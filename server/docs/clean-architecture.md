# Clean Architecture Implementation in TasksTrack

## Overview

This document explains how Clean Architecture principles are implemented in the TasksTrack server,
providing a learning reference for understanding the architectural decisions and patterns used.

## Architecture Layers

### 1. Controllers Layer (`/Controllers`)
**Purpose**: API Entry Points and HTTP Concerns

```csharp
// Example: AuthController.cs
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    // Handles HTTP requests, validates input, returns appropriate responses
    // Does NOT contain business logic
}
```

**Responsibilities**:
- Handle HTTP requests and responses
- Model validation and binding
- Route definition
- Status code management
- **Does NOT**: Contain business logic or data access

### 2. Services Layer (`/Services`)
**Purpose**: Business Logic and Application Rules

```csharp
// Example: AuthService.cs
public class AuthService : IAuthService
{
    private readonly IAuthRepository _authRepository;

    // Contains business rules, validation logic, and orchestrates operations
    // Uses repositories for data access
}
```

**Responsibilities**:
- Business logic implementation
- Data validation and transformation
- Orchestrating multiple repository calls
- Application-specific rules
- **Does NOT**: Handle HTTP concerns or direct database access

### 3. Repositories Layer (`/Repositories`)
**Purpose**: Data Access and Persistence

```csharp
// Example: AuthRepository.cs
public class AuthRepository : IAuthRepository
{
    private readonly TasksTrackContext _context;

    // Handles all database operations
    // Abstracts Entity Framework details from services
}
```

**Responsibilities**:
- Database operations (CRUD)
- Entity Framework interaction
- Data mapping and querying
- **Does NOT**: Contain business logic or validation

### 4. Models Layer (`/Models`)
**Purpose**: Data Structures and Contracts

**Domain Models**: Core business entities
```csharp
public class ToDoTask
{
    public int Id { get; set; }
    public string Title { get; set; }
    // Core business properties
}
```

**DTOs (Data Transfer Objects)**: API contracts
```csharp
public class RegisterRequest
{
    public string Username { get; set; }
    public string Email { get; set; }
    // Data transfer structures
}
```

## Dependency Flow

```text
Controllers → Services → Repositories → Database
     ↓           ↓           ↓
   HTTP      Business    Data Access
  Concerns    Logic      Abstraction
```

### Key Principle: Dependency Inversion
- Higher-level modules don't depend on lower-level modules
- Both depend on abstractions (interfaces)
- Controllers depend on `IAuthService`, not `AuthService`
- Services depend on `IAuthRepository`, not `AuthRepository`

## Implementation Examples in the Codebase

### 1. Authentication Flow
```text
AuthController.Register()
    ↓ calls
IAuthService.RegisterAsync()
    ↓ implemented by
AuthService.RegisterAsync()
    ↓ calls
IAuthRepository.CreateUserAsync()
    ↓ implemented by
AuthRepository.CreateUserAsync()
```

### 2. Dependency Injection Setup
Located in `DependencyInjectionSetup.cs`:
```csharp
services.AddScoped<IAuthService, AuthService>();
services.AddScoped<IAuthRepository, AuthRepository>();
```

## Benefits of This Architecture

### 1. **Separation of Concerns**
Each layer has a single responsibility:
- Controllers: HTTP handling
- Services: Business logic
- Repositories: Data access

### 2. **Testability**
- Easy to mock interfaces for unit testing
- Business logic can be tested without HTTP or database
- See examples in `/Tests` folder

### 3. **Maintainability**
- Changes in one layer don't cascade to others
- Easy to modify business rules without affecting API contracts
- Database changes isolated to repository layer

### 4. **Flexibility**
- Can swap implementations (e.g., different databases)
- Can add new features following established patterns
- Supports different deployment scenarios

## Learning Exercises

### 1. **Trace a Request**
Follow a complete request through all layers:
1. Start with `AuthController.Register()`
2. Follow to `AuthService.RegisterAsync()`
3. Continue to `AuthRepository.CreateUserAsync()`
4. Understand how data flows back

### 2. **Identify Responsibilities**
For each class, ask:
- What is its single responsibility?
- What layer does it belong to?
- What should it NOT be doing?

### 3. **Understand Interfaces**
- Why does `AuthService` depend on `IAuthRepository`?
- How does dependency injection resolve these dependencies?
- What happens during testing when we mock these interfaces?

## Common Patterns in the Codebase

### 1. **Async/Await Pattern**
All data operations are asynchronous:
```csharp
public async Task<AuthResult> RegisterAsync(RegisterRequest request)
{
    // Async business logic
    var user = await _authRepository.CreateUserAsync(newUser);
}
```

### 2. **Result Pattern**
Services return structured results:
```csharp
public class AuthResult
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public string Token { get; set; }
}
```

### 3. **Repository Pattern**
Data access abstracted behind interfaces:
```csharp
public interface IAuthRepository
{
    Task<User> GetUserByEmailAsync(string email);
    Task<User> CreateUserAsync(User user);
}
```

## Next Steps for Learning

1. **Study Existing Code**: Examine how each layer is implemented
2. **Add New Features**: Follow the same patterns for new functionality
3. **Write Tests**: Understand how architecture enables testing
4. **Refactor**: Practice moving logic to appropriate layers
5. **Extend**: Add new services and repositories following established patterns

## References

- [Clean Architecture by Robert Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [ASP.NET Core Architecture](
  https://docs.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures)
- The existing codebase in `/Controllers`, `/Services`, and `/Repositories`
