using TasksTrack.Models;

namespace TasksTrack.Repositories
{
    public interface IHabitRepository
    {
        Task<IEnumerable<Habit>> GetAllAsync();
        Task<IEnumerable<Habit>> GetByUserIdAsync(string userId);
        Task<Habit?> GetByIdAsync(int id);
        Task AddAsync(Habit habit);
        Task UpdateAsync(Habit habit);
        Task DeleteAsync(int id);
        Task<IEnumerable<Habit>> GetActiveAsync();
        Task<IEnumerable<Habit>> GetByCategoryAsync(string category);
    }
}