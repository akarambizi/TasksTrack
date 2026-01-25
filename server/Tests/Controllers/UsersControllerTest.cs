using Moq;
using Xunit;
using TasksTrack.Controllers;
using TasksTrack.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace TasksTrack.Tests.Controllers
{
    public class UsersControllerTest
    {
        private readonly Mock<IUserService> _userServiceMock;
        private readonly UsersController _usersController;

        public UsersControllerTest()
        {
            _userServiceMock = new Mock<IUserService>();
            _usersController = new UsersController(_userServiceMock.Object);
        }

        [Fact]
        public void GetUsers_ShouldReturnOk_WithListOfUsers()
        {
            // Act
            var result = _usersController.GetUsers();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var users = Assert.IsType<List<string>>(okResult.Value);
            Assert.Equal(3, users.Count);
            Assert.Contains("User1", users);
            Assert.Contains("User2", users);
            Assert.Contains("User3", users);
        }

        [Fact]
        public void GetUser_ShouldReturnOk_WithSpecificUser()
        {
            // Arrange
            int userId = 123;

            // Act
            var result = _usersController.GetUser(userId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var user = Assert.IsType<string>(okResult.Value);
            Assert.Equal("User123", user);
        }

        [Fact]
        public void AddUser_ShouldReturnOk_WithNewUser()
        {
            // Act
            var result = _usersController.AddUser();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var user = Assert.IsType<string>(okResult.Value);
            Assert.Equal("New User", user);
        }

        [Fact]
        public void UpdateUser_ShouldReturnOk_WithUpdatedUser()
        {
            // Arrange
            int userId = 456;

            // Act
            var result = _usersController.UpdateUser(userId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var user = Assert.IsType<string>(okResult.Value);
            Assert.Equal("Updated User456", user);
        }

        [Fact]
        public void DeleteUser_ShouldReturnOk_WithDeleteMessage()
        {
            // Arrange
            int userId = 789;

            // Act
            var result = _usersController.DeleteUser(userId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var message = Assert.IsType<string>(okResult.Value);
            Assert.Equal("api/user deleted", message);
        }
    }
}