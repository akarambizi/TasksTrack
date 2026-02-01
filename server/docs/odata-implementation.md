# OData Query Options Implementation in TasksTrack

## Overview

This document explains the OData (Open Data Protocol) implementation in TasksTrack, providing
a learning reference for understanding query capabilities, architectural decisions, and the
rationale behind choosing Microsoft's recommended patterns over more complex alternatives.

## What is OData?

OData enables REST APIs to support advanced querying capabilities like filtering, sorting,
pagination, and field selection directly through URL parameters, without requiring custom
endpoint implementations for each query scenario.

### Supported Query Options

```text
$filter    - Filter data based on conditions
$orderby   - Sort results by one or more fields
$select    - Choose specific fields to return
$top       - Limit number of results (pagination)
$skip      - Skip results (pagination offset)
$count     - Include total count in response
$expand    - Include related entities (when applicable)
```

## Implementation Architecture

### 1. Configuration (Program.cs)

#### Our Choice: Simple, Convention-Based Configuration

```csharp
// Program.cs - Microsoft's recommended approach
builder.Services.AddControllers().AddOData(options =>
{
    options.Select()
           .Filter()
           .OrderBy()
           .Expand()
           .Count()
           .SetMaxTop(null);
});
```

**Why This Approach**:
- **Scalable**: Works with any `IQueryable<T>` automatically
- **Convention-based**: No manual EDM model configuration needed
- **Future-proof**: New entities work immediately with `[EnableQuery]`
- **Less maintenance**: No Program.cs changes when adding new APIs

**Alternative Avoided**:
```csharp
// Complex approach - too specific and not scalable
static IEdmModel GetEdmModel()
{
    var builder = new ODataConventionModelBuilder();
    builder.EntitySet<FocusSessionResponse>("FocusSessions");  // Too specific!
    return builder.GetEdmModel();
}
```

### 2. Controller Implementation

#### Pattern: EnableQuery Attribute

```csharp
// FocusController.cs
[HttpGet("api/focus/sessions")]
[EnableQuery]  // This is the magic!
public ActionResult<IQueryable<FocusSessionResponse>> GetSessions()
{
    var userId = GetUserId();
    var result = _focusSessionService.GetSessions(userId);
    return Ok(result);
}
```

**Key Requirements**:
- Return type must be `IQueryable<T>` for optimal performance
- Use `[EnableQuery]` attribute on the controller method
- Apply security filters (like `userId`) at the service level

### 3. Service Layer Implementation

#### Pattern: IQueryable for OData Compatibility

```csharp
// FocusSessionService.cs
public IQueryable<FocusSessionResponse> GetSessions(string userId)
{
    var sessions = _focusSessionRepository.GetByUser(userId);
    return sessions.Select(session => new FocusSessionResponse
    {
        Id = session.Id,
        HabitId = session.HabitId,
        StartTime = session.StartTime,
        // ... other properties
    });
}
```

**Why IQueryable Instead of IEnumerable**:
- **Performance**: OData queries translate to SQL via EF Core
- **Efficiency**: Database-level filtering, not in-memory
- **Scalability**: Handles large datasets without loading everything into memory

**Comparison**:
```csharp
// ❌ Bad: Loads all data, then filters in-memory
public IEnumerable<FocusSessionResponse> GetSessions(string userId)
{
    return _repository.GetAll().Where(x => x.UserId == userId).ToList();
}

// ✅ Good: Database-level filtering
public IQueryable<FocusSessionResponse> GetSessions(string userId)
{
    return _repository.GetByUser(userId).Select(session => new FocusSessionResponse {...});
}
```

### 4. Repository Layer

#### Pattern: Return IQueryable from Repository

```csharp
// FocusSessionRepository.cs
public IQueryable<FocusSession> GetByUser(string userId)
{
    return _context.FocusSessions
        .Include(fs => fs.Habit)
        .Where(fs => fs.CreatedBy == userId);
}
```

**Security Boundary**: Repository applies user-specific filtering to ensure data security.

## Frontend Integration

### Date Formatting for OData

**Challenge**: OData expects ISO 8601 DateTimeOffset format, not simple date strings.

