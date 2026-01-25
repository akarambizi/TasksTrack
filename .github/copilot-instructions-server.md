# TasksTrack Server - GitHub Copilot Instructions

## Follow Existing Project Patterns

**IMPORTANT: Always examine and follow the patterns already established in the existing server codebase rather than creating new ones.**

### Project Architecture

- **Clean Architecture** with Repository Pattern
- **Entity Framework Core** with PostgreSQL
- **JWT Authentication** for security
- **Dependency Injection** throughout
- **RESTful API** design principles

## Key Principles for Code Generation

### 1. **Follow Existing Naming Conventions**

**Examine these files to understand the established patterns:**

- `server/Controllers/` - for controller naming and structure (e.g., `AuthController.cs`)
- `server/Services/` - for service class patterns (e.g., `AuthService.cs`)
- `server/Models/` - for model and DTO naming (e.g., `AuthResult.cs`, `User.cs`)
- `server/Repositories/` - for repository interface and implementation patterns

**Key Patterns Already Established:**

- Classes: PascalCase (`AuthService`, `AuthController`)
- Interfaces: Start with "I" (`IAuthService`, `IAuthRepository`)
- ✅ Methods: PascalCase (`RegisterAsync`, `GetAllAsync`)
- ✅ Private fields: camelCase with underscore (`_authRepository`, `_jwtSecret`)

### 2. **Follow Existing Project Structure**

**Reference the actual folder structure and examine existing files:**

```text
server/
├── Controllers/        # API Controllers (AuthController.cs)
├── Services/          # Business logic layer (AuthService.cs)
├── Repositories/      # Data access layer (AuthRepository.cs)
├── Models/           # Domain models and DTOs (User.cs, AuthResult.cs)
├── Data/             # DbContext and configurations
├── Migrations/       # EF Core migrations
└── Tests/           # Unit and integration tests
```

**When creating new files, examine existing files in the same directory to match:**

- File naming conventions and namespace structure
- Class organization and method patterns
- Import statements and dependency usage

### 3. **Follow Existing Dependency Injection Patterns**

**Study the established DI patterns in:**

- `server/DependencyInjectionSetup.cs` - for service registration patterns
- `server/Controllers/AuthController.cs` - for constructor injection usage
- `server/Services/AuthService.cs` - for dependency injection in services

**Key patterns to maintain:**

- Service registration approach and lifetime management
- Constructor injection patterns already established
- Configuration injection patterns used throughout

### 4. **Follow Existing Repository Patterns**

**Study the repository implementations in:**

- `server/Repositories/IAuthRepository.cs` - for repository interface patterns
- `server/Repositories/AuthRepository.cs` - for repository implementation patterns
- `server/Repositories/AuthRepository.cs` - for data access patterns

**Maintain consistency with:**

- Interface method signatures and naming conventions
- Entity Framework usage patterns and async operations
- Error handling approaches used in existing repositories

### 5. **Follow Existing Service Layer Patterns**

**Reference the service implementations in:**

- `server/Services/AuthService.cs` - for business logic and validation patterns
- `server/Services/AuthService.cs` - for business logic patterns
- `server/Services/IAuthService.cs` - for service interface definitions

**Key patterns to maintain:**

- Business logic organization and validation approaches
- Repository usage patterns and dependency injection
- Return type patterns (`AuthResult`, async methods)
- Error handling and exception management strategies

### 6. **Follow Existing Controller Patterns**

**Study the controller implementations in:**

- `server/Controllers/AuthController.cs` - for authentication endpoints and response patterns
- `server/Controllers/AuthController.cs` - for API endpoint patterns and error handling
- `server/Controllers/UsersController.cs` - for additional API patterns

**Key patterns to maintain:**

- Route attribute patterns and HTTP method usage
- Response type patterns (`IActionResult`, status codes)
- Error handling and validation approaches
- Model binding patterns (`[FromBody]`, request/response models)

### 7. **Follow Existing Model Patterns**

**Reference the model definitions in:**

- `server/Models/User.cs` - for entity model patterns and validation attributes
- `server/Models/User.cs` - for user model structure
- `server/Models/AuthResult.cs` - for response model patterns
- `server/Models/` - for request/response DTOs (LoginRequest, RegisterRequest, etc.)

**Key patterns to maintain:**

- Property naming conventions and data annotations
- Required vs optional property patterns
- Validation attribute usage and error messages

### 8. **Follow Existing Entity Framework Patterns**

**Reference the EF Core usage in:**

- `server/Data/TasksTrackContext.cs` - for DbContext configuration
- `server/Migrations/` - for migration patterns and database schema
- Existing repository implementations for query patterns

## Key Areas to Reference Before Creating New Code

### 1. **Authentication and JWT Patterns**

**Study the authentication implementation in:**

- `server/Services/AuthService.cs` - for JWT generation and validation patterns
- `server/Controllers/AuthController.cs` - for authentication endpoints
- `server/Program.cs` - for JWT configuration setup

### 2. **Validation Patterns**

**Reference validation approaches in:**

- `server/Services/AuthService.cs` - for email and password validation logic
- `server/Models/` - for data annotation patterns
- Controller implementations for ModelState validation

### 3. **Error Handling Patterns**

**Study error handling in:**

- Existing controller methods for consistent error responses
- Service layer implementations for exception management
- `AuthResult` pattern for standardized responses

