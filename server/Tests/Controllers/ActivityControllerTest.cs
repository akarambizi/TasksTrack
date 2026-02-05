using Moq;
using Xunit;
using Microsoft.AspNetCore.Mvc;
using TasksTrack.Controllers;
using TasksTrack.Models;
using TasksTrack.Services;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Linq;

namespace TasksTrack.Tests.Controllers
{
    public class ActivityControllerTests
    {
        private readonly Mock<IActivityService> _activityServiceMock;
        private readonly Mock<ICurrentUserService> _currentUserServiceMock;
        private readonly ActivityController _controller;
        private readonly string _userId = "testuser";

        public ActivityControllerTests()
        {
            _activityServiceMock = new Mock<IActivityService>();
            _currentUserServiceMock = new Mock<ICurrentUserService>();
            _controller = new ActivityController(_activityServiceMock.Object, _currentUserServiceMock.Object);

            _currentUserServiceMock.Setup(service => service.GetUserId()).Returns(_userId);
        }

        [Fact]
        public async Task GetActivityGrid_WithValidDateRange_ReturnsOkResult()
        {
            // Arrange
            var startDate = "2024-01-01";
            var endDate = "2024-01-07";
            var expectedGrid = new List<ActivityGridResponse>
            {
                new ActivityGridResponse
                {
                    Date = DateOnly.Parse(startDate),
                    ActivityCount = 2,
                    TotalValue = 50,
                    IntensityLevel = 2,
                    HabitsSummary = new List<HabitActivitySummary>()
                }
            };

            _activityServiceMock.Setup(service => service.GetActivityGridAsync(_userId, DateOnly.Parse(startDate), DateOnly.Parse(endDate)))
                .ReturnsAsync(expectedGrid);

            // Act
            var result = await _controller.GetActivityGrid(startDate, endDate);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedGrid = Assert.IsAssignableFrom<IQueryable<ActivityGridResponse>>(okResult.Value);
            Assert.Single(returnedGrid);
        }

        [Fact]
        public async Task GetActivityGrid_WithInvalidStartDate_ReturnsBadRequest()
        {
            // Arrange
            var startDate = "invalid-date";
            var endDate = "2024-01-07";

            // Act
            var result = await _controller.GetActivityGrid(startDate, endDate);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var errorResponse = badRequestResult.Value;
            Assert.NotNull(errorResponse);
        }

        [Fact]
        public async Task GetActivityGrid_WithInvalidEndDate_ReturnsBadRequest()
        {
            // Arrange
            var startDate = "2024-01-01";
            var endDate = "invalid-date";

            // Act
            var result = await _controller.GetActivityGrid(startDate, endDate);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var errorResponse = badRequestResult.Value;
            Assert.NotNull(errorResponse);
        }

        [Fact]
        public async Task GetActivityGrid_WithStartDateAfterEndDate_ReturnsBadRequest()
        {
            // Arrange
            var startDate = "2024-01-07";
            var endDate = "2024-01-01";

            // Act
            var result = await _controller.GetActivityGrid(startDate, endDate);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var errorResponse = badRequestResult.Value;
            Assert.NotNull(errorResponse);
        }

        [Fact]
        public async Task GetActivityGrid_WithDateRangeExceeding2Years_ReturnsBadRequest()
        {
            // Arrange
            var startDate = "2020-01-01";
            var endDate = "2024-01-01"; // More than 2 years

            // Act
            var result = await _controller.GetActivityGrid(startDate, endDate);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var errorResponse = badRequestResult.Value;
            Assert.NotNull(errorResponse);
        }

        [Fact]
        public async Task GetActivitySummary_WithValidDateRange_ReturnsOkResult()
        {
            // Arrange
            var startDate = "2024-01-01";
            var endDate = "2024-01-07";
            var expectedSummary = new ActivitySummaryResponse
            {
                StartDate = DateOnly.Parse(startDate),
                EndDate = DateOnly.Parse(endDate),
                TotalDays = 7,
                ActiveDays = 3,
                TotalActivities = 5,
                TotalValue = 150,
                AverageValue = 30,
                LongestStreak = 3,
                CurrentStreak = 2,
                CategoryBreakdown = new List<CategorySummary>(),
                HabitBreakdown = new List<HabitSummary>()
            };

            _activityServiceMock.Setup(service => service.GetActivitySummaryAsync(_userId, DateOnly.Parse(startDate), DateOnly.Parse(endDate)))
                .ReturnsAsync(expectedSummary);

            // Act
            var result = await _controller.GetActivitySummary(startDate, endDate);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedSummary = Assert.IsType<ActivitySummaryResponse>(okResult.Value);
            Assert.Equal(7, returnedSummary.TotalDays);
            Assert.Equal(3, returnedSummary.ActiveDays);
            Assert.Equal(5, returnedSummary.TotalActivities);
        }

