using Xunit;
using Moq;
using TasksTrack.Controllers;
using TasksTrack.Services;
using TasksTrack.Models;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace TasksTrack.Tests.Controllers
{
    public class HabitLogControllerTests
    {
        private readonly Mock<IHabitLogService> _mockService;
        private readonly HabitLogController _controller;

        public HabitLogControllerTests()
        {
            _mockService = new Mock<IHabitLogService>();
            _controller = new HabitLogController(_mockService.Object);
        }

        [Fact]
        public async Task GetAll_ReturnsListOfHabitLogs()
        {
            // Arrange
            var habitLogs = new List<HabitLog>
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

            _mockService.Setup(service => service.GetAllAsync()).ReturnsAsync(habitLogs);

            // Act
            var result = await _controller.GetAll();
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedLogs = Assert.IsAssignableFrom<IEnumerable<HabitLog>>(okResult.Value);

            // Assert
            Assert.Equal(2, returnedLogs.Count());
            Assert.Equal(habitLogs.First().Id, returnedLogs.First().Id);
        }

        [Fact]
        public async Task GetById_ReturnsHabitLog()
        {
            // Arrange
            var habitLog = new HabitLog
            {
                Id = 1,
                HabitId = 1,
                Value = 45.0m,
                Date = DateOnly.FromDateTime(DateTime.Today),
                Notes = "Excellent workout session",
                CreatedBy = "testuser",
                CreatedDate = DateTime.Now
            };
            _mockService.Setup(service => service.GetByIdAsync(1)).ReturnsAsync(habitLog);

            // Act
            var result = await _controller.GetById(1);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedLog = Assert.IsType<HabitLog>(okResult.Value);

            // Assert
            Assert.Equal(habitLog.Id, returnedLog.Id);
            Assert.Equal(habitLog.HabitId, returnedLog.HabitId);
            Assert.Equal(habitLog.Value, returnedLog.Value);
            Assert.Equal(habitLog.Notes, returnedLog.Notes);
        }

        [Fact]
        public async Task GetById_ReturnsNotFound_WhenHabitLogDoesNotExist()
        {
            // Arrange
            _mockService.Setup(service => service.GetByIdAsync(999)).ReturnsAsync((HabitLog?)null);

            // Act
            var result = await _controller.GetById(999);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task Add_ReturnsCreatedAtAction()
        {
            // Arrange
            var habitLog = new HabitLog
            {
                Id = 1,
                HabitId = 1,
                Value = 30.0m,
                Date = DateOnly.FromDateTime(DateTime.Today),
                Notes = "First log entry",
                CreatedBy = "testuser",
                CreatedDate = DateTime.Now
            };

            _mockService.Setup(service => service.AddAsync(It.IsAny<HabitLog>())).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Add(habitLog);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(nameof(_controller.GetById), createdAtActionResult.ActionName);
            Assert.Equal(habitLog.Id, createdAtActionResult.RouteValues!["id"]);
        }

        [Fact]
        public async Task Add_ReturnsBadRequest_WhenServiceThrowsArgumentException()
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
            _mockService.Setup(service => service.AddAsync(It.IsAny<HabitLog>()))
                .ThrowsAsync(new ArgumentException("Habit does not exist"));

            // Act
            var result = await _controller.Add(habitLog);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var errorResponse = badRequestResult.Value;
            Assert.NotNull(errorResponse);
            // Check that the response contains the error message (it's wrapped in an object with a "message" property)
        }

        [Fact]
        public async Task Update_ReturnsNoContent_WhenUpdateSucceeds()
        {
            // Arrange
            var habitLog = new HabitLog
            {
                Id = 1,
                HabitId = 1,
                Value = 35.0m,
                Date = DateOnly.FromDateTime(DateTime.Today),
                Notes = "Updated session notes",
                CreatedBy = "testuser",
                CreatedDate = DateTime.Now
            };

            _mockService.Setup(service => service.UpdateAsync(habitLog)).ReturnsAsync(true);

            // Act
            var result = await _controller.Update(1, habitLog);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Update_ReturnsBadRequest_WhenIdMismatch()
        {
            // Arrange
            var habitLog = new HabitLog 
            { 
                Id = 2, 
                HabitId = 1, 
                Value = 30.0m, 
                CreatedBy = "testuser",
                CreatedDate = DateTime.Now
            };

            // Act
            var result = await _controller.Update(1, habitLog);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Update_ReturnsNotFound_WhenUpdateFails()
        {
            // Arrange
            var habitLog = new HabitLog 
            { 
                Id = 999, 
                HabitId = 1, 
                Value = 30.0m, 
                CreatedBy = "testuser",
                CreatedDate = DateTime.Now
            };
            _mockService.Setup(service => service.UpdateAsync(habitLog)).ReturnsAsync(false);

            // Act
            var result = await _controller.Update(999, habitLog);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task Delete_ReturnsNoContent_WhenHabitLogExists()
        {
            // Arrange
            var habitLog = new HabitLog 
            { 
                Id = 1, 
                HabitId = 1, 
                Value = 30.0m, 
                Date = DateOnly.FromDateTime(DateTime.Today),
                CreatedBy = "testuser",
                CreatedDate = DateTime.Now
            };
            _mockService.Setup(service => service.GetByIdAsync(1)).ReturnsAsync(habitLog);

            // Act
            var result = await _controller.Delete(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
            _mockService.Verify(service => service.GetByIdAsync(1), Times.Once);
            _mockService.Verify(service => service.DeleteAsync(1), Times.Once);
        }

        [Fact]
        public async Task Delete_ReturnsNotFound_WhenHabitLogDoesNotExist()
        {
            // Arrange - Delete now returns NotFound when resource doesn't exist
            _mockService.Setup(service => service.GetByIdAsync(999)).ReturnsAsync((HabitLog?)null);

            // Act
            var result = await _controller.Delete(999);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
            _mockService.Verify(service => service.GetByIdAsync(999), Times.Once);
            _mockService.Verify(service => service.DeleteAsync(999), Times.Never);
        }

        [Fact]
        public async Task GetByHabitId_ReturnsLogsForSpecificHabit()
        {
            // Arrange
            var habitId = 1;
            var habitLogs = new List<HabitLog>
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

            _mockService.Setup(service => service.GetByHabitIdAsync(habitId)).ReturnsAsync(habitLogs);

            // Act
            var result = await _controller.GetByHabitId(habitId);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedLogs = Assert.IsAssignableFrom<IEnumerable<HabitLog>>(okResult.Value);

            // Assert
            Assert.Equal(2, returnedLogs.Count());
            Assert.All(returnedLogs, log => Assert.Equal(habitId, log.HabitId));
        }

        [Fact]
        public async Task GetByDate_ReturnsLogsForSpecificDate()
        {
            // Arrange
            var targetDate = DateOnly.FromDateTime(DateTime.Today);
            var habitLogs = new List<HabitLog>
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

            _mockService.Setup(service => service.GetByDateAsync(targetDate)).ReturnsAsync(habitLogs);

            // Act
            var result = await _controller.GetByDate(targetDate.ToDateTime(TimeOnly.MinValue));
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedLogs = Assert.IsAssignableFrom<IEnumerable<HabitLog>>(okResult.Value);

            // Assert
            Assert.Equal(2, returnedLogs.Count());
            Assert.All(returnedLogs, log => Assert.Equal(targetDate, log.Date));
        }

        [Fact]
        public async Task GetByDateRange_ReturnsLogsInDateRange()
        {
            // Arrange
            var startDate = DateOnly.FromDateTime(DateTime.Today.AddDays(-7));
            var endDate = DateOnly.FromDateTime(DateTime.Today);
            var habitLogs = new List<HabitLog>
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

            _mockService.Setup(service => service.GetByDateRangeAsync(startDate, endDate)).ReturnsAsync(habitLogs);

            // Act
            var result = await _controller.GetByDateRange(startDate.ToDateTime(TimeOnly.MinValue), endDate.ToDateTime(TimeOnly.MinValue));
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedLogs = Assert.IsAssignableFrom<IEnumerable<HabitLog>>(okResult.Value);

            // Assert
            Assert.Equal(2, returnedLogs.Count());
            Assert.All(returnedLogs, log => Assert.True(log.Date >= startDate && log.Date <= endDate));
        }

        [Fact]
        public async Task GetByHabitAndDate_ReturnsLogForSpecificHabitAndDate()
        {
            // Arrange
            var habitId = 1;
            var targetDate = DateOnly.FromDateTime(DateTime.Today);
            var habitLog = new HabitLog
            {
                Id = 1,
                HabitId = habitId,
                Value = 30.0m,
                Date = targetDate,
                Notes = "Today's session",
                CreatedBy = "testuser",
                CreatedDate = DateTime.Now
            };

            _mockService.Setup(service => service.GetByHabitAndDateAsync(habitId, targetDate))
                .ReturnsAsync(habitLog);

            // Act
            var result = await _controller.GetByHabitAndDate(habitId, targetDate.ToDateTime(TimeOnly.MinValue));
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedLog = Assert.IsType<HabitLog>(okResult.Value);

            // Assert
            Assert.Equal(habitId, returnedLog.HabitId);
            Assert.Equal(targetDate, returnedLog.Date);
        }

        [Fact]
        public async Task GetByHabitAndDate_ReturnsNotFound_WhenLogDoesNotExist()
        {
            // Arrange
            var habitId = 1;
            var targetDate = DateOnly.FromDateTime(DateTime.Today);
            _mockService.Setup(service => service.GetByHabitAndDateAsync(habitId, targetDate))
                .ReturnsAsync((HabitLog?)null);

            // Act
            var result = await _controller.GetByHabitAndDate(habitId, targetDate.ToDateTime(TimeOnly.MinValue));

            // Assert
            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetByHabitAndDateRange_ReturnsListOfHabitLogs()
        {
            // Arrange
            var habitId = 1;
            var startDate = DateOnly.FromDateTime(DateTime.Today.AddDays(-7));
            var endDate = DateOnly.FromDateTime(DateTime.Today);
            var habitLogs = new List<HabitLog>
            {
                new HabitLog 
                { 
                    Id = 1, 
                    HabitId = habitId, 
                    Date = startDate, 
                    Value = 30, 
                    CreatedBy = "test@example.com" 
                },
                new HabitLog 
                { 
                    Id = 2, 
                    HabitId = habitId, 
                    Date = endDate, 
                    Value = 45, 
                    CreatedBy = "test@example.com" 
                }
            };

            _mockService.Setup(service => service.GetByHabitAndDateRangeAsync(habitId, startDate, endDate))
                .ReturnsAsync(habitLogs);

            // Act
            var result = await _controller.GetByHabitAndDateRange(habitId, startDate.ToDateTime(TimeOnly.MinValue), endDate.ToDateTime(TimeOnly.MinValue));
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedLogs = Assert.IsAssignableFrom<IEnumerable<HabitLog>>(okResult.Value);

            // Assert
            Assert.Equal(2, returnedLogs.Count());
            Assert.All(returnedLogs, log => Assert.Equal(habitId, log.HabitId));
        }

        [Fact]
        public async Task GetByHabitAndDateRange_ReturnsEmptyList_WhenNoLogsInRange()
        {
            // Arrange
            var habitId = 1;
            var startDate = DateOnly.FromDateTime(DateTime.Today.AddDays(-7));
            var endDate = DateOnly.FromDateTime(DateTime.Today);
            var habitLogs = new List<HabitLog>();

            _mockService.Setup(service => service.GetByHabitAndDateRangeAsync(habitId, startDate, endDate))
                .ReturnsAsync(habitLogs);

            // Act
            var result = await _controller.GetByHabitAndDateRange(habitId, startDate.ToDateTime(TimeOnly.MinValue), endDate.ToDateTime(TimeOnly.MinValue));
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedLogs = Assert.IsAssignableFrom<IEnumerable<HabitLog>>(okResult.Value);

            // Assert
            Assert.Empty(returnedLogs);
        }
    }
}