using Xunit;
using Microsoft.EntityFrameworkCore;
using TasksTrack.Data;
using TasksTrack.Models;
using TasksTrack.Repositories;
using System.Threading.Tasks;
using System.Linq;

namespace TasksTrack.Tests.Repositories
{
    public class HabitLogRepositoryTest : IDisposable
    {
        private readonly TasksTrackContext _context;
        private readonly HabitLogRepository _repository;

        public HabitLogRepositoryTest()
        {
            var options = new DbContextOptionsBuilder<TasksTrackContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;

            _context = new TasksTrackContext(options);
            _repository = new HabitLogRepository(_context);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllHabitLogs()
        {
            // Arrange
            var habit = new Habit
            {
                Name = "Test Habit",
                MetricType = "minutes",
                Target = 30,
                CreatedBy = "testuser"
            };

            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();

            var log1 = new HabitLog
            {
                HabitId = habit.Id,
                Value = 30,
                Date = DateOnly.FromDateTime(DateTime.Today),
                CreatedBy = "testuser"
            };

            var log2 = new HabitLog
            {
                HabitId = habit.Id,
                Value = 45,
                Date = DateOnly.FromDateTime(DateTime.Today.AddDays(-1)),
                CreatedBy = "testuser"
            };

            _context.HabitLogs.AddRange(log1, log2);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnHabitLog_WhenLogExists()
        {
            // Arrange
            var habit = new Habit
            {
                Name = "Test Habit",
                MetricType = "minutes",
                Target = 30,
                CreatedBy = "testuser"
            };

            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();

            var log = new HabitLog
            {
                HabitId = habit.Id,
                Value = 30,
                Date = DateOnly.FromDateTime(DateTime.Today),
                Notes = "Good session",
                CreatedBy = "testuser"
            };

            _context.HabitLogs.Add(log);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetByIdAsync(log.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(30, result.Value);
            Assert.Equal("Good session", result.Notes);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnNull_WhenLogDoesNotExist()
        {
            // Act
            var result = await _repository.GetByIdAsync(999);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task AddAsync_ShouldCreateHabitLog_WhenLogIsValid()
        {
            // Arrange
            var habit = new Habit
            {
                Name = "Test Habit",
                MetricType = "minutes",
                Target = 30,
                CreatedBy = "testuser"
            };

            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();

            var log = new HabitLog
            {
                HabitId = habit.Id,
                Value = 25,
                Date = DateOnly.FromDateTime(DateTime.Today),
                Notes = "Great workout",
                CreatedBy = "testuser"
            };

            // Act
            await _repository.AddAsync(log);

            // Assert
            Assert.True(log.Id > 0);
            Assert.Equal(25, log.Value);

            // Verify log was saved to database
            var savedLog = await _context.HabitLogs.FindAsync(log.Id);
            Assert.NotNull(savedLog);
            Assert.Equal("Great workout", savedLog.Notes);
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateHabitLog_WhenLogExists()
        {
            // Arrange
            var habit = new Habit
            {
                Name = "Test Habit",
                MetricType = "minutes",
                Target = 30,
                CreatedBy = "testuser"
            };

            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();

            var log = new HabitLog
            {
                HabitId = habit.Id,
                Value = 20,
                Date = DateOnly.FromDateTime(DateTime.Today),
                Notes = "Original notes",
                CreatedBy = "testuser"
            };

            _context.HabitLogs.Add(log);
            await _context.SaveChangesAsync();

            // Modify log
            log.Value = 35;
            log.Notes = "Updated notes";

            // Act
            await _repository.UpdateAsync(log);

            // Assert
            // Verify changes were saved to database
            var updatedLog = await _context.HabitLogs.FindAsync(log.Id);
            Assert.NotNull(updatedLog);
            Assert.Equal(35, updatedLog.Value);
            Assert.Equal("Updated notes", updatedLog.Notes);
        }

        [Fact]
        public async Task DeleteAsync_ShouldDeleteHabitLog_WhenLogExists()
        {
            // Arrange
            var habit = new Habit
            {
                Name = "Test Habit",
                MetricType = "minutes",
                Target = 30,
                CreatedBy = "testuser"
            };

            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();

            var log = new HabitLog
            {
                HabitId = habit.Id,
                Value = 30,
                Date = DateOnly.FromDateTime(DateTime.Today),
                CreatedBy = "testuser"
            };

            _context.HabitLogs.Add(log);
            await _context.SaveChangesAsync();
            var logId = log.Id;

            // Act
            await _repository.DeleteAsync(logId);

            // Assert
            // Verify log was removed from database
            var deletedLog = await _context.HabitLogs.FindAsync(logId);
            Assert.Null(deletedLog);
        }

        [Fact]
        public async Task GetByHabitIdAsync_ShouldReturnLogsForHabit()
        {
            // Arrange
            var habit = new Habit
            {
                Name = "Test Habit",
                MetricType = "minutes",
                Target = 30,
                CreatedBy = "testuser"
            };

            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();

            var log1 = new HabitLog
            {
                HabitId = habit.Id,
                Value = 30,
                Date = DateOnly.FromDateTime(DateTime.Today),
                CreatedBy = "testuser"
            };

            var log2 = new HabitLog
            {
                HabitId = habit.Id,
                Value = 45,
                Date = DateOnly.FromDateTime(DateTime.Today.AddDays(-1)),
                CreatedBy = "testuser"
            };

            _context.HabitLogs.AddRange(log1, log2);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetByHabitIdAsync(habit.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.All(result, log => Assert.Equal(habit.Id, log.HabitId));
        }

        [Fact]
        public async Task GetByDateAsync_ShouldReturnLogsForDate()
        {
            // Arrange
            var habit = new Habit
            {
                Name = "Test Habit",
                MetricType = "minutes",
                Target = 30,
                CreatedBy = "testuser"
            };

            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();

            var today = DateOnly.FromDateTime(DateTime.Today);
            var yesterday = DateOnly.FromDateTime(DateTime.Today.AddDays(-1));

            var log1 = new HabitLog
            {
                HabitId = habit.Id,
                Value = 30,
                Date = today,
                CreatedBy = "testuser"
            };

            var log2 = new HabitLog
            {
                HabitId = habit.Id,
                Value = 45,
                Date = yesterday,
                CreatedBy = "testuser"
            };

            _context.HabitLogs.AddRange(log1, log2);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetByDateAsync(today);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(today, result.First().Date);
            Assert.Equal(30, result.First().Value);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}