```typescript
// Frontend: odata-query integration
import buildQuery from 'odata-query';

// Helper functions for proper date formatting
export const formatDateForOData = (date: string | Date): string => {
  if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return new Date(`${date}T00:00:00.000Z`).toISOString();
  }
  return new Date(date).toISOString();
};

export const formatEndDateForOData = (date: string | Date): string => {
  if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return new Date(`${date}T23:59:59.999Z`).toISOString();
  }
  return new Date(date).toISOString();
};

// Usage in API calls
const filter: IODataFilter = {};
if (params?.startDate) {
    filter.startTime = { ge: formatDateForOData(params.startDate) };
}
if (params?.endDate) {
    filter.startTime = { ...filter.startTime, le: formatEndDateForOData(params.endDate) };
}

const odataQuery = buildQuery({
    filter: Object.keys(filter).length > 0 ? filter : undefined,
    orderBy: 'startTime desc',
    top: params?.pageSize,
    skip: params?.page && params?.pageSize ? (params.page - 1) * params.pageSize : undefined
});
```

## How OData Query Processing Works

### 1. Request Flow

```text
Client Request:
GET /api/focus/sessions?$filter=startTime ge 2026-01-31T00:00:00Z&$orderby=startTime desc&$top=10

↓

Controller ([EnableQuery]):
- Parses OData parameters from query string
- Calls service method to get base IQueryable
- Applies OData transformations to IQueryable
- Returns filtered/sorted/paged results

↓

Service Layer:
- Returns IQueryable<FocusSessionResponse> with user security filter applied
- NO manual parameter parsing needed

↓

Repository Layer:
- Returns IQueryable<FocusSession> filtered by userId
- Includes necessary navigation properties

↓

Entity Framework Core:
- Translates final IQueryable to optimized SQL
- Executes query at database level
```

### 2. SQL Translation Example

```csharp
// This OData query:
// ?$filter=startTime ge 2026-01-31T00:00:00Z&$orderby=startTime desc&$top=10

// Gets translated to SQL like:
SELECT TOP 10
    fs.Id, fs.HabitId, fs.StartTime, fs.Status, /* other fields */
FROM FocusSessions fs
INNER JOIN Habits h ON fs.HabitId = h.Id
WHERE fs.CreatedBy = @userId
    AND fs.StartTime >= '2026-01-31T00:00:00Z'
ORDER BY fs.StartTime DESC
```

## Example Usage Scenarios

### Basic Filtering
```text
GET /api/focus/sessions?$filter=status eq 'completed'
GET /api/focus/sessions?$filter=habitId eq 123
GET /api/focus/sessions?$filter=startTime ge 2026-01-31T00:00:00Z
```

### Sorting and Pagination
```text
GET /api/focus/sessions?$orderby=startTime desc&$top=20&$skip=0
GET /api/focus/sessions?$orderby=actualDurationSeconds desc
```

### Complex Queries
```text
GET /api/focus/sessions?$filter=status eq 'completed' and startTime ge 2026-01-31T00:00:00Z&$orderby=startTime desc&$top=10
```

### Field Selection
```text
GET /api/focus/sessions?$select=id,habitId,startTime,status
```

## Best Practices and Security

### 1. Security Considerations

**Always Apply User-Level Filtering**:
```csharp
// ✅ Good: Security applied at service level
public IQueryable<FocusSessionResponse> GetSessions(string userId)
{
    var sessions = _focusSessionRepository.GetByUser(userId);  // User filter here
    return sessions.Select(/* ... */);
}

// ❌ Bad: No user filtering - security risk
public IQueryable<FocusSessionResponse> GetAllSessions()
{
    return _focusSessionRepository.GetAll().Select(/* ... */);
}
```

### 2. Performance Optimization

**Use IQueryable Throughout the Chain**:
```csharp
// Repository → Service → Controller all use IQueryable
// This ensures database-level query optimization
Repository: IQueryable<Entity> GetByUser(string userId)
Service:    IQueryable<Response> GetSessions(string userId)
Controller: ActionResult<IQueryable<Response>> GetSessions()
```

### 3. Error Handling

