# API Development Guide for TasksTrack

## Overview

This document provides comprehensive guidance for developing and maintaining the TasksTrack API.
It covers endpoint design patterns, request/response structures, error handling, and best practices
based on the existing codebase.

## API Architecture

### RESTful Design Principles

TasksTrack follows REST conventions with these URL patterns:

```text
Authentication:
POST   /api/auth/register       # User registration
POST   /api/auth/login          # User login
POST   /api/auth/reset-password # Password reset

Tasks:
GET    /api/tasks               # Get all tasks
GET    /api/tasks/{id}          # Get specific task
POST   /api/tasks               # Create new task
PUT    /api/tasks/{id}          # Update task
DELETE /api/tasks/{id}          # Delete task

Users:
GET    /api/users               # Get all users
GET    /api/users/{id}          # Get specific user
PUT    /api/users/{id}          # Update user
DELETE /api/users/{id}          # Delete user
```

### Controller Structure Pattern

All controllers follow this established pattern:

```csharp
[ApiController]
[Route("api/[controller]")]
public class YourController : ControllerBase
{
    private readonly IYourService _service;

    public YourController(IYourService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<YourModel>>> GetAll()
    {
        try
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new {
                message = "An error occurred while retrieving data.",
                error = ex.Message
            });
        }
    }
}
```

## Request/Response Patterns

### Request Models

Use specific request models for input validation:

```csharp
// Registration request
public class RegisterRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [MinLength(3)]
    public string Username { get; set; }

    [Required]
    [MinLength(8)]
    public string Password { get; set; }
}

// Task creation request
public class CreateTaskRequest
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; }

    [StringLength(1000)]
    public string Description { get; set; }

    public TaskPriority Priority { get; set; } = TaskPriority.Medium;

    public DateTime? DueDate { get; set; }
}
```

### Response Models

Use structured response models for consistent API contracts:

```csharp
// Authentication response
public class AuthResult
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public string Token { get; set; }
    public UserDto User { get; set; }
}

// Standard API response wrapper
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public T Data { get; set; }
    public List<string> Errors { get; set; } = new List<string>();
}
```

### HTTP Status Codes

Use appropriate HTTP status codes consistently:

```csharp
// Success responses
return Ok(data);                    // 200 - Success with data
return NoContent();                 // 204 - Success without data
return Created(location, data);     // 201 - Resource created

// Client error responses
return BadRequest(error);           // 400 - Invalid request
return Unauthorized();              // 401 - Authentication required
return Forbidden();                 // 403 - Access denied
return NotFound();                  // 404 - Resource not found
return Conflict(error);             // 409 - Resource conflict

// Server error responses
return StatusCode(500, error);      // 500 - Internal server error
```

## Error Handling Patterns

### Controller Error Handling

Follow the established pattern from existing controllers:

```csharp
[HttpPost]
public async Task<IActionResult> Create([FromBody] CreateTaskRequest request)
{
    try
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _service.CreateAsync(request);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return CreatedAtAction(nameof(GetById),
            new { id = result.Data.Id }, result.Data);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new {
            message = "An error occurred while creating the task.",
            error = ex.Message
        });
    }
}
```

### Service Layer Error Handling

Services return result objects for business logic errors:

```csharp
public async Task<ServiceResult<ToDoTask>> CreateAsync(CreateTaskRequest request)
{
    // Validation
    if (string.IsNullOrWhiteSpace(request.Title))
    {
        return ServiceResult<ToDoTask>.Failure("Title is required");
    }

    try
    {
        var task = new ToDoTask
        {
            Title = request.Title,
            Description = request.Description,
            Priority = request.Priority,
            DueDate = request.DueDate,
            CreatedAt = DateTime.UtcNow
        };

        var createdTask = await _repository.CreateAsync(task);
        return ServiceResult<ToDoTask>.Success(createdTask);
    }
    catch (Exception ex)
    {
        // Log the exception
        return ServiceResult<ToDoTask>.Failure("Failed to create task");
    }
}
```

## Authentication and Authorization

### JWT Authentication Setup

Based on the existing authentication implementation:

```csharp
// In Program.cs - JWT configuration
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration["Jwt:Secret"])),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        };
    });
```

### Protecting Endpoints

