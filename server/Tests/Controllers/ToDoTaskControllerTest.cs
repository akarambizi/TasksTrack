using Xunit;
using Moq;
using TasksTrack.Controllers;
using TasksTrack.Services;
using TasksTrack.Models;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace TasksTrack.Tests.Controllers
{
    public class ToDoTaskControllerTests
    {
        private readonly Mock<IToDoTaskService> _mockService;
        private readonly ToDoTaskController _controller;

        public ToDoTaskControllerTests()
        {
            _mockService = new Mock<IToDoTaskService>();
            _controller = new ToDoTaskController();
        }

        [Fact]
        public void GetAll_ReturnsListOfToDoTasks()
        {
            // Arrange
            var tasks = new List<ToDoTask>
    {
        new ToDoTask { Id = 1, Title = "Task 1", Completed = false, CreatedBy = "User1", CreatedDate = "2021-01-01", Description = "Task 1 description"},
        new ToDoTask { Id = 2, Title = "Task 2", Completed = true, CreatedBy = "User2", CreatedDate = "2021-01-01" }
    };
            _mockService.Setup(service => service.GetAll()).Returns(tasks);

            // Act
            var result = _controller.GetAll().ToList(); // Convert to list

            // Assert
            for (int i = 0; i < tasks.Count; i++)
            {
                Assert.Equal(tasks[i].Id, result[i].Id);
                Assert.Equal(tasks[i].Title, result[i].Title);
            }
        }

        [Fact]
        public void GetById_ReturnsToDoTask()
        {
            // Arrange
            var task = new ToDoTask { Id = 1, Title = "Task 1", Completed = false, CreatedBy = "User1", CreatedDate = "2021-01-01", Description = "Task 1 description" };
            _mockService.Setup(service => service.GetById(1)).Returns(task);

            // Act
            var result = _controller.GetById(1);

            // Assert
            Assert.Equal(task.Id, result.Id);
            Assert.Equal(task.Title, result.Title);
            // Continue for all properties
        }
    }
}