### 4. **Configuration Patterns**

**Reference configuration usage in:**

- `server/Program.cs` - for service configuration and startup patterns
- `server/appsettings.json` and `server/appsettings.Development.json` - for configuration structure
- `server/Services/AuthService.cs` - for configuration injection patterns (JWT settings)

### 5. **Testing Patterns**

**Study existing test patterns in:**

- `server/Tests/` - for test project structure and organization
- Look for existing test files to understand testing conventions
- Follow established mocking and assertion patterns

**Quality Requirements:**
- **Test coverage must be ≥ 80%** - Every new feature must include comprehensive unit tests
- **All tests must pass** - 100% pass rate required before merge
- **Test error conditions** - Include tests for null values, exceptions, and edge cases
- **Follow existing test patterns** - Use the same mocking and assertion approaches already established

**Before completing any feature, run:**
```bash
dotnet build         # Must succeed with no warnings/errors
dotnet test          # Must show 100% test pass rate
```

## Development Best Practices

### ✅ **Do This: Follow Existing Patterns**

- **Before writing new code**, examine similar existing files in the server codebase
- **Study the established patterns** in AuthService.cs for business logic structure
- **Follow existing validation approaches** seen in email/password validation
- **Use the same error handling patterns** established in controllers and services
- **Maintain consistency** with existing async/await usage and return types

### ❌ **Don't Do This: Create New Patterns**

- **Don't introduce new validation approaches** - follow the regex patterns in AuthService
- **Don't create new response models** - use AuthResult pattern or similar established models
- **Don't ignore existing error handling** - follow the success/failure patterns already used
- **Don't skip existing security patterns** - follow BCrypt and JWT patterns established

## Key .NET CLI Commands

```bash
# Project management
dotnet restore              # Restore packages
dotnet build               # Build project
dotnet run                 # Run application
dotnet watch run          # Run with hot reload
dotnet test               # Run tests

# Entity Framework
dotnet ef migrations add MigrationName     # Add migration
dotnet ef database update                  # Update database
dotnet ef migrations remove                # Remove last migration

# Package management
dotnet add package PackageName             # Add NuGet package
dotnet remove package PackageName          # Remove package
dotnet list package                        # List packages
```

## Documentation Guidelines

### 📚 **Project Documentation Folder**: `server/docs/`

**This folder is crucial for your learning journey and future reference. Always document your learning and decisions here.**

### **When to Create Documentation:**

- **New backend concepts learned** - Create `.md` files to explain patterns you've implemented
- **System design decisions** - Document architectural choices and trade-offs
- **Deployment processes** - Document Azure deployment steps and configurations
- **Complex business logic** - Explain the reasoning behind service layer implementations
- **Database design decisions** - Document entity relationships and migration strategies
- **Security implementations** - Document authentication flows and security patterns
- **Performance optimizations** - Record optimization techniques and their impact

### **Existing Documentation Patterns:**

**Study the current documentation structure in:**

- `server/docs/authentication.md` - for authentication flow documentation
- `server/docs/db-setup.md` - for database setup and configuration
- `server/docs/todos.md` - for API endpoint documentation
- `server/docs/unit-tests.md` - for testing approach documentation

### **Documentation Best Practices:**

- ✅ **Use descriptive filenames** following the pattern: `feature-name.md` or `concept-name.md`
- ✅ **Include code examples** from your actual implementation
- ✅ **Document the "why"** behind decisions, not just the "how"
- ✅ **Add diagrams** for system design and data flow when helpful
- ✅ **Keep it updated** as your understanding and implementation evolve
- ✅ **Reference specific files** in your codebase when explaining patterns

### **Suggested Documentation Topics for Learning:**

```text
server/docs/
├── azure-deployment.md         # Azure deployment steps and configurations
├── clean-architecture.md       # Clean architecture implementation notes
├── dependency-injection.md     # DI patterns and container configuration
├── entity-framework.md         # EF Core patterns and database design
├── jwt-authentication.md       # JWT implementation and security notes
├── repository-pattern.md       # Repository pattern implementation details
├── system-design.md            # Overall system architecture decisions
├── performance-optimization.md # Performance patterns and techniques
├── error-handling.md           # Error handling strategies and patterns
└── learning-notes.md           # General learning observations and insights
```

### **Documentation Template Example:**

```markdown
# Topic Name

## Overview
Brief description of the concept or feature

## Implementation
Reference to actual files in your codebase

## Key Patterns
Patterns you've established and why

## Lessons Learned
What you discovered while implementing

## Future Improvements
Ideas for enhancement or optimization

## References
Links to external resources that helped
```

## Learning Resources

For comprehensive .NET learning:

- Microsoft Learn: [https://learn.microsoft.com/en-us/dotnet/](https://learn.microsoft.com/en-us/dotnet/)
- ASP.NET Core documentation: [https://docs.microsoft.com/en-us/aspnet/core/](https://docs.microsoft.com/en-us/aspnet/core/)
- Entity Framework Core: [https://docs.microsoft.com/en-us/ef/core/](https://docs.microsoft.com/en-us/ef/core/)

Remember: Focus on understanding the "why" behind each pattern, not just the "how." This will help you make better architectural decisions as you learn C# and .NET development. **Document your learning journey in the `server/docs/` folder for future reference and deeper understanding.**