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
    public class AnalyticsServiceTests
    {
        private readonly Mock<IHabitLogRepository> _habitLogRepositoryMock;
        private readonly Mock<IHabitRepository> _habitRepositoryMock;
        private readonly Mock<IFocusSessionRepository> _focusSessionRepositoryMock;
        private readonly Mock<IActivityService> _activityServiceMock;
        private readonly AnalyticsService _service;

        public AnalyticsServiceTests()
        {
            _habitLogRepositoryMock = new Mock<IHabitLogRepository>();
            _habitRepositoryMock = new Mock<IHabitRepository>();
            _focusSessionRepositoryMock = new Mock<IFocusSessionRepository>();
            _activityServiceMock = new Mock<IActivityService>();
            _service = new AnalyticsService(
                _habitLogRepositoryMock.Object,
                _habitRepositoryMock.Object,
                _focusSessionRepositoryMock.Object,
                _activityServiceMock.Object);
        }

        [Fact]
        public async Task GetWeeklyAnalyticsAsync_WithValidUser_ReturnsWeeklyData()
        {
            // Arrange
            var weekOffset = 0;

            var habits = CreateTestHabits();
            var habitLogs = CreateTestHabitLogs();
            var focusSessions = CreateTestFocusSessions().AsQueryable();

            _habitRepositoryMock.Setup(repo => repo.GetAllAsync())
                .ReturnsAsync(habits);

            _habitLogRepositoryMock.Setup(repo => repo.GetByDateRangeAsync(It.IsAny<DateOnly>(), It.IsAny<DateOnly>()))
                .ReturnsAsync(habitLogs);

            _focusSessionRepositoryMock.Setup(repo => repo.GetQueryable())
                .Returns(focusSessions);

            _activityServiceMock.Setup(service => service.GetCurrentStreakAsync(It.IsAny<int>()))
                .ReturnsAsync(5);

            _activityServiceMock.Setup(service => service.GetLongestStreakAsync(It.IsAny<int>()))
                .ReturnsAsync(10);

            // Act
            var result = await _service.GetWeeklyAnalyticsAsync(weekOffset);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Weekly", result.Period);
            Assert.Equal(2, result.TotalHabitsTracked);
            Assert.True(result.TotalSessions >= 0);
            Assert.True(result.TotalMinutes >= 0);
            Assert.NotEmpty(result.HabitBreakdown);
            Assert.NotEmpty(result.CategoryBreakdown);
            Assert.NotEmpty(result.DailyProgress);
            Assert.NotNull(result.GoalProgress);
        }

        [Fact]
        public async Task GetCustomAnalyticsAsync_WithValidRequest_ReturnsCustomData()
        {
            // Arrange
            var request = new CustomAnalyticsRequest
            {
                StartDate = "2026-01-01",
                EndDate = "2026-01-31",
                HabitIds = new List<int> { 1 },
                Categories = new List<string> { "Health" }
            };

            var habits = CreateTestHabits().Where(h => h.Id == 1).ToList();
            var habitLogs = CreateTestHabitLogs().Where(l => l.HabitId == 1).ToList();
            var focusSessions = CreateTestFocusSessions().Where(s => s.HabitId == 1).AsQueryable();

            _habitRepositoryMock.Setup(repo => repo.GetAllAsync())
                .ReturnsAsync(habits);

            _habitLogRepositoryMock.Setup(repo => repo.GetByDateRangeAsync(It.IsAny<DateOnly>(), It.IsAny<DateOnly>()))
                .ReturnsAsync(habitLogs);

            _focusSessionRepositoryMock.Setup(repo => repo.GetQueryable())
                .Returns(focusSessions);

            _activityServiceMock.Setup(service => service.GetCurrentStreakAsync(It.IsAny<int>()))
                .ReturnsAsync(5);

            _activityServiceMock.Setup(service => service.GetLongestStreakAsync(It.IsAny<int>()))
                .ReturnsAsync(9);

            // Act
            var result = await _service.GetCustomAnalyticsAsync(request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Custom", result.Period);
            Assert.Equal(1, result.TotalHabitsTracked); // Filtered to one habit
            Assert.Single(result.HabitBreakdown); // Should have only one habit
            Assert.Single(result.CategoryBreakdown); // Should have only one category
        }

        [Fact]
        public async Task GetCustomAnalyticsAsync_WithInvalidDateFormat_ThrowsArgumentException()
        {
            // Arrange
            var request = new CustomAnalyticsRequest
            {
                StartDate = "invalid-date",
                EndDate = "2026-01-31"
            };

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => 
                _service.GetCustomAnalyticsAsync(request));
        }

        [Fact]
        public async Task GetCustomAnalyticsAsync_WithStartDateAfterEndDate_ThrowsArgumentException()
        {
            // Arrange
            var request = new CustomAnalyticsRequest
            {
                StartDate = "2026-02-01",
                EndDate = "2026-01-31"
            };

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => 
                _service.GetCustomAnalyticsAsync(request));
        }

        [Fact]
        public async Task ExportAnalyticsAsync_WithJsonFormat_ReturnsJsonData()
        {
            // Arrange
            var request = new ExportAnalyticsRequest
            {
                StartDate = "2026-01-01",
                EndDate = "2026-01-31",
                Format = "json",
                IncludeDailyBreakdown = true,
                IncludeHabitBreakdown = true,
                IncludeCategoryBreakdown = true
            };

            var habits = CreateTestHabits();
            var habitLogs = CreateTestHabitLogs();
            var focusSessions = CreateTestFocusSessions().AsQueryable();

            _habitRepositoryMock.Setup(repo => repo.GetAllAsync())
                .ReturnsAsync(habits);

            _habitLogRepositoryMock.Setup(repo => repo.GetByDateRangeAsync(It.IsAny<DateOnly>(), It.IsAny<DateOnly>()))
                .ReturnsAsync(habitLogs);

            _focusSessionRepositoryMock.Setup(repo => repo.GetQueryable())
                .Returns(focusSessions);

            _activityServiceMock.Setup(service => service.GetCurrentStreakAsync(It.IsAny<int>()))
                .ReturnsAsync(2);

            _activityServiceMock.Setup(service => service.GetLongestStreakAsync(It.IsAny<int>()))
                .ReturnsAsync(5);

            // Act
            var result = await _service.ExportAnalyticsAsync(request);

            // Assert
            Assert.Equal("application/json", result.ContentType);
            Assert.Contains(".json", result.FileName);
            Assert.True(result.Data.Length > 0);
        }

        [Fact]
        public async Task ExportAnalyticsAsync_WithCsvFormat_ReturnsCsvData()
        {
            // Arrange
            var request = new ExportAnalyticsRequest
            {
                StartDate = "2026-01-01",
                EndDate = "2026-01-07",
                Format = "csv",
                IncludeDailyBreakdown = true,
                IncludeHabitBreakdown = true
            };

            var habits = CreateTestHabits();
            var habitLogs = CreateTestHabitLogs();
            var focusSessions = CreateTestFocusSessions().AsQueryable();

            _habitRepositoryMock.Setup(repo => repo.GetAllAsync())
                .ReturnsAsync(habits);

            _habitLogRepositoryMock.Setup(repo => repo.GetByDateRangeAsync(It.IsAny<DateOnly>(), It.IsAny<DateOnly>()))
                .ReturnsAsync(habitLogs);

            _focusSessionRepositoryMock.Setup(repo => repo.GetQueryable())
                .Returns(focusSessions);

            _activityServiceMock.Setup(service => service.GetCurrentStreakAsync(It.IsAny<int>()))
                .ReturnsAsync(1);

            _activityServiceMock.Setup(service => service.GetLongestStreakAsync(It.IsAny<int>()))
                .ReturnsAsync(3);

            // Act
            var result = await _service.ExportAnalyticsAsync(request);

            // Assert
            Assert.Equal("text/csv", result.ContentType);
            Assert.Contains(".csv", result.FileName);
            Assert.True(result.Data.Length > 0);
        }

        [Fact]
        public async Task ExportAnalyticsAsync_WithUnsupportedFormat_ThrowsArgumentException()
        {
            // Arrange
            var request = new ExportAnalyticsRequest
            {
                StartDate = "2026-01-01",
                EndDate = "2026-01-31",
                Format = "pdf" // Unsupported format
            };

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => 
                _service.ExportAnalyticsAsync(request));
        }

        // Helper methods for creating test data
        private List<Habit> CreateTestHabits()
        {
            return new List<Habit>
            {
                new Habit
                {
                    Id = 1,
                    Name = "Exercise",
                    Category = "Health",
                    CreatedBy = "testuser",
                    MetricType = "Time",
                    Unit = "minutes",
                    Color = "#FF5733",
                    Icon = "dumbbell",
                    IsActive = true
                },
                new Habit
                {
                    Id = 2,
                    Name = "Reading",
                    Category = "Education",
                    CreatedBy = "testuser",
                    MetricType = "Time",
                    Unit = "minutes",
                    Color = "#33AFFF",
                    Icon = "book",
                    IsActive = true
                }
            };
        }

        private List<HabitLog> CreateTestHabitLogs()
        {
            return new List<HabitLog>
            {
                new HabitLog
                {
                    Id = 1,
                    HabitId = 1,
                    Date = DateOnly.FromDateTime(DateTime.Today.AddDays(-1)),
                    Value = 30,
                    Notes = "Good workout",
                    CreatedBy = "testuser"
                },
                new HabitLog
                {
                    Id = 2,
                    HabitId = 2,
                    Date = DateOnly.FromDateTime(DateTime.Today.AddDays(-1)),
                    Value = 45,
                    Notes = "Read novel",
                    CreatedBy = "testuser"
                },
                new HabitLog
                {
                    Id = 3,
                    HabitId = 1,
                    Date = DateOnly.FromDateTime(DateTime.Today.AddDays(-2)),
                    Value = 25,
                    Notes = "Short session",
                    CreatedBy = "testuser"
                }
            };
        }

        private List<FocusSession> CreateTestFocusSessions()
        {
            return new List<FocusSession>
            {
                new FocusSession
                {
                    Id = 1,
                    CreatedBy = "testuser",
                    HabitId = 1,
                    StartTime = DateTime.Today.AddDays(-1).AddHours(9),
                    PlannedDurationMinutes = 30,
                    ActualDurationSeconds = 1800,
                    Status = "completed"
                },
                new FocusSession
                {
                    Id = 2,
                    CreatedBy = "testuser",
                    HabitId = 2,
                    StartTime = DateTime.Today.AddDays(-2).AddHours(14),
                    PlannedDurationMinutes = 45,
                    ActualDurationSeconds = 2400, // 40 minutes
                    Status = "completed"
                }
            };
        }
    }
}