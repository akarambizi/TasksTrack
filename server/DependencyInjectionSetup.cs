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

        // Habit services
        services.AddScoped<IHabitService, HabitService>();
        services.AddScoped<IHabitRepository, HabitRepository>();

        // HabitLog services
        services.AddScoped<IHabitLogService, HabitLogService>();
        services.AddScoped<IHabitLogRepository, HabitLogRepository>();

        // FocusSession services
        services.AddScoped<IFocusSessionService, FocusSessionService>();
        services.AddScoped<IFocusSessionRepository, FocusSessionRepository>();

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAuthRepository, AuthRepository>();

        return services;
    }
}