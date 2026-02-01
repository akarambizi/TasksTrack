using Xunit;
using Moq;
using TasksTrack.Services;
using TasksTrack.Repositories;
using TasksTrack.Models;
using System.Threading.Tasks;
using System;

namespace TasksTrack.Tests.Services
{
    public class FocusSessionServiceTest
    {
        private readonly Mock<IFocusSessionRepository> _mockFocusSessionRepository;
        private readonly Mock<IHabitRepository> _mockHabitRepository;
        private readonly FocusSessionService _service;
        private readonly string _testUserId = "test-user-123";

        public FocusSessionServiceTest()
        {
            _mockFocusSessionRepository = new Mock<IFocusSessionRepository>();
            _mockHabitRepository = new Mock<IHabitRepository>();
            _service = new FocusSessionService(_mockFocusSessionRepository.Object, _mockHabitRepository.Object);
        }

        [Fact]
        public async Task StartSessionAsync_ValidRequest_ReturnsSuccessResponse()
        {
            // Arrange
            var request = new FocusSessionStartRequest
            {
                HabitId = 1,
                PlannedDurationMinutes = 25
            };

            var habit = new Habit
            {
                Id = 1,
                Name = "Reading",
                MetricType = "minutes",
                CreatedBy = _testUserId
            };

            var focusSession = new FocusSession
            {
                Id = 1,
                HabitId = 1,
                CreatedBy = _testUserId,
                StartTime = DateTimeOffset.UtcNow,
                Status = "active",
                PlannedDurationMinutes = 25,
                CreatedDate = DateTimeOffset.UtcNow,
                Habit = habit
            };

            _mockFocusSessionRepository.Setup(r => r.GetActiveOrPausedSessionByUserAsync(_testUserId))
                                     .ReturnsAsync((FocusSession?)null);
            _mockHabitRepository.Setup(r => r.GetByIdAsync(1))
                               .ReturnsAsync(habit);
            _mockFocusSessionRepository.Setup(r => r.AddAsync(It.IsAny<FocusSession>()))
                                     .Callback<FocusSession>(fs => fs.Id = 1)
                                     .Returns(Task.CompletedTask);

            // Act
            var result = await _service.StartSessionAsync(request, _testUserId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.HabitId);
            Assert.Equal("Reading", result.Habit!.Name);
            Assert.Equal("active", result.Status);
            Assert.Equal(25, result.PlannedDurationMinutes);
            Assert.Equal(_testUserId, result.CreatedBy);
        }

        [Fact]
        public async Task StartSessionAsync_ActiveSessionExists_ThrowsInvalidOperationException()
        {
            // Arrange
            var request = new FocusSessionStartRequest
            {
                HabitId = 1,
                PlannedDurationMinutes = 25
            };

            var existingSession = new FocusSession
            {
                Id = 1,
                HabitId = 2,
                CreatedBy = _testUserId,
                Status = "active"
            };

            _mockFocusSessionRepository.Setup(r => r.GetActiveOrPausedSessionByUserAsync(_testUserId))
                                     .ReturnsAsync(existingSession);

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() =>
                _service.StartSessionAsync(request, _testUserId));
        }

