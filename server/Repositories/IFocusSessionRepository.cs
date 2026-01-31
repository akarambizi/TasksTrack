using TasksTrack.Models;

namespace TasksTrack.Repositories
{
    public interface IFocusSessionRepository
    {
        Task<FocusSession?> GetByIdAsync(int id);
        Task<IEnumerable<FocusSession>> GetByUserAsync(string userId);
        Task<IEnumerable<FocusSession>> GetByHabitAsync(int habitId);
        Task<FocusSession?> GetActiveSessionByUserAsync(string userId);
        Task AddAsync(FocusSession focusSession);
        Task<bool> UpdateAsync(FocusSession focusSession);
        Task DeleteAsync(int id);
        Task<FocusSessionAnalytics> GetAnalyticsAsync(string userId, DateTime? startDate = null, DateTime? endDate = null);
    }
}