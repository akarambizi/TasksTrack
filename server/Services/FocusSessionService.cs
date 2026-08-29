using TasksTrack.Models;
using TasksTrack.Repositories;
using TasksTrack.Services;
using System.Globalization;

namespace TasksTrack.Services
{
    public class FocusSessionService : IFocusSessionService
    {
        private readonly IFocusSessionRepository _focusSessionRepository;
        private readonly IHabitRepository _habitRepository;
        private readonly ICurrentUserService _currentUserService;

        public FocusSessionService(IFocusSessionRepository focusSessionRepository, IHabitRepository habitRepository, ICurrentUserService currentUserService)
        {
            _focusSessionRepository = focusSessionRepository;
            _habitRepository = habitRepository;
            _currentUserService = currentUserService;
        }

        public async Task<FocusSessionResponse> StartSessionAsync(FocusSessionStartRequest request)
        {
            var userId = _currentUserService.GetUserId();

            // Check if user already has an active session
            var existingSession = await _focusSessionRepository.GetActiveOrPausedSessionAsync();
            if (existingSession != null)
            {
                throw new InvalidOperationException("User already has an active focus session. Complete or interrupt the current session first.");
            }

            // Validate habit exists
            var habit = await _habitRepository.GetByIdAsync(request.HabitId);
            if (habit == null)
            {
                throw new ArgumentException("Habit not found.");
            }

            var focusSession = new FocusSession
            {
                HabitId = request.HabitId,
                CreatedBy = userId,
                StartTime = DateTimeOffset.UtcNow,
                Status = FocusSessionStatus.Active.ToStringValue(),
                PlannedDurationMinutes = request.PlannedDurationMinutes,
                CreatedDate = DateTimeOffset.UtcNow,
                Habit = habit // Set the habit object for proper response mapping
            };

            await _focusSessionRepository.AddAsync(focusSession);

            return MapToResponse(focusSession, habit.Name);
        }

        public async Task<FocusSessionResponse> PauseSessionAsync()
        {
            var userId = _currentUserService.GetUserId();
            var session = await _focusSessionRepository.GetActiveOrPausedSessionAsync();

            if (session == null)
            {
                throw new InvalidOperationException("No active session found to pause.");
            }

            if (session.Status != FocusSessionStatus.Active.ToStringValue())
            {
                throw new InvalidOperationException("Session must be active to pause.");
            }

            session.Status = FocusSessionStatus.Paused.ToStringValue();
            session.PauseTime = DateTimeOffset.UtcNow;
            session.UpdatedDate = DateTimeOffset.UtcNow;
            session.UpdatedBy = userId;

            await _focusSessionRepository.UpdateAsync(session);

            return MapToResponse(session, session.Habit?.Name);
        }

        public async Task<FocusSessionResponse> ResumeSessionAsync()
        {
            var userId = _currentUserService.GetUserId();
            var session = await _focusSessionRepository.GetActiveOrPausedSessionAsync();

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
                var pausedSeconds = (int)(DateTimeOffset.UtcNow - session.PauseTime.Value).TotalSeconds;
                session.PausedDurationSeconds = (session.PausedDurationSeconds ?? 0) + pausedSeconds;
            }

            session.Status = FocusSessionStatus.Active.ToStringValue();
            session.ResumeTime = DateTimeOffset.UtcNow;
            session.UpdatedDate = DateTimeOffset.UtcNow;
            session.UpdatedBy = userId;

            await _focusSessionRepository.UpdateAsync(session);

            return MapToResponse(session, session.Habit?.Name);
        }

