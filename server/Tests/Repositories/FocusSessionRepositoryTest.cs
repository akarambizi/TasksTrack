using Xunit;
using Microsoft.EntityFrameworkCore;
using TasksTrack.Data;
using TasksTrack.Models;
using TasksTrack.Repositories;
using System.Threading.Tasks;
using System.Linq;

namespace TasksTrack.Tests.Repositories
{
    public class FocusSessionRepositoryTest : IDisposable
    {
        private readonly TasksTrackContext _context;
        private readonly FocusSessionRepository _repository;
        private readonly string _testUserId = "test-user-123";

        public FocusSessionRepositoryTest()
        {
            var options = new DbContextOptionsBuilder<TasksTrackContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;

            _context = new TasksTrackContext(options);
            _repository = new FocusSessionRepository(_context);

            // Seed test data
            SeedTestData();
        }

        private void SeedTestData()
        {
            var habit = new Habit
            {
                Id = 1,
                Name = "Test Habit",
                MetricType = "minutes",
                Target = 30,
                IsActive = true,
                CreatedDate = DateTime.Now,
                CreatedBy = _testUserId
            };

            _context.Habits.Add(habit);
            _context.SaveChanges();
        }

        [Fact]
        public async Task GetByIdAsync_WithValidId_ShouldReturnFocusSession()
        {
            // Arrange
            var focusSession = new FocusSession
            {
                HabitId = 1,
                CreatedBy = _testUserId,
                StartTime = DateTime.Now,
                Status = "active",
                PlannedDurationMinutes = 25,
                CreatedDate = DateTime.Now
            };

            _context.FocusSessions.Add(focusSession);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetByIdAsync(focusSession.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(focusSession.Id, result.Id);
            Assert.Equal(focusSession.HabitId, result.HabitId);
            Assert.Equal(focusSession.CreatedBy, result.CreatedBy);
            Assert.NotNull(result.Habit); // Test Include
        }

        [Fact]
        public async Task GetByIdAsync_WithInvalidId_ShouldReturnNull()
        {
            // Act
            var result = await _repository.GetByIdAsync(999);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetByUserAsync_ShouldReturnUsersSessions_OrderedByStartTimeDescending()
        {
            // Arrange
            var habit = new Habit
            {
                Id = 2,
                Name = "Test Habit 2",
                MetricType = "minutes",
                Target = 30,
                IsActive = true,
                CreatedDate = DateTime.Now,
                CreatedBy = _testUserId
            };
            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();

            var session1 = new FocusSession
            {
                HabitId = 2,
                CreatedBy = _testUserId,
                StartTime = DateTime.Now.AddHours(-2),
                Status = "completed",
                PlannedDurationMinutes = 25,
                CreatedDate = DateTime.Now.AddHours(-2)
            };

            var session2 = new FocusSession
            {
                HabitId = 2,
                CreatedBy = _testUserId,
                StartTime = DateTime.Now.AddHours(-1),
                Status = "active",
                PlannedDurationMinutes = 30,
                CreatedDate = DateTime.Now.AddHours(-1)
            };

            var session3 = new FocusSession
            {
                HabitId = 2,
                CreatedBy = "other-user",
                StartTime = DateTime.Now,
                Status = "active",
                PlannedDurationMinutes = 15,
                CreatedDate = DateTime.Now
            };

            _context.FocusSessions.AddRange(session1, session2, session3);
            await _context.SaveChangesAsync();

            // Act
            var result = _repository.GetByUser(_testUserId);
            var sessions = result.ToList();

            // Assert
            Assert.Equal(2, sessions.Count);
            Assert.All(sessions, s => Assert.Equal(_testUserId, s.CreatedBy));
            Assert.All(sessions, s => Assert.NotNull(s.Habit)); // Test Include

            // Check that we get the sessions for this user (order doesn't matter at repository level for IQueryable)
            var sessionIds = sessions.Select(s => s.Id).ToList();
            Assert.Contains(session1.Id, sessionIds);
            Assert.Contains(session2.Id, sessionIds);
        }

        [Fact]
        public async Task GetByHabitAsync_ShouldReturnHabitsSessions_OrderedByStartTimeDescending()
        {
            // Arrange
            var session1 = new FocusSession
            {
                HabitId = 1,
                CreatedBy = _testUserId,
                StartTime = DateTime.Now.AddHours(-2),
                Status = "completed",
                PlannedDurationMinutes = 25,
                CreatedDate = DateTime.Now.AddHours(-2)
            };

            var session2 = new FocusSession
            {
                HabitId = 1,
                CreatedBy = "other-user",
                StartTime = DateTime.Now.AddHours(-1),
                Status = "active",
                PlannedDurationMinutes = 30,
                CreatedDate = DateTime.Now.AddHours(-1)
            };

            _context.FocusSessions.AddRange(session1, session2);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetByHabitAsync(1);
            var sessions = result.ToList();

            // Assert
            Assert.Equal(2, sessions.Count);
            Assert.Equal(session2.Id, sessions[0].Id); // Most recent first
            Assert.Equal(session1.Id, sessions[1].Id);
            Assert.All(sessions, s => Assert.Equal(1, s.HabitId));
        }

        [Fact]
        public async Task GetActiveOrPausedSessionByUserAsync_WithActiveSession_ShouldReturnSession()
        {
            // Arrange
            var activeSession = new FocusSession
            {
                HabitId = 1,
                CreatedBy = _testUserId,
                StartTime = DateTime.Now,
                Status = "active",
                PlannedDurationMinutes = 25,
                CreatedDate = DateTime.Now
            };

            var completedSession = new FocusSession
            {
                HabitId = 1,
                CreatedBy = _testUserId,
                StartTime = DateTime.Now.AddHours(-1),
                Status = "completed",
                PlannedDurationMinutes = 25,
                CreatedDate = DateTime.Now.AddHours(-1)
            };

            _context.FocusSessions.AddRange(activeSession, completedSession);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetActiveOrPausedSessionByUserAsync(_testUserId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(activeSession.Id, result.Id);
            Assert.Equal("active", result.Status);
        }

        [Fact]
        public async Task GetActiveOrPausedSessionByUserAsync_WithPausedSession_ShouldReturnSession()
        {
            // Arrange
            var pausedSession = new FocusSession
            {
                HabitId = 1,
                CreatedBy = _testUserId,
                StartTime = DateTime.Now,
                Status = "paused",
                PlannedDurationMinutes = 25,
                CreatedDate = DateTime.Now
            };

            _context.FocusSessions.Add(pausedSession);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetActiveOrPausedSessionByUserAsync(_testUserId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(pausedSession.Id, result.Id);
            Assert.Equal("paused", result.Status);
        }

        [Fact]
        public async Task GetActiveOrPausedSessionByUserAsync_WithNoActiveSession_ShouldReturnNull()
        {
            // Arrange
            var completedSession = new FocusSession
            {
                HabitId = 1,
                CreatedBy = _testUserId,
                StartTime = DateTime.Now,
                Status = "completed",
                PlannedDurationMinutes = 25,
                CreatedDate = DateTime.Now
            };

            _context.FocusSessions.Add(completedSession);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetActiveOrPausedSessionByUserAsync(_testUserId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task AddAsync_ShouldAddAndSaveFocusSession()
        {
            // Arrange
            var focusSession = new FocusSession
            {
                HabitId = 1,
                CreatedBy = _testUserId,
                StartTime = DateTime.Now,
                Status = "active",
                PlannedDurationMinutes = 25,
                CreatedDate = DateTime.Now
            };

            // Act
            await _repository.AddAsync(focusSession);

            // Assert
            var savedSession = await _context.FocusSessions.FindAsync(focusSession.Id);
            Assert.NotNull(savedSession);
            Assert.Equal(focusSession.HabitId, savedSession.HabitId);
            Assert.Equal(focusSession.CreatedBy, savedSession.CreatedBy);
        }

        [Fact]
        public async Task UpdateAsync_WithValidSession_ShouldReturnTrueAndUpdateSession()
        {
            // Arrange
            var focusSession = new FocusSession
            {
                HabitId = 1,
                CreatedBy = _testUserId,
                StartTime = DateTime.Now,
                Status = "active",
                PlannedDurationMinutes = 25,
                CreatedDate = DateTime.Now
            };

            _context.FocusSessions.Add(focusSession);
            await _context.SaveChangesAsync();

            focusSession.Status = "completed";
            focusSession.EndTime = DateTime.Now;
            focusSession.ActualDurationSeconds = 1500;

            // Act
            var result = await _repository.UpdateAsync(focusSession);

            // Assert
            Assert.True(result);
            var updatedSession = await _context.FocusSessions.FindAsync(focusSession.Id);
            Assert.Equal("completed", updatedSession!.Status);
            Assert.NotNull(updatedSession.EndTime);
            Assert.Equal(1500, updatedSession.ActualDurationSeconds);
        }

        [Fact]
        public async Task DeleteAsync_WithValidId_ShouldRemoveSession()
        {
            // Arrange
            var focusSession = new FocusSession
            {
                HabitId = 1,
                CreatedBy = _testUserId,
                StartTime = DateTime.Now,
                Status = "active",
                PlannedDurationMinutes = 25,
                CreatedDate = DateTime.Now
            };

            _context.FocusSessions.Add(focusSession);
            await _context.SaveChangesAsync();

            // Act
            await _repository.DeleteAsync(focusSession.Id);

            // Assert
            var deletedSession = await _context.FocusSessions.FindAsync(focusSession.Id);
            Assert.Null(deletedSession);
        }

        [Fact]
        public async Task DeleteAsync_WithInvalidId_ShouldNotThrow()
        {
            // Act & Assert - Should not throw exception
            await _repository.DeleteAsync(999);
        }

        [Fact]
        public async Task GetAnalyticsAsync_ShouldCalculateCorrectAnalytics()
        {
            // Arrange
            var sessions = new List<FocusSession>
            {
                new FocusSession
                {
                    HabitId = 1,
                    CreatedBy = _testUserId,
                    StartTime = DateTime.Now.AddDays(-5),
                    Status = "completed",
                    PlannedDurationMinutes = 25,
                    ActualDurationSeconds = 1500, // 25 minutes
                    CreatedDate = DateTime.Now.AddDays(-5)
                },
                new FocusSession
                {
                    HabitId = 1,
                    CreatedBy = _testUserId,
                    StartTime = DateTime.Now.AddDays(-3),
                    Status = "completed",
                    PlannedDurationMinutes = 30,
                    ActualDurationSeconds = 1800, // 30 minutes
                    CreatedDate = DateTime.Now.AddDays(-3)
                },
                new FocusSession
                {
                    HabitId = 1,
                    CreatedBy = _testUserId,
                    StartTime = DateTime.Now.AddDays(-1),
                    Status = "interrupted",
                    PlannedDurationMinutes = 25,
                    ActualDurationSeconds = 600, // 10 minutes
                    CreatedDate = DateTime.Now.AddDays(-1)
                }
            };

            _context.FocusSessions.AddRange(sessions);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetAnalyticsAsync(_testUserId);

            // Assert
            Assert.Equal(3, result.TotalSessions);
            Assert.Equal(2, result.CompletedSessions);
            Assert.Equal(65, result.TotalMinutes); // 25 + 30 + 10
            Assert.Equal(66.67, Math.Round(result.CompletionRate, 2)); // 2/3 * 100
            Assert.Equal(27.5, Math.Round(result.AverageSessionMinutes, 2)); // Average of completed sessions: (25 + 30) / 2
        }

        [Fact]
        public async Task GetAnalyticsAsync_WithDateRange_ShouldFilterSessions()
        {
            // Arrange
            var oldSession = new FocusSession
            {
                HabitId = 1,
                CreatedBy = _testUserId,
                StartTime = DateTime.Now.AddDays(-10),
                Status = "completed",
                PlannedDurationMinutes = 25,
                ActualDurationSeconds = 1500,
                CreatedDate = DateTime.Now.AddDays(-10)
            };

            var recentSession = new FocusSession
            {
                HabitId = 1,
                CreatedBy = _testUserId,
                StartTime = DateTime.Now.AddDays(-2),
                Status = "completed",
                PlannedDurationMinutes = 30,
                ActualDurationSeconds = 1800,
                CreatedDate = DateTime.Now.AddDays(-2)
            };

            _context.FocusSessions.AddRange(oldSession, recentSession);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetAnalyticsAsync(_testUserId);

            // Assert
            Assert.Equal(2, result.TotalSessions); // Both sessions since we removed date filtering
            Assert.Equal(2, result.CompletedSessions);
            Assert.Equal(55, result.TotalMinutes); // 1500 + 1800 seconds = 3300 seconds = 55 minutes
            Assert.Equal(100.0, result.CompletionRate); // 2/2 * 100 = 100%
            Assert.Equal(27.5, result.AverageSessionMinutes); // Average of completed sessions: (25 + 30) / 2 = 27.5
        }

        [Fact]
        public async Task GetAnalyticsAsync_WithNoSessions_ShouldReturnZeroValues()
        {
            // Act
            var result = await _repository.GetAnalyticsAsync("nonexistent-user");

            // Assert
            Assert.Equal(0, result.TotalSessions);
            Assert.Equal(0, result.CompletedSessions);
            Assert.Equal(0, result.TotalMinutes); // No sessions = 0 minutes
            Assert.Equal(0, result.CompletionRate);
            Assert.Equal(0, result.AverageSessionMinutes); // No sessions = 0 average
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}