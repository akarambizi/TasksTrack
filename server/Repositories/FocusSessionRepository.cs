using Microsoft.EntityFrameworkCore;
using TasksTrack.Data;
using TasksTrack.Models;

namespace TasksTrack.Repositories
{
    public class FocusSessionRepository : IFocusSessionRepository
    {
        private readonly TasksTrackContext _context;

        public FocusSessionRepository(TasksTrackContext context)
        {
            _context = context;
        }

        public async Task<FocusSession?> GetByIdAsync(int id)
        {
            return await _context.FocusSessions
                .Include(fs => fs.Habit)
                .FirstOrDefaultAsync(fs => fs.Id == id);
        }

        public IQueryable<FocusSession> GetByUser(string userId)
        {
            return _context.FocusSessions
                .Include(fs => fs.Habit)
                .Where(fs => fs.CreatedBy == userId);
        }

        public async Task<IEnumerable<FocusSession>> GetByHabitAsync(int habitId)
        {
            return await _context.FocusSessions
                .Include(fs => fs.Habit)
                .Where(fs => fs.HabitId == habitId)
                .OrderByDescending(fs => fs.StartTime)
                .ToListAsync();
        }

        public async Task<FocusSession?> GetActiveOrPausedSessionByUserAsync(string userId)
        {
            return await _context.FocusSessions
                .Include(fs => fs.Habit)
                .FirstOrDefaultAsync(fs => fs.CreatedBy == userId &&
                                        (fs.Status == FocusSessionStatus.Active.ToStringValue() ||
                                         fs.Status == FocusSessionStatus.Paused.ToStringValue()));
        }

        public async Task AddAsync(FocusSession focusSession)
        {
            await _context.FocusSessions.AddAsync(focusSession);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> UpdateAsync(FocusSession focusSession)
        {
            _context.FocusSessions.Update(focusSession);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task DeleteAsync(int id)
        {
            var session = await _context.FocusSessions.FindAsync(id);
            if (session != null)
            {
                _context.FocusSessions.Remove(session);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<FocusSessionAnalytics> GetAnalyticsAsync(string userId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = _context.FocusSessions.Where(fs => fs.CreatedBy == userId);

            if (startDate.HasValue)
                query = query.Where(fs => fs.StartTime >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(fs => fs.StartTime <= endDate.Value);

            var sessions = await query.OrderBy(fs => fs.StartTime).ToListAsync();

            var totalSessions = sessions.Count;
            var completedSessions = sessions.Count(fs => fs.Status == FocusSessionStatus.Completed.ToStringValue());

            // Calculate total minutes from actual duration
            var totalMinutes = sessions
                .Where(fs => fs.ActualDurationSeconds.HasValue)
                .Sum(fs => fs.ActualDurationSeconds!.Value) / 60;

            // Calculate average session minutes (only for sessions with actual duration)
            var sessionsWithDuration = sessions.Where(fs => fs.ActualDurationSeconds.HasValue).ToList();
            var averageSessionMinutes = sessionsWithDuration.Any()
                ? sessionsWithDuration.Average(fs => fs.ActualDurationSeconds!.Value / FocusSessionConstants.SECONDS_TO_MINUTES)
                : 0;

            // Calculate longest session
            var longestSessionMinutes = sessionsWithDuration.Any()
                ? sessionsWithDuration.Max(fs => fs.ActualDurationSeconds!.Value / FocusSessionConstants.SECONDS_TO_MINUTES)
                : 0;

            // Calculate completion rate
            var completionRate = totalSessions > 0
                ? (double)completedSessions / totalSessions * FocusSessionConstants.PERCENTAGE_MULTIPLIER
                : 0;

            // Calculate current streak (consecutive completed sessions from the end)
            var currentStreak = 0;
            for (int i = sessions.Count - 1; i >= 0; i--)
            {
                if (sessions[i].Status == FocusSessionStatus.Completed.ToStringValue())
                    currentStreak++;
                else
                    break;
            }

            // Calculate longest streak
            var longestStreak = 0;
            var tempStreak = 0;
            foreach (var session in sessions)
            {
                if (session.Status == FocusSessionStatus.Completed.ToStringValue())
                {
                    tempStreak++;
                    longestStreak = Math.Max(longestStreak, tempStreak);
                }
                else
                {
                    tempStreak = 0;
                }
            }

            return new FocusSessionAnalytics
            {
                TotalSessions = totalSessions,
                TotalMinutes = totalMinutes,
                CompletedSessions = completedSessions,
                AverageSessionMinutes = averageSessionMinutes,
                LongestSessionMinutes = longestSessionMinutes,
                CurrentStreak = currentStreak,
                LongestStreak = longestStreak,
                CompletionRate = completionRate
            };
        }
    }
}