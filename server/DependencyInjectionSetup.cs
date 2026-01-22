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
        
        // Legacy Task services (keep for backward compatibility)
        services.AddScoped<IToDoTaskService, ToDoTaskService>();
        services.AddScoped<IToDoTaskRepository, ToDoTaskRepository>();
        
        // New Habit services
        services.AddScoped<IHabitService, HabitService>();
        services.AddScoped<IHabitRepository, HabitRepository>();

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAuthRepository, AuthRepository>();

        return services;
    }
}