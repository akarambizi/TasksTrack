using Xunit;
using Moq;
using TasksTrack.Controllers;
using TasksTrack.Services;
using TasksTrack.Models;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;

namespace TasksTrack.Tests.Controllers
{
    public class CategoryControllerTests
    {
        private readonly Mock<ICategoryService> _mockService;
        private readonly Mock<ICurrentUserService> _mockCurrentUserService;
        private readonly CategoryController _controller;

        public CategoryControllerTests()
        {
            _mockService = new Mock<ICategoryService>();
            _mockCurrentUserService = new Mock<ICurrentUserService>();

            // Mock the GetUserId method to return test user ID
            _mockCurrentUserService.Setup(x => x.GetUserId()).Returns("test-user-id");

            _controller = new CategoryController(_mockService.Object, _mockCurrentUserService.Object);
        }

        [Fact]
        public async Task GetAll_ReturnsListOfCategories()
        {
            // Arrange
            var categories = new List<Category>
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
                    CreatedBy = "system"
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
                    CreatedBy = "system"
                }
            };

            _mockService.Setup(service => service.GetAllAsync()).ReturnsAsync(categories);

            // Act
            var result = await _controller.GetAll();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedCategories = Assert.IsAssignableFrom<IEnumerable<Category>>(okResult.Value);
            Assert.Equal(2, ((List<Category>)returnedCategories).Count);
        }

        [Fact]
        public async Task GetActive_ReturnsActiveCategories()
        {
            // Arrange
            var activeCategories = new List<Category>
            {
                new Category
                {
                    Id = 1,
                    Name = "Health",
                    IsActive = true,
                    CreatedDate = DateTimeOffset.UtcNow,
                    CreatedBy = "system"
                }
            };

            _mockService.Setup(service => service.GetActiveAsync()).ReturnsAsync(activeCategories);

            // Act
            var result = await _controller.GetActive();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedCategories = Assert.IsAssignableFrom<IEnumerable<Category>>(okResult.Value);
            Assert.Single((List<Category>)returnedCategories);
        }

        [Fact]
        public async Task GetById_WithValidId_ReturnsCategory()
        {
            // Arrange
            var categoryId = 1;
            var category = new Category
            {
                Id = categoryId,
                Name = "Health",
                IsActive = true,
                CreatedDate = DateTimeOffset.UtcNow,
                CreatedBy = "system"
            };

            _mockService.Setup(service => service.GetByIdAsync(categoryId)).ReturnsAsync(category);

            // Act
            var result = await _controller.GetById(categoryId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedCategory = Assert.IsType<Category>(okResult.Value);
            Assert.Equal(categoryId, returnedCategory.Id);
            Assert.Equal("Health", returnedCategory.Name);
        }

        [Fact]
        public async Task GetById_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var categoryId = 999;
            _mockService.Setup(service => service.GetByIdAsync(categoryId)).ReturnsAsync((Category?)null);

            // Act
            var result = await _controller.GetById(categoryId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Contains("not found", notFoundResult.Value?.ToString());
        }

        [Fact]
        public async Task Create_WithValidCategory_ReturnsCreatedResult()
        {
            // Arrange
            var category = new Category
            {
                Name = "New Category",
                Description = "A new test category",
                Color = "#ff0000",
                Icon = "Star",
                CreatedBy = "test-user-id"
            };

            _mockService.Setup(service => service.AddAsync(It.IsAny<Category>())).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Create(category);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedCategory = Assert.IsType<Category>(createdResult.Value);
            Assert.Equal("New Category", returnedCategory.Name);
            Assert.Equal("test-user-id", returnedCategory.CreatedBy);
        }

        [Fact]
        public async Task Create_WithDuplicateName_ReturnsBadRequest()
        {
            // Arrange
            var category = new Category
            {
                Name = "Existing Category",
                CreatedBy = "test-user-id"
            };

            _mockService.Setup(service => service.AddAsync(It.IsAny<Category>()))
                .ThrowsAsync(new InvalidOperationException("Category with name 'Existing Category' already exists."));

            // Act
            var result = await _controller.Create(category);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Contains("already exists", badRequestResult.Value?.ToString());
        }

        [Fact]
        public async Task Update_WithValidCategory_ReturnsNoContent()
        {
            // Arrange
            var categoryId = 1;
            var category = new Category
            {
                Id = categoryId,
                Name = "Updated Category",
                Description = "Updated description",
                CreatedBy = "test-user-id"
            };

            _mockService.Setup(service => service.UpdateAsync(It.IsAny<Category>())).ReturnsAsync(true);

            // Act
            var result = await _controller.Update(categoryId, category);

            // Assert
            Assert.IsType<NoContentResult>(result);
            _mockService.Verify(service => service.UpdateAsync(It.Is<Category>(c => c.UpdatedBy == "test-user-id")), Times.Once);
        }

        [Fact]
        public async Task Update_WithIdMismatch_ReturnsBadRequest()
        {
            // Arrange
            var categoryId = 1;
            var category = new Category
            {
                Id = 2, // Different ID
                Name = "Updated Category",
                CreatedBy = "test-user-id"
            };

            // Act
            var result = await _controller.Update(categoryId, category);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Contains("mismatch", badRequestResult.Value?.ToString());
        }

        [Fact]
        public async Task Update_WithNonexistentCategory_ReturnsNotFound()
        {
            // Arrange
            var categoryId = 999;
            var category = new Category
            {
                Id = categoryId,
                Name = "Nonexistent Category",
                CreatedBy = "test-user-id"
            };

            _mockService.Setup(service => service.UpdateAsync(It.IsAny<Category>())).ReturnsAsync(false);

            // Act
            var result = await _controller.Update(categoryId, category);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Contains("not found", notFoundResult.Value?.ToString());
        }

        [Fact]
        public async Task Delete_WithValidId_ReturnsNoContent()
        {
            // Arrange
            var categoryId = 1;
            var category = new Category
            {
                Id = categoryId,
                Name = "Category to Delete",
                CreatedBy = "test-user-id"
            };

            _mockService.Setup(service => service.GetByIdAsync(categoryId)).ReturnsAsync(category);
            _mockService.Setup(service => service.DeleteAsync(categoryId)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Delete(categoryId);

            // Assert
            Assert.IsType<NoContentResult>(result);
            _mockService.Verify(service => service.DeleteAsync(categoryId), Times.Once);
        }

        [Fact]
        public async Task Archive_WithValidId_ReturnsNoContent()
        {
            // Arrange
            var categoryId = 1;
            var category = new Category
            {
                Id = categoryId,
                Name = "Category to Archive",
                CreatedBy = "test-user-id"
            };

            _mockService.Setup(service => service.GetByIdAsync(categoryId)).ReturnsAsync(category);
            _mockService.Setup(service => service.ArchiveAsync(categoryId, "test-user-id")).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Archive(categoryId);

            // Assert
            Assert.IsType<NoContentResult>(result);
            _mockService.Verify(service => service.ArchiveAsync(categoryId, "test-user-id"), Times.Once);
        }
    }
}