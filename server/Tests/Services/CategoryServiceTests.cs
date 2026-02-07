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
    public class CategoryServiceTests
    {
        private readonly Mock<ICategoryRepository> _repositoryMock;
        private readonly CategoryService _service;

        public CategoryServiceTests()
        {
            _repositoryMock = new Mock<ICategoryRepository>();
            _service = new CategoryService(_repositoryMock.Object);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllCategories()
        {
            // Arrange
            var expectedCategories = new List<Category>
            {
                new Category
                {
                    Id = 1,
                    Name = "Health",
                    Description = "Health and fitness activities",
                    Color = "#22c55e",
                    Icon = "Heart",
                    IsActive = true,
                    CreatedDate = DateTimeOffset.UtcNow,
                    CreatedBy = "test-user"
                },
                new Category
                {
                    Id = 2,
                    Name = "Learning",
                    Description = "Educational activities",
                    Color = "#3b82f6",
                    Icon = "BookOpen",
                    IsActive = true,
                    CreatedDate = DateTimeOffset.UtcNow,
                    CreatedBy = "test-user"
                }
            };

            _repositoryMock.Setup(repo => repo.GetAllAsync())
                .ReturnsAsync(expectedCategories);

            // Act
            var result = await _service.GetAllAsync();

            // Assert
            Assert.Equal(expectedCategories, result);
            _repositoryMock.Verify(repo => repo.GetAllAsync(), Times.Once);
        }

        [Fact]
        public async Task GetActiveAsync_ShouldReturnOnlyActiveCategories()
        {
            // Arrange
            var expectedCategories = new List<Category>
            {
                new Category
                {
                    Id = 1,
                    Name = "Health",
                    Description = "Health activities",
                    IsActive = true,
                    CreatedDate = DateTimeOffset.UtcNow,
                    CreatedBy = "test-user"
                }
            };

            _repositoryMock.Setup(repo => repo.GetActiveAsync())
                .ReturnsAsync(expectedCategories);

            // Act
            var result = await _service.GetActiveAsync();

            // Assert
            Assert.Equal(expectedCategories, result);
            _repositoryMock.Verify(repo => repo.GetActiveAsync(), Times.Once);
        }

        [Fact]
        public async Task GetByIdAsync_WithValidId_ShouldReturnCategory()
        {
            // Arrange
            var categoryId = 1;
            var expectedCategory = new Category
            {
                Id = categoryId,
                Name = "Health",
                IsActive = true,
                CreatedDate = DateTimeOffset.UtcNow,
                CreatedBy = "test-user"
            };

            _repositoryMock.Setup(repo => repo.GetByIdAsync(categoryId))
                .ReturnsAsync(expectedCategory);

            // Act
            var result = await _service.GetByIdAsync(categoryId);

            // Assert
            Assert.Equal(expectedCategory, result);
            _repositoryMock.Verify(repo => repo.GetByIdAsync(categoryId), Times.Once);
        }

        [Fact]
        public async Task GetByIdAsync_WithInvalidId_ShouldReturnNull()
        {
            // Arrange
            var categoryId = 999;
            _repositoryMock.Setup(repo => repo.GetByIdAsync(categoryId))
                .ReturnsAsync((Category?)null);

            // Act
            var result = await _service.GetByIdAsync(categoryId);

            // Assert
            Assert.Null(result);
            _repositoryMock.Verify(repo => repo.GetByIdAsync(categoryId), Times.Once);
        }

        [Fact]
        public async Task AddAsync_WithUniqueName_ShouldSucceed()
        {
            // Arrange
            var category = new Category
            {
                Name = "New Category",
                Description = "A new category",
                IsActive = true,
                CreatedBy = "test-user"
            };

            _repositoryMock.Setup(repo => repo.ExistsAsync(category.Name))
                .ReturnsAsync(false);
            _repositoryMock.Setup(repo => repo.AddAsync(It.IsAny<Category>()))
                .Returns(Task.CompletedTask);

            // Act
            await _service.AddAsync(category);

            // Assert
            Assert.True(category.CreatedDate != DateTimeOffset.MinValue);
            _repositoryMock.Verify(repo => repo.ExistsAsync(category.Name), Times.Once);
            _repositoryMock.Verify(repo => repo.AddAsync(category), Times.Once);
        }

        [Fact]
        public async Task AddAsync_WithDuplicateName_ShouldThrowException()
        {
            // Arrange
            var category = new Category
            {
                Name = "Existing Category",
                IsActive = true,
                CreatedBy = "test-user"
            };

            _repositoryMock.Setup(repo => repo.ExistsAsync(category.Name))
                .ReturnsAsync(true);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<InvalidOperationException>(
                () => _service.AddAsync(category));
            Assert.Contains("already exists", exception.Message);
            _repositoryMock.Verify(repo => repo.ExistsAsync(category.Name), Times.Once);
            _repositoryMock.Verify(repo => repo.AddAsync(It.IsAny<Category>()), Times.Never);
        }

        [Fact]
        public async Task UpdateAsync_WithValidCategory_ShouldUpdateAndReturnTrue()
        {
            // Arrange
            var categoryId = 1;
            var existingCategory = new Category
            {
                Id = categoryId,
                Name = "Old Name",
                Description = "Old description",
                IsActive = true,
                CreatedDate = DateTimeOffset.UtcNow,
                CreatedBy = "test-user"
            };

            var updatedCategory = new Category
            {
                Id = categoryId,
                Name = "New Name",
                Description = "New description",
                Color = "#ff0000",
                Icon = "Star",
                IsActive = true,
                UpdatedBy = "test-user",
                CreatedBy = "test-user"
            };

            _repositoryMock.Setup(repo => repo.GetByIdAsync(categoryId))
                .ReturnsAsync(existingCategory);
            _repositoryMock.Setup(repo => repo.ExistsAsync(updatedCategory.Name, categoryId))
                .ReturnsAsync(false);
            _repositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Category>()))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _service.UpdateAsync(updatedCategory);

            // Assert
            Assert.True(result);
            Assert.Equal("New Name", existingCategory.Name);
            Assert.Equal("New description", existingCategory.Description);
            Assert.Equal("#ff0000", existingCategory.Color);
            Assert.Equal("Star", existingCategory.Icon);
            Assert.True(existingCategory.UpdatedDate.HasValue);
            _repositoryMock.Verify(repo => repo.UpdateAsync(existingCategory), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_WithNonexistentCategory_ShouldReturnFalse()
        {
            // Arrange
            var category = new Category
            {
                Id = 999,
                Name = "Nonexistent",
                CreatedBy = "test-user"
            };

            _repositoryMock.Setup(repo => repo.GetByIdAsync(category.Id))
                .ReturnsAsync((Category?)null);

            // Act
            var result = await _service.UpdateAsync(category);

            // Assert
            Assert.False(result);
            _repositoryMock.Verify(repo => repo.UpdateAsync(It.IsAny<Category>()), Times.Never);
        }

        [Fact]
        public async Task ArchiveAsync_WithValidId_ShouldDeactivateCategory()
        {
            // Arrange
            var categoryId = 1;
            var category = new Category
            {
                Id = categoryId,
                Name = "Test Category",
                IsActive = true,
                CreatedDate = DateTimeOffset.UtcNow,
                CreatedBy = "test-user"
            };

            _repositoryMock.Setup(repo => repo.GetByIdAsync(categoryId))
                .ReturnsAsync(category);
            _repositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Category>()))
                .Returns(Task.CompletedTask);

            // Act
            await _service.ArchiveAsync(categoryId, "test-user");

            // Assert
            Assert.False(category.IsActive);
            Assert.Equal("test-user", category.UpdatedBy);
            Assert.True(category.UpdatedDate.HasValue);
            _repositoryMock.Verify(repo => repo.UpdateAsync(category), Times.Once);
        }

        [Fact]
        public async Task ExistsAsync_WithExistingName_ShouldReturnTrue()
        {
            // Arrange
            var categoryName = "Existing Category";
            _repositoryMock.Setup(repo => repo.ExistsAsync(It.IsAny<string>(), It.IsAny<int?>()))
                .ReturnsAsync(false);

            // Act
            var result = await _service.ExistsAsync(categoryName);

            // Assert
            Assert.False(result);
            _repositoryMock.Verify(repo => repo.ExistsAsync(categoryName, null), Times.Once);
        }
    }
}