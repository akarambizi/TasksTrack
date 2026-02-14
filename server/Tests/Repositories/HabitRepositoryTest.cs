using Xunit;
using Microsoft.EntityFrameworkCore;
using TasksTrack.Data;
using TasksTrack.Models;
using TasksTrack.Repositories;
using TasksTrack.Services;
using System.Threading.Tasks;
using System.Linq;
using Moq;

namespace TasksTrack.Tests.Repositories
{
    public class HabitRepositoryTest : IDisposable
    {
        private readonly TasksTrackContext _context;
        private readonly HabitRepository _repository;
        private readonly Mock<ICurrentUserService> _mockCurrentUserService;

        public HabitRepositoryTest()
        {
            var options = new DbContextOptionsBuilder<TasksTrackContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;

            _mockCurrentUserService = new Mock<ICurrentUserService>();
            _mockCurrentUserService.Setup(s => s.GetUserIdOrNull()).Returns("testuser");

            _context = new TasksTrackContext(options, _mockCurrentUserService.Object);
            _repository = new HabitRepository(_context);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllHabits()
        {
            // Arrange
            var habit1 = new Habit
            {
                Name = "Exercise",
                MetricType = "minutes",
                Target = 30,
                IsActive = true,
                CreatedDate = DateTime.Now,
                CreatedBy = "testuser"
            };

            var habit2 = new Habit
            {
                Name = "Reading",
                MetricType = "pages",
                Target = 10,
                IsActive = true,
                CreatedDate = DateTime.Now,
                CreatedBy = "testuser"
            };

            _context.Habits.AddRange(habit1, habit2);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.Contains(result, h => h.Name == "Exercise");
            Assert.Contains(result, h => h.Name == "Reading");
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnHabit_WhenHabitExists()
        {
            // Arrange
            var habit = new Habit
            {
                Name = "Meditation",
                MetricType = "minutes",
                Target = 15,
                IsActive = true,
                CreatedDate = DateTime.Now,
                CreatedBy = "testuser"
            };

            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetByIdAsync(habit.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Meditation", result.Name);
            Assert.Equal(15, result.Target);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnNull_WhenHabitDoesNotExist()
        {
            // Act
            var result = await _repository.GetByIdAsync(999);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task AddAsync_ShouldCreateHabit_WhenHabitIsValid()
        {
            // Arrange
            var habit = new Habit
            {
                Name = "New Habit",
                MetricType = "count",
                Target = 5,
                IsActive = true,
                CreatedDate = DateTime.Now,
                CreatedBy = "testuser"
            };

            // Act
            await _repository.AddAsync(habit);

            // Assert
            Assert.True(habit.Id > 0);
            Assert.Equal("New Habit", habit.Name);

            // Verify habit was saved to database
            var savedHabit = await _context.Habits.FindAsync(habit.Id);
            Assert.NotNull(savedHabit);
            Assert.Equal("New Habit", savedHabit.Name);
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateHabit_WhenHabitExists()
        {
            // Arrange
            var habit = new Habit
            {
                Name = "Original Name",
                MetricType = "minutes",
                Target = 20,
                IsActive = true,
                CreatedDate = DateTime.Now,
                CreatedBy = "testuser"
            };

            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();

            // Modify habit
            habit.Name = "Updated Name";
            habit.Target = 30;

            // Act
            await _repository.UpdateAsync(habit);

            // Assert
            // Verify changes were saved to database
            var updatedHabit = await _context.Habits.FindAsync(habit.Id);
            Assert.NotNull(updatedHabit);
            Assert.Equal("Updated Name", updatedHabit.Name);
            Assert.Equal(30, updatedHabit.Target);
        }

        [Fact]
        public async Task DeleteAsync_ShouldDeleteHabit_WhenHabitExists()
        {
            // Arrange
            var habit = new Habit
            {
                Name = "To Delete",
                MetricType = "minutes",
                Target = 25,
                IsActive = true,
                CreatedDate = DateTime.Now,
                CreatedBy = "testuser"
            };

            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();
            var habitId = habit.Id;

            // Act
            await _repository.DeleteAsync(habitId);

            // Assert
            // Verify habit was removed from database
            var deletedHabit = await _context.Habits.FindAsync(habitId);
            Assert.Null(deletedHabit);
        }

        [Fact]
        public async Task GetActiveAsync_ShouldReturnOnlyActiveHabits()
        {
            // Arrange
            var activeHabit = new Habit
            {
                Name = "Exercise",
                MetricType = "minutes",
                Target = 30,
                IsActive = true,
                CreatedDate = DateTime.Now,
                CreatedBy = "testuser"
            };

            var inactiveHabit = new Habit
            {
                Name = "Reading",
                MetricType = "pages",
                Target = 10,
                IsActive = false,
                CreatedDate = DateTime.Now,
                CreatedBy = "testuser"
            };

            _context.Habits.AddRange(activeHabit, inactiveHabit);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetActiveAsync();

            // Assert
            Assert.Single(result);
            Assert.Equal("Exercise", result.First().Name);
            Assert.True(result.First().IsActive);
        }

        [Fact]
        public async Task GetByCategoryAsync_ShouldReturnHabitsInCategory()
        {
            // Arrange
            var fitnessHabit = new Habit
            {
                Name = "Exercise",
                MetricType = "minutes",
                Target = 30,
                IsActive = true,
                Category = "Fitness",
                CreatedDate = DateTime.Now,
                CreatedBy = "testuser"
            };

            var educationHabit = new Habit
            {
                Name = "Reading",
                MetricType = "pages",
                Target = 10,
                IsActive = true,
                Category = "Education",
                CreatedDate = DateTime.Now,
                CreatedBy = "testuser"
            };

            var inactiveFitnessHabit = new Habit
            {
                Name = "Yoga",
                MetricType = "minutes",
                Target = 20,
                IsActive = false,
                Category = "Fitness",
                CreatedDate = DateTime.Now,
                CreatedBy = "testuser"
            };

            _context.Habits.AddRange(fitnessHabit, educationHabit, inactiveFitnessHabit);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetByCategoryAsync("Fitness");

            // Assert
            Assert.Single(result);
            Assert.Equal("Exercise", result.First().Name);
            Assert.Equal("Fitness", result.First().Category);
            Assert.True(result.First().IsActive);
        }

        [Fact]
        public async Task GetByCategoryAsync_ShouldReturnEmpty_WhenNoCategoryMatch()
        {
            // Arrange
            var habit = new Habit
            {
                Name = "Exercise",
                MetricType = "minutes",
                Target = 30,
                IsActive = true,
                Category = "Fitness",
                CreatedDate = DateTime.Now,
                CreatedBy = "testuser"
            };

            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetByCategoryAsync("NonExistentCategory");

            // Assert
            Assert.Empty(result);
        }

        [Fact]
        public async Task DeleteAsync_ShouldDoNothing_WhenHabitDoesNotExist()
        {
            // Arrange
            var habit = new Habit
            {
                Name = "Exercise",
                MetricType = "minutes",
                Target = 30,
                IsActive = true,
                CreatedDate = DateTime.Now,
                CreatedBy = "testuser"
            };

            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();
            var habitId = habit.Id;

            // Act
            await _repository.DeleteAsync(999); // Non-existent ID

            // Assert
            var habitStillExists = await _context.Habits.FindAsync(habitId);
            Assert.NotNull(habitStillExists); // Original habit should still exist
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}