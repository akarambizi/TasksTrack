using Xunit;
using Moq;
using TasksTrack.Controllers;
using TasksTrack.Services;
using TasksTrack.Models;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace TasksTrack.Tests.Controllers
{
    public class HabitControllerTests
    {
        private readonly Mock<IHabitService> _mockService;
        private readonly HabitController _controller;

        public HabitControllerTests()
        {
            _mockService = new Mock<IHabitService>();
            _controller = new HabitController(_mockService.Object);
        }

        [Fact]
        public async Task GetAll_ReturnsListOfHabits()
        {
            // Arrange
            var habits = new List<Habit>
            {
                new Habit
                {
                    Id = 1,
                    Name = "Morning Exercise",
                    MetricType = "minutes",
                    Unit = "min",
                    Target = 30,
                    TargetFrequency = "daily",
                    Category = "Health",
                    IsActive = true,
                    CreatedBy = "User1",
                    CreatedDate = new System.DateTime(2024, 1, 1),
                    Description = "Daily morning workout routine"
                },
                new Habit
                {
                    Id = 2,
                    Name = "Reading",
                    MetricType = "pages",
                    Unit = "pages",
                    Target = 10,
                    TargetFrequency = "daily",
                    Category = "Learning",
                    IsActive = true,
                    CreatedBy = "User2",
                    CreatedDate = new System.DateTime(2024, 1, 1)
                }
            };
            _mockService.Setup(service => service.GetAllAsync()).ReturnsAsync(habits);

            // Act
            var result = await _controller.GetAll();
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedHabits = Assert.IsAssignableFrom<IEnumerable<Habit>>(okResult.Value);

            // Assert
            Assert.Equal(habits.Count, returnedHabits.Count());
        }

        [Fact]
        public async Task GetById_ReturnsHabit()
        {
            // Arrange
            var habit = new Habit
            {
                Id = 1,
                Name = "Morning Exercise",
                MetricType = "minutes",
                Unit = "min",
                Target = 30,
                TargetFrequency = "daily",
                Category = "Health",
                IsActive = true,
                CreatedBy = "User1",
                CreatedDate = new System.DateTime(2024, 1, 1),
                Description = "Daily morning workout routine"
            };
            _mockService.Setup(service => service.GetByIdAsync(1)).ReturnsAsync(habit);

            // Act
            var result = await _controller.GetById(1);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedHabit = Assert.IsType<Habit>(okResult.Value);

            // Assert
            Assert.Equal(habit.Id, returnedHabit.Id);
            Assert.Equal(habit.Name, returnedHabit.Name);
        }

        [Fact]
        public async Task GetById_ReturnsNotFound_WhenHabitDoesNotExist()
        {
            // Arrange
            _mockService.Setup(service => service.GetByIdAsync(1)).ReturnsAsync((Habit?)null);

            // Act
            var result = await _controller.GetById(1);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task Add_ReturnsCreatedAtAction()
        {
            // Arrange
            var habit = new Habit
            {
                Id = 1,
                Name = "Morning Exercise",
                MetricType = "minutes",
                Unit = "min",
                Target = 30,
                TargetFrequency = "daily",
                Category = "Health",
                IsActive = true,
                CreatedBy = "User1",
                CreatedDate = new System.DateTime(2024, 1, 1),
                Description = "Daily morning workout routine"
            };

            // Act
            var result = await _controller.Add(habit);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(nameof(_controller.GetById), createdAtActionResult.ActionName);
        }

        [Fact]
        public async Task Delete_ReturnsNoContent_WhenHabitExists()
        {
            // Arrange
            var habit = new Habit
            {
                Id = 1,
                Name = "Morning Exercise",
                MetricType = "minutes",
                CreatedBy = "User1"
            };
            _mockService.Setup(service => service.GetByIdAsync(1)).ReturnsAsync(habit);

            // Act
            var result = await _controller.Delete(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Archive_ReturnsNoContent_WhenHabitExists()
        {
            // Arrange
            var habit = new Habit
            {
                Id = 1,
                Name = "Morning Exercise",
                MetricType = "minutes",
                CreatedBy = "User1",
                IsActive = true
            };
            _mockService.Setup(service => service.GetByIdAsync(1)).ReturnsAsync(habit);

            // Act
            var result = await _controller.Archive(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Activate_ReturnsNoContent_WhenHabitExists()
        {
            // Arrange
            var habit = new Habit
            {
                Id = 1,
                Name = "Morning Exercise",
                MetricType = "minutes",
                CreatedBy = "User1",
                IsActive = false
            };
            _mockService.Setup(service => service.GetByIdAsync(1)).ReturnsAsync(habit);

            // Act
            var result = await _controller.Activate(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Update_ReturnsNoContent_WhenUpdateSucceeds()
        {
            // Arrange
            var habit = new Habit { Id = 1, Name = "Exercise", MetricType = "minutes", Target = 30, IsActive = true, CreatedBy = "testuser" };
            _mockService.Setup(service => service.UpdateAsync(habit)).ReturnsAsync(true);

            // Act
            var result = await _controller.Update(1, habit);

            // Assert
            Assert.IsType<NoContentResult>(result);
            _mockService.Verify(service => service.UpdateAsync(habit), Times.Once);
        }

        [Fact]
        public async Task Update_ReturnsNotFound_WhenHabitDoesNotExist()
        {
            // Arrange
            var habit = new Habit { Id = 1, Name = "Exercise", MetricType = "minutes", Target = 30, IsActive = true, CreatedBy = "testuser" };
            _mockService.Setup(service => service.UpdateAsync(habit)).ReturnsAsync(false);

            // Act
            var result = await _controller.Update(1, habit);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task Update_ReturnsBadRequest_WhenIdMismatch()
        {
            // Arrange
            var habit = new Habit { Id = 2, Name = "Exercise", MetricType = "minutes", Target = 30, IsActive = true, CreatedBy = "testuser" };

            // Act
            var result = await _controller.Update(1, habit);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Update_ReturnsBadRequest_WhenModelStateInvalid()
        {
            // Arrange
            var habit = new Habit { Id = 1, Name = "", MetricType = "minutes", Target = 30, IsActive = true, CreatedBy = "testuser" }; // Empty name should be invalid
            _controller.ModelState.AddModelError("Name", "Name is required");

            // Act
            var result = await _controller.Update(1, habit);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Update_ReturnsInternalServerError_WhenServiceThrowsException()
        {
            // Arrange
            var habit = new Habit { Id = 1, Name = "Exercise", MetricType = "minutes", Target = 30, IsActive = true, CreatedBy = "testuser" };
            _mockService.Setup(service => service.UpdateAsync(habit))
                .ThrowsAsync(new Exception("Service error"));

            // Act
            var result = await _controller.Update(1, habit);

            // Assert
            var statusCodeResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, statusCodeResult.StatusCode);
        }
    }
}