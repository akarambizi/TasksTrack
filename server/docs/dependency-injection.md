# Dependency Injection in TasksTrack

## Overview

Dependency Injection (DI) is a design pattern that implements Inversion of Control (IoC) for resolving dependencies.
This document explains how DI is implemented in TasksTrack and why it's crucial for maintainable, testable applications.

## What is Dependency Injection?

Dependency Injection is a technique where objects receive their dependencies from an external source rather than
creating them internally. Instead of a class creating its dependencies, the dependencies are "injected" into the class.

## DI Container in ASP.NET Core

ASP.NET Core has a built-in DI container that manages object creation and lifetime.
The container is configured in `Program.cs` and `DependencyInjectionSetup.cs`.

## Implementation in TasksTrack

### 1. DI Configuration

Located in `DependencyInjectionSetup.cs`:

```csharp
public static class DependencyInjectionSetup
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        WebApplicationBuilder builder)
    {
        // Service registrations
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IToDoTaskService, ToDoTaskService>();
        services.AddScoped<IToDoTaskRepository, ToDoTaskRepository>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAuthRepository, AuthRepository>();

        return services;
    }
}
```

**Key Patterns:**

- **Interface → Implementation**: Always register interface with its implementation
- **Scoped Lifetime**: Services are created once per HTTP request
- **Extension Method**: Clean separation of DI configuration

### 2. Service Registration in Program.cs

```csharp
var builder = WebApplication.CreateBuilder(args);

// Database context registration
builder.Services.AddDbContext<TasksTrackContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Application services registration
builder.Services.AddApplicationServices(builder);
```

### 3. Constructor Injection Pattern

All classes receive dependencies through constructor injection:

```csharp
// AuthController.cs
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }
    // Methods use _authService
}

// AuthService.cs
public class AuthService : IAuthService
{
    private readonly IAuthRepository _authRepository;

    public AuthService(IAuthRepository authRepository)
    {
        _authRepository = authRepository;
    }
    // Methods use _authRepository
}
```

## Service Lifetimes

### 1. Scoped (Used in TasksTrack)

**When**: Once per HTTP request

```csharp
services.AddScoped<IAuthService, AuthService>();
```

**Characteristics:**

- New instance created for each HTTP request
- Same instance shared within the request
- Disposed at end of request
- **Best for**: Services that work with database contexts

### 2. Transient

**When**: New instance every time requested

```csharp
services.AddTransient<IEmailService, EmailService>();
```

**Characteristics:**

- New instance for every injection
- No state sharing
- **Best for**: Lightweight, stateless services

### 3. Singleton

**When**: Single instance for application lifetime

```csharp
services.AddSingleton<IConfiguration, Configuration>();
```

**Characteristics:**

- One instance for entire application
- Shared across all requests
- **Best for**: Expensive-to-create, stateless services

## Benefits of DI in TasksTrack

### 1. **Testability**

Easy to mock dependencies for unit testing:

```csharp
// Unit test example
[Test]
public async Task RegisterAsync_UserExists_ReturnsFailure()
{
    // Arrange
    var mockRepository = new Mock<IAuthRepository>();
    mockRepository.Setup(r => r.GetUserByEmailAsync("test@example.com"))
              .ReturnsAsync(new User { Email = "test@example.com" });

    var authService = new AuthService(mockRepository.Object);

    // Act & Assert
    var result = await authService.RegisterAsync(new RegisterRequest
    {
        Email = "test@example.com"
    });

    Assert.False(result.Success);
}
```

### 2. **Loose Coupling**

Classes depend on abstractions, not concrete implementations:

```text
AuthController depends on IAuthService (not AuthService)
AuthService depends on IAuthRepository (not AuthRepository)
```

### 3. **Flexibility**

Easy to swap implementations:

```csharp
// Development environment
services.AddScoped<IEmailService, MockEmailService>();

// Production environment
services.AddScoped<IEmailService, SmtpEmailService>();
```

### 4. **Single Responsibility**

Classes focus on their core responsibility, not on creating dependencies.

## Dependency Chain in TasksTrack

### Authentication Flow Example

```text
HTTP Request
    ↓
AuthController (depends on IAuthService)
    ↓
AuthService (depends on IAuthRepository)
    ↓
AuthRepository (depends on TasksTrackContext)
    ↓
TasksTrackContext (depends on DbContextOptions)
    ↓
Database
```

**DI Container resolves this chain automatically:**

1. Creates `TasksTrackContext` with database options
2. Creates `AuthRepository` with context
3. Creates `AuthService` with repository
4. Creates `AuthController` with service

## Common DI Patterns in the Codebase

### 1. **Interface Segregation**

Each service has a focused interface:

```csharp
public interface IAuthService
{
    Task<AuthResult> RegisterAsync(RegisterRequest request);
    Task<AuthResult> LoginAsync(LoginRequest request);
    Task<AuthResult> ResetPasswordAsync(PasswordResetRequest request);
}

public interface IToDoTaskService
{
    Task<IEnumerable<ToDoTask>> GetAllAsync();
    Task<ToDoTask> GetByIdAsync(int id);
    Task<ToDoTask> CreateAsync(ToDoTask task);
    Task<ToDoTask> UpdateAsync(ToDoTask task);
    Task<bool> DeleteAsync(int id);
}
```

