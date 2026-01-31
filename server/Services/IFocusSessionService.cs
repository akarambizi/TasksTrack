using TasksTrack.Models;

namespace TasksTrack.Services
{
    public interface IFocusSessionService
    {
        Task<FocusSessionResponse> StartSessionAsync(FocusSessionStartRequest request, string userId);
        Task<FocusSessionResponse?> PauseSessionAsync(string userId);
        Task<FocusSessionResponse?> ResumeSessionAsync(string userId);
        Task<FocusSessionResponse?> CompleteSessionAsync(FocusSessionCompleteRequest request, string userId);
        Task<IEnumerable<FocusSessionResponse>> GetSessionsAsync(string userId);
        Task<FocusSessionResponse?> GetActiveSessionAsync(string userId);
        Task<FocusSessionAnalytics> GetAnalyticsAsync(string userId, DateTime? startDate = null, DateTime? endDate = null);
    }
}