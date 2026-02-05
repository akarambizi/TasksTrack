using Moq;
using Xunit;
using TasksTrack.Models;
using TasksTrack.Services;
using TasksTrack.Repositories;
using System.Collections.Generic;
using System.Linq;
using System;
using System.Threading.Tasks;

namespace TasksTrack.Tests.Services
{
    public class ActivityServiceTests
    {
        private readonly Mock<IHabitLogRepository> _habitLogRepositoryMock;
        private readonly Mock<IHabitRepository> _habitRepositoryMock;
        private readonly ActivityService _service;

        public ActivityServiceTests()
        {
            _habitLogRepositoryMock = new Mock<IHabitLogRepository>();
            _habitRepositoryMock = new Mock<IHabitRepository>();
            _service = new ActivityService(_habitLogRepositoryMock.Object, _habitRepositoryMock.Object);
        }

        [Fact]
        public async Task GetActivityGridAsync_WithNoHabits_ReturnsEmptyGrid()
        {
            // Arrange
            var userId = "testuser";
            var startDate = DateOnly.FromDateTime(DateTime.Today.AddDays(-7));
            var endDate = DateOnly.FromDateTime(DateTime.Today);

            _habitRepositoryMock.Setup(repo => repo.GetByUserIdAsync(userId))
                .ReturnsAsync(new List<Habit>());

            // Act
            var result = await _service.GetActivityGridAsync(userId, startDate, endDate);

            // Assert
            Assert.NotNull(result);
            var gridData = result.ToList();
            Assert.Equal(8, gridData.Count); // 7 days + start day
            Assert.All(gridData, item => Assert.Equal(0, item.ActivityCount));
            Assert.All(gridData, item => Assert.Equal(0, item.TotalValue));
            Assert.All(gridData, item => Assert.Equal(0, item.IntensityLevel));
        }

        [Fact]
        public async Task GetActivityGridAsync_WithHabitsAndLogs_ReturnsCorrectGrid()
        {
            // Arrange
            var userId = "testuser";
            var startDate = DateOnly.FromDateTime(DateTime.Today.AddDays(-2));
            var endDate = DateOnly.FromDateTime(DateTime.Today);
            var today = DateOnly.FromDateTime(DateTime.Today);

            var habits = new List<Habit>
            {
                new Habit
                {
                    Id = 1,
                    Name = "Exercise",
                    MetricType = "minutes",
                    Unit = "min",
                    CreatedBy = userId,
                    Color = "#FF5733",
                    Icon = "dumbbell"
                }
            };

            var habitLogs = new List<HabitLog>
            {
                new HabitLog
                {
                    Id = 1,
                    HabitId = 1,
                    Value = 30,
                    Date = today,
                    CreatedBy = userId,
                    CreatedDate = DateTime.Now
                }
            };

            _habitRepositoryMock.Setup(repo => repo.GetByUserIdAsync(userId)).ReturnsAsync(habits);
            _habitLogRepositoryMock.Setup(repo => repo.GetByDateRangeAsync(startDate, endDate)).ReturnsAsync(habitLogs);
            _habitLogRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(habitLogs);

            // Act
            var result = await _service.GetActivityGridAsync(userId, startDate, endDate);

            // Assert
            var gridData = result.ToList();
            Assert.Equal(3, gridData.Count);
            
            var todayData = gridData.FirstOrDefault(g => g.Date == today);
            Assert.NotNull(todayData);
            Assert.Equal(1, todayData.ActivityCount);
            Assert.Equal(30, todayData.TotalValue);
            Assert.Single(todayData.HabitsSummary);
            Assert.Equal("Exercise", todayData.HabitsSummary.First().HabitName);
        }

