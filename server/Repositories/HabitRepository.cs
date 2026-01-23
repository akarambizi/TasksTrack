using TasksTrack.Models;
using TasksTrack.Data;
using Microsoft.EntityFrameworkCore;

namespace TasksTrack.Repositories
{
    public class HabitRepository : IHabitRepository
    {
        private readonly TasksTrackContext _context;

        public HabitRepository(TasksTrackContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Habit>> GetAllAsync()
        {
            return await _context.Habits.OrderByDescending(h => h.CreatedDate).ToListAsync();
        }

        public async Task<Habit?> GetByIdAsync(int id)
        {
            return await _context.Habits.FirstOrDefaultAsync(habit => habit.Id == id);
        }

        public async Task AddAsync(Habit habit)
        {
            await _context.Habits.AddAsync(habit);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Habit habit)
        {
            _context.Habits.Update(habit);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var habit = await _context.Habits.FindAsync(id);
            if (habit != null)
            {
                _context.Habits.Remove(habit);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Habit>> GetActiveAsync()
        {
            return await _context.Habits
                .Where(h => h.IsActive)
                .OrderByDescending(h => h.CreatedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Habit>> GetByCategoryAsync(string category)
        {
            return await _context.Habits
                .Where(h => h.Category == category && h.IsActive)
                .OrderByDescending(h => h.CreatedDate)
                .ToListAsync();
        }
    }
}