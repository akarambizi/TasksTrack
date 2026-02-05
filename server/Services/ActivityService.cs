using TasksTrack.Models;
using TasksTrack.Repositories;
using System.Globalization;

namespace TasksTrack.Services
{
    public class ActivityService : IActivityService
    {
        private readonly IHabitLogRepository _habitLogRepository;
        private readonly IHabitRepository _habitRepository;
        private readonly IFocusSessionRepository _focusSessionRepository;

        public ActivityService(IHabitLogRepository habitLogRepository, IHabitRepository habitRepository, IFocusSessionRepository focusSessionRepository)
        {
            _habitLogRepository = habitLogRepository;
            _habitRepository = habitRepository;
            _focusSessionRepository = focusSessionRepository;
        }

        public async Task<IEnumerable<ActivityGridResponse>> GetActivityGridAsync(string userId, DateOnly startDate, DateOnly endDate)
        {
            // Get all habit logs for the user in the date range
            var userHabits = await _habitRepository.GetByUserIdAsync(userId);
            var userHabitIds = userHabits.Select(h => h.Id).ToList();

            if (!userHabitIds.Any())
            {
                // No habits, return empty grid with dates
                return GenerateEmptyActivityGrid(startDate, endDate);
            }

            var habitLogs = await _habitLogRepository.GetByDateRangeAsync(startDate, endDate);
            var userHabitLogs = habitLogs.Where(log => userHabitIds.Contains(log.HabitId)).ToList();

            // Get focus sessions for the user in the date range
            var focusSessions = _focusSessionRepository.GetByUser(userId)
                .Where(session => session.StartTime.Date >= startDate.ToDateTime(TimeOnly.MinValue).Date && 
                                session.StartTime.Date <= endDate.ToDateTime(TimeOnly.MinValue).Date)
                .Where(session => userHabitIds.Contains(session.HabitId))
                .ToList();

            // Get user statistics for intensity calculation
            var userStats = await GetActivityStatisticsAsync(userId);

            // Group logs by date
            var logsByDate = userHabitLogs.GroupBy(log => log.Date).ToList();
            
            // Group focus sessions by date
            var sessionsByDate = focusSessions.GroupBy(session => DateOnly.FromDateTime(session.StartTime.Date)).ToList();

            var result = new List<ActivityGridResponse>();

            // Generate grid for each date in range
            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                var dayLogs = logsByDate.FirstOrDefault(g => g.Key == date)?.ToList() ?? new List<HabitLog>();
                var daySessions = sessionsByDate.FirstOrDefault(g => g.Key == date)?.ToList() ?? new List<FocusSession>();

                // Combine habit logs and focus sessions for activity count
                var totalActivityCount = dayLogs.Count + daySessions.Count;
                var totalValue = dayLogs.Sum(log => log.Value);

                var habitsSummary = dayLogs.GroupBy(log => log.HabitId)
                    .Select(group =>
                    {
                        var habit = userHabits.First(h => h.Id == group.Key);
                        var habitTotalValue = group.Sum(log => log.Value);
                        return new HabitActivitySummary
                        {
                            HabitId = habit.Id,
                            HabitName = habit.Name,
                            MetricType = habit.MetricType,
                            Unit = habit.Unit,
                            Value = habitTotalValue,
                            Color = habit.Color,
                            Icon = habit.Icon
                        };
                    })
                    .ToList();

                // Add focus session summaries
                var focusSessionSummary = daySessions.GroupBy(session => session.HabitId)
                    .Select(group =>
                    {
                        var habit = userHabits.First(h => h.Id == group.Key);
                        var totalMinutes = group.Sum(session => session.ActualDurationSeconds.GetValueOrDefault() / 60);
                        return new HabitActivitySummary
                        {
                            HabitId = habit.Id,
                            HabitName = habit.Name + " (Focus)",
                            MetricType = "Time",
                            Unit = "min",
                            Value = totalMinutes,
                            Color = habit.Color,
                            Icon = "🎯" // Focus icon
                        };
                    })
                    .ToList();

                habitsSummary.AddRange(focusSessionSummary);

                var activityCount = totalActivityCount;
                var intensityLevel = CalculateActivityIntensity(activityCount, totalValue, userStats);

                result.Add(new ActivityGridResponse
                {
                    Date = date,
                    ActivityCount = activityCount,
                    TotalValue = totalValue,
                    IntensityLevel = intensityLevel,
                    HabitsSummary = habitsSummary
                });
            }

