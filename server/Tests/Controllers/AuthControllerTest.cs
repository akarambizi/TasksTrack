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

        [Fact]
        public async Task Login_ShouldReturnOk_WhenLoginSucceeds()
        {
            // Arrange
            var request = new LoginRequest { Email = "test@example.com", Password = "password123" };
            var expectedResult = new AuthResult 
            { 
                Success = true, 
                Token = "fake-jwt-token", 
                RefreshToken = "fake-refresh-token"
            };
            
            _authServiceMock.Setup(service => service.LoginAsync(request)).ReturnsAsync(expectedResult);

            // Act
            var result = await _authController.Login(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var authResult = Assert.IsType<AuthResult>(okResult.Value);
            Assert.True(authResult.Success);
            Assert.Equal("fake-jwt-token", authResult.Token);
        }

        [Fact]
        public async Task Login_ShouldReturnBadRequest_WhenLoginFails()
        {
            // Arrange
            var request = new LoginRequest { Email = "test@example.com", Password = "wrongpassword" };
            var expectedResult = new AuthResult { Success = false, Message = "Invalid credentials" };
            
            _authServiceMock.Setup(service => service.LoginAsync(request)).ReturnsAsync(expectedResult);

            // Act
            var result = await _authController.Login(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid credentials", badRequestResult.Value);
        }

        [Fact]
        public async Task Logout_ShouldReturnOk_WhenLogoutSucceeds()
        {
            // Arrange
            var request = new RefreshTokenRequest { RefreshToken = "valid-refresh-token" };
            var expectedResult = new AuthResult { Success = true, Message = "Logged out successfully" };
            
            _authServiceMock.Setup(service => service.LogoutAsync(request.RefreshToken)).ReturnsAsync(expectedResult);

            // Act
            var result = await _authController.Logout(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var authResult = Assert.IsType<AuthResult>(okResult.Value);
            Assert.True(authResult.Success);
        }

        [Fact]
        public async Task RefreshToken_ShouldReturnOk_WhenRefreshSucceeds()
        {
            // Arrange
            var request = new RefreshTokenRequest { RefreshToken = "valid-refresh-token" };
            var expectedResult = new AuthResult 
            { 
                Success = true, 
                Token = "new-jwt-token", 
                RefreshToken = "new-refresh-token" 
            };
            
            _authServiceMock.Setup(service => service.RefreshTokenAsync(request)).ReturnsAsync(expectedResult);

            // Act
            var result = await _authController.RefreshToken(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var authResult = Assert.IsType<AuthResult>(okResult.Value);
            Assert.True(authResult.Success);
            Assert.Equal("new-jwt-token", authResult.Token);
        }

        [Fact]
        public async Task RefreshToken_ShouldReturnBadRequest_WhenRefreshFails()
        {
            // Arrange
            var request = new RefreshTokenRequest { RefreshToken = "invalid-refresh-token" };
            var expectedResult = new AuthResult { Success = false, Message = "Invalid refresh token" };
            
            _authServiceMock.Setup(service => service.RefreshTokenAsync(request)).ReturnsAsync(expectedResult);

            // Act
            var result = await _authController.RefreshToken(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid refresh token", badRequestResult.Value);
        }

        [Fact]
        public async Task ResetPassword_ShouldReturnOk_WhenResetSucceeds()
        {
            // Arrange
            var request = new PasswordResetRequest { Email = "test@example.com", NewPassword = "newpassword123" };
            var expectedResult = new AuthResult { Success = true, Message = "Password reset successfully" };
            
            _authServiceMock.Setup(service => service.ResetPasswordAsync(request)).ReturnsAsync(expectedResult);

            // Act
            var result = await _authController.ResetPassword(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var authResult = Assert.IsType<AuthResult>(okResult.Value);
            Assert.True(authResult.Success);
        }

        [Fact]
        public async Task ResetPassword_ShouldReturnBadRequest_WhenResetFails()
        {
            // Arrange
            var request = new PasswordResetRequest { Email = "nonexistent@example.com", NewPassword = "newpassword123" };
            var expectedResult = new AuthResult { Success = false, Message = "User not found" };
            
            _authServiceMock.Setup(service => service.ResetPasswordAsync(request)).ReturnsAsync(expectedResult);

            // Act
            var result = await _authController.ResetPassword(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("User not found", badRequestResult.Value);
        }
    }
}