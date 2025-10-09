using Moq;
using Xunit;
using TasksTrack.Models;
using TasksTrack.Services;
using TasksTrack.Repositories;
using System.Collections.Generic;
using System.Linq;

namespace TasksTrack.Tests.Services
{
    public class ToDoTaskServiceTests
    {
        private readonly Mock<IToDoTaskRepository> _repositoryMock;
        private readonly ToDoTaskService _service;

        public ToDoTaskServiceTests()
        {
            _repositoryMock = new Mock<IToDoTaskRepository>();
            _service = new ToDoTaskService(_repositoryMock.Object);
        }

        [Fact]
        public async Task GetAll_ShouldReturnAllTasks()
        {
            // Arrange
            var expectedTasks = new List<ToDoTask>
            {
                new ToDoTask {
                    Id = 1,
                Title = "Test Task",
                CreatedDate = "2021-01-01",
                CreatedBy = "Test User" },
                new ToDoTask {
                    Id = 2,
                Title = "Test Task 2",
                CreatedDate = "2021-01-01",
                CreatedBy = "Test User" }
            };

            _repositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(expectedTasks);

            // Act
            var tasks = await _service.GetAllAsync();

            // Assert
            Assert.Equal(2, tasks.Count());
            Assert.Contains(tasks, task => task.Id == 1);
            Assert.Contains(tasks, task => task.Id == 2);
        }
    }
}