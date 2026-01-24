using TasksTrack.Models;

namespace TasksTrack.Services
{
    public interface IHabitLogService
    {
        Task<IEnumerable<HabitLog>> GetAllAsync();
        Task<HabitLog?> GetByIdAsync(int id);
        Task AddAsync(HabitLog habitLog);
        Task<bool> UpdateAsync(HabitLog habitLog);
        Task DeleteAsync(int id);
        Task<IEnumerable<HabitLog>> GetByHabitIdAsync(int habitId);
        Task<IEnumerable<HabitLog>> GetByDateAsync(DateTime date);
        Task<IEnumerable<HabitLog>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<HabitLog>> GetByHabitAndDateRangeAsync(int habitId, DateTime startDate, DateTime endDate);
        Task<HabitLog?> GetByHabitAndDateAsync(int habitId, DateTime date);
    }
}