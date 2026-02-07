using Moq;
using Xunit;
using TasksTrack.Models;
using TasksTrack.Services;
using TasksTrack.Repositories;
using System.Collections.Generic;
using System.Linq;
using System;
using System.Threading.Tasks;

namespace TasksTrack.Tests.Services
{
    public class CategoryGoalServiceTests
    {
        private readonly Mock<ICategoryGoalRepository> _repositoryMock;
        private readonly CategoryGoalService _service;

        public CategoryGoalServiceTests()
        {
            _repositoryMock = new Mock<ICategoryGoalRepository>();
            _service = new CategoryGoalService(_repositoryMock.Object);
        }

        [Fact]
        public async Task GetByUserIdAsync_ShouldReturnUserGoals()
        {
            // Arrange
            var userId = "test-user";
            var expectedGoals = new List<CategoryGoal>
            {
                new CategoryGoal
                {
                    Id = 1,
                    CategoryId = 1,
                    UserId = userId,
                    WeeklyTargetMinutes = 300,
                    DailyTargetMinutes = 60,
                    IsActive = true,
                    CreatedDate = DateTimeOffset.UtcNow,
                    CreatedBy = userId,
                    Category = new Category { Id = 1, Name = "Health", CreatedBy = "system" }
                }
            };

            _repositoryMock.Setup(repo => repo.GetByUserIdAsync(userId))
                .ReturnsAsync(expectedGoals);

            // Act
            var result = await _service.GetByUserIdAsync(userId);

            // Assert
            Assert.Equal(expectedGoals, result);
            _repositoryMock.Verify(repo => repo.GetByUserIdAsync(userId), Times.Once);
        }

        [Fact]
        public async Task AddAsync_WithValidGoal_ShouldSucceed()
        {
            // Arrange
            var categoryGoal = new CategoryGoal
            {
                CategoryId = 1,
                UserId = "test-user",
                WeeklyTargetMinutes = 300,
                DailyTargetMinutes = 60,
                IsActive = true,
                CreatedBy = "test-user"
            };

            _repositoryMock.Setup(repo => repo.HasActiveGoalAsync(categoryGoal.CategoryId, categoryGoal.UserId, It.IsAny<int?>()))
                .ReturnsAsync(false);
            _repositoryMock.Setup(repo => repo.AddAsync(It.IsAny<CategoryGoal>()))
                .Returns(Task.CompletedTask);

            // Act
            await _service.AddAsync(categoryGoal);

            // Assert
            Assert.True(categoryGoal.CreatedDate != DateTimeOffset.MinValue);
            Assert.True(categoryGoal.StartDate != DateTimeOffset.MinValue);
            _repositoryMock.Verify(repo => repo.HasActiveGoalAsync(categoryGoal.CategoryId, categoryGoal.UserId, It.IsAny<int?>()), Times.Once);
            _repositoryMock.Verify(repo => repo.AddAsync(categoryGoal), Times.Once);
        }

        [Fact]
        public async Task AddAsync_WithDuplicateActiveGoal_ShouldThrowException()
        {
            // Arrange
            var categoryGoal = new CategoryGoal
            {
                CategoryId = 1,
                UserId = "test-user",
                WeeklyTargetMinutes = 300,
                IsActive = true,
                CreatedBy = "test-user"
            };

            _repositoryMock.Setup(repo => repo.HasActiveGoalAsync(categoryGoal.CategoryId, categoryGoal.UserId, It.IsAny<int?>()))
                .ReturnsAsync(true);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<InvalidOperationException>(
                () => _service.AddAsync(categoryGoal));
            Assert.Contains("already has an active goal", exception.Message);
            _repositoryMock.Verify(repo => repo.AddAsync(It.IsAny<CategoryGoal>()), Times.Never);
        }