            return result;
        }

        public async Task<ActivitySummaryResponse> GetActivitySummaryAsync(string userId, DateOnly startDate, DateOnly endDate)
        {
            var userHabits = await _habitRepository.GetByUserIdAsync(userId);
            var userHabitIds = userHabits.Select(h => h.Id).ToList();

            if (!userHabitIds.Any())
            {
                return CreateEmptyActivitySummary(startDate, endDate);
            }

            var habitLogs = await _habitLogRepository.GetByDateRangeAsync(startDate, endDate);
            var userHabitLogs = habitLogs.Where(log => userHabitIds.Contains(log.HabitId)).ToList();

            var totalDays = endDate.DayNumber - startDate.DayNumber + 1;
            var activeDays = userHabitLogs.GroupBy(log => log.Date).Count();
            var totalActivities = userHabitLogs.Count;
            var totalValue = userHabitLogs.Sum(log => log.Value);
            var averageValue = totalActivities > 0 ? totalValue / totalActivities : 0;

            // Calculate streaks
            var currentStreak = await GetCurrentOverallStreakAsync(userId);
            var longestStreak = await GetLongestOverallStreakAsync(userId);

            // Category breakdown
            var categoryBreakdown = userHabitLogs
                .Join(userHabits, log => log.HabitId, habit => habit.Id, (log, habit) => new { Log = log, Habit = habit })
                .GroupBy(x => x.Habit.Category ?? "No Category")
                .Select(group => new CategorySummary
                {
                    Category = group.Key,
                    ActivityCount = group.Count(),
                    TotalValue = group.Sum(x => x.Log.Value),
                    Percentage = totalActivities > 0 ? (double)group.Count() / totalActivities * 100 : 0
                }).ToList();

            // Habit breakdown
            var habitBreakdown = new List<HabitSummary>();

            foreach (var habit in userHabits)
            {
                var habitSpecificLogs = userHabitLogs.Where(log => log.HabitId == habit.Id).ToList();
                var habitActivityCount = habitSpecificLogs.Count;
                var habitTotalValue = habitSpecificLogs.Sum(log => log.Value);
                var habitAverageValue = habitActivityCount > 0 ? habitTotalValue / habitActivityCount : 0;
                var habitCurrentStreak = await GetCurrentStreakAsync(userId, habit.Id);
                var habitLongestStreak = await GetLongestStreakAsync(userId, habit.Id);

                habitBreakdown.Add(new HabitSummary
                {
                    HabitId = habit.Id,
                    HabitName = habit.Name,
                    MetricType = habit.MetricType,
                    Unit = habit.Unit,
                    ActivityCount = habitActivityCount,
                    TotalValue = habitTotalValue,
                    AverageValue = habitAverageValue,
                    LongestStreak = habitLongestStreak,
                    CurrentStreak = habitCurrentStreak,
                    Category = habit.Category,
                    Color = habit.Color,
                    Icon = habit.Icon
                });
            }

            return new ActivitySummaryResponse
            {
                StartDate = startDate,
                EndDate = endDate,
                TotalDays = totalDays,
                ActiveDays = activeDays,
                TotalActivities = totalActivities,
                TotalValue = totalValue,
                AverageValue = averageValue,
                LongestStreak = longestStreak,
                CurrentStreak = currentStreak,
                CategoryBreakdown = categoryBreakdown,
                HabitBreakdown = habitBreakdown
            };
        }

