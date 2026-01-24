using TasksTrack.Models;

namespace TasksTrack.Repositories
{
    public interface IHabitLogRepository
    {
        Task<IEnumerable<HabitLog>> GetAllAsync();
        Task<HabitLog?> GetByIdAsync(int id);
        Task AddAsync(HabitLog habitLog);
        Task UpdateAsync(HabitLog habitLog);
        Task DeleteAsync(int id);
        Task<IEnumerable<HabitLog>> GetByHabitIdAsync(int habitId);
        Task<IEnumerable<HabitLog>> GetByDateAsync(DateOnly date);
        Task<IEnumerable<HabitLog>> GetByDateRangeAsync(DateOnly startDate, DateOnly endDate);
        Task<IEnumerable<HabitLog>> GetByHabitAndDateRangeAsync(int habitId, DateOnly startDate, DateOnly endDate);
        Task<HabitLog?> GetByHabitAndDateAsync(int habitId, DateOnly date);
    }
}