using TasksTrack.Models;
using TasksTrack.Repositories;

namespace TasksTrack.Services
{
    public class FocusSessionService : IFocusSessionService
    {
        private readonly IFocusSessionRepository _focusSessionRepository;
        private readonly IHabitRepository _habitRepository;

        public FocusSessionService(IFocusSessionRepository focusSessionRepository, IHabitRepository habitRepository)
        {
            _focusSessionRepository = focusSessionRepository;
            _habitRepository = habitRepository;
        }

        public async Task<FocusSessionResponse> StartSessionAsync(FocusSessionStartRequest request, string userId)
        {
            // Check if user already has an active session
            var existingSession = await _focusSessionRepository.GetActiveOrPausedSessionByUserAsync(userId);
            if (existingSession != null)
            {
                throw new InvalidOperationException("User already has an active focus session. Complete or interrupt the current session first.");
            }

            // Validate habit exists and belongs to user
            var habit = await _habitRepository.GetByIdAsync(request.HabitId);
            if (habit == null)
            {
                throw new ArgumentException("Habit not found.");
            }

            if (habit.CreatedBy != userId)
            {
                throw new UnauthorizedAccessException("You can only create focus sessions for your own habits.");
            }

            var focusSession = new FocusSession
            {
                HabitId = request.HabitId,
                CreatedBy = userId,
                StartTime = DateTime.UtcNow,
                Status = FocusSessionStatus.Active.ToStringValue(),
                PlannedDurationMinutes = request.PlannedDurationMinutes,
                CreatedDate = DateTime.UtcNow,
                Habit = habit // Set the habit object for proper response mapping
            };

            await _focusSessionRepository.AddAsync(focusSession);

            return MapToResponse(focusSession, habit.Name);
        }

        public async Task<FocusSessionResponse> PauseSessionAsync(string userId)
        {
            var session = await _focusSessionRepository.GetActiveOrPausedSessionByUserAsync(userId);

            if (session == null)
            {
                throw new InvalidOperationException("No active session found to pause.");
            }

            if (session.Status != FocusSessionStatus.Active.ToStringValue())
            {
                throw new InvalidOperationException("Session must be active to pause.");
            }

            session.Status = FocusSessionStatus.Paused.ToStringValue();
            session.PauseTime = DateTime.UtcNow;
            session.UpdatedDate = DateTime.UtcNow;
            session.UpdatedBy = userId;

            await _focusSessionRepository.UpdateAsync(session);

            return MapToResponse(session, session.Habit?.Name);
        }

        public async Task<FocusSessionResponse> ResumeSessionAsync(string userId)
        {
            var session = await _focusSessionRepository.GetActiveOrPausedSessionByUserAsync(userId);

            if (session == null)
            {
                throw new InvalidOperationException("No paused session found to resume.");
            }

            if (session.Status != FocusSessionStatus.Paused.ToStringValue())
            {
                throw new InvalidOperationException("Session is not in a paused state.");
            }

            // Calculate paused duration if this is a resume action
            if (session.PauseTime.HasValue)
            {
                var pausedSeconds = (int)(DateTime.UtcNow - session.PauseTime.Value).TotalSeconds;
                session.PausedDurationSeconds = (session.PausedDurationSeconds ?? 0) + pausedSeconds;
            }

            session.Status = FocusSessionStatus.Active.ToStringValue();
            session.ResumeTime = DateTime.UtcNow;
            session.UpdatedDate = DateTime.UtcNow;
            session.UpdatedBy = userId;

            await _focusSessionRepository.UpdateAsync(session);

            return MapToResponse(session, session.Habit?.Name);
        }

