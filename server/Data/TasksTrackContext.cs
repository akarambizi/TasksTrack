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
        public DbSet<ToDoTask> Tasks { get; set; }
    }
}