using TasksTrack.Models;

namespace TasksTrack.Services
{
    public interface IHabitService
    {
        Task<IEnumerable<Habit>> GetAllAsync();
        Task<Habit?> GetByIdAsync(int id);
        Task AddAsync(Habit habit);
        Task<bool> UpdateAsync(Habit habit);
        Task DeleteAsync(int id);
        Task<IEnumerable<Habit>> GetActiveAsync();
        Task<IEnumerable<Habit>> GetByCategoryAsync(string category);
        Task ArchiveAsync(int id, string? updatedBy = null);
        Task ActivateAsync(int id, string? updatedBy = null);
    }
}