Common OData errors and solutions:
- **Date format errors**: Use proper ISO 8601 formatting in frontend
- **Type mismatch errors**: Ensure frontend sends correct data types
- **Unauthorized access**: Always filter by authenticated user

## Learning Resources

### Microsoft Documentation
- [ASP.NET Core OData Best Practices](https://learn.microsoft.com/en-us/odata/webapi-8/getting-started)
- [OData Query Options](https://learn.microsoft.com/en-us/odata/webapi-8/fundamentals/query-options)

### Why This Pattern Was Chosen
1. **Follows Microsoft's recommendations** for ASP.NET Core OData
2. **Scalable architecture** - works with any entity without code changes
3. **Performance optimized** - queries execute at database level
4. **Security focused** - user filtering applied at service boundary
5. **Maintainable** - minimal configuration, convention-based approach

## Migration Notes

When OData was implemented, the following conversions were made:

### 1. Async methods to sync (for IQueryable compatibility)

**Before OData:**
```csharp
// Service method was async
public async Task<IEnumerable<FocusSessionResponse>> GetSessionsAsync(string userId,
    int? habitId = null, string? status = null,
    DateTime? startDate = null, DateTime? endDate = null,
    int page = 1, int pageSize = 10)
{
    var sessions = await _focusSessionRepository.GetByUserAsync(userId, habitId, status, startDate, endDate);
    return sessions.Select(session => MapToResponse(session));
}
```

**After OData:**
```csharp
// Service method is now sync, returns IQueryable
public IQueryable<FocusSessionResponse> GetSessions(string userId)
{
    var sessions = _focusSessionRepository.GetByUser(userId);
    return sessions.Select(session => new FocusSessionResponse
    {
        Id = session.Id,
        HabitId = session.HabitId,
        StartTime = session.StartTime,
        // ... other properties
    });
}
```

### 2. IEnumerable returns to IQueryable returns

**Before OData:**
```csharp
// Repository returned materialized data
public async Task<IEnumerable<FocusSession>> GetByUserAsync(string userId,
    int? habitId, string? status, DateTime? startDate, DateTime? endDate)
{
    var query = _context.FocusSessions.Where(fs => fs.CreatedBy == userId);

    if (habitId.HasValue)
        query = query.Where(fs => fs.HabitId == habitId.Value);

    if (!string.IsNullOrEmpty(status))
        query = query.Where(fs => fs.Status == status);

    return await query.ToListAsync(); // Materializes data here
}
```

**After OData:**
```csharp
// Repository returns IQueryable expression tree
public IQueryable<FocusSession> GetByUser(string userId)
{
    return _context.FocusSessions
        .Include(fs => fs.Habit)
        .Where(fs => fs.CreatedBy == userId); // Still an expression tree
}
```

### 3. Manual parameter parsing to OData attribute-based handling

**Before OData:**
```csharp
// Controller manually parsed query parameters
[HttpGet("api/focus/sessions")]
public async Task<ActionResult<IEnumerable<FocusSessionResponse>>> GetSessions(
    [FromQuery] int? habitId,
    [FromQuery] string? status,
    [FromQuery] DateTime? startDate,
    [FromQuery] DateTime? endDate,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
{
    var userId = GetUserId();
    var sessions = await _focusSessionService.GetSessionsAsync(userId, habitId, status, startDate, endDate, page, pageSize);
    return Ok(sessions);
}
```

**After OData:**
```csharp
// Controller uses OData attribute - no manual parameter parsing
[HttpGet("api/focus/sessions")]
[EnableQuery]
public ActionResult<IQueryable<FocusSessionResponse>> GetSessions()
{
    var userId = GetUserId();
    var result = _focusSessionService.GetSessions(userId);
    return Ok(result);
}
```

This provided significant benefits:
- Eliminated custom filtering logic
- Added sorting and pagination automatically
- Improved query performance
- Reduced code complexity
- Added standardized query capabilities across all endpoints

The trade-off of async→sync was acceptable because:
- EF Core optimizes IQueryable to SQL efficiently
- Query execution still happens asynchronously when results are enumerated
- OData provides better performance through database-level operations