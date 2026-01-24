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
    public class HabitLogServiceTests
    {
        private readonly Mock<IHabitLogRepository> _habitLogRepositoryMock;
        private readonly Mock<IHabitRepository> _habitRepositoryMock;
        private readonly HabitLogService _service;

        public HabitLogServiceTests()
        {
            _habitLogRepositoryMock = new Mock<IHabitLogRepository>();
            _habitRepositoryMock = new Mock<IHabitRepository>();
            _service = new HabitLogService(_habitLogRepositoryMock.Object, _habitRepositoryMock.Object);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllHabitLogs()
        {
            // Arrange
            var expectedLogs = new List<HabitLog>
            {
                new HabitLog
                {
                    Id = 1,
                    HabitId = 1,
                    Value = 30.5m,
                    Date = DateOnly.FromDateTime(DateTime.Today),
                    Notes = "Good session",
                    CreatedBy = "testuser",
                    CreatedDate = DateTime.Now
                },
                new HabitLog
                {
                    Id = 2,
                    HabitId = 2,
                    Value = 15.0m,
                    Date = DateOnly.FromDateTime(DateTime.Today.AddDays(-1)),
                    Notes = "Short session",
                    CreatedBy = "testuser",
                    CreatedDate = DateTime.Now
                }
            };

            _habitLogRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(expectedLogs);

            // Act
            var logs = await _service.GetAllAsync();

            // Assert
            Assert.Equal(2, logs.Count());
            Assert.Equal(expectedLogs.First().Id, logs.First().Id);
            Assert.Equal(expectedLogs.First().Value, logs.First().Value);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnHabitLog()
        {
            // Arrange
            var expectedLog = new HabitLog
            {
                Id = 1,
                HabitId = 1,
                Value = 45.0m,
                Date = DateOnly.FromDateTime(DateTime.Today),
                Notes = "Great workout session",
                CreatedBy = "testuser",
                CreatedDate = DateTime.Now
            };

            _habitLogRepositoryMock.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(expectedLog);

            // Act
            var log = await _service.GetByIdAsync(1);

            // Assert
            Assert.NotNull(log);
            Assert.Equal(expectedLog.Id, log.Id);
            Assert.Equal(expectedLog.HabitId, log.HabitId);
            Assert.Equal(expectedLog.Value, log.Value);
            Assert.Equal(expectedLog.Notes, log.Notes);
        }

        [Fact]
        public async Task AddAsync_ShouldValidateHabitExists_BeforeAdding()
        {
            // Arrange
            var habit = new Habit 
            { 
                Id = 1, 
                Name = "Test Habit", 
                IsActive = true, 
                MetricType = "minutes",
                CreatedBy = "testuser",
                CreatedDate = DateTime.Now
            };
            var habitLog = new HabitLog
            {
                HabitId = 1,
                Value = 30.0m,
                Date = DateOnly.FromDateTime(DateTime.Today),
                Notes = "Test log",
                CreatedBy = "testuser",
                CreatedDate = DateTime.Now
            };

            _habitRepositoryMock.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(habit);
            _habitLogRepositoryMock.Setup(repo => repo.AddAsync(It.IsAny<HabitLog>())).Returns(Task.CompletedTask);

            // Act
            await _service.AddAsync(habitLog);

            // Assert
            _habitRepositoryMock.Verify(repo => repo.GetByIdAsync(1), Times.Once);
            _habitLogRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<HabitLog>()), Times.Once);
        }

        [Fact]
        public async Task AddAsync_ShouldThrowException_WhenHabitDoesNotExist()
        {
            // Arrange
            var habitLog = new HabitLog
            {
                HabitId = 999,
                Value = 30.0m,
                Date = DateOnly.FromDateTime(DateTime.Today),
                CreatedBy = "testuser",
                CreatedDate = DateTime.Now
            };

            _habitRepositoryMock.Setup(repo => repo.GetByIdAsync(999)).ReturnsAsync((Habit?)null);

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.AddAsync(habitLog));
            _habitLogRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<HabitLog>()), Times.Never);
        }

        [Fact]
        public async Task UpdateAsync_ShouldReturnTrue_WhenHabitLogExists()
        {
            // Arrange
            var existingLog = new HabitLog
            {
                Id = 1,
                HabitId = 1,
                Value = 25.0m,
                Date = DateOnly.FromDateTime(DateTime.Today),
                Notes = "Original notes",
                CreatedBy = "testuser",
                CreatedDate = DateTime.Now
            };

            var updatedLog = new HabitLog
            {
                Id = 1,
                HabitId = 1,
                Value = 35.0m,
                Date = DateOnly.FromDateTime(DateTime.Today),
                Notes = "Updated notes",
                CreatedBy = "testuser",
                CreatedDate = DateTime.Now
            };

            _habitLogRepositoryMock.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(existingLog);
            _habitLogRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<HabitLog>())).Returns(Task.CompletedTask);

            // Act
            var result = await _service.UpdateAsync(updatedLog);

            // Assert
            Assert.True(result);
            Assert.Equal(35.0m, existingLog.Value);
            Assert.Equal("Updated notes", existingLog.Notes);
            _habitLogRepositoryMock.Verify(repo => repo.UpdateAsync(existingLog), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_ShouldReturnFalse_WhenHabitLogDoesNotExist()
        {
            // Arrange
            var nonExistentLog = new HabitLog 
            { 
                Id = 999, 
                HabitId = 1, 
                Value = 30.0m, 
                CreatedBy = "testuser",
                CreatedDate = DateTime.Now
            };
            _habitLogRepositoryMock.Setup(repo => repo.GetByIdAsync(999)).ReturnsAsync((HabitLog?)null);

            // Act
            var result = await _service.UpdateAsync(nonExistentLog);

            // Assert
            Assert.False(result);
            _habitLogRepositoryMock.Verify(repo => repo.UpdateAsync(It.IsAny<HabitLog>()), Times.Never);
        }

        [Fact]
        public async Task DeleteAsync_ShouldCallRepository()
        {
            // Arrange
            var logId = 1;

            // Act
            await _service.DeleteAsync(logId);

            // Assert
            _habitLogRepositoryMock.Verify(repo => repo.DeleteAsync(logId), Times.Once);
        }

        [Fact]
        public async Task GetByHabitIdAsync_ShouldReturnLogsForSpecificHabit()
        {
            // Arrange
            var habitId = 1;
            var expectedLogs = new List<HabitLog>
            {
                new HabitLog 
                { 
                    Id = 1, 
                    HabitId = habitId, 
                    Value = 30.0m, 
                    Date = DateOnly.FromDateTime(DateTime.Today),
                    CreatedBy = "testuser",
                    CreatedDate = DateTime.Now
                },
                new HabitLog 
                { 
                    Id = 2, 
                    HabitId = habitId, 
                    Value = 25.0m, 
                    Date = DateOnly.FromDateTime(DateTime.Today.AddDays(-1)),
                    CreatedBy = "testuser",
                    CreatedDate = DateTime.Now
                }
            };

            _habitLogRepositoryMock.Setup(repo => repo.GetByHabitIdAsync(habitId)).ReturnsAsync(expectedLogs);

            // Act
            var logs = await _service.GetByHabitIdAsync(habitId);

            // Assert
            Assert.Equal(2, logs.Count());
            Assert.All(logs, log => Assert.Equal(habitId, log.HabitId));
        }

        [Fact]
        public async Task GetByDateAsync_ShouldReturnLogsForSpecificDate()
        {
            // Arrange
            var targetDate = DateOnly.FromDateTime(DateTime.Today);
            var expectedLogs = new List<HabitLog>
            {
                new HabitLog 
                { 
                    Id = 1, 
                    HabitId = 1, 
                    Value = 30.0m, 
                    Date = targetDate,
                    CreatedBy = "testuser",
                    CreatedDate = DateTime.Now
                },
                new HabitLog 
                { 
                    Id = 2, 
                    HabitId = 2, 
                    Value = 15.0m, 
                    Date = targetDate,
                    CreatedBy = "testuser",
                    CreatedDate = DateTime.Now
                }
            };

            _habitLogRepositoryMock.Setup(repo => repo.GetByDateAsync(targetDate)).ReturnsAsync(expectedLogs);

            // Act
            var logs = await _service.GetByDateAsync(targetDate);

            // Assert
            Assert.Equal(2, logs.Count());
            Assert.All(logs, log => Assert.Equal(targetDate, log.Date));
        }

        [Fact]
        public async Task GetByDateRangeAsync_ShouldReturnLogsInRange()
        {
            // Arrange
            var startDate = DateOnly.FromDateTime(DateTime.Today.AddDays(-7));
            var endDate = DateOnly.FromDateTime(DateTime.Today);
            var expectedLogs = new List<HabitLog>
            {
                new HabitLog 
                { 
                    Id = 1, 
                    HabitId = 1, 
                    Value = 30.0m, 
                    Date = DateOnly.FromDateTime(DateTime.Today.AddDays(-3)),
                    CreatedBy = "testuser",
                    CreatedDate = DateTime.Now
                },
                new HabitLog 
                { 
                    Id = 2, 
                    HabitId = 1, 
                    Value = 25.0m, 
                    Date = DateOnly.FromDateTime(DateTime.Today.AddDays(-1)),
                    CreatedBy = "testuser",
                    CreatedDate = DateTime.Now
                }
            };

            _habitLogRepositoryMock.Setup(repo => repo.GetByDateRangeAsync(startDate, endDate)).ReturnsAsync(expectedLogs);

            // Act
            var logs = await _service.GetByDateRangeAsync(startDate, endDate);

            // Assert
            Assert.Equal(2, logs.Count());
            Assert.All(logs, log => Assert.True(log.Date >= startDate && log.Date <= endDate));
        }

        [Fact]
        public async Task GetByHabitAndDateAsync_ShouldReturnLogForSpecificHabitAndDate()
        {
            // Arrange
            var habitId = 1;
            var targetDate = DateOnly.FromDateTime(DateTime.Today);
            var expectedLog = new HabitLog
            {
                Id = 1,
                HabitId = habitId,
                Value = 30.0m,
                Date = targetDate,
                Notes = "Today's session",
                CreatedBy = "testuser",
                CreatedDate = DateTime.Now
            };

            _habitLogRepositoryMock.Setup(repo => repo.GetByHabitAndDateAsync(habitId, targetDate))
                .ReturnsAsync(expectedLog);

            // Act
            var log = await _service.GetByHabitAndDateAsync(habitId, targetDate);

            // Assert
            Assert.NotNull(log);
            Assert.Equal(habitId, log.HabitId);
            Assert.Equal(targetDate, log.Date);
        }

        [Fact]
        public async Task GetByHabitAndDateRangeAsync_ShouldReturnHabitLogsForHabitAndDateRange()
        {
            // Arrange
            var habitId = 1;
            var startDate = DateOnly.FromDateTime(DateTime.Today.AddDays(-7));
            var endDate = DateOnly.FromDateTime(DateTime.Today);
            var expectedLogs = new List<HabitLog>
            {
                new HabitLog
                {
                    Id = 1,
                    HabitId = habitId,
                    Value = 30.5m,
                    Date = startDate,
                    Notes = "First session",
                    CreatedBy = "testuser",
                    CreatedDate = DateTime.Now
                },
                new HabitLog
                {
                    Id = 2,
                    HabitId = habitId,
                    Value = 45.0m,
                    Date = endDate,
                    Notes = "Last session",
                    CreatedBy = "testuser",
                    CreatedDate = DateTime.Now
                }
            };

            _habitLogRepositoryMock.Setup(repo => repo.GetByHabitAndDateRangeAsync(habitId, startDate, endDate))
                .ReturnsAsync(expectedLogs);

            // Act
            var logs = await _service.GetByHabitAndDateRangeAsync(habitId, startDate, endDate);

            // Assert
            Assert.NotNull(logs);
            Assert.Equal(2, logs.Count());
            Assert.All(logs, log => Assert.Equal(habitId, log.HabitId));
            Assert.Contains(logs, log => log.Date == startDate);
            Assert.Contains(logs, log => log.Date == endDate);
        }
    }
}