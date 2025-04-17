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

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAuthRepository, AuthRepository>();

        return services;
    }
}