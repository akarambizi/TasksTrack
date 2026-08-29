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
        Task<CalendarHistoryResponse> GetCalendarHistoryAsync(FocusSessionHistoryFilterRequest filter);
        Task<TimelineHistoryResponse> GetTimelineHistoryAsync(FocusSessionHistoryFilterRequest filter);
        Task<FocusSessionDayDetailResponse> GetDayDetailAsync(string localDate, FocusSessionHistoryFilterRequest filter);
        Task<FocusSessionResponse?> GetActiveSessionAsync();
        Task<FocusSessionAnalytics> GetAnalyticsAsync();
    }
}