using Microsoft.Extensions.DependencyInjection;
using TasksTrack.Services;
using TasksTrack.Repositories;
using Microsoft.EntityFrameworkCore;

public static class DependencyInjectionSetup
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, WebApplicationBuilder builder)
    {
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IToDoTaskService, ToDoTaskService>();
        services.AddScoped<IToDoTaskRepository, ToDoTaskRepository>();

        // Add DbContext
        services.AddDbContext<TasksTrackContext>(options =>
            options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

        return services;
    }
}