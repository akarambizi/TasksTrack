using TasksTrack.Models;

namespace TasksTrack.Services
{
    public interface IFocusSessionService
    {
        Task<FocusSessionResponse> StartSessionAsync(FocusSessionStartRequest request, string userId);
        Task<FocusSessionResponse> PauseSessionAsync(string userId);
        Task<FocusSessionResponse> ResumeSessionAsync(string userId);
        Task<FocusSessionResponse> CompleteSessionAsync(FocusSessionCompleteRequest request, string userId);
        Task<FocusSessionResponse> CancelSessionAsync(FocusSessionCompleteRequest request, string userId);
        IQueryable<FocusSessionResponse> GetSessions(string userId);
        Task<FocusSessionResponse?> GetActiveSessionAsync(string userId);
        Task<FocusSessionAnalytics> GetAnalyticsAsync(string userId);
    }
}