        [Fact]
        public async Task GetActivitySummaryAsync_WithNoHabits_ReturnsEmptySummary()
        {
            // Arrange
            var userId = "testuser";
            var startDate = DateOnly.FromDateTime(DateTime.Today.AddDays(-7));
            var endDate = DateOnly.FromDateTime(DateTime.Today);

            _habitRepositoryMock.Setup(repo => repo.GetByUserIdAsync(userId))
                .ReturnsAsync(new List<Habit>());

            // Act
            var result = await _service.GetActivitySummaryAsync(userId, startDate, endDate);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(startDate, result.StartDate);
            Assert.Equal(endDate, result.EndDate);
            Assert.Equal(8, result.TotalDays);
            Assert.Equal(0, result.ActiveDays);
            Assert.Equal(0, result.TotalActivities);
            Assert.Equal(0, result.TotalValue);
            Assert.Equal(0, result.CurrentStreak);
            Assert.Equal(0, result.LongestStreak);
            Assert.Empty(result.CategoryBreakdown);
            Assert.Empty(result.HabitBreakdown);
        }

        [Fact]
        public async Task GetActivitySummaryAsync_WithHabitsAndLogs_ReturnsCorrectSummary()
        {
            // Arrange
            var userId = "testuser";
            var startDate = DateOnly.FromDateTime(DateTime.Today.AddDays(-7));
            var endDate = DateOnly.FromDateTime(DateTime.Today);
            var today = DateOnly.FromDateTime(DateTime.Today);

            var habits = new List<Habit>
            {
                new Habit
                {
                    Id = 1,
                    Name = "Exercise",
                    MetricType = "minutes",
                    Unit = "min",
                    Category = "Health",
                    CreatedBy = userId,
                    CreatedDate = DateTime.Now
                },
                new Habit
                {
                    Id = 2,
                    Name = "Reading",
                    MetricType = "pages",
                    Unit = "pages",
                    Category = "Learning",
                    CreatedBy = userId,
                    CreatedDate = DateTime.Now
                }
            };

            var habitLogs = new List<HabitLog>
            {
                new HabitLog
                {
                    Id = 1,
                    HabitId = 1,
                    Value = 30,
                    Date = today,
                    CreatedBy = userId,
                    CreatedDate = DateTime.Now
                },
                new HabitLog
                {
                    Id = 2,
                    HabitId = 1,
                    Value = 45,
                    Date = today.AddDays(-1),
                    CreatedBy = userId,
                    CreatedDate = DateTime.Now
                },
                new HabitLog
                {
                    Id = 3,
                    HabitId = 2,
                    Value = 10,
                    Date = today,
                    CreatedBy = userId,
                    CreatedDate = DateTime.Now
                }
            };

            _habitRepositoryMock.Setup(repo => repo.GetByUserIdAsync(userId)).ReturnsAsync(habits);
            _habitLogRepositoryMock.Setup(repo => repo.GetByDateRangeAsync(startDate, endDate)).ReturnsAsync(habitLogs);
            _habitLogRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(habitLogs);

            // Setup for streak calculations
            _habitLogRepositoryMock.Setup(repo => repo.GetByHabitIdAsync(1))
                .ReturnsAsync(habitLogs.Where(l => l.HabitId == 1));
            _habitLogRepositoryMock.Setup(repo => repo.GetByHabitIdAsync(2))
                .ReturnsAsync(habitLogs.Where(l => l.HabitId == 2));

            // Act
            var result = await _service.GetActivitySummaryAsync(userId, startDate, endDate);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(8, result.TotalDays);
            Assert.Equal(2, result.ActiveDays); // today and yesterday
            Assert.Equal(3, result.TotalActivities);
            Assert.Equal(85, result.TotalValue); // 30 + 45 + 10
            Assert.Equal(2, result.CategoryBreakdown.Count);
            Assert.Equal(2, result.HabitBreakdown.Count);

            var healthCategory = result.CategoryBreakdown.FirstOrDefault(c => c.Category == "Health");
            Assert.NotNull(healthCategory);
            Assert.Equal(2, healthCategory.ActivityCount); // 2 exercise logs
            Assert.Equal(75, healthCategory.TotalValue); // 30 + 45

            var learningCategory = result.CategoryBreakdown.FirstOrDefault(c => c.Category == "Learning");
            Assert.NotNull(learningCategory);
            Assert.Equal(1, learningCategory.ActivityCount); // 1 reading log
            Assert.Equal(10, learningCategory.TotalValue);
        }

