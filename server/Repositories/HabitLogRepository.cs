using TasksTrack.Models;
using TasksTrack.Data;
using Microsoft.EntityFrameworkCore;

namespace TasksTrack.Repositories
{
    public class HabitLogRepository : IHabitLogRepository
    {
        private readonly TasksTrackContext _context;

        public HabitLogRepository(TasksTrackContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<HabitLog>> GetAllAsync()
        {
            return await _context.HabitLogs
                .Include(hl => hl.Habit)
                .OrderByDescending(hl => hl.Date)
                .ThenByDescending(hl => hl.CreatedDate)
                .ToListAsync();
        }

        public async Task<HabitLog?> GetByIdAsync(int id)
        {
            return await _context.HabitLogs
                .Include(hl => hl.Habit)
                .FirstOrDefaultAsync(hl => hl.Id == id);
        }

        public async Task AddAsync(HabitLog habitLog)
        {
            await _context.HabitLogs.AddAsync(habitLog);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> UpdateAsync(HabitLog habitLog)
        {
            _context.HabitLogs.Update(habitLog);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task DeleteAsync(int id)
        {
            var habitLog = await _context.HabitLogs.FirstOrDefaultAsync(hl => hl.Id == id);
            if (habitLog != null)
            {
                _context.HabitLogs.Remove(habitLog);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<HabitLog>> GetByHabitIdAsync(int habitId)
        {
            return await _context.HabitLogs
                .Include(hl => hl.Habit)
                .Where(hl => hl.HabitId == habitId)
                .OrderByDescending(hl => hl.Date)
                .ToListAsync();
        }

        public async Task<IEnumerable<HabitLog>> GetByDateAsync(DateOnly date)
        {
            return await _context.HabitLogs
                .Include(hl => hl.Habit)
                .Where(hl => hl.Date == date)
                .OrderBy(hl => hl.Habit != null ? hl.Habit.Name : "")
                .ToListAsync();
        }

        public async Task<IEnumerable<HabitLog>> GetByDateRangeAsync(DateOnly startDate, DateOnly endDate)
        {
            return await _context.HabitLogs
                .Include(hl => hl.Habit)
                .Where(hl => hl.Date >= startDate && hl.Date <= endDate)
                .OrderByDescending(hl => hl.Date)
                .ThenBy(hl => hl.Habit != null ? hl.Habit.Name : "")
                .ToListAsync();
        }

        public async Task<IEnumerable<HabitLog>> GetByHabitAndDateRangeAsync(int habitId, DateOnly startDate, DateOnly endDate)
        {
            return await _context.HabitLogs
                .Include(hl => hl.Habit)
                .Where(hl => hl.HabitId == habitId && hl.Date >= startDate && hl.Date <= endDate)
                .OrderByDescending(hl => hl.Date)
                .ToListAsync();
        }

        public async Task<HabitLog?> GetByHabitAndDateAsync(int habitId, DateOnly date)
        {
            return await _context.HabitLogs
                .Include(hl => hl.Habit)
                .FirstOrDefaultAsync(hl => hl.HabitId == habitId && hl.Date == date);
        }
    }
}