        public async Task<ActivityStatisticsResponse> GetActivityStatisticsAsync(string userId)
        {
            var userHabits = await _habitRepository.GetByUserIdAsync(userId);
            var userHabitIds = userHabits.Select(h => h.Id).ToList();

            if (!userHabitIds.Any())
            {
                return CreateEmptyActivityStatistics();
            }

            var allHabitLogs = await _habitLogRepository.GetAllAsync();
            var userHabitLogs = allHabitLogs.Where(log => userHabitIds.Contains(log.HabitId)).ToList();

            // Get focus sessions for the user
            var focusSessions = _focusSessionRepository.GetByUser(userId)
                .Where(session => userHabitIds.Contains(session.HabitId))
                .ToList();

            if (!userHabitLogs.Any() && !focusSessions.Any())
            {
                return CreateEmptyActivityStatistics();
            }

            // Combine dates from both habit logs and focus sessions
            var habitLogDates = userHabitLogs.Select(log => log.Date).Distinct();
            var focusSessionDates = focusSessions.Select(session => DateOnly.FromDateTime(session.StartTime.Date)).Distinct();
            var allActiveDates = habitLogDates.Union(focusSessionDates).Distinct().ToList();
            
            var totalActiveDays = allActiveDates.Count;
            var totalActivities = userHabitLogs.Count + focusSessions.Count; // Combined count
            var totalHabits = userHabits.Count();
            var activeHabits = userHabits.Count(h => h.IsActive);
            var totalValue = userHabitLogs.Sum(log => log.Value);
            var averageValue = totalActivities > 0 ? totalValue / totalActivities : 0;

            // Calculate date range using all activity dates
            if (!allActiveDates.Any())
            {
                return CreateEmptyActivityStatistics();
            }
            
            var minDate = allActiveDates.Min();
            var maxDate = allActiveDates.Max();
            var totalDaysTracked = maxDate.DayNumber - minDate.DayNumber + 1;
            var completionRate = totalDaysTracked > 0 ? (double)totalActiveDays / totalDaysTracked * 100 : 0;

            // Calculate streaks
            var currentOverallStreak = await GetCurrentOverallStreakAsync(userId);
            var longestOverallStreak = await GetLongestOverallStreakAsync(userId);

            // Most active day of the week
            var dayOfWeekStats = userHabitLogs
                .GroupBy(log => (int)log.Date.DayOfWeek)
                .Select(group => new { DayOfWeek = group.Key, Count = group.Count() })
                .OrderByDescending(x => x.Count)
                .FirstOrDefault();

            var mostActiveDayOfWeek = dayOfWeekStats?.DayOfWeek ?? 0;
            var mostActiveDayName = CultureInfo.CurrentCulture.DateTimeFormat.GetDayName((DayOfWeek)mostActiveDayOfWeek);

            // Best performing habit
            var bestHabit = userHabits
                .Select(habit =>
                {
                    var habitSpecificLogs = userHabitLogs.Where(log => log.HabitId == habit.Id).ToList();
                    var activityCount = habitSpecificLogs.Count;
                    var habitTotalValue = habitSpecificLogs.Sum(log => log.Value);

                    // Simple completion rate based on activity frequency
                    var daysSinceCreation = Math.Max(1, DateOnly.FromDateTime(DateTime.Today).DayNumber - DateOnly.FromDateTime(habit.CreatedDate.Date).DayNumber + 1);
                    var completionRate = (double)activityCount / daysSinceCreation * 100;

                    return new HabitPerformance
                    {
                        HabitId = habit.Id,
                        HabitName = habit.Name,
                        TotalValue = habitTotalValue,
                        ActivityCount = activityCount,
                        CompletionRate = Math.Min(100, completionRate) // Cap at 100%
                    };
                })
                .OrderByDescending(h => h.CompletionRate)
                .ThenByDescending(h => h.TotalValue)
                .FirstOrDefault();

            // Monthly statistics
            var monthlyStats = userHabitLogs
                .GroupBy(log => new { Year = log.Date.Year, Month = log.Date.Month })
                .Select(group => new MonthlyStatistics
                {
                    Year = group.Key.Year,
                    Month = group.Key.Month,
                    MonthName = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(group.Key.Month),
                    ActivityCount = group.Count(),
                    TotalValue = group.Sum(log => log.Value),
                    ActiveDays = group.GroupBy(log => log.Date).Count()
                })
                .OrderBy(m => m.Year)
                .ThenBy(m => m.Month)
                .ToList();

            // Weekly statistics (last 12 weeks)
            var weeklyStats = new List<WeeklyStatistics>();
            var today = DateOnly.FromDateTime(DateTime.Today);

            for (int i = 11; i >= 0; i--)
            {
                var weekStart = today.AddDays(-(int)today.DayOfWeek - (i * 7));
                var weekEnd = weekStart.AddDays(6);

                var weekLogs = userHabitLogs.Where(log => log.Date >= weekStart && log.Date <= weekEnd).ToList();

                weeklyStats.Add(new WeeklyStatistics
                {
                    WeekStartDate = weekStart,
                    WeekEndDate = weekEnd,
                    ActivityCount = weekLogs.Count,
                    TotalValue = weekLogs.Sum(log => log.Value),
                    ActiveDays = weekLogs.GroupBy(log => log.Date).Count()
                });
            }

            return new ActivityStatisticsResponse
            {
                TotalDaysTracked = totalDaysTracked,
                TotalActiveDays = totalActiveDays,
                TotalActivities = totalActivities,
                TotalHabits = totalHabits,
                ActiveHabits = activeHabits,
                TotalValue = totalValue,
                AverageValue = averageValue,
                CompletionRate = completionRate,
                CurrentOverallStreak = currentOverallStreak,
                LongestOverallStreak = longestOverallStreak,
                MostActiveDayOfWeek = mostActiveDayOfWeek,
                MostActiveDayName = mostActiveDayName,
                BestPerformingHabit = bestHabit,
                MonthlyStats = monthlyStats,
                WeeklyStats = weeklyStats
            };
        }

