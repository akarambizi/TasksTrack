using TasksTrack.Models;

namespace TasksTrack.Services
{
    public interface IFocusSessionService
    {
        Task<FocusSessionResponse> StartSessionAsync(FocusSessionStartRequest request);
        Task<FocusSessionResponse> PauseSessionAsync();
        Task<FocusSessionResponse> ResumeSessionAsync();
        Task<FocusSessionResponse> CompleteSessionAsync(FocusSessionCompleteRequest request);
        Task<FocusSessionResponse> CancelSessionAsync(FocusSessionCompleteRequest request);
        IQueryable<FocusSessionResponse> GetSessions();
        Task<FocusSessionResponse?> GetActiveSessionAsync();
        Task<FocusSessionAnalytics> GetAnalyticsAsync();
    }
}