        public async Task<FocusSessionResponse> CompleteSessionAsync(FocusSessionCompleteRequest request)
        {
            var userId = _currentUserService.GetUserId();
            var session = await _focusSessionRepository.GetActiveOrPausedSessionAsync();

            if (session == null)
            {
                throw new InvalidOperationException("No active session found to complete.");
            }

            if (session.Status != FocusSessionStatus.Active.ToStringValue() && session.Status != FocusSessionStatus.Paused.ToStringValue())
            {
                throw new InvalidOperationException("Session is not in an active or paused state.");
            }

            var endTime = DateTimeOffset.UtcNow;
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

        public async Task<FocusSessionResponse> CancelSessionAsync(FocusSessionCompleteRequest request)
        {
            var userId = _currentUserService.GetUserId();
            var session = await _focusSessionRepository.GetActiveOrPausedSessionAsync();

            if (session == null)
            {
                throw new InvalidOperationException("No active session found to cancel.");
            }

            if (session.Status != FocusSessionStatus.Active.ToStringValue() && session.Status != FocusSessionStatus.Paused.ToStringValue())
            {
                throw new InvalidOperationException("Session is not in an active or paused state.");
            }

            var endTime = DateTimeOffset.UtcNow;
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

        public IQueryable<FocusSessionResponse> GetSessions()
        {
            var sessions = _focusSessionRepository.GetQueryable();
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

        public async Task<CalendarHistoryResponse> GetCalendarHistoryAsync(FocusSessionHistoryFilterRequest filter)
        {
            var (sessions, timezone, startDate, endDate) = await GetHistoryContextAsync(filter);

            var days = sessions
                .GroupBy(session => GetLocalDate(session.StartTime, timezone))
                .OrderBy(group => group.Key)
                .Select(group => CreateCalendarDaySummary(group.Key, group))
                .ToList();

            return new CalendarHistoryResponse
            {
                StartDate = startDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                EndDate = endDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                Timezone = timezone.Id,
                Days = days
            };
        }

        public async Task<TimelineHistoryResponse> GetTimelineHistoryAsync(FocusSessionHistoryFilterRequest filter)
        {
            var (sessions, timezone, startDate, endDate) = await GetHistoryContextAsync(filter);

            var groups = sessions
                .GroupBy(session => GetLocalDate(session.StartTime, timezone))
                .OrderByDescending(group => group.Key)
                .Select(group => new TimelineDayGroupResponse
                {
                    LocalDate = group.Key.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                    DisplayLabel = group.Key.ToString("MMMM d, yyyy", CultureInfo.InvariantCulture),
                    TotalFocusMinutes = group.Sum(GetDurationMinutes),
                    Sessions = group
                        .OrderByDescending(session => session.StartTime)
                        .Select(session => MapToTimelineItem(session, timezone))
                        .ToList()
                })
                .ToList();

            return new TimelineHistoryResponse
            {
                StartDate = startDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                EndDate = endDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                Timezone = timezone.Id,
                Groups = groups
            };
        }

        public async Task<FocusSessionDayDetailResponse> GetDayDetailAsync(string localDate, FocusSessionHistoryFilterRequest filter)
        {
            if (!DateOnly.TryParse(localDate, CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
            {
                throw new ArgumentException("Invalid local date format. Use YYYY-MM-DD.");
            }

            filter.StartDate = localDate;
            filter.EndDate = localDate;
            var (sessions, timezone, _, _) = await GetHistoryContextAsync(filter);
            var daySessions = sessions
                .Where(session => GetLocalDate(session.StartTime, timezone) == parsedDate)
                .OrderByDescending(session => session.StartTime)
                .ToList();

            return new FocusSessionDayDetailResponse
            {
                LocalDate = parsedDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                Timezone = timezone.Id,
                Summary = CreateCalendarDaySummary(parsedDate, daySessions),
                Sessions = daySessions.Select(session => MapToTimelineItem(session, timezone)).ToList()
            };
        }

        public async Task<FocusSessionResponse?> GetActiveSessionAsync()
        {
            var session = await _focusSessionRepository.GetActiveOrPausedSessionAsync();
            return session != null ? MapToResponse(session, session.Habit?.Name) : null;
        }

        public async Task<FocusSessionAnalytics> GetAnalyticsAsync()
        {
            return await _focusSessionRepository.GetAnalyticsAsync();
        }

        private async Task<(List<FocusSession> Sessions, TimeZoneInfo Timezone, DateOnly StartDate, DateOnly EndDate)> GetHistoryContextAsync(FocusSessionHistoryFilterRequest filter)
        {
            if (!DateOnly.TryParse(filter.StartDate, CultureInfo.InvariantCulture, DateTimeStyles.None, out var startDate) ||
                !DateOnly.TryParse(filter.EndDate, CultureInfo.InvariantCulture, DateTimeStyles.None, out var endDate))
            {
                throw new ArgumentException("Invalid date format. Use YYYY-MM-DD.");
            }

            if (startDate > endDate)
            {
                throw new ArgumentException("Start date must be before or equal to end date.");
            }

            if (endDate.DayNumber - startDate.DayNumber > 91)
            {
                throw new ArgumentException("Date range cannot exceed 92 days.");
            }

            TimeZoneInfo timezone;
            try
            {
                timezone = TimeZoneInfo.FindSystemTimeZoneById(filter.Timezone);
            }
            catch (TimeZoneNotFoundException)
            {
                throw new ArgumentException("Timezone is not supported.");
            }
            catch (InvalidTimeZoneException)
            {
                throw new ArgumentException("Timezone is not supported.");
            }

            var rangeStartUtc = new DateTimeOffset(TimeZoneInfo.ConvertTimeToUtc(startDate.ToDateTime(TimeOnly.MinValue), timezone));
            var rangeEndUtc = new DateTimeOffset(TimeZoneInfo.ConvertTimeToUtc(endDate.AddDays(1).ToDateTime(TimeOnly.MinValue), timezone));
            var sessions = (await _focusSessionRepository.GetHistorySessionsAsync(filter, rangeStartUtc, rangeEndUtc)).ToList();

            return (sessions, timezone, startDate, endDate);
        }

        private static DateOnly GetLocalDate(DateTimeOffset timestamp, TimeZoneInfo timezone)
        {
            return DateOnly.FromDateTime(TimeZoneInfo.ConvertTime(timestamp, timezone).DateTime);
        }

        private static CalendarDaySummaryResponse CreateCalendarDaySummary(DateOnly localDate, IEnumerable<FocusSession> sessions)
        {
            var sessionList = sessions.ToList();
            return new CalendarDaySummaryResponse
            {
                LocalDate = localDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                IsActive = sessionList.Count > 0,
                SessionCount = sessionList.Count,
                TotalFocusMinutes = sessionList.Sum(GetDurationMinutes),
                CompletedSessionCount = sessionList.Count(session => session.Status == FocusSessionStatus.Completed.ToStringValue()),
                HabitIds = sessionList.Select(session => session.HabitId).Distinct().ToList(),
                Categories = sessionList
                    .Select(session => session.Habit?.Category)
                    .Where(category => !string.IsNullOrWhiteSpace(category))
                    .Select(category => category!)
                    .Distinct()
                    .ToList()
            };
        }

        private static SessionTimelineItemResponse MapToTimelineItem(FocusSession session, TimeZoneInfo timezone)
        {
            return new SessionTimelineItemResponse
            {
                SessionId = session.Id,
                HabitId = session.HabitId,
                HabitName = session.Habit?.Name ?? "Unknown Habit",
                Category = session.Habit?.Category,
                StartTimeUtc = session.StartTime,
                EndTimeUtc = session.EndTime,
                StartTimeLocal = TimeZoneInfo.ConvertTime(session.StartTime, timezone),
                EndTimeLocal = session.EndTime.HasValue ? TimeZoneInfo.ConvertTime(session.EndTime.Value, timezone) : null,
                Status = session.Status,
                DurationMinutes = GetDurationMinutes(session),
                Notes = session.Notes
            };
        }

        private static int GetDurationMinutes(FocusSession session)
        {
            return session.ActualDurationSeconds.HasValue
                ? (int)Math.Round(session.ActualDurationSeconds.Value / 60d)
                : session.PlannedDurationMinutes;
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