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

        public async Task<FocusSessionAnalytics> GetAnalyticsAsync(string userId)
        {
            var sessions = await _context.FocusSessions
                .Where(fs => fs.CreatedBy == userId)
                .ToListAsync();

            var totalSessions = sessions.Count;
            var completedSessions = sessions.Count(s => s.Status == FocusSessionStatus.Completed.ToStringValue());
            var completionRate = totalSessions > 0 ? ((double)completedSessions / totalSessions) * 100.0 : 0.0;

            var totalMinutes = sessions
                .Where(s => s.ActualDurationSeconds.HasValue)
                .Sum(s => s.ActualDurationSeconds!.Value / 60.0);

            var averageSessionMinutes = completedSessions > 0
                ? sessions
                    .Where(s => s.Status == FocusSessionStatus.Completed.ToStringValue() && s.ActualDurationSeconds.HasValue)
                    .Average(s => s.ActualDurationSeconds!.Value / 60.0)
                : 0.0;

            var longestSessionMinutes = sessions
                .Where(s => s.ActualDurationSeconds.HasValue)
                .Max(s => (double?)s.ActualDurationSeconds!.Value / 60.0) ?? 0.0;

            // Calculate current and longest streaks
            var currentStreak = CalculateCurrentStreak(sessions);
            var longestStreak = CalculateLongestStreak(sessions);

            return new FocusSessionAnalytics
            {
                TotalSessions = totalSessions,
                CompletedSessions = completedSessions,
                CompletionRate = completionRate,
                TotalMinutes = (int)Math.Round(totalMinutes),
                AverageSessionMinutes = averageSessionMinutes,
                LongestSessionMinutes = longestSessionMinutes,
                CurrentStreak = currentStreak,
                LongestStreak = longestStreak
            };
        }

        private int CalculateCurrentStreak(List<FocusSession> sessions)
        {
            if (!sessions.Any())
                return 0;

            var completedSessions = sessions
                .Where(s => s.Status == FocusSessionStatus.Completed.ToStringValue())
                .OrderByDescending(s => s.StartTime.Date)
                .GroupBy(s => s.StartTime.Date)
                .Select(g => g.Key)
                .ToList();

            if (!completedSessions.Any())
                return 0;

            var streak = 0;
            var currentDate = DateTimeOffset.UtcNow.Date;

            // Check if there's a session today or yesterday to start the streak
            if (!completedSessions.Contains(currentDate) && !completedSessions.Contains(currentDate.AddDays(-1)))
                return 0;

            // Start from today or yesterday
            var checkDate = completedSessions.Contains(currentDate) ? currentDate : currentDate.AddDays(-1);

            foreach (var sessionDate in completedSessions)
            {
                if (sessionDate == checkDate)
                {
                    streak++;
                    checkDate = checkDate.AddDays(-1);
                }
                else if (sessionDate < checkDate)
                {
                    break; // Gap found, streak ends
                }
            }

            return streak;
        }

        private int CalculateLongestStreak(List<FocusSession> sessions)
        {
            if (!sessions.Any())
                return 0;

            var completedSessions = sessions
                .Where(s => s.Status == FocusSessionStatus.Completed.ToStringValue())
                .OrderBy(s => s.StartTime.Date)
                .GroupBy(s => s.StartTime.Date)
                .Select(g => g.Key)
                .ToList();

            if (!completedSessions.Any())
                return 0;

            var longestStreak = 0;
            var currentStreak = 1;

            for (int i = 1; i < completedSessions.Count; i++)
            {
                if (completedSessions[i] == completedSessions[i - 1].AddDays(1))
                {
                    currentStreak++;
                }
                else
                {
                    longestStreak = Math.Max(longestStreak, currentStreak);
                    currentStreak = 1;
                }
            }

            return Math.Max(longestStreak, currentStreak);
        }
    }
}