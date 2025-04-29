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
    }
}