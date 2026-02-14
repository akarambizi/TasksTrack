using Xunit;
using Microsoft.EntityFrameworkCore;
using TasksTrack.Data;
using TasksTrack.Models;
using TasksTrack.Repositories;
using TasksTrack.Services;
using System.Threading.Tasks;
using Moq;

namespace TasksTrack.Tests.Repositories
{
    public class AuthRepositoryTest : IDisposable
    {
        private readonly TasksTrackContext _context;
        private readonly AuthRepository _repository;
        private readonly Mock<ICurrentUserService> _mockCurrentUserService;

        public AuthRepositoryTest()
        {
            var options = new DbContextOptionsBuilder<TasksTrackContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;

            _mockCurrentUserService = new Mock<ICurrentUserService>();
            _mockCurrentUserService.Setup(s => s.GetUserIdOrNull()).Returns("testuser");

            _context = new TasksTrackContext(options, _mockCurrentUserService.Object);
            _repository = new AuthRepository(_context);
        }

        [Fact]
        public async Task GetUserByEmailAsync_ShouldReturnUser_WhenUserExists()
        {
            // Arrange
            var user = new User
            {
                Email = "test@example.com",
                Username = "testuser",
                PasswordHash = "hashedpassword",
                CreatedAt = DateTimeOffset.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetUserByEmailAsync("test@example.com");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("test@example.com", result.Email);
            Assert.Equal("testuser", result.Username);
        }

        [Fact]
        public async Task GetUserByEmailAsync_ShouldReturnNull_WhenUserDoesNotExist()
        {
            // Act
            var result = await _repository.GetUserByEmailAsync("nonexistent@example.com");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetUserByUsernameAsync_ShouldReturnUser_WhenUserExists()
        {
            // Arrange
            var user = new User
            {
                Email = "test@example.com",
                Username = "testuser",
                PasswordHash = "hashedpassword",
                CreatedAt = DateTimeOffset.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetUserByUsernameAsync("testuser");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("testuser", result.Username);
            Assert.Equal("test@example.com", result.Email);
        }

        [Fact]
        public async Task GetUserByUsernameAsync_ShouldReturnNull_WhenUserDoesNotExist()
        {
            // Act
            var result = await _repository.GetUserByUsernameAsync("nonexistentuser");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task CreateUserAsync_ShouldCreateUser_WhenUserIsValid()
        {
            // Arrange
            var user = new User
            {
                Email = "newuser@example.com",
                Username = "newuser",
                PasswordHash = "hashedpassword",
                CreatedAt = DateTimeOffset.UtcNow
            };

            // Act
            await _repository.CreateUserAsync(user);

            // Assert
            Assert.True(user.Id > 0);
            Assert.Equal("newuser@example.com", user.Email);

            // Verify user was saved to database
            var savedUser = await _context.Users.FindAsync(user.Id);
            Assert.NotNull(savedUser);
            Assert.Equal("newuser@example.com", savedUser.Email);
        }

        [Fact]
        public async Task GetUserByRefreshTokenAsync_ShouldReturnUser_WhenTokenExists()
        {
            // Arrange
            var user = new User
            {
                Email = "test@example.com",
                Username = "testuser",
                PasswordHash = "hashedpassword",
                RefreshToken = "valid-refresh-token",
                CreatedAt = DateTimeOffset.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetUserByRefreshTokenAsync("valid-refresh-token");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("valid-refresh-token", result.RefreshToken);
            Assert.Equal("test@example.com", result.Email);
        }

        [Fact]
        public async Task UpdateUserAsync_ShouldUpdateUser_WhenUserExists()
        {
            // Arrange
            var user = new User
            {
                Email = "test@example.com",
                Username = "testuser",
                PasswordHash = "hashedpassword",
                CreatedAt = DateTimeOffset.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Modify user
            user.RefreshToken = "new-refresh-token";
            user.PasswordHash = "new-hashed-password";

            // Act
            await _repository.UpdateUserAsync(user);

            // Assert
            // Verify changes were saved to database
            var updatedUser = await _context.Users.FindAsync(user.Id);
            Assert.NotNull(updatedUser);
            Assert.Equal("new-refresh-token", updatedUser.RefreshToken);
            Assert.Equal("new-hashed-password", updatedUser.PasswordHash);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}