        [Fact]
        public async Task GetActivityStatisticsAsync_WithNoHabits_ReturnsEmptyStatistics()
        {
            // Arrange
            var userId = "testuser";
            _habitRepositoryMock.Setup(repo => repo.GetByUserIdAsync(userId))
                .ReturnsAsync(new List<Habit>());

            // Act
            var result = await _service.GetActivityStatisticsAsync(userId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(0, result.TotalDaysTracked);
            Assert.Equal(0, result.TotalActiveDays);
            Assert.Equal(0, result.TotalActivities);
            Assert.Equal(0, result.TotalHabits);
            Assert.Equal(0, result.ActiveHabits);
            Assert.Equal(0, result.CurrentOverallStreak);
            Assert.Equal(0, result.LongestOverallStreak);
            Assert.Null(result.BestPerformingHabit);
            Assert.Empty(result.MonthlyStats);
            Assert.Empty(result.WeeklyStats);
        }

        [Fact]
        public async Task GetCurrentStreakAsync_WithConsecutiveLogs_ReturnsCorrectStreak()
        {
            // Arrange
            var userId = "testuser";
            var habitId = 1;
            var today = DateOnly.FromDateTime(DateTime.Today);

            var habitLogs = new List<HabitLog>
            {
                new HabitLog { Date = today, HabitId = habitId, Value = 30, CreatedBy = userId, CreatedDate = DateTime.Now },
                new HabitLog { Date = today.AddDays(-1), HabitId = habitId, Value = 25, CreatedBy = userId, CreatedDate = DateTime.Now },
                new HabitLog { Date = today.AddDays(-2), HabitId = habitId, Value = 35, CreatedBy = userId, CreatedDate = DateTime.Now },
                // Gap here
                new HabitLog { Date = today.AddDays(-4), HabitId = habitId, Value = 20, CreatedBy = userId, CreatedDate = DateTime.Now }
            };

            _habitLogRepositoryMock.Setup(repo => repo.GetByHabitIdAsync(habitId))
                .ReturnsAsync(habitLogs);

            // Act
            var streak = await _service.GetCurrentStreakAsync(userId, habitId);

            // Assert
            Assert.Equal(3, streak);
        }

        [Fact]
        public async Task GetCurrentStreakAsync_WithNoRecentActivity_ReturnsZero()
        {
            // Arrange
            var userId = "testuser";
            var habitId = 1;
            var today = DateOnly.FromDateTime(DateTime.Today);

            var habitLogs = new List<HabitLog>
            {
                // Last activity was 3 days ago
                new HabitLog { Date = today.AddDays(-3), HabitId = habitId, Value = 30, CreatedBy = userId, CreatedDate = DateTime.Now },
                new HabitLog { Date = today.AddDays(-4), HabitId = habitId, Value = 25, CreatedBy = userId, CreatedDate = DateTime.Now }
            };

            _habitLogRepositoryMock.Setup(repo => repo.GetByHabitIdAsync(habitId))
                .ReturnsAsync(habitLogs);

            // Act
            var streak = await _service.GetCurrentStreakAsync(userId, habitId);

            // Assert
            Assert.Equal(0, streak);
        }

        [Fact]
        public async Task GetLongestStreakAsync_WithMultipleStreaks_ReturnsLongest()
        {
            // Arrange
            var userId = "testuser";
            var habitId = 1;
            var today = DateOnly.FromDateTime(DateTime.Today);

            var habitLogs = new List<HabitLog>
            {
                // First streak (3 days): days -20, -21, -22
                new HabitLog { Date = today.AddDays(-20), HabitId = habitId, Value = 30, CreatedBy = userId, CreatedDate = DateTime.Now },
                new HabitLog { Date = today.AddDays(-21), HabitId = habitId, Value = 25, CreatedBy = userId, CreatedDate = DateTime.Now },
                new HabitLog { Date = today.AddDays(-22), HabitId = habitId, Value = 35, CreatedBy = userId, CreatedDate = DateTime.Now },
                
                // Gap (days -19 to -11 have no logs)
                
                // Second streak (5 days) - longest: days -10, -9, -8, -7, -6
                new HabitLog { Date = today.AddDays(-10), HabitId = habitId, Value = 30, CreatedBy = userId, CreatedDate = DateTime.Now },
                new HabitLog { Date = today.AddDays(-9), HabitId = habitId, Value = 25, CreatedBy = userId, CreatedDate = DateTime.Now },
                new HabitLog { Date = today.AddDays(-8), HabitId = habitId, Value = 35, CreatedBy = userId, CreatedDate = DateTime.Now },
                new HabitLog { Date = today.AddDays(-7), HabitId = habitId, Value = 20, CreatedBy = userId, CreatedDate = DateTime.Now },
                new HabitLog { Date = today.AddDays(-6), HabitId = habitId, Value = 40, CreatedBy = userId, CreatedDate = DateTime.Now },
                
                // Gap (days -5 to -2 have no logs)
                
                // Current streak (2 days): days -1 and today
                new HabitLog { Date = today.AddDays(-1), HabitId = habitId, Value = 25, CreatedBy = userId, CreatedDate = DateTime.Now },
                new HabitLog { Date = today, HabitId = habitId, Value = 30, CreatedBy = userId, CreatedDate = DateTime.Now }
            };

            _habitLogRepositoryMock.Setup(repo => repo.GetByHabitIdAsync(habitId))
                .ReturnsAsync(habitLogs);

            // Act
            var streak = await _service.GetLongestStreakAsync(userId, habitId);

            // Assert
            Assert.Equal(5, streak);
        }

        [Fact]
        public void CalculateActivityIntensity_WithNoActivity_ReturnsZero()
        {
            // Arrange
            var activityCount = 0;
            var totalValue = 0m;
            var userStats = new ActivityStatisticsResponse
            {
                TotalActiveDays = 10,
                TotalActivities = 20,
                TotalValue = 100
            };

            // Act
            var intensity = _service.CalculateActivityIntensity(activityCount, totalValue, userStats);

            // Assert
            Assert.Equal(0, intensity);
        }

        [Fact]
        public void CalculateActivityIntensity_WithHighActivity_ReturnsHighIntensity()
        {
            // Arrange
            var activityCount = 4; // Above user's average
            var totalValue = 100m; // Above user's average
            var userStats = new ActivityStatisticsResponse
            {
                TotalActiveDays = 10,
                TotalActivities = 20, // Average: 2 activities per day
                TotalValue = 200 // Average: 20 value per day
            };

            // Act
            var intensity = _service.CalculateActivityIntensity(activityCount, totalValue, userStats);

            // Assert
            Assert.Equal(4, intensity); // Very high activity
        }

        [Fact]
        public void CalculateActivityIntensity_WithMediumActivity_ReturnsMediumIntensity()
        {
            // Arrange
            var activityCount = 2; // Equal to user's average
            var totalValue = 20m; // Equal to user's average
            var userStats = new ActivityStatisticsResponse
            {
                TotalActiveDays = 10,
                TotalActivities = 20, // Average: 2 activities per day
                TotalValue = 200 // Average: 20 value per day
            };

            // Act
            var intensity = _service.CalculateActivityIntensity(activityCount, totalValue, userStats);

            // Assert
            Assert.Equal(2, intensity); // Medium activity
        }
    }
}