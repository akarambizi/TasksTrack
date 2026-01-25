using Microsoft.EntityFrameworkCore;
using Xunit;
using TasksTrack.Data;
using TasksTrack.Models;

namespace TasksTrack.Tests.Data
{
    public class TasksTrackContextTest : IDisposable
    {
        private readonly TasksTrackContext _context;

        public TasksTrackContextTest()
        {
            var options = new DbContextOptionsBuilder<TasksTrackContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new TasksTrackContext(options);
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        [Fact]
        public void Context_ShouldInitialize_WithCorrectTables()
        {
            // Arrange & Act
            var hasUsers = _context.Users != null;
            var hasHabits = _context.Habits != null;
            var hasHabitLogs = _context.HabitLogs != null;

            // Assert
            Assert.True(hasUsers);
            Assert.True(hasHabits);
            Assert.True(hasHabitLogs);
        }

        [Fact]
        public async Task Context_ShouldAdd_User()
        {
            // Arrange
            var user = new User
            {
                Email = "test@example.com",
                Username = "testuser",
                PasswordHash = "hashedpassword"
            };

            // Act
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Assert
            var savedUser = await _context.Users.FirstOrDefaultAsync();
            Assert.NotNull(savedUser);
            Assert.Equal("test@example.com", savedUser.Email);
        }

        [Fact]
        public async Task Context_ShouldAdd_Habit()
        {
            // Arrange
            var habit = new Habit
            {
                Name = "Exercise",
                Description = "Daily workout",
                MetricType = "minutes",
                CreatedBy = "testuser"
            };

            // Act
            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();

            // Assert
            var savedHabit = await _context.Habits.FirstOrDefaultAsync();
            Assert.NotNull(savedHabit);
            Assert.Equal("Exercise", savedHabit.Name);
        }

        [Fact]
        public async Task Context_ShouldAdd_HabitLog()
        {
            // Arrange
            var habit = new Habit
            {
                Name = "Exercise",
                MetricType = "minutes",
                CreatedBy = "testuser"
            };
            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();

            var habitLog = new HabitLog
            {
                HabitId = habit.Id,
                Value = 30,
                Date = DateOnly.FromDateTime(DateTime.Today),
                CreatedBy = "testuser"
            };

            // Act
            _context.HabitLogs.Add(habitLog);
            await _context.SaveChangesAsync();

            // Assert
            var savedHabitLog = await _context.HabitLogs.FirstOrDefaultAsync();
            Assert.NotNull(savedHabitLog);
            Assert.Equal(habit.Id, savedHabitLog.HabitId);
            Assert.Equal(30, savedHabitLog.Value);
        }

        [Fact]
        public async Task Context_ShouldUpdate_User()
        {
            // Arrange
            var user = new User
            {
                Email = "test@example.com",
                Username = "testuser",
                PasswordHash = "hashedpassword"
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Act
            user.Username = "updateduser";
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            // Assert
            var updatedUser = await _context.Users.FirstOrDefaultAsync();
            Assert.NotNull(updatedUser);
            Assert.Equal("updateduser", updatedUser.Username);
        }

        [Fact]
        public async Task Context_ShouldDelete_User()
        {
            // Arrange
            var user = new User
            {
                Email = "test@example.com",
                Username = "testuser",
                PasswordHash = "hashedpassword"
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Act
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            // Assert
            var deletedUser = await _context.Users.FirstOrDefaultAsync();
            Assert.Null(deletedUser);
        }

        [Fact]
        public async Task Context_ShouldQuery_RelatedData()
        {
            // Arrange
            var habit = new Habit
            {
                Name = "Exercise",
                MetricType = "minutes",
                CreatedBy = "testuser"
            };
            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();

            var habitLog = new HabitLog
            {
                HabitId = habit.Id,
                Value = 30,
                Date = DateOnly.FromDateTime(DateTime.Today),
                CreatedBy = "testuser"
            };
            _context.HabitLogs.Add(habitLog);
            await _context.SaveChangesAsync();

            // Act
            var habitCount = await _context.Habits.CountAsync();
            var habitLogCount = await _context.HabitLogs.CountAsync();

            // Assert
            Assert.Equal(1, habitCount);
            Assert.Equal(1, habitLogCount);
        }

        [Fact]
        public async Task Context_ShouldHandleMultiple_Operations()
        {
            // Arrange
            var user = new User
            {
                Email = "test@example.com",
                Username = "testuser",
                PasswordHash = "hashedpassword"
            };
            var habit = new Habit
            {
                Name = "Exercise",
                MetricType = "minutes",
                CreatedBy = "testuser"
            };

            // Act
            _context.Users.Add(user);
            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();

            // Assert
            var userCount = await _context.Users.CountAsync();
            var habitCount = await _context.Habits.CountAsync();
            Assert.Equal(1, userCount);
            Assert.Equal(1, habitCount);
        }
    }
}