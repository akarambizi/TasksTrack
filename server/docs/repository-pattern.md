# Repository Pattern Implementation in TasksTrack

## Overview

The Repository Pattern provides an abstraction layer between business logic and data access logic. This document explains how it's implemented in TasksTrack and why it's beneficial for learning and maintainability.

## What is the Repository Pattern?

The Repository Pattern encapsulates the logic needed to access data sources. It centralizes common data access functionality, providing better maintainability and decoupling the infrastructure or technology used to access databases from the domain model layer.

## Implementation in TasksTrack

### 1. Repository Interface Structure

All repository interfaces follow a consistent pattern:

```csharp
// Example: IAuthRepository.cs
public interface IAuthRepository
{
    Task<User> GetUserByEmailAsync(string email);
    Task<User> GetUserByUsernameAsync(string username);
    Task<User> CreateUserAsync(User user);
    Task<bool> UserExistsAsync(string email, string username);
}
```

**Key Characteristics:**
- Async methods with `Task<T>` return types
- Clear, descriptive method names
- Domain-focused operations (not CRUD-focused)
- Returns domain models, not DTOs

### 2. Repository Implementation Pattern

```csharp
// Example: AuthRepository.cs
public class AuthRepository : IAuthRepository
{
    private readonly TasksTrackContext _context;

    public AuthRepository(TasksTrackContext context)
    {
        _context = context;
    }

    public async Task<User> GetUserByEmailAsync(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    // Other implementations...
}
```

**Key Patterns:**
- Dependency injection of `TasksTrackContext`
- Entity Framework operations encapsulated
- Async/await throughout
- Domain-specific query logic

### 3. Service Layer Integration

Services depend on repository interfaces, not implementations:

```csharp
public class AuthService : IAuthService
{
    private readonly IAuthRepository _authRepository;

    public AuthService(IAuthRepository authRepository)
    {
        _authRepository = authRepository;
    }

    public async Task<AuthResult> RegisterAsync(RegisterRequest request)
    {
        // Business logic using repository abstraction
        var existingUser = await _authRepository.GetUserByEmailAsync(request.Email);
        if (existingUser != null)
        {
            return new AuthResult { Success = false, Message = "User already exists" };
        }

        // More business logic...
    }
}
```

## Benefits of Repository Pattern

### 1. **Separation of Concerns**

**Data Access Logic** is separated from **Business Logic**:

```text
Service Layer (Business Logic)
       ↓
Repository Interface (Contract)
       ↓
Repository Implementation (Data Access)
       ↓
Entity Framework Context
       ↓
Database
```

### 2. **Testability**

Easy to mock repository interfaces for unit testing:

```csharp
// In unit tests
var mockRepository = new Mock<IAuthRepository>();
mockRepository.Setup(r => r.GetUserByEmailAsync("test@example.com"))
          .ReturnsAsync(new User { Email = "test@example.com" });

var authService = new AuthService(mockRepository.Object);
```

### 3. **Flexibility**

Can swap data access implementations without changing business logic:
- Switch from Entity Framework to Dapper
- Change from SQL Server to PostgreSQL
- Add caching layer
- Implement different data sources

### 4. **Maintainability**

Centralized data access logic makes changes easier:
- Query optimization in one place
- Consistent error handling
- Standardized async patterns

## Repository Pattern Examples in the Codebase

### 1. **AuthRepository**

**Purpose**: Handle user authentication data operations

**Key Methods:**
- `GetUserByEmailAsync()` - Find user by email
- `CreateUserAsync()` - Create new user
- `UserExistsAsync()` - Check if user exists

**Business Focus**: User identity and authentication

### 2. **ToDoTaskRepository**

**Purpose**: Handle task management data operations

**Key Methods:**
- `GetAllAsync()` - Retrieve all tasks
- `GetByIdAsync()` - Find specific task
- `CreateAsync()` - Create new task
- `UpdateAsync()` - Update existing task
- `DeleteAsync()` - Delete task