        [Fact]
        public async Task GetActivitySummary_WithInvalidDateFormat_ReturnsBadRequest()
        {
            // Arrange
            var startDate = "invalid-date";
            var endDate = "2024-01-07";

            // Act
            var result = await _controller.GetActivitySummary(startDate, endDate);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var errorResponse = badRequestResult.Value;
            Assert.NotNull(errorResponse);
        }

        [Fact]
        public async Task GetActivityStatistics_ReturnsOkResult()
        {
            // Arrange
            var expectedStats = new ActivityStatisticsResponse
            {
                TotalDaysTracked = 100,
                TotalActiveDays = 75,
                TotalActivities = 200,
                TotalHabits = 5,
                ActiveHabits = 4,
                TotalValue = 5000,
                AverageValue = 25,
                CompletionRate = 75.0,
                CurrentOverallStreak = 5,
                LongestOverallStreak = 15,
                MostActiveDayOfWeek = 1,
                MostActiveDayName = "Monday",
                BestPerformingHabit = new HabitPerformance
                {
                    HabitId = 1,
                    HabitName = "Exercise",
                    TotalValue = 1000,
                    ActivityCount = 50,
                    CompletionRate = 85.0
                },
                MonthlyStats = new List<MonthlyStatistics>(),
                WeeklyStats = new List<WeeklyStatistics>()
            };

            _activityServiceMock.Setup(service => service.GetActivityStatisticsAsync(_userId))
                .ReturnsAsync(expectedStats);

            // Act
            var result = await _controller.GetActivityStatistics();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedStats = Assert.IsType<ActivityStatisticsResponse>(okResult.Value);
            Assert.Equal(100, returnedStats.TotalDaysTracked);
            Assert.Equal(75, returnedStats.TotalActiveDays);
            Assert.Equal(5, returnedStats.CurrentOverallStreak);
        }

        [Fact]
        public async Task GetCurrentStreak_WithValidHabitId_ReturnsOkResult()
        {
            // Arrange
            var habitId = 1;
            var expectedStreak = 7;

            _activityServiceMock.Setup(service => service.GetCurrentStreakAsync(_userId, habitId))
                .ReturnsAsync(expectedStreak);

            // Act
            var result = await _controller.GetCurrentStreak(habitId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedStreak = Assert.IsType<int>(okResult.Value);
            Assert.Equal(7, returnedStreak);
        }

        [Fact]
        public async Task GetLongestStreak_WithValidHabitId_ReturnsOkResult()
        {
            // Arrange
            var habitId = 1;
            var expectedStreak = 15;

            _activityServiceMock.Setup(service => service.GetLongestStreakAsync(_userId, habitId))
                .ReturnsAsync(expectedStreak);

            // Act
            var result = await _controller.GetLongestStreak(habitId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedStreak = Assert.IsType<int>(okResult.Value);
            Assert.Equal(15, returnedStreak);
        }

        [Fact]
        public async Task GetCurrentOverallStreak_ReturnsOkResult()
        {
            // Arrange
            var expectedStreak = 10;

            _activityServiceMock.Setup(service => service.GetCurrentOverallStreakAsync(_userId))
                .ReturnsAsync(expectedStreak);

            // Act
            var result = await _controller.GetCurrentOverallStreak();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedStreak = Assert.IsType<int>(okResult.Value);
            Assert.Equal(10, returnedStreak);
        }

        [Fact]
        public async Task GetLongestOverallStreak_ReturnsOkResult()
        {
            // Arrange
            var expectedStreak = 25;

            _activityServiceMock.Setup(service => service.GetLongestOverallStreakAsync(_userId))
                .ReturnsAsync(expectedStreak);

            // Act
            var result = await _controller.GetLongestOverallStreak();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedStreak = Assert.IsType<int>(okResult.Value);
            Assert.Equal(25, returnedStreak);
        }

        [Fact]
        public async Task GetActivityGrid_WhenServiceThrowsException_ReturnsInternalServerError()
        {
            // Arrange
            var startDate = "2024-01-01";
            var endDate = "2024-01-07";

            _activityServiceMock.Setup(service => service.GetActivityGridAsync(_userId, It.IsAny<DateOnly>(), It.IsAny<DateOnly>()))
                .ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _controller.GetActivityGrid(startDate, endDate);

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, statusResult.StatusCode);
        }

        [Fact]
        public async Task GetActivitySummary_WhenServiceThrowsException_ReturnsInternalServerError()
        {
            // Arrange
            var startDate = "2024-01-01";
            var endDate = "2024-01-07";

            _activityServiceMock.Setup(service => service.GetActivitySummaryAsync(_userId, It.IsAny<DateOnly>(), It.IsAny<DateOnly>()))
                .ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _controller.GetActivitySummary(startDate, endDate);

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, statusResult.StatusCode);
        }

        [Fact]
        public async Task GetActivityStatistics_WhenServiceThrowsException_ReturnsInternalServerError()
        {
            // Arrange
            _activityServiceMock.Setup(service => service.GetActivityStatisticsAsync(_userId))
                .ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _controller.GetActivityStatistics();

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, statusResult.StatusCode);
        }
    }
}