        [Fact]
        public async Task StartSessionAsync_HabitNotFound_ThrowsArgumentException()
        {
            // Arrange
            var request = new FocusSessionStartRequest
            {
                HabitId = 999,
                PlannedDurationMinutes = 25
            };

            _mockFocusSessionRepository.Setup(r => r.GetActiveOrPausedSessionByUserAsync(_testUserId))
                                     .ReturnsAsync((FocusSession?)null);
            _mockHabitRepository.Setup(r => r.GetByIdAsync(999))
                               .ReturnsAsync((Habit?)null);

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() =>
                _service.StartSessionAsync(request, _testUserId));
        }

        [Fact]
        public async Task StartSessionAsync_HabitBelongsToOtherUser_ThrowsUnauthorizedAccessException()
        {
            // Arrange
            var request = new FocusSessionStartRequest
            {
                HabitId = 1,
                PlannedDurationMinutes = 25
            };

            var habit = new Habit
            {
                Id = 1,
                Name = "Reading",
                MetricType = "minutes",
                CreatedBy = "other-user"
            };

            _mockFocusSessionRepository.Setup(r => r.GetActiveOrPausedSessionByUserAsync(_testUserId))
                                     .ReturnsAsync((FocusSession?)null);
            _mockHabitRepository.Setup(r => r.GetByIdAsync(1))
                               .ReturnsAsync(habit);

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
                _service.StartSessionAsync(request, _testUserId));
        }

        [Fact]
        public async Task PauseSessionAsync_ActiveSession_ReturnsSuccessResponse()
        {
            // Arrange
            var activeSession = new FocusSession
            {
                Id = 1,
                HabitId = 1,
                CreatedBy = _testUserId,
                StartTime = DateTimeOffset.UtcNow.AddMinutes(-10),
                Status = "active",
                PlannedDurationMinutes = 25,
                Habit = new Habit { Name = "Reading", MetricType = "minutes", CreatedBy = "test" }
            };

            _mockFocusSessionRepository.Setup(r => r.GetActiveOrPausedSessionByUserAsync(_testUserId))
                                     .ReturnsAsync(activeSession);
            _mockFocusSessionRepository.Setup(r => r.UpdateAsync(It.IsAny<FocusSession>()))
                                     .ReturnsAsync(true);

            // Act
            var result = await _service.PauseSessionAsync(_testUserId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("paused", result.Status);
            Assert.NotNull(result.PauseTime);
        }

        [Fact]
        public async Task PauseSessionAsync_NoActiveSession_ThrowsInvalidOperationException()
        {
            // Arrange
            _mockFocusSessionRepository.Setup(r => r.GetActiveOrPausedSessionByUserAsync(_testUserId))
                                     .ReturnsAsync((FocusSession?)null);

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() =>
                _service.PauseSessionAsync(_testUserId));
        }

        [Fact]
        public async Task ResumeSessionAsync_PausedSession_ReturnsSuccessResponse()
        {
            // Arrange
            var pausedSession = new FocusSession
            {
                Id = 1,
                HabitId = 1,
                CreatedBy = _testUserId,
                StartTime = DateTimeOffset.UtcNow.AddMinutes(-15),
                PauseTime = DateTimeOffset.UtcNow.AddMinutes(-5),
                Status = "paused",
                PlannedDurationMinutes = 25,
                PausedDurationSeconds = 300, // 5 minutes already paused
                Habit = new Habit { Name = "Reading", MetricType = "minutes", CreatedBy = "test" }
            };

            _mockFocusSessionRepository.Setup(r => r.GetActiveOrPausedSessionByUserAsync(_testUserId))
                                     .ReturnsAsync(pausedSession);
            _mockFocusSessionRepository.Setup(r => r.UpdateAsync(It.IsAny<FocusSession>()))
                                     .ReturnsAsync(true);

            // Act
            var result = await _service.ResumeSessionAsync(_testUserId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("active", result.Status);
            Assert.NotNull(result.ResumeTime);
            Assert.True(result.PausedDurationSeconds >= 300); // Should have accumulated more pause time
        }

        [Fact]
        public async Task CompleteSessionAsync_ActiveSession_ReturnsSuccessResponse()
        {
            // Arrange
            var request = new FocusSessionCompleteRequest
            {
                Notes = "Great focus session!"
            };

            var activeSession = new FocusSession
            {
                Id = 1,
                HabitId = 1,
                CreatedBy = _testUserId,
                StartTime = DateTimeOffset.UtcNow.AddMinutes(-25),
                Status = "active",
                PlannedDurationMinutes = 25,
                Habit = new Habit { Name = "Reading", MetricType = "minutes", CreatedBy = "test" }
            };

            _mockFocusSessionRepository.Setup(r => r.GetActiveOrPausedSessionByUserAsync(_testUserId))
                                     .ReturnsAsync(activeSession);
            _mockFocusSessionRepository.Setup(r => r.UpdateAsync(It.IsAny<FocusSession>()))
                                     .ReturnsAsync(true);

            // Act
            var result = await _service.CompleteSessionAsync(request, _testUserId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("completed", result.Status);
            Assert.Equal("Great focus session!", result.Notes);
            Assert.NotNull(result.EndTime);
            Assert.True(result.ActualDurationSeconds > 0);
        }

        [Fact]
        public void GetSessions_ReturnsUserSessions()
        {
            // Arrange
            var sessions = new List<FocusSession>
            {
                new FocusSession
                {
                    Id = 1,
                    HabitId = 1,
                    CreatedBy = _testUserId,
                    StartTime = DateTimeOffset.UtcNow.AddDays(-1),
                    EndTime = DateTimeOffset.UtcNow.AddDays(-1).AddMinutes(25),
                    Status = "completed",
                    PlannedDurationMinutes = 25,
                    ActualDurationSeconds = 1500,
                    Habit = new Habit { Name = "Reading", MetricType = "minutes", CreatedBy = "test" }
                },
                new FocusSession
                {
                    Id = 2,
                    HabitId = 2,
                    CreatedBy = _testUserId,
                    StartTime = DateTimeOffset.UtcNow.AddHours(-1),
                    Status = "active",
                    PlannedDurationMinutes = 30,
                    Habit = new Habit { Name = "Exercise", MetricType = "minutes", CreatedBy = "test" }
                }
            };

            _mockFocusSessionRepository.Setup(r => r.GetByUser(_testUserId))
                                     .Returns(sessions.AsQueryable());

            // Act
            var result = _service.GetSessions(_testUserId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetActiveSessionAsync_HasActiveSession_ReturnsSession()
        {
            // Arrange
            var activeSession = new FocusSession
            {
                Id = 1,
                HabitId = 1,
                CreatedBy = _testUserId,
                StartTime = DateTimeOffset.UtcNow.AddMinutes(-10),
                Status = "active",
                PlannedDurationMinutes = 25,
                Habit = new Habit { Name = "Reading", MetricType = "minutes", CreatedBy = "test" }
            };

            _mockFocusSessionRepository.Setup(r => r.GetActiveOrPausedSessionByUserAsync(_testUserId))
                                     .ReturnsAsync(activeSession);

            // Act
            var result = await _service.GetActiveSessionAsync(_testUserId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("active", result.Status);
            Assert.Equal("Reading", result.Habit!.Name);
        }

        [Fact]
        public async Task GetActiveSessionAsync_NoActiveSession_ReturnsNull()
        {
            // Arrange
            _mockFocusSessionRepository.Setup(r => r.GetActiveOrPausedSessionByUserAsync(_testUserId))
                                     .ReturnsAsync((FocusSession?)null);

            // Act
            var result = await _service.GetActiveSessionAsync(_testUserId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetAnalyticsAsync_ValidDateRange_ReturnsAnalytics()
        {
            // Arrange
            var startDate = DateTimeOffset.UtcNow.AddDays(-7);
            var endDate = DateTimeOffset.UtcNow;
            var expectedAnalytics = new FocusSessionAnalytics
            {
                TotalSessions = 5,
                CompletedSessions = 4,
                TotalMinutes = 125,
                AverageSessionMinutes = 25.0,
                CompletionRate = 0.8
            };

            _mockFocusSessionRepository.Setup(r => r.GetAnalyticsAsync(_testUserId))
                                     .ReturnsAsync(expectedAnalytics);

            // Act
            var result = await _service.GetAnalyticsAsync(_testUserId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(5, result.TotalSessions);
            Assert.Equal(4, result.CompletedSessions);
            Assert.Equal(125, result.TotalMinutes);
            Assert.Equal(25, result.AverageSessionMinutes);
            Assert.Equal(0.8, result.CompletionRate);
        }
    }
}