**Business Focus**: Task lifecycle management

### 3. **UserRepository**

**Purpose**: Handle general user data operations

**Key Methods:**
- User profile management
- User settings and preferences
- General user operations

## Repository Method Naming Conventions

Follow these established patterns in the codebase:

### Query Operations
```csharp
Task<User> GetUserByEmailAsync(string email);
Task<User> GetByIdAsync(int id);
Task<IEnumerable<ToDoTask>> GetAllAsync();
Task<bool> ExistsAsync(int id);
```

### Command Operations
```csharp
Task<User> CreateAsync(User user);
Task<User> UpdateAsync(User user);
Task<bool> DeleteAsync(int id);
```

### Business-Specific Operations
```csharp
Task<bool> UserExistsAsync(string email, string username);
Task<IEnumerable<ToDoTask>> GetTasksByStatusAsync(TaskStatus status);
```

## Common Repository Patterns in the Code

### 1. **Generic Return Types**

```csharp
// Return entity or null
Task<User> GetUserByEmailAsync(string email);

// Return boolean for existence checks
Task<bool> UserExistsAsync(string email, string username);

// Return collections
Task<IEnumerable<ToDoTask>> GetAllAsync();
```

### 2. **Error Handling**

Let Entity Framework exceptions bubble up to service layer:

```csharp
public async Task<User> CreateUserAsync(User user)
{
    _context.Users.Add(user);
    await _context.SaveChangesAsync();
    return user; // EF exceptions will be caught by service layer
}
```

### 3. **Async Consistency**

All repository methods are async:

```csharp
// Consistent async pattern
public async Task<User> GetUserByEmailAsync(string email)
{
    return await _context.Users
        .FirstOrDefaultAsync(u => u.Email == email);
}
```

## Learning Exercises

### 1. **Trace Data Flow**

Follow a complete data operation:
1. Controller receives request
2. Service calls repository interface
3. Repository implementation queries database
4. Data flows back through layers

### 2. **Understand Abstractions**

Ask these questions:
- Why does the service depend on `IAuthRepository` instead of `AuthRepository`?
- How does dependency injection resolve the interface to implementation?
- What happens during testing when we mock the interface?

### 3. **Identify Responsibilities**

For each repository:
- What domain area does it handle?
- What operations does it provide?
- How does it encapsulate data access complexity?

## Best Practices from the Codebase

### 1. **Interface-First Design**

Always define the interface before implementation:

```csharp
// 1. Define interface
public interface IToDoTaskRepository
{
    Task<IEnumerable<ToDoTask>> GetAllAsync();
}

// 2. Implement interface
public class ToDoTaskRepository : IToDoTaskRepository
{
    public async Task<IEnumerable<ToDoTask>> GetAllAsync()
    {
        // Implementation
    }
}
```

### 2. **Domain-Focused Methods**

Methods reflect business operations, not just CRUD:

```csharp
// Good: Business-focused
Task<bool> UserExistsAsync(string email, string username);

// Avoid: Too generic
Task<bool> ExistsAsync(object criteria);
```

### 3. **Consistent Async Patterns**

All data operations are async for scalability:

```csharp
// Always async for database operations
public async Task<User> GetUserByEmailAsync(string email)
{
    return await _context.Users
        .FirstOrDefaultAsync(u => u.Email == email);
}
```

## Next Steps

1. **Study Existing Repositories**: Examine `AuthRepository.cs` and `ToDoTaskRepository.cs`
2. **Understand Dependencies**: Trace how repositories are injected into services
3. **Practice Testing**: Write unit tests that mock repository interfaces
4. **Extend Patterns**: Add new repositories following the established patterns
5. **Refactor**: Move data access logic into appropriate repositories

## References

- [Repository Pattern in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/repository-pattern)
- [Entity Framework Best Practices](https://docs.microsoft.com/en-us/ef/core/miscellaneous/configuring-dbcontext)
- The existing repository implementations in `/Repositories`