        [Fact]
        public async Task UpdateAsync_WithValidGoal_ShouldUpdateAndReturnTrue()
        {
            // Arrange
            var goalId = 1;
            var existingGoal = new CategoryGoal
            {
                Id = goalId,
                CategoryId = 1,
                UserId = "test-user",
                WeeklyTargetMinutes = 300,
                DailyTargetMinutes = 60,
                IsActive = true,
                CreatedDate = DateTimeOffset.UtcNow,
                CreatedBy = "test-user"
            };

            var updatedGoal = new CategoryGoal
            {
                Id = goalId,
                CategoryId = 1,
                UserId = "test-user",
                WeeklyTargetMinutes = 400,
                DailyTargetMinutes = 80,
                IsActive = true,
                UpdatedBy = "test-user",
                CreatedBy = "test-user"
            };

            _repositoryMock.Setup(repo => repo.GetByIdAsync(goalId))
                .ReturnsAsync(existingGoal);
            _repositoryMock.Setup(repo => repo.HasActiveGoalAsync(updatedGoal.CategoryId, updatedGoal.UserId, goalId))
                .ReturnsAsync(false);
            _repositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<CategoryGoal>()))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _service.UpdateAsync(updatedGoal);

            // Assert
            Assert.True(result);
            Assert.Equal(400, existingGoal.WeeklyTargetMinutes);
            Assert.Equal(80, existingGoal.DailyTargetMinutes);
            Assert.True(existingGoal.UpdatedDate.HasValue);
            _repositoryMock.Verify(repo => repo.UpdateAsync(existingGoal), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_WithNonexistentGoal_ShouldReturnFalse()
        {
            // Arrange
            var goal = new CategoryGoal
            {
                Id = 999,
                CategoryId = 1,
                UserId = "test-user",
                CreatedBy = "test-user"
            };

            _repositoryMock.Setup(repo => repo.GetByIdAsync(goal.Id))
                .ReturnsAsync((CategoryGoal?)null);

            // Act
            var result = await _service.UpdateAsync(goal);

            // Assert
            Assert.False(result);
            _repositoryMock.Verify(repo => repo.UpdateAsync(It.IsAny<CategoryGoal>()), Times.Never);
        }

        [Fact]
        public async Task GetActiveByCategoryAndUserAsync_ShouldReturnActiveGoal()
        {
            // Arrange
            var categoryId = 1;
            var userId = "test-user";
            var expectedGoal = new CategoryGoal
            {
                Id = 1,
                CategoryId = categoryId,
                UserId = userId,
                IsActive = true,
                CreatedDate = DateTimeOffset.UtcNow,
                CreatedBy = userId,
                Category = new Category { Id = categoryId, Name = "Health", CreatedBy = "system" }
            };

            _repositoryMock.Setup(repo => repo.GetActiveByCategoryAndUserAsync(categoryId, userId))
                .ReturnsAsync(expectedGoal);

            // Act
            var result = await _service.GetActiveByCategoryAndUserAsync(categoryId, userId);

            // Assert
            Assert.Equal(expectedGoal, result);
            _repositoryMock.Verify(repo => repo.GetActiveByCategoryAndUserAsync(categoryId, userId), Times.Once);
        }

        [Fact]
        public async Task DeactivateAsync_WithValidId_ShouldCallRepository()
        {
            // Arrange
            var goalId = 1;
            var updatedBy = "test-user";

            _repositoryMock.Setup(repo => repo.DeactivateAsync(goalId, updatedBy))
                .Returns(Task.CompletedTask);

            // Act
            await _service.DeactivateAsync(goalId, updatedBy);

            // Assert
            _repositoryMock.Verify(repo => repo.DeactivateAsync(goalId, updatedBy), Times.Once);
        }

        [Fact]
        public async Task HasActiveGoalAsync_WithExistingGoal_ShouldReturnTrue()
        {
            // Arrange
            var categoryId = 1;
            var userId = "test-user";

            _repositoryMock.Setup(repo => repo.HasActiveGoalAsync(categoryId, userId, It.IsAny<int?>()))
                .ReturnsAsync(true);

            // Act
            var result = await _service.HasActiveGoalAsync(categoryId, userId);

            // Assert
            Assert.True(result);
            _repositoryMock.Verify(repo => repo.HasActiveGoalAsync(categoryId, userId, It.IsAny<int?>()), Times.Once);
        }
    }
}