        public async Task<int> GetCurrentStreakAsync(string userId, int habitId)
        {
            var habitLogs = await _habitLogRepository.GetByHabitIdAsync(habitId);
            var orderedLogs = habitLogs.OrderByDescending(log => log.Date).ToList();

            if (!orderedLogs.Any())
                return 0;

            var today = DateOnly.FromDateTime(DateTime.Today);
            var streak = 0;

            // Start from today and work backwards
            for (var date = today; ; date = date.AddDays(-1))
            {
                if (orderedLogs.Any(log => log.Date == date))
                {
                    streak++;
                }
                else
                {
                    // If we haven't started counting and there's no log today/yesterday, streak is 0
                    if (streak == 0 && date >= today.AddDays(-1))
                        continue;

                    break;
                }
            }

            return streak;
        }

        public async Task<int> GetLongestStreakAsync(string userId, int habitId)
        {
            var habitLogs = await _habitLogRepository.GetByHabitIdAsync(habitId);
            var logDates = habitLogs.Select(log => log.Date).Distinct().OrderBy(d => d).ToList();

            if (!logDates.Any())
                return 0;

            var longestStreak = 1;
            var currentStreak = 1;

            for (int i = 1; i < logDates.Count; i++)
            {
                if (logDates[i].DayNumber == logDates[i - 1].DayNumber + 1)
                {
                    currentStreak++;
                    longestStreak = Math.Max(longestStreak, currentStreak);
                }
                else
                {
                    currentStreak = 1;
                }
            }

            return longestStreak;
        }

        public int CalculateActivityIntensity(int activityCount, decimal totalValue, ActivityStatisticsResponse userActivityStats)
        {
            if (activityCount == 0)
                return 0;

            // Use percentile-based approach for intensity calculation
            var avgActivitiesPerDay = userActivityStats.TotalActiveDays > 0
                ? (double)userActivityStats.TotalActivities / userActivityStats.TotalActiveDays
                : 0;

            var avgValuePerDay = userActivityStats.TotalActiveDays > 0
                ? (double)userActivityStats.TotalValue / userActivityStats.TotalActiveDays
                : 0;

            // Calculate intensity based on activity count relative to user's average
            var activityRatio = avgActivitiesPerDay > 0 ? activityCount / avgActivitiesPerDay : 1;
            var valueRatio = avgValuePerDay > 0 ? (double)totalValue / avgValuePerDay : 1;

            // Combine both ratios with equal weight
            var combinedRatio = (activityRatio + valueRatio) / 2;

            // Map to intensity levels (GitHub-style: 0-4)
            if (combinedRatio >= 2.0) return 4; // Very high activity
            if (combinedRatio >= 1.5) return 3; // High activity
            if (combinedRatio >= 1.0) return 2; // Medium activity
            if (combinedRatio >= 0.5) return 1; // Low activity
            return 0; // No activity (shouldn't reach here if activityCount > 0)
        }

