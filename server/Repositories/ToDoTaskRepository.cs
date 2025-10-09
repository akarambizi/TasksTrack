using TasksTrack.Models;
using TasksTrack.Data;
using Microsoft.EntityFrameworkCore;

namespace TasksTrack.Repositories
{
    public class ToDoTaskRepository : IToDoTaskRepository
    {
        private readonly TasksTrackContext _context;

        public ToDoTaskRepository(TasksTrackContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ToDoTask>> GetAllAsync()
        {
            return await _context.Tasks.ToListAsync();
        }

        public async Task<ToDoTask?> GetByIdAsync(int id)
        {
            return await _context.Tasks.FirstOrDefaultAsync(task => task.Id == id);
        }

        public async Task AddAsync(ToDoTask task)
        {
            await _context.Tasks.AddAsync(task);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(ToDoTask task)
        {
            _context.Tasks.Update(task);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task != null)
            {
                _context.Tasks.Remove(task);
                await _context.SaveChangesAsync();
            }
        }
    }
}