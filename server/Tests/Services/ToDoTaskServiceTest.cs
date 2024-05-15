using Moq;
using Xunit;
using TasksTrack.Models;
using TasksTrack.Services;
using TasksTrack.Repositories;

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
        [Trait("Description", "This test verifies that the Add method calls Add on the repository when it is called.")]
        public void Add_ShouldCallAddOnRepository_WhenCalled()
        {
            // Arrange
            var task = new ToDoTask
            {
                Title = "Test Task",
                CreatedDate = "2021-01-01",
                CreatedBy = "Test User"
            };

            // Act
            _service.Add(task);

            // Assert
            _repositoryMock.Verify(r => r.Add(task), Times.Once);
        }

        [Fact]
        public void GetAll_ShouldReturnAllTasks()
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
            _repositoryMock.Setup(r => r.GetAll()).Returns(expectedTasks);

            // Act
            var tasks = _service.GetAll();

            // Assert
            Assert.Equal(2, tasks.Count());
            Assert.Contains(tasks, task => task.Id == 1);
            Assert.Contains(tasks, task => task.Id == 2);
        }
    }
}