using Moq;
using Xunit;
using TasksTrack.Controllers;
using TasksTrack.Services;
using TasksTrack.Models;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace TasksTrack.Tests.Controllers
{
    public class AuthControllerTest
    {
        private readonly Mock<IAuthService> _authServiceMock;
        private readonly AuthController _authController;

        public AuthControllerTest()
        {
            _authServiceMock = new Mock<IAuthService>();
            _authController = new AuthController(_authServiceMock.Object);
        }

        [Fact]
        public async Task Register_ShouldReturnBadRequest_WhenRegistrationFails()
        {
            // Arrange
            var request = new RegisterRequest { Email = "test@example.com", Username = "testuser", Password = "password123" };
            _authServiceMock.Setup(service => service.RegisterAsync(request)).ReturnsAsync(new AuthResult { Success = false, Message = "Email is already taken." });

            // Act
            var result = await _authController.Register(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Email is already taken.", badRequestResult.Value);
        }

        [Fact]
        public async Task Register_ShouldReturnOk_WhenRegistrationSucceeds()
        {
            // Arrange
            var request = new RegisterRequest { Email = "new@example.com", Username = "newuser", Password = "password123" };
            _authServiceMock.Setup(service => service.RegisterAsync(request)).ReturnsAsync(new AuthResult { Success = true, Token = "test_token" });

            // Act
            var result = await _authController.Register(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("test_token", ((AuthResult?)okResult.Value)?.Token ?? string.Empty);
        }
    }
}