        public async Task<int> GetCurrentOverallStreakAsync(string userId)
        {
            var userHabits = await _habitRepository.GetByUserIdAsync(userId);
            var userHabitIds = userHabits.Select(h => h.Id).ToList();

            if (!userHabitIds.Any())
                return 0;

            var habitLogs = await _habitLogRepository.GetAllAsync();
            var userHabitLogs = habitLogs.Where(log => userHabitIds.Contains(log.HabitId)).ToList();

            var activeDates = userHabitLogs.Select(log => log.Date).Distinct().OrderByDescending(d => d).ToList();

            if (!activeDates.Any())
                return 0;

            var today = DateOnly.FromDateTime(DateTime.Today);
            var streak = 0;

            // Start from today and work backwards
            for (var date = today; ; date = date.AddDays(-1))
            {
                if (activeDates.Contains(date))
                {
                    streak++;
                }
                else
                {
                    // If we haven't started counting and there's no activity today/yesterday, streak is 0
                    if (streak == 0 && date >= today.AddDays(-1))
                        continue;

                    break;
                }
            }

            return streak;
        }

        public async Task<int> GetLongestOverallStreakAsync(string userId)
        {
            var userHabits = await _habitRepository.GetByUserIdAsync(userId);
            var userHabitIds = userHabits.Select(h => h.Id).ToList();

            if (!userHabitIds.Any())
                return 0;

            var habitLogs = await _habitLogRepository.GetAllAsync();
            var userHabitLogs = habitLogs.Where(log => userHabitIds.Contains(log.HabitId)).ToList();

            var activeDates = userHabitLogs.Select(log => log.Date).Distinct().OrderBy(d => d).ToList();

            if (!activeDates.Any())
                return 0;

            var longestStreak = 1;
            var currentStreak = 1;

            for (int i = 1; i < activeDates.Count; i++)
            {
                if (activeDates[i].DayNumber == activeDates[i - 1].DayNumber + 1)
                {
                    currentStreak++;
                    longestStreak = Math.Max(longestStreak, currentStreak);
                }
                else
                {
                    currentStreak = 1;
                }
            }

            return longestStreak;
        }

        private static IEnumerable<ActivityGridResponse> GenerateEmptyActivityGrid(DateOnly startDate, DateOnly endDate)
        {
            var result = new List<ActivityGridResponse>();

            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                result.Add(new ActivityGridResponse
                {
                    Date = date,
                    ActivityCount = 0,
                    TotalValue = 0,
                    IntensityLevel = 0,
                    HabitsSummary = new List<HabitActivitySummary>()
                });
            }

            return result;
        }

        private static ActivitySummaryResponse CreateEmptyActivitySummary(DateOnly startDate, DateOnly endDate)
        {
            var totalDays = endDate.DayNumber - startDate.DayNumber + 1;

            return new ActivitySummaryResponse
            {
                StartDate = startDate,
                EndDate = endDate,
                TotalDays = totalDays,
                ActiveDays = 0,
                TotalActivities = 0,
                TotalValue = 0,
                AverageValue = 0,
                LongestStreak = 0,
                CurrentStreak = 0,
                CategoryBreakdown = new List<CategorySummary>(),
                HabitBreakdown = new List<HabitSummary>()
            };
        }

        private static ActivityStatisticsResponse CreateEmptyActivityStatistics()
        {
            return new ActivityStatisticsResponse
            {
                TotalDaysTracked = 0,
                TotalActiveDays = 0,
                TotalActivities = 0,
                TotalHabits = 0,
                ActiveHabits = 0,
                TotalValue = 0,
                AverageValue = 0,
                CompletionRate = 0,
                CurrentOverallStreak = 0,
                LongestOverallStreak = 0,
                MostActiveDayOfWeek = 0,
                MostActiveDayName = "Sunday",
                BestPerformingHabit = null,
                MonthlyStats = new List<MonthlyStatistics>(),
                WeeklyStats = new List<WeeklyStatistics>()
            };
        }
    }
}