### 2. **Layered Dependencies**

Each layer depends on the layer below it:

```csharp
// Controllers depend on Services
public class AuthController
{
    private readonly IAuthService _authService;
}

// Services depend on Repositories
public class AuthService
{
    private readonly IAuthRepository _authRepository;
}

// Repositories depend on DbContext
public class AuthRepository
{
    private readonly TasksTrackContext _context;
}
```

### 3. **Configuration Injection**

Configuration is injected where needed:

```csharp
public class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;

    public AuthService(IAuthRepository authRepository, IConfiguration configuration)
    {
        _authRepository = authRepository;
        _configuration = configuration;
    }
}
```

## Best Practices from the Codebase

### 1. **Constructor Injection Only**

Always use constructor injection for required dependencies:

```csharp
// Good: Constructor injection
public class AuthService : IAuthService
{
    private readonly IAuthRepository _authRepository;

    public AuthService(IAuthRepository authRepository)
    {
        _authRepository = authRepository;
    }
}

// Avoid: Service locator pattern
// public class AuthService
// {
//     public void SomeMethod()
//     {
//         var repository = ServiceProvider.GetService<IAuthRepository>();
//     }
// }
```

### 2. **Interface-Based Design**

Always inject interfaces, not concrete classes:

```csharp
// Good: Depend on abstraction
public class AuthController
{
    private readonly IAuthService _authService;
}

// Avoid: Depend on concrete class
// public class AuthController
// {
//     private readonly AuthService _authService;
// }
```

### 3. **Scoped Services for Business Logic**

Use scoped lifetime for services that work with database:

```csharp
// Appropriate for database-connected services
services.AddScoped<IAuthService, AuthService>();
services.AddScoped<IAuthRepository, AuthRepository>();
```

## DI in Testing

### 1. **Unit Testing with Mocks**

```csharp
[Test]
public async Task GetAllAsync_ReturnsAllTasks()
{
    // Arrange
    var mockRepository = new Mock<IToDoTaskRepository>();
    var expectedTasks = new List<ToDoTask> { /* test data */ };
    mockRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(expectedTasks);

    var service = new ToDoTaskService(mockRepository.Object);

    // Act
    var result = await service.GetAllAsync();

    // Assert
    Assert.Equal(expectedTasks, result);
}
```

### 2. **Integration Testing**

Use test-specific DI configuration:

```csharp
public class TestStartup
{
    public void ConfigureServices(IServiceCollection services)
    {
        // Use in-memory database for testing
        services.AddDbContext<TasksTrackContext>(options =>
            options.UseInMemoryDatabase("TestDatabase"));

        // Register test-specific services
        services.AddScoped<IEmailService, MockEmailService>();
    }
}
```

## Learning Exercises

### 1. **Trace Dependency Resolution**

Follow how DI container creates an object:

1. Start with `AuthController` constructor
2. See it requires `IAuthService`
3. Container finds `AuthService` registration
4. `AuthService` constructor requires `IAuthRepository`
5. Container creates `AuthRepository`
6. Container injects all dependencies

### 2. **Understand Lifetimes**

Experiment with different service lifetimes:

- Create a simple service with scoped lifetime
- Log when constructor and dispose are called
- See how instances are reused within request

### 3. **Practice Testing**

Write unit tests that mock dependencies:

- Mock repository interfaces
- Test service logic in isolation
- Verify that correct repository methods are called

## Common Mistakes to Avoid

### 1. **Circular Dependencies**

```csharp
// Avoid: A depends on B, B depends on A
public class ServiceA
{
    public ServiceA(IServiceB serviceB) { }
}

public class ServiceB
{
    public ServiceB(IServiceA serviceA) { }
}
```

### 2. **Injecting Concrete Classes**

```csharp
// Avoid: Injecting concrete class
public class AuthController
{
    public AuthController(AuthService authService) { }
}

// Good: Inject interface
public class AuthController
{
    public AuthController(IAuthService authService) { }
}
```

### 3. **Wrong Service Lifetime**

```csharp
// Avoid: Singleton service depending on scoped service
services.AddSingleton<ISingletonService, SingletonService>();
services.AddScoped<IScopedService, ScopedService>();

public class SingletonService
{
    // Problem: Singleton holding reference to scoped service
    public SingletonService(IScopedService scopedService) { }
}
```

## Next Steps

1. **Study Existing Configuration**: Examine `DependencyInjectionSetup.cs`
2. **Understand Service Lifetimes**: Research when to use each lifetime
3. **Practice Testing**: Write unit tests using mock objects
4. **Add New Services**: Follow established DI patterns for new features
5. **Learn Advanced Patterns**: Explore decorators, factories, and other DI patterns

## References

- [ASP.NET Core Dependency Injection](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection)
- [Service Lifetimes](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?
  view=aspnetcore-6.0#service-lifetimes)
- The existing DI configuration in `DependencyInjectionSetup.cs` and `Program.cs`
