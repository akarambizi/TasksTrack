using Moq;
using Xunit;
using TasksTrack.Models;
using TasksTrack.Services;
using TasksTrack.Repositories;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace TasksTrack.Tests.Services
{
    public class AuthServiceTest
    {
        private readonly Mock<IAuthRepository> _authRepositoryMock;
        private readonly Mock<IConfiguration> _configurationMock;
        private readonly AuthService _authService;

        public AuthServiceTest()
        {
            _authRepositoryMock = new Mock<IAuthRepository>();
            _configurationMock = new Mock<IConfiguration>();
            _configurationMock.Setup(config => config[It.IsAny<string>()]).Returns("a_secure_random_key_with_at_least_32_characters");
            _authService = new AuthService(_authRepositoryMock.Object, _configurationMock.Object);
        }

        [Fact]
        public async Task RegisterAsync_ShouldReturnError_WhenEmailExists()
        {
            // Arrange
            var existingUser = new User { Email = "test@example.com" };
            _authRepositoryMock.Setup(repo => repo.GetUserByEmailAsync("test@example.com")).ReturnsAsync(existingUser);

            var request = new RegisterRequest { Email = "test@example.com", Username = "testuser", Password = "Password123!" };

            // Act
            var result = await _authService.RegisterAsync(request);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Email is already taken.", result.Message);
        }

        [Fact]
        public async Task RegisterAsync_ShouldReturnError_WhenUsernameExists()
        {
            // Arrange
            var existingUser = new User { Username = "testuser", Email = "test@example.com" };
            _authRepositoryMock.Setup(repo => repo.GetUserByUsernameAsync("testuser")).ReturnsAsync(existingUser);

            var request = new RegisterRequest { Email = "new@example.com", Username = "testuser", Password = "Password123!" };

            // Act
            var result = await _authService.RegisterAsync(request);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Username is already taken.", result.Message);
        }

        [Fact]
        public async Task RegisterAsync_ShouldCreateUser_WhenValidRequest()
        {
            // Arrange
            _authRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(It.IsAny<string>())).ReturnsAsync((User?)null);
            _ = _authRepositoryMock.Setup(repo => repo.GetUserByUsernameAsync(It.IsAny<string>())).ReturnsAsync((User?)null);

            var request = new RegisterRequest { Email = "new@example.com", Username = "newuser", Password = "Password123!" };

            // Act
            var result = await _authService.RegisterAsync(request);

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.Token);
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnError_WhenUserNotFound()
        {
            // Arrange
            _authRepositoryMock.Setup(repo => repo.GetUserByEmailAsync("nonexistent@example.com")).ReturnsAsync((User?)null);

            var request = new LoginRequest { Email = "nonexistent@example.com", Password = "password123" };

            // Act
            var result = await _authService.LoginAsync(request);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Invalid credentials", result.Message);
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnError_WhenPasswordIncorrect()
        {
            // Arrange
            var existingUser = new User 
            { 
                Id = 1, 
                Email = "test@example.com", 
                Username = "testuser", 
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("correctpassword") 
            };
            _authRepositoryMock.Setup(repo => repo.GetUserByEmailAsync("test@example.com")).ReturnsAsync(existingUser);

            var request = new LoginRequest { Email = "test@example.com", Password = "wrongpassword" };

            // Act
            var result = await _authService.LoginAsync(request);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Invalid credentials", result.Message);
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnSuccess_WhenCredentialsValid()
        {
            // Arrange
            var existingUser = new User 
            { 
                Id = 1, 
                Email = "test@example.com", 
                Username = "testuser", 
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123") 
            };
            _authRepositoryMock.Setup(repo => repo.GetUserByEmailAsync("test@example.com")).ReturnsAsync(existingUser);

            var request = new LoginRequest { Email = "test@example.com", Password = "password123" };

            // Act
            var result = await _authService.LoginAsync(request);

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.Token);
            Assert.NotNull(result.RefreshToken);
        }

        [Fact]
        public async Task LogoutAsync_ShouldReturnError_WhenUserNotFound()
        {
            // Arrange
            _authRepositoryMock.Setup(repo => repo.GetUserByRefreshTokenAsync("invalid-token")).ReturnsAsync((User?)null);

            // Act
            var result = await _authService.LogoutAsync("invalid-token");

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Invalid refresh token", result.Message);
        }

        [Fact]
        public async Task LogoutAsync_ShouldReturnSuccess_WhenTokenValid()
        {
            // Arrange
            var existingUser = new User 
            { 
                Id = 1, 
                Email = "test@example.com", 
                RefreshToken = "valid-refresh-token" 
            };
            _authRepositoryMock.Setup(repo => repo.GetUserByRefreshTokenAsync("valid-refresh-token")).ReturnsAsync(existingUser);

            // Act
            var result = await _authService.LogoutAsync("valid-refresh-token");

            // Assert
            Assert.True(result.Success);
            Assert.Equal("Logged out successfully", result.Message);
        }

        [Fact]
        public async Task RefreshTokenAsync_ShouldReturnError_WhenTokenInvalid()
        {
            // Arrange
            _authRepositoryMock.Setup(repo => repo.GetUserByRefreshTokenAsync("invalid-token")).ReturnsAsync((User?)null);

            var request = new RefreshTokenRequest { RefreshToken = "invalid-token" };

            // Act
            var result = await _authService.RefreshTokenAsync(request);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Invalid refresh token", result.Message);
        }

        [Fact]
        public async Task RefreshTokenAsync_ShouldReturnSuccess_WhenTokenValid()
        {
            // Arrange
            var existingUser = new User 
            { 
                Id = 1, 
                Email = "test@example.com", 
                Username = "testuser",
                RefreshToken = "valid-refresh-token" 
            };
            _authRepositoryMock.Setup(repo => repo.GetUserByRefreshTokenAsync("valid-refresh-token")).ReturnsAsync(existingUser);

            var request = new RefreshTokenRequest { RefreshToken = "valid-refresh-token" };

            // Act
            var result = await _authService.RefreshTokenAsync(request);

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.Token);
            Assert.NotNull(result.RefreshToken);
        }

        [Fact]
        public async Task ResetPasswordAsync_ShouldReturnError_WhenUserNotFound()
        {
            // Arrange
            _authRepositoryMock.Setup(repo => repo.GetUserByEmailAsync("nonexistent@example.com")).ReturnsAsync((User?)null);

            var request = new PasswordResetRequest { Email = "nonexistent@example.com", NewPassword = "newpassword123" };

            // Act
            var result = await _authService.ResetPasswordAsync(request);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("User not found", result.Message);
        }

        [Fact]
        public async Task ResetPasswordAsync_ShouldReturnSuccess_WhenUserExists()
        {
            // Arrange
            var existingUser = new User 
            { 
                Id = 1, 
                Email = "test@example.com", 
                Username = "testuser" 
            };
            _authRepositoryMock.Setup(repo => repo.GetUserByEmailAsync("test@example.com")).ReturnsAsync(existingUser);

            var request = new PasswordResetRequest { Email = "test@example.com", NewPassword = "newpassword123" };

            // Act
            var result = await _authService.ResetPasswordAsync(request);

            // Assert
            Assert.True(result.Success);
            Assert.Equal("Password reset successfully", result.Message);
        }
    }
}