using Microsoft.EntityFrameworkCore;
using TasksTrack.Models;

namespace TasksTrack.Data
{
    public class TasksTrackContext : DbContext
    {
        public TasksTrackContext(DbContextOptions<TasksTrackContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Habit> Habits { get; set; }
        public DbSet<HabitLog> HabitLogs { get; set; }
        public DbSet<FocusSession> FocusSessions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // All date/time properties now use DateTimeOffset which handles timezones properly
            // No additional configuration needed for PostgreSQL timestamp with time zone
        }
    }
}