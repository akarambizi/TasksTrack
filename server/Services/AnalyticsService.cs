using TasksTrack.Models;
using TasksTrack.Repositories;
using System.Text.Json;
using System.Text;
using System.Globalization;

namespace TasksTrack.Services
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly IHabitLogRepository _habitLogRepository;
        private readonly IHabitRepository _habitRepository;
        private readonly IFocusSessionRepository _focusSessionRepository;
        private readonly IActivityService _activityService;

        public AnalyticsService(
            IHabitLogRepository habitLogRepository,
            IHabitRepository habitRepository,
            IFocusSessionRepository focusSessionRepository,
            IActivityService activityService)
        {
            _habitLogRepository = habitLogRepository;
            _habitRepository = habitRepository;
            _focusSessionRepository = focusSessionRepository;
            _activityService = activityService;
        }

        public async Task<AnalyticsResponse> GetWeeklyAnalyticsAsync(string userId, int weekOffset = 0)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var startOfWeek = today.AddDays(-(int)DateTime.Today.DayOfWeek + (int)DayOfWeek.Monday + (weekOffset * 7));
            var endOfWeek = startOfWeek.AddDays(6);

            return await GetAnalyticsForPeriodAsync(userId, startOfWeek, endOfWeek, "Weekly");
        }

        public async Task<AnalyticsResponse> GetMonthlyAnalyticsAsync(string userId, int monthOffset = 0)
        {
            var today = DateTime.Today;
            var targetMonth = today.AddMonths(monthOffset);
            var startOfMonth = DateOnly.FromDateTime(new DateTime(targetMonth.Year, targetMonth.Month, 1));
            var endOfMonth = DateOnly.FromDateTime(new DateTime(targetMonth.Year, targetMonth.Month, DateTime.DaysInMonth(targetMonth.Year, targetMonth.Month)));

            return await GetAnalyticsForPeriodAsync(userId, startOfMonth, endOfMonth, "Monthly");
        }

        public async Task<AnalyticsResponse> GetQuarterlyAnalyticsAsync(string userId, int quarterOffset = 0)
        {
            var today = DateTime.Today;
            var targetDate = today.AddMonths(quarterOffset * 3);
            
            var quarter = (targetDate.Month - 1) / 3 + 1;
            var startOfQuarter = DateOnly.FromDateTime(new DateTime(targetDate.Year, (quarter - 1) * 3 + 1, 1));
            var endOfQuarter = DateOnly.FromDateTime(new DateTime(targetDate.Year, quarter * 3, 
                DateTime.DaysInMonth(targetDate.Year, quarter * 3)));

            return await GetAnalyticsForPeriodAsync(userId, startOfQuarter, endOfQuarter, "Quarterly");
        }

        public async Task<AnalyticsResponse> GetYearlyAnalyticsAsync(string userId, int yearOffset = 0)
        {
            var today = DateTime.Today;
            var targetYear = today.Year + yearOffset;
            var startOfYear = DateOnly.FromDateTime(new DateTime(targetYear, 1, 1));
            var endOfYear = DateOnly.FromDateTime(new DateTime(targetYear, 12, 31));

            return await GetAnalyticsForPeriodAsync(userId, startOfYear, endOfYear, "Yearly");
        }

        public async Task<AnalyticsResponse> GetCustomAnalyticsAsync(string userId, CustomAnalyticsRequest request)
        {
            if (!DateOnly.TryParse(request.StartDate, out var startDate))
            {
                throw new ArgumentException("Invalid start date format. Use YYYY-MM-DD.");
            }

            if (!DateOnly.TryParse(request.EndDate, out var endDate))
            {
                throw new ArgumentException("Invalid end date format. Use YYYY-MM-DD.");
            }

            if (startDate > endDate)
            {
                throw new ArgumentException("Start date cannot be after end date.");
            }

            return await GetAnalyticsForPeriodAsync(userId, startDate, endDate, "Custom", request.HabitIds, request.Categories);
        }

        public async Task<ComparisonAnalyticsResponse> GetComparisonAnalyticsAsync(string userId, 
            DateOnly currentStart, DateOnly currentEnd, 
            DateOnly previousStart, DateOnly previousEnd)
        {
            var currentPeriod = await GetAnalyticsForPeriodAsync(userId, currentStart, currentEnd, "Current");
            var previousPeriod = await GetAnalyticsForPeriodAsync(userId, previousStart, previousEnd, "Previous");

            var comparison = CalculateComparisonMetrics(currentPeriod, previousPeriod);

            return new ComparisonAnalyticsResponse
            {
                CurrentPeriod = currentPeriod,
                PreviousPeriod = previousPeriod,
                Comparison = comparison
            };
        }

        public async Task<List<HabitAnalytics>> GetHabitComparisonAsync(string userId, List<int> habitIds, DateOnly startDate, DateOnly endDate)
        {
            var analytics = await GetAnalyticsForPeriodAsync(userId, startDate, endDate, "Comparison", habitIds);
            return analytics.HabitBreakdown.Where(h => habitIds.Contains(h.HabitId)).ToList();
        }

        public async Task<(byte[] Data, string ContentType, string FileName)> ExportAnalyticsAsync(string userId, ExportAnalyticsRequest request)
        {
            if (!DateOnly.TryParse(request.StartDate, out var startDate))
            {
                throw new ArgumentException("Invalid start date format. Use YYYY-MM-DD.");
            }

            if (!DateOnly.TryParse(request.EndDate, out var endDate))
            {
                throw new ArgumentException("Invalid end date format. Use YYYY-MM-DD.");
            }

            var analytics = await GetAnalyticsForPeriodAsync(userId, startDate, endDate, "Export", request.HabitIds, request.Categories);

            return request.Format.ToLower() switch
            {
                "json" => GenerateJsonExport(analytics),
                "csv" => GenerateCsvExport(analytics, request),
                _ => throw new ArgumentException("Unsupported export format. Use 'json' or 'csv'.")
            };
        }

        public async Task<GoalProgress> CalculateGoalProgressAsync(string userId, DateOnly startDate, DateOnly endDate, 
            decimal? targetMinutes = null, int? targetSessions = null)
        {
            // Get basic data directly to avoid circular dependency
            var userHabits = await _habitRepository.GetByUserIdAsync(userId);
            var userHabitIds = userHabits.Select(h => h.Id).ToList();

            if (!userHabitIds.Any())
            {
                return new GoalProgress
                {
                    TargetMinutesPerPeriod = 0,
                    ActualMinutes = 0,
                    ProgressPercentage = 0,
                    TargetSessionsPerPeriod = 0,
                    ActualSessions = 0,
                    OnTrack = true,
                    DaysRemaining = 0,
                    RequiredDailyAverage = 0
                };
            }

            var habitLogs = await _habitLogRepository.GetByDateRangeAsync(startDate, endDate);
            habitLogs.Where(l => userHabitIds.Contains(l.HabitId)).ToList();

            var focusSessions = _focusSessionRepository.GetByUser(userId)
                .Where(s => DateOnly.FromDateTime(s.StartTime.DateTime) >= startDate 
                         && DateOnly.FromDateTime(s.StartTime.DateTime) <= endDate)
                .ToList();

            var totalMinutes = focusSessions.Sum(s => (decimal)(s.ActualDurationSeconds ?? 0)) / 60;
            var totalSessions = focusSessions.Count;

            var daysRemaining = Math.Max(0, endDate.DayNumber - DateOnly.FromDateTime(DateTime.Today).DayNumber);

            // Default goals if not specified
            var periodDays = endDate.DayNumber - startDate.DayNumber + 1;
            var defaultTargetMinutes = targetMinutes ?? (decimal)periodDays * 30; // 30 minutes per day default
            var defaultTargetSessions = targetSessions ?? periodDays; // 1 session per day default

            return new GoalProgress
            {
                TargetMinutesPerPeriod = defaultTargetMinutes,
                ActualMinutes = totalMinutes,
                ProgressPercentage = defaultTargetMinutes > 0 ? Math.Round((totalMinutes / defaultTargetMinutes) * 100, 2) : 0,
                TargetSessionsPerPeriod = defaultTargetSessions,
                ActualSessions = totalSessions,
                OnTrack = totalMinutes >= (defaultTargetMinutes * (periodDays - daysRemaining) / periodDays),
                DaysRemaining = daysRemaining,
                RequiredDailyAverage = daysRemaining > 0 
                    ? Math.Max(0, (defaultTargetMinutes - totalMinutes) / daysRemaining)
                    : 0
            };
        }

        public async Task<AnalyticsResponse> GetDashboardOverviewAsync(string userId)
        {
            // Get current week analytics for dashboard overview
            var weeklyAnalytics = await GetWeeklyAnalyticsAsync(userId, 0);
            
            // Override period name for dashboard
            weeklyAnalytics.Period = "Dashboard Overview";

            return weeklyAnalytics;
        }

        private async Task<AnalyticsResponse> GetAnalyticsForPeriodAsync(string userId, DateOnly startDate, DateOnly endDate, 
            string period, List<int>? habitIds = null, List<string>? categories = null)
        {
            // Get user habits with optional filtering
            var userHabits = await _habitRepository.GetByUserIdAsync(userId);
            
            if (habitIds?.Any() == true)
            {
                userHabits = userHabits.Where(h => habitIds.Contains(h.Id)).ToList();
            }
            
            if (categories?.Any() == true)
            {
                userHabits = userHabits.Where(h => categories.Contains(h.Category ?? "No Category")).ToList();
            }

            var userHabitIds = userHabits.Select(h => h.Id).ToList();

            if (!userHabitIds.Any())
            {
                return CreateEmptyAnalytics(period, startDate, endDate);
            }

            // Get habit logs in date range
            var habitLogs = await _habitLogRepository.GetByDateRangeAsync(startDate, endDate);
            var userHabitLogs = habitLogs.Where(log => userHabitIds.Contains(log.HabitId)).ToList();

            // Get focus sessions in date range
            var focusSessions = _focusSessionRepository.GetByUser(userId)
                .Where(session => session.StartTime.Date >= startDate.ToDateTime(TimeOnly.MinValue).Date &&
                                session.StartTime.Date <= endDate.ToDateTime(TimeOnly.MinValue).Date)
                .Where(session => userHabitIds.Contains(session.HabitId))
                .ToList();

            // Calculate metrics
            var totalSessions = userHabitLogs.Count + focusSessions.Count;
            var totalMinutes = focusSessions.Sum(s => (s.ActualDurationSeconds ?? 0) / 60.0m);
            var averageSessionDuration = totalSessions > 0 ? totalMinutes / totalSessions : 0;

            var activeDates = userHabitLogs.Select(l => l.Date)
                .Union(focusSessions.Select(s => DateOnly.FromDateTime(s.StartTime.Date)))
                .Distinct()
                .Count();

            var totalDays = endDate.DayNumber - startDate.DayNumber + 1;
            var activityRate = totalDays > 0 ? Math.Round((decimal)activeDates / totalDays * 100, 2) : 0;

            // Calculate habit breakdowns
            var habitBreakdown = await CalculateHabitBreakdownAsync(userHabits, userHabitLogs, focusSessions, startDate, endDate, userId);
            
            // Calculate category breakdowns
            var categoryBreakdown = CalculateCategoryBreakdown(habitBreakdown);
            
            // Calculate daily progress
            var dailyProgress = CalculateDailyProgress(userHabitLogs, focusSessions, startDate, endDate);
            
            // Calculate goal progress
            var goalProgress = await CalculateGoalProgressAsync(userId, startDate, endDate);

            // Calculate streaks
            var currentStreak = await CalculateCurrentOverallStreakAsync(userId);
            var longestStreak = await CalculateLongestOverallStreakAsync(userId);

            return new AnalyticsResponse
            {
                Period = period,
                StartDate = startDate,
                EndDate = endDate,
                TotalHabitsTracked = userHabits.Count(),
                TotalSessions = totalSessions,
                TotalMinutes = totalMinutes,
                AverageSessionDuration = Math.Round(averageSessionDuration, 2),
                ActiveDays = activeDates,
                TotalDays = totalDays,
                ActivityRate = activityRate,
                CurrentStreak = currentStreak,
                LongestStreak = longestStreak,
                HabitBreakdown = habitBreakdown,
                CategoryBreakdown = categoryBreakdown,
                DailyProgress = dailyProgress,
                GoalProgress = goalProgress
            };
        }

        private async Task<List<HabitAnalytics>> CalculateHabitBreakdownAsync(IEnumerable<Habit> habits, 
            List<HabitLog> habitLogs, List<FocusSession> focusSessions, DateOnly startDate, DateOnly endDate, string userId)
        {
            var result = new List<HabitAnalytics>();

            foreach (var habit in habits)
            {
                var habitLogEntries = habitLogs.Where(l => l.HabitId == habit.Id).ToList();
                var habitFocusSessions = focusSessions.Where(s => s.HabitId == habit.Id).ToList();

                var sessionCount = habitLogEntries.Count + habitFocusSessions.Count;
                var totalMinutes = habitFocusSessions.Sum(s => (s.ActualDurationSeconds ?? 0) / 60.0m);
                var averageSessionDuration = sessionCount > 0 ? totalMinutes / sessionCount : 0;

                var completedDates = habitLogEntries.Select(l => l.Date)
                    .Union(habitFocusSessions.Select(s => DateOnly.FromDateTime(s.StartTime.Date)))
                    .Distinct()
                    .Count();

                var totalDays = endDate.DayNumber - startDate.DayNumber + 1;
                var completionRate = totalDays > 0 ? Math.Round((decimal)completedDates / totalDays * 100, 2) : 0;

                var currentStreak = await _activityService.GetCurrentStreakAsync(userId, habit.Id);
                var longestStreak = await _activityService.GetLongestStreakAsync(userId, habit.Id);

                var lastActivity = habitLogEntries.Any() || habitFocusSessions.Any()
                    ? habitLogEntries.Select(l => l.Date.ToDateTime(TimeOnly.MinValue)).ToList()
                        .Concat(habitFocusSessions.Select(s => s.StartTime.DateTime).ToList())
                        .Max()
                    : DateTime.MinValue;

                // Calculate activity intensity based on recent activity
                var recentLogs = habitLogEntries.Where(l => l.Date >= DateOnly.FromDateTime(DateTime.Today.AddDays(-7))).Count();
                var recentSessions = habitFocusSessions.Where(s => DateOnly.FromDateTime(s.StartTime.DateTime) >= DateOnly.FromDateTime(DateTime.Today.AddDays(-7))).Count();
                var activityIntensity = Math.Min(4, (recentLogs + recentSessions) / 2);

                result.Add(new HabitAnalytics
                {
                    HabitId = habit.Id,
                    Name = habit.Name,
                    Category = habit.Category ?? "No Category",
                    SessionCount = sessionCount,
                    TotalMinutes = Math.Round(totalMinutes, 2),
                    AverageSessionDuration = Math.Round(averageSessionDuration, 2),
                    CompletedDays = completedDates,
                    CompletionRate = completionRate,
                    CurrentStreak = currentStreak,
                    LongestStreak = longestStreak,
                    LastActivityDate = lastActivity == DateTime.MinValue ? "" : lastActivity.ToString("yyyy-MM-dd"),
                    ActivityIntensity = activityIntensity
                });
            }

            return result;
        }

        private List<CategoryAnalytics> CalculateCategoryBreakdown(List<HabitAnalytics> habitAnalytics)
        {
            var categoryGroups = habitAnalytics.GroupBy(h => h.Category);
            var totalMinutes = habitAnalytics.Sum(h => h.TotalMinutes);

            return categoryGroups.Select(group => new CategoryAnalytics
            {
                Category = group.Key,
                HabitCount = group.Count(),
                TotalSessions = group.Sum(h => h.SessionCount),
                TotalMinutes = Math.Round(group.Sum(h => h.TotalMinutes), 2),
                Percentage = totalMinutes > 0 
                    ? Math.Round((group.Sum(h => h.TotalMinutes) / totalMinutes) * 100, 2) 
                    : 0,
                CompletedDays = group.Sum(h => h.CompletedDays),
                CompletionRate = Math.Round(group.Average(h => h.CompletionRate), 2),
                AverageSessionDuration = Math.Round(group.Average(h => h.AverageSessionDuration), 2)
            }).ToList();
        }

        private List<DailyProgress> CalculateDailyProgress(List<HabitLog> habitLogs, 
            List<FocusSession> focusSessions, DateOnly startDate, DateOnly endDate)
        {
            var result = new List<DailyProgress>();

            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                var dayLogs = habitLogs.Where(l => l.Date == date).ToList();
                var daySessions = focusSessions.Where(s => DateOnly.FromDateTime(s.StartTime.Date) == date).ToList();

                var sessionCount = dayLogs.Count + daySessions.Count;
                var totalMinutes = daySessions.Sum(s => (s.ActualDurationSeconds ?? 0) / 60.0m);
                var habitsCompleted = dayLogs.Select(l => l.HabitId)
                    .Union(daySessions.Select(s => s.HabitId))
                    .Distinct()
                    .Count();

                // Simple intensity calculation based on activity count
                var activityIntensity = sessionCount switch
                {
                    0 => 0,
                    1 => 1,
                    2 or 3 => 2,
                    4 or 5 => 3,
                    _ => 4
                };

                result.Add(new DailyProgress
                {
                    Date = date,
                    SessionCount = sessionCount,
                    TotalMinutes = Math.Round(totalMinutes, 2),
                    HabitsCompleted = habitsCompleted,
                    ActivityIntensity = activityIntensity,
                    Label = date.ToString("MMM dd", CultureInfo.InvariantCulture)
                });
            }

            return result;
        }

        private ComparisonMetrics CalculateComparisonMetrics(AnalyticsResponse current, AnalyticsResponse previous)
        {
            var sessionsChange = previous.TotalSessions > 0 
                ? Math.Round(((decimal)(current.TotalSessions - previous.TotalSessions) / previous.TotalSessions) * 100, 2)
                : current.TotalSessions > 0 ? 100 : 0;

            var minutesChange = previous.TotalMinutes > 0 
                ? Math.Round(((current.TotalMinutes - previous.TotalMinutes) / previous.TotalMinutes) * 100, 2)
                : current.TotalMinutes > 0 ? 100 : 0;

            var activityRateChange = previous.ActivityRate > 0 
                ? Math.Round(((current.ActivityRate - previous.ActivityRate) / previous.ActivityRate) * 100, 2)
                : current.ActivityRate > 0 ? 100 : 0;

            var trend = "stable";
            if (sessionsChange > 5 && minutesChange > 5)
                trend = "improving";
            else if (sessionsChange < -5 && minutesChange < -5)
                trend = "declining";

            var habitComparisons = current.HabitBreakdown.Select(currentHabit =>
            {
                var previousHabit = previous.HabitBreakdown.FirstOrDefault(h => h.HabitId == currentHabit.HabitId);
                
                var habitSessionsChange = previousHabit?.SessionCount > 0
                    ? Math.Round(((decimal)(currentHabit.SessionCount - previousHabit.SessionCount) / previousHabit.SessionCount) * 100, 2)
                    : currentHabit.SessionCount > 0 ? 100 : 0;

                var habitMinutesChange = previousHabit?.TotalMinutes > 0
                    ? Math.Round(((currentHabit.TotalMinutes - previousHabit.TotalMinutes) / previousHabit.TotalMinutes) * 100, 2)
                    : currentHabit.TotalMinutes > 0 ? 100 : 0;

                var habitTrend = habitSessionsChange > 5 && habitMinutesChange > 5 ? "improving" :
                               habitSessionsChange < -5 && habitMinutesChange < -5 ? "declining" : "stable";

                return new HabitComparison
                {
                    HabitId = currentHabit.HabitId,
                    Name = currentHabit.Name,
                    SessionsChange = habitSessionsChange,
                    MinutesChange = habitMinutesChange,
                    CompletionRateChange = previousHabit != null 
                        ? Math.Round(currentHabit.CompletionRate - previousHabit.CompletionRate, 2) 
                        : currentHabit.CompletionRate,
                    Trend = habitTrend
                };
            }).ToList();

            return new ComparisonMetrics
            {
                SessionsChange = sessionsChange,
                MinutesChange = minutesChange,
                ActivityRateChange = activityRateChange,
                CompletionRateChange = Math.Round(current.ActivityRate - previous.ActivityRate, 2),
                Trend = trend,
                HabitComparisons = habitComparisons
            };
        }

        private AnalyticsResponse CreateEmptyAnalytics(string period, DateOnly startDate, DateOnly endDate)
        {
            var totalDays = endDate.DayNumber - startDate.DayNumber + 1;
            var dailyProgress = new List<DailyProgress>();

            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                dailyProgress.Add(new DailyProgress
                {
                    Date = date,
                    SessionCount = 0,
                    TotalMinutes = 0,
                    HabitsCompleted = 0,
                    ActivityIntensity = 0,
                    Label = date.ToString("MMM dd", CultureInfo.InvariantCulture)
                });
            }

            return new AnalyticsResponse
            {
                Period = period,
                StartDate = startDate,
                EndDate = endDate,
                TotalHabitsTracked = 0,
                TotalSessions = 0,
                TotalMinutes = 0,
                AverageSessionDuration = 0,
                ActiveDays = 0,
                TotalDays = totalDays,
                ActivityRate = 0,
                CurrentStreak = 0,
                LongestStreak = 0,
                HabitBreakdown = new List<HabitAnalytics>(),
                CategoryBreakdown = new List<CategoryAnalytics>(),
                DailyProgress = dailyProgress,
                GoalProgress = new GoalProgress
                {
                    TargetMinutesPerPeriod = 0,
                    ActualMinutes = 0,
                    ProgressPercentage = 0,
                    TargetSessionsPerPeriod = 0,
                    ActualSessions = 0,
                    OnTrack = true,
                    DaysRemaining = Math.Max(0, endDate.DayNumber - DateOnly.FromDateTime(DateTime.Today).DayNumber),
                    RequiredDailyAverage = 0
                }
            };
        }

        private async Task<int> CalculateCurrentOverallStreakAsync(string userId)
        {
            var userHabits = await _habitRepository.GetByUserIdAsync(userId);
            var userHabitIds = userHabits.Select(h => h.Id).ToList();

            if (!userHabitIds.Any()) return 0;

            var today = DateOnly.FromDateTime(DateTime.Today);
            var streak = 0;
            var currentDate = today;
            var minDate = DateOnly.MinValue.AddDays(1); // Safety buffer

            // Look backwards from today to find consecutive days with activity
            while (currentDate > minDate)
            {
                var hasActivity = await HasActivityOnDate(userId, userHabitIds, currentDate);
                
                if (!hasActivity)
                {
                    // Allow one day gap for current streak (if today has no activity yet)
                    if (currentDate == today)
                    {
                        currentDate = currentDate.AddDays(-1);
                        continue;
                    }
                    break;
                }

                streak++;
                currentDate = currentDate.AddDays(-1);
                
                // Prevent infinite loop and extremely long streaks
                if (streak > 3650) // Max 10 years worth of streak
                    break;
            }

            return streak;
        }

        private async Task<int> CalculateLongestOverallStreakAsync(string userId)
        {
            var userHabits = await _habitRepository.GetByUserIdAsync(userId);
            var userHabitIds = userHabits.Select(h => h.Id).ToList();

            if (!userHabitIds.Any()) return 0;

            // Get all activity dates
            var allHabitLogs = await _habitLogRepository.GetAllAsync();
            var habitLogs = allHabitLogs.Where(l => userHabitIds.Contains(l.HabitId));
            var focusSessions = _focusSessionRepository.GetByUser(userId).ToList();

            var allActivityDates = habitLogs.Select(l => l.Date)
                .Union(focusSessions.Select(s => DateOnly.FromDateTime(s.StartTime.DateTime.Date)))
                .Distinct()
                .OrderBy(d => d)
                .ToList();

            if (!allActivityDates.Any()) return 0;

            var longestStreak = 0;
            var currentStreak = 1;
            
            for (int i = 1; i < allActivityDates.Count; i++)
            {
                if (allActivityDates[i].DayNumber - allActivityDates[i - 1].DayNumber == 1)
                {
                    currentStreak++;
                }
                else
                {
                    longestStreak = Math.Max(longestStreak, currentStreak);
                    currentStreak = 1;
                }
            }

            return Math.Max(longestStreak, currentStreak);
        }

        private async Task<bool> HasActivityOnDate(string userId, List<int> habitIds, DateOnly date)
        {
            var habitLogs = await _habitLogRepository.GetByDateRangeAsync(date, date);
            var dayHabitLogs = habitLogs.Where(l => habitIds.Contains(l.HabitId)).Any();

            if (dayHabitLogs) return true;

            var focusSessions = _focusSessionRepository.GetByUser(userId)
                .Where(s => DateOnly.FromDateTime(s.StartTime.DateTime.Date) == date)
                .Where(s => habitIds.Contains(s.HabitId))
                .Any();

            return focusSessions;
        }

        private (byte[] Data, string ContentType, string FileName) GenerateJsonExport(AnalyticsResponse analytics)
        {
            var json = JsonSerializer.Serialize(analytics, new JsonSerializerOptions { WriteIndented = true });
            var bytes = Encoding.UTF8.GetBytes(json);
            var fileName = $"analytics-{analytics.StartDate:yyyy-MM-dd}-to-{analytics.EndDate:yyyy-MM-dd}.json";
            
            return (bytes, "application/json", fileName);
        }

        private (byte[] Data, string ContentType, string FileName) GenerateCsvExport(AnalyticsResponse analytics, ExportAnalyticsRequest request)
        {
            var csv = new StringBuilder();
            
            // Headers
            csv.AppendLine("Date,Sessions,Minutes,Habits Completed,Activity Intensity");
            
            // Daily data
            foreach (var day in analytics.DailyProgress)
            {
                csv.AppendLine($"{day.Date:yyyy-MM-dd},{day.SessionCount},{day.TotalMinutes},{day.HabitsCompleted},{day.ActivityIntensity}");
            }
            
            if (request.IncludeHabitBreakdown)
            {
                csv.AppendLine();
                csv.AppendLine("Habit Breakdown");
                csv.AppendLine("Habit Name,Category,Sessions,Total Minutes,Completion Rate,Current Streak");
                
                foreach (var habit in analytics.HabitBreakdown)
                {
                    csv.AppendLine($"{habit.Name},{habit.Category},{habit.SessionCount},{habit.TotalMinutes},{habit.CompletionRate},{habit.CurrentStreak}");
                }
            }
            
            var bytes = Encoding.UTF8.GetBytes(csv.ToString());
            var fileName = $"analytics-{analytics.StartDate:yyyy-MM-dd}-to-{analytics.EndDate:yyyy-MM-dd}.csv";
            
            return (bytes, "text/csv", fileName);
        }
    }
}