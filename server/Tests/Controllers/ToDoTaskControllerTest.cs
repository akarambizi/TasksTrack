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
    public class ToDoTaskControllerTests
    {
        private readonly Mock<IToDoTaskService> _mockService;
        private readonly ToDoTaskController _controller;

        public ToDoTaskControllerTests()
        {
            _mockService = new Mock<IToDoTaskService>();
            _controller = new ToDoTaskController(_mockService.Object);
        }

        [Fact]
        public async Task GetAll_ReturnsListOfToDoTasks()
        {
            // Arrange
            var tasks = new List<ToDoTask>
            {
                new ToDoTask { Id = 1, Title = "Task 1", Completed = false, CreatedBy = "User1", CreatedDate = "2021-01-01", Description = "Task 1 description"},
                new ToDoTask { Id = 2, Title = "Task 2", Completed = true, CreatedBy = "User2", CreatedDate = "2021-01-01" }
            };
            _mockService.Setup(service => service.GetAllAsync()).ReturnsAsync(tasks);

            // Act
            var result = await _controller.GetAll();
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedTasks = Assert.IsAssignableFrom<IEnumerable<ToDoTask>>(okResult.Value);

            // Assert
            Assert.Equal(tasks.Count, ((List<ToDoTask>)returnedTasks).Count);
        }

        [Fact]
        public async Task GetById_ReturnsToDoTask()
        {
            // Arrange
            var task = new ToDoTask { Id = 1, Title = "Task 1", Completed = false, CreatedBy = "User1", CreatedDate = "2021-01-01", Description = "Task 1 description" };
            _mockService.Setup(service => service.GetByIdAsync(1)).ReturnsAsync(task);

            // Act
            var result = await _controller.GetById(1);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedTask = Assert.IsType<ToDoTask>(okResult.Value);

            // Assert
            Assert.Equal(task.Id, returnedTask.Id);
            Assert.Equal(task.Title, returnedTask.Title);
            // Continue for all properties
        }
    }
}