using Moq;
using Xunit;
using TasksTrack.Models;
using TasksTrack.Services;
using TasksTrack.Repositories;
using System.Collections.Generic;
using System.Linq;
using System;

namespace TasksTrack.Tests.Services
{
    public class HabitServiceTests
    {
        private readonly Mock<IHabitRepository> _repositoryMock;
        private readonly Mock<ICurrentUserService> _currentUserServiceMock;
        private readonly HabitService _service;

        public HabitServiceTests()
        {
            _repositoryMock = new Mock<IHabitRepository>();
            _currentUserServiceMock = new Mock<ICurrentUserService>();            _currentUserServiceMock.Setup(s => s.GetUserId()).Returns("test-user-123");            _service = new HabitService(_repositoryMock.Object, _currentUserServiceMock.Object);
        }

        [Fact]
        public async Task GetAll_ShouldReturnAllHabits()
        {
            // Arrange
            var expectedHabits = new List<Habit>
            {
                new Habit
                {
                    Id = 1,
                    Name = "Morning Exercise",
                    MetricType = "minutes",
                    Unit = "min",
                    Target = 30,
                    TargetFrequency = "daily",
                    Category = "Health",
                    IsActive = true,
                    CreatedDate = new DateTime(2024, 1, 1),
                    CreatedBy = "Test User"
                },
                new Habit
                {
                    Id = 2,
                    Name = "Reading Books",
                    MetricType = "pages",
                    Unit = "pages",
                    Target = 10,
                    TargetFrequency = "daily",
                    Category = "Learning",
                    IsActive = true,
                    CreatedDate = new DateTime(2024, 1, 1),
                    CreatedBy = "Test User"
                }
            };

            _repositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(expectedHabits);

            // Act
            var habits = await _service.GetAllAsync();

            // Assert
            Assert.Equal(2, habits.Count());
            Assert.Contains(habits, habit => habit.Id == 1);
            Assert.Contains(habits, habit => habit.Id == 2);
        }

        [Fact]
        public async Task GetById_ShouldReturnHabit()
        {
            // Arrange
            var expectedHabit = new Habit
            {
                Id = 1,
                Name = "Morning Exercise",
                MetricType = "minutes",
                Unit = "min",
                Target = 30,
                TargetFrequency = "daily",
                Category = "Health",
                IsActive = true,
                CreatedDate = new DateTime(2024, 1, 1),
                CreatedBy = "Test User"
            };

            _repositoryMock.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(expectedHabit);

            // Act
            var habit = await _service.GetByIdAsync(1);

            // Assert
            Assert.NotNull(habit);
            Assert.Equal(expectedHabit.Id, habit.Id);
            Assert.Equal(expectedHabit.Name, habit.Name);
            Assert.Equal(expectedHabit.MetricType, habit.MetricType);
        }

        [Fact]
        public async Task AddAsync_ShouldSetCreatedDate()
        {
            // Arrange
            var habit = new Habit
            {
                Name = "New Habit",
                MetricType = "minutes",
                CreatedBy = "Test User"
            };

            // Act
            await _service.AddAsync(habit);

            // Assert
            Assert.NotEqual(DateTime.MinValue, habit.CreatedDate);
            _repositoryMock.Verify(repo => repo.AddAsync(habit), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_ShouldReturnTrue_WhenHabitExists()
        {
            // Arrange
            var existingHabit = new Habit
            {
                Id = 1,
                Name = "Old Name",
                MetricType = "minutes",
                CreatedBy = "Test User"
            };

            var updatedHabit = new Habit
            {
                Id = 1,
                Name = "New Name",
                MetricType = "pages",
                Unit = "pages",
                Target = 20,
                Category = "Learning",
                CreatedBy = "Test User"
            };

            _repositoryMock.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(existingHabit);

            // Act
            var result = await _service.UpdateAsync(updatedHabit);

            // Assert
            Assert.True(result);
            Assert.Equal("New Name", existingHabit.Name);
            Assert.Equal("pages", existingHabit.MetricType);
            Assert.Equal("pages", existingHabit.Unit);
            Assert.Equal(20, existingHabit.Target);
            Assert.Equal("Learning", existingHabit.Category);
            _repositoryMock.Verify(repo => repo.UpdateAsync(existingHabit), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_ShouldReturnFalse_WhenHabitDoesNotExist()
        {
            // Arrange
            var updatedHabit = new Habit
            {
                Id = 1,
                Name = "New Name",
                MetricType = "pages",
                CreatedBy = "Test User"
            };

            _repositoryMock.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync((Habit?)null);

            // Act
            var result = await _service.UpdateAsync(updatedHabit);

            // Assert
            Assert.False(result);
            _repositoryMock.Verify(repo => repo.UpdateAsync(It.IsAny<Habit>()), Times.Never);
        }

        [Fact]
        public async Task DeleteAsync_ShouldCallRepository()
        {
            // Arrange
            int habitId = 1;

            // Act
            await _service.DeleteAsync(habitId);

            // Assert
            _repositoryMock.Verify(repo => repo.DeleteAsync(habitId), Times.Once);
        }

        [Fact]
        public async Task GetActiveAsync_ShouldReturnActiveHabits()
        {
            // Arrange
            var activeHabits = new List<Habit>
            {
                new Habit
                {
                    Id = 1,
                    Name = "Active Habit",
                    MetricType = "minutes",
                    IsActive = true,
                    CreatedBy = "Test User"
                }
            };

            _repositoryMock.Setup(repo => repo.GetActiveAsync()).ReturnsAsync(activeHabits);

            // Act
            var habits = await _service.GetActiveAsync();

            // Assert
            Assert.Single(habits);
            Assert.True(habits.First().IsActive);
        }

        [Fact]
        public async Task ArchiveAsync_ShouldSetIsActiveToFalse()
        {
            // Arrange
            var habit = new Habit
            {
                Id = 1,
                Name = "Test Habit",
                MetricType = "minutes",
                IsActive = true,
                CreatedBy = "Test User"
            };

            _repositoryMock.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(habit);

            // Act
            await _service.ArchiveAsync(1);

            // Assert
            Assert.False(habit.IsActive);
            Assert.NotNull(habit.UpdatedDate);
            _repositoryMock.Verify(repo => repo.UpdateAsync(habit), Times.Once);
        }

        [Fact]
        public async Task ActivateAsync_ShouldSetIsActiveToTrue()
        {
            // Arrange
            var habit = new Habit
            {
                Id = 1,
                Name = "Test Habit",
                MetricType = "minutes",
                IsActive = false,
                CreatedBy = "Test User"
            };

            _repositoryMock.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(habit);

            // Act
            await _service.ActivateAsync(1);

            // Assert
            Assert.True(habit.IsActive);
            Assert.NotNull(habit.UpdatedDate);
            _repositoryMock.Verify(repo => repo.UpdateAsync(habit), Times.Once);
        }
    }
}