using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace TasksTrack.Data
{
    /// <summary>
    /// Factory for creating TasksTrackContext during design-time operations (migrations, scaffolding)
    /// This uses the constructor without ICurrentUserService to avoid user authentication issues during migrations
    /// </summary>
    public class TasksTrackContextFactory : IDesignTimeDbContextFactory<TasksTrackContext>
    {
        public TasksTrackContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<TasksTrackContext>();
            
            // Load configuration
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .AddJsonFile("appsettings.Development.json", optional: true)
                .AddEnvironmentVariables()
                .Build();

            // Use the configured connection string
            var connectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? "Server=localhost;Port=5433;Database=taskstrackdb;User Id=postgres;Password=postgres;";

            optionsBuilder.UseNpgsql(connectionString);

            // Use the constructor without ICurrentUserService for migrations
            return new TasksTrackContext(optionsBuilder.Options);
        }
    }
}