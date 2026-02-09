using TasksTrack.Models;

namespace TasksTrack.Repositories
{
    public interface IFocusSessionRepository
    {
        Task<FocusSession?> GetByIdAsync(int id);
        IQueryable<FocusSession> GetQueryable();
        Task<IEnumerable<FocusSession>> GetByHabitAsync(int habitId);
        Task<FocusSession?> GetActiveOrPausedSessionAsync();
        Task AddAsync(FocusSession focusSession);
        Task<bool> UpdateAsync(FocusSession focusSession);
        Task DeleteAsync(int id);
        Task<FocusSessionAnalytics> GetAnalyticsAsync();
    }
}