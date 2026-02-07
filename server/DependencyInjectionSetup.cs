using Microsoft.Extensions.DependencyInjection;
using TasksTrack.Services;
using TasksTrack.Repositories;
using Microsoft.EntityFrameworkCore;

public static class DependencyInjectionSetup
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, WebApplicationBuilder builder)
    {
        // User context service
        services.AddScoped<ICurrentUserService, CurrentUserService>();

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

        // Activity services
        services.AddScoped<IActivityService, ActivityService>();

        // Analytics services
        services.AddScoped<IAnalyticsService, AnalyticsService>();

        // Category services
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();

        // CategoryGoal services
        services.AddScoped<ICategoryGoalService, CategoryGoalService>();
        services.AddScoped<ICategoryGoalRepository, CategoryGoalRepository>();

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAuthRepository, AuthRepository>();

        return services;
    }
}