Use `[Authorize]` attribute for protected endpoints:

```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize] // Protects all endpoints in this controller
public class TasksController : ControllerBase
{
    [HttpGet]
    [AllowAnonymous] // Override for specific endpoints
    public async Task<ActionResult<IEnumerable<ToDoTask>>> GetPublicTasks()
    {
        // Public endpoint implementation
    }

    [HttpPost]
    // Requires authentication (inherited from controller)
    public async Task<IActionResult> CreateTask([FromBody] CreateTaskRequest request)
    {
        // Protected endpoint implementation
    }
}
```

### Accessing Current User

Get current user information in controllers:

```csharp
[HttpGet("my-tasks")]
public async Task<ActionResult<IEnumerable<ToDoTask>>> GetMyTasks()
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userId))
    {
        return Unauthorized();
    }

    var tasks = await _service.GetTasksByUserIdAsync(int.Parse(userId));
    return Ok(tasks);
}
```

## Input Validation

### Model Validation Attributes

Use data annotations for input validation:

```csharp
public class CreateTaskRequest
{
    [Required(ErrorMessage = "Title is required")]
    [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
    public string Title { get; set; }

    [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
    public string Description { get; set; }

    [Range(1, 5, ErrorMessage = "Priority must be between 1 and 5")]
    public TaskPriority Priority { get; set; }

    [DataType(DataType.DateTime)]
    public DateTime? DueDate { get; set; }
}
```

### Custom Validation

Create custom validation attributes when needed:

```csharp
public class FutureDateAttribute : ValidationAttribute
{
    public override bool IsValid(object value)
    {
        if (value is DateTime date)
        {
            return date > DateTime.UtcNow;
        }
        return true; // Allow null values
    }

    public override string FormatErrorMessage(string name)
    {
        return $"{name} must be a future date";
    }
}

// Usage
public class CreateTaskRequest
{
    [FutureDate]
    public DateTime? DueDate { get; set; }
}
```

### Validation in Controllers

Check ModelState for validation errors:

```csharp
[HttpPost]
public async Task<IActionResult> Create([FromBody] CreateTaskRequest request)
{
    if (!ModelState.IsValid)
    {
        var errors = ModelState
            .SelectMany(x => x.Value.Errors)
            .Select(x => x.ErrorMessage)
            .ToList();

        return BadRequest(new {
            message = "Validation failed",
            errors = errors
        });
    }

    // Continue with processing...
}
```

## API Documentation

### Swagger Configuration

Enhance Swagger documentation with attributes:

```csharp
[HttpPost]
[ProducesResponseType(typeof(ToDoTask), StatusCodes.Status201Created)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
public async Task<IActionResult> Create([FromBody] CreateTaskRequest request)
{
    // Implementation
}
```

### XML Documentation

Add XML comments for better API documentation:

```csharp
/// <summary>
/// Creates a new task for the authenticated user
/// </summary>
/// <param name="request">Task creation details</param>
/// <returns>The created task</returns>
/// <response code="201">Task created successfully</response>
/// <response code="400">Invalid request data</response>
/// <response code="401">User not authenticated</response>
[HttpPost]
public async Task<IActionResult> Create([FromBody] CreateTaskRequest request)
{
    // Implementation
}
```

## Performance Considerations

### Async/Await Best Practices

Follow consistent async patterns:

```csharp
// Good: Consistent async throughout the call chain
[HttpGet("{id}")]
public async Task<ActionResult<ToDoTask>> GetById(int id)
{
    var task = await _service.GetByIdAsync(id);
    if (task == null)
    {
        return NotFound();
    }
    return Ok(task);
}

// Service method
public async Task<ToDoTask> GetByIdAsync(int id)
{
    return await _repository.GetByIdAsync(id);
}

// Repository method
public async Task<ToDoTask> GetByIdAsync(int id)
{
    return await _context.ToDoTasks
        .FirstOrDefaultAsync(t => t.Id == id);
}
```

### Pagination for Large Datasets

Implement pagination for list endpoints:

