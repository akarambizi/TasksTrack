using Microsoft.EntityFrameworkCore;
using TasksTrack.Models;
using TasksTrack.Services;

namespace TasksTrack.Data
{
    public class TasksTrackContext : DbContext
    {
        private readonly ICurrentUserService? _currentUserService;

        public TasksTrackContext(DbContextOptions<TasksTrackContext> options)
            : base(options)
        {
        }

        public TasksTrackContext(DbContextOptions<TasksTrackContext> options,
                               ICurrentUserService currentUserService)
            : base(options)
        {
            _currentUserService = currentUserService;
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Habit> Habits { get; set; }
        public DbSet<HabitLog> HabitLogs { get; set; }
        public DbSet<FocusSession> FocusSessions { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<CategoryGoal> CategoryGoals { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Global Query Filters for automatic user scoping
            // These filters are evaluated dynamically at query time, not at model creation time
            // When _currentUserService is null (migrations/tests) or user not authenticated, no filtering is applied

            modelBuilder.Entity<Habit>()
                .HasQueryFilter(h => _currentUserService == null || _currentUserService.GetUserIdOrNull() == null || h.CreatedBy == _currentUserService.GetUserIdOrNull());

            modelBuilder.Entity<HabitLog>()
                .HasQueryFilter(hl => _currentUserService == null || _currentUserService.GetUserIdOrNull() == null || hl.CreatedBy == _currentUserService.GetUserIdOrNull());

            modelBuilder.Entity<FocusSession>()
                .HasQueryFilter(fs => _currentUserService == null || _currentUserService.GetUserIdOrNull() == null || fs.CreatedBy == _currentUserService.GetUserIdOrNull());

            modelBuilder.Entity<Category>()
                .HasQueryFilter(c => _currentUserService == null || _currentUserService.GetUserIdOrNull() == null || c.CreatedBy == _currentUserService.GetUserIdOrNull());

            modelBuilder.Entity<CategoryGoal>()
                .HasQueryFilter(cg => _currentUserService == null || _currentUserService.GetUserIdOrNull() == null || cg.UserId == _currentUserService.GetUserIdOrNull());
            // If _currentUserService is null, no query filters are applied (migration/test scenario)
        }
    }
}