        public async Task<FocusSessionResponse> CompleteSessionAsync(FocusSessionCompleteRequest request, string userId)
        {
            var session = await _focusSessionRepository.GetActiveOrPausedSessionByUserAsync(userId);

            if (session == null)
            {
                throw new InvalidOperationException("No active session found to complete.");
            }

            if (session.Status != FocusSessionStatus.Active.ToStringValue() && session.Status != FocusSessionStatus.Paused.ToStringValue())
            {
                throw new InvalidOperationException("Session is not in an active or paused state.");
            }

            var endTime = DateTime.UtcNow;
            session.Status = FocusSessionStatus.Completed.ToStringValue();
            session.EndTime = endTime;
            session.Notes = request.Notes;
            session.UpdatedDate = endTime;
            session.UpdatedBy = userId;

            // Calculate actual duration
            var totalSeconds = (int)(endTime - session.StartTime).TotalSeconds;
            session.ActualDurationSeconds = totalSeconds - (session.PausedDurationSeconds ?? 0);

            await _focusSessionRepository.UpdateAsync(session);

            return MapToResponse(session, session.Habit?.Name);
        }

        public async Task<FocusSessionResponse> CancelSessionAsync(FocusSessionCompleteRequest request, string userId)
        {
            var session = await _focusSessionRepository.GetActiveOrPausedSessionByUserAsync(userId);

            if (session == null)
            {
                throw new InvalidOperationException("No active session found to cancel.");
            }

            if (session.Status != FocusSessionStatus.Active.ToStringValue() && session.Status != FocusSessionStatus.Paused.ToStringValue())
            {
                throw new InvalidOperationException("Session is not in an active or paused state.");
            }

            var endTime = DateTime.UtcNow;
            session.Status = FocusSessionStatus.Interrupted.ToStringValue();
            session.EndTime = endTime;
            session.Notes = request.Notes;
            session.UpdatedDate = endTime;
            session.UpdatedBy = userId;

            // Calculate actual duration up to cancellation
            var totalSeconds = (int)(endTime - session.StartTime).TotalSeconds;
            session.ActualDurationSeconds = totalSeconds - (session.PausedDurationSeconds ?? 0);

            await _focusSessionRepository.UpdateAsync(session);

            return MapToResponse(session, session.Habit?.Name);
        }

        public IQueryable<FocusSessionResponse> GetSessions(string userId)
        {
            var sessions = _focusSessionRepository.GetByUser(userId);
            return sessions.Select(session => new FocusSessionResponse
            {
                Id = session.Id,
                HabitId = session.HabitId,
                CreatedBy = session.CreatedBy,
                StartTime = session.StartTime,
                PauseTime = session.PauseTime,
                ResumeTime = session.ResumeTime,
                EndTime = session.EndTime,
                Status = session.Status,
                PlannedDurationMinutes = session.PlannedDurationMinutes,
                ActualDurationSeconds = session.ActualDurationSeconds ?? 0,
                PausedDurationSeconds = session.PausedDurationSeconds ?? 0,
                Notes = session.Notes,
                CreatedDate = session.CreatedDate,
                Habit = session.Habit
            });
        }

        public async Task<FocusSessionResponse?> GetActiveSessionAsync(string userId)
        {
            var session = await _focusSessionRepository.GetActiveOrPausedSessionByUserAsync(userId);
            return session != null ? MapToResponse(session, session.Habit?.Name) : null;
        }

        public async Task<FocusSessionAnalytics> GetAnalyticsAsync(string userId, DateTime? startDate = null, DateTime? endDate = null)
        {
            return await _focusSessionRepository.GetAnalyticsAsync(userId, startDate, endDate);
        }

        private static FocusSessionResponse MapToResponse(FocusSession session, string? habitName)
        {
            return new FocusSessionResponse
            {
                Id = session.Id,
                HabitId = session.HabitId,
                CreatedBy = session.CreatedBy,
                StartTime = session.StartTime,
                PauseTime = session.PauseTime,
                ResumeTime = session.ResumeTime,
                EndTime = session.EndTime,
                Status = session.Status,
                PlannedDurationMinutes = session.PlannedDurationMinutes,
                ActualDurationSeconds = session.ActualDurationSeconds ?? 0,
                PausedDurationSeconds = session.PausedDurationSeconds ?? 0,
                Notes = session.Notes,
                CreatedDate = session.CreatedDate,
                Habit = session.Habit // Include the full habit object
            };
        }
    }
}