```csharp
public class PagedRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string SearchTerm { get; set; }
    public string SortBy { get; set; }
    public string SortDirection { get; set; } = "asc";
}

public class PagedResponse<T>
{
    public IEnumerable<T> Data { get; set; }
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}

[HttpGet]
public async Task<ActionResult<PagedResponse<ToDoTask>>> GetAll([FromQuery] PagedRequest request)
{
    var result = await _service.GetPagedAsync(request);
    return Ok(result);
}
```

## Testing API Endpoints

### Integration Testing Pattern

Create integration tests for API endpoints:

```csharp
public class TasksControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public TasksControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task GetTasks_ReturnsSuccessStatusCode()
    {
        // Arrange
        var token = await GetAuthTokenAsync();
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/tasks");

        // Assert
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        var tasks = JsonSerializer.Deserialize<List<ToDoTask>>(content);
        Assert.NotNull(tasks);
    }
}
```

### Unit Testing Controllers

Test controller logic with mocked services:

```csharp
public class TasksControllerTests
{
    private readonly Mock<IToDoTaskService> _mockService;
    private readonly TasksController _controller;

    public TasksControllerTests()
    {
        _mockService = new Mock<IToDoTaskService>();
        _controller = new TasksController(_mockService.Object);
    }

    [Fact]
    public async Task GetById_ExistingTask_ReturnsOk()
    {
        // Arrange
        var taskId = 1;
        var expectedTask = new ToDoTask { Id = taskId, Title = "Test Task" };
        _mockService.Setup(s => s.GetByIdAsync(taskId))
                   .ReturnsAsync(expectedTask);

        // Act
        var result = await _controller.GetById(taskId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var task = Assert.IsType<ToDoTask>(okResult.Value);
        Assert.Equal(expectedTask.Id, task.Id);
    }
}
```

## API Versioning (Future Consideration)

### URL-based Versioning

For future API versions:

```csharp
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class TasksV1Controller : ControllerBase
{
    // V1 implementation
}

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("2.0")]
public class TasksV2Controller : ControllerBase
{
    // V2 implementation with breaking changes
}
```

## Monitoring and Logging

### Structured Logging

Add structured logging to controllers:

```csharp
public class TasksController : ControllerBase
{
    private readonly IToDoTaskService _service;
    private readonly ILogger<TasksController> _logger;

    public TasksController(IToDoTaskService service, ILogger<TasksController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTaskRequest request)
    {
        _logger.LogInformation("Creating new task with title: {Title}", request.Title);

        try
        {
            var result = await _service.CreateAsync(request);
            if (result.Success)
            {
                _logger.LogInformation("Task created successfully with ID: {TaskId}", result.Data.Id);
                return CreatedAtAction(nameof(GetById),
                    new { id = result.Data.Id }, result.Data);
            }

            _logger.LogWarning("Failed to create task: {Error}", result.Message);
            return BadRequest(result.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception occurred while creating task");
            return StatusCode(500, new {
                message = "An error occurred while creating the task."
            });
        }
    }
}
```

## API Security Best Practices

### Input Sanitization

Sanitize inputs to prevent injection attacks:

```csharp
public class CreateTaskRequest
{
    private string _title;

    [Required]
    public string Title
    {
        get => _title;
        set => _title = value?.Trim().Replace("<", "&lt;").Replace(">", "&gt;");
    }
}
```

### Rate Limiting

Implement rate limiting for API protection:

```csharp
// In Program.cs
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("api", opt =>
    {
        opt.PermitLimit = 100;
        opt.Window = TimeSpan.FromMinutes(1);
    });
});

// Usage on controllers
[EnableRateLimiting("api")]
public class TasksController : ControllerBase
{
    // Controller implementation
}
```

## Next Steps

1. **Study Existing Controllers**: Examine `AuthController` and `ToDoTaskController`
2. **Practice API Design**: Create new endpoints following established patterns
3. **Write Tests**: Add integration and unit tests for new endpoints
4. **Implement Security**: Follow authentication and authorization patterns
5. **Monitor Performance**: Add logging and monitoring to new endpoints

## References

- [ASP.NET Core Web API Documentation](https://docs.microsoft.com/en-us/aspnet/core/web-api/)
- [RESTful API Design Best Practices](https://restfulapi.net/)
- The existing controllers in `/Controllers` directory
- Authentication implementation in `AuthController.cs` and `AuthService.cs`
