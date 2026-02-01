# OData Implementation Guide

## Overview

TasksTrack uses **OData (Open Data Protocol)** for standardized querying across the entire
application. This provides a consistent, flexible, and powerful way to filter, sort,
paginate, and query data on both frontend and backend.

## 🏗️ Architecture

### **Frontend**: OData Query Builder Pattern
- **Tool**: `ODataQueryBuilder` utility class
- **Location**: `client/src/utils/odataQueryBuilder.ts`
- **Purpose**: Build type-safe, fluent OData query strings

### **Backend**: OData EnableQuery Attribute
- **Tool**: ASP.NET Core OData with `[EnableQuery]`
- **Purpose**: Automatic query parsing and execution
- **Returns**: `IQueryable<T>` for efficient database queries

## Frontend Usage

### Basic Query Building

```typescript
import { ODataQueryBuilder } from '@/utils/odataQueryBuilder';

// Simple filter and pagination
const query = new ODataQueryBuilder()
    .filter("contains(name,'john')")
    .orderBy('createdAt desc')
    .top(10)
    .build();
// Result: "?$filter=contains(name,'john')&$orderby=createdAt desc&$top=10"
```

### Date Range Filters (Timezone-Aware)

```typescript
// Automatic timezone conversion
const query = new ODataQueryBuilder()
    .dateRangeFilter({
        field: 'startTime',
        startDate: '2026-01-01',  // Local date
        endDate: '2026-01-31'     // Local date
    })
    .build();
// Converts local dates to UTC automatically
```

### Complex Filtering

```typescript
const query = new ODataQueryBuilder()
    .filter('status eq "completed"')
    .filter('priority gt 5')
    .filterConditions([
        { field: 'name', operator: 'contains', value: 'task' },
        { field: 'dueDate', operator: 'ge', value: '2026-01-01' }
    ])
    .orderBy(['createdAt desc', 'priority asc'])
    .paginate(2, 20) // page 2, 20 items per page
    .build();
```

### Component Integration

```typescript
// In React components
const MyComponent = () => {
    const queryString = useMemo(() => {
        return new ODataQueryBuilder()
            .dateRangeFilter({ field: 'createdAt', startDate, endDate })
            .filter(habitId ? `habitId eq ${habitId}` : '')
            .filter(status !== 'all' ? `status eq '${status}'` : '')
            .orderBy('createdAt desc')
            .top(pageSize)
            .build();
    }, [startDate, endDate, habitId, status, pageSize]);

    const { data } = useMyDataHook(queryString);
};
```

## Backend Implementation

### Controller Setup

```csharp
[HttpGet("api/myresource")]
[EnableQuery] // This enables OData query support
public ActionResult<IQueryable<MyResourceResponse>> GetMyResources()
{
    try
    {
        var userId = GetUserId();
        var result = _myService.GetResources(userId); // Returns IQueryable<T>
        return Ok(result);
    }
    catch (Exception)
    {
        return StatusCode(500, new { message = "Error occurred" });
    }
}
```

### Service Layer

```csharp
// Service should return IQueryable<T> for OData to work
public IQueryable<MyResourceResponse> GetResources(string userId)
{
    return _repository.GetByUserId(userId)
        .Select(entity => new MyResourceResponse
        {
            Id = entity.Id,
            Name = entity.Name,
            CreatedAt = entity.CreatedAt
            // Map other properties
        });
}
```

## Implementation Checklist

When adding new filterable endpoints:

### Frontend
- [ ] Create query using `ODataQueryBuilder`
- [ ] Use `useMemo` for query string to prevent unnecessary re-renders
- [ ] Pass query string to API function
- [ ] Use `.dateRangeFilter()` for date-based filters
- [ ] Use fluent chaining for readable code

### Backend
- [ ] Add `[EnableQuery]` attribute to controller method
- [ ] Return `ActionResult<IQueryable<TResponse>>`
- [ ] Service returns `IQueryable<TResponse>` (not materialized list)
- [ ] Use proper response DTOs (not domain entities)

## When to Use OData

### **Use OData When:**
- Listing/filtering collections (sessions, habits, logs)
- Analytics endpoints that need flexible querying
- Paginated data views
- Search and filter functionality
- Date range queries

### **Don't Use OData When:**
- Single item retrieval (`GET /api/item/{id}`)
- Create/Update/Delete operations
- Authentication endpoints
- File upload/download
- Simple lookup data (dropdowns, enums)

## Available Query Builders

### ODataQueryBuilder Methods

```typescript
// Filtering
.filter(condition: string | string[])
.dateRangeFilter(config: IDateRangeFilter)
.filterConditions(conditions: IFilterCondition[], combineWith: 'and' | 'or')

// Sorting & Pagination
.orderBy(fields: string | string[])
.top(count: number)
.skip(count: number)
.paginate(page: number, pageSize: number)

// Field Selection
.select(fields: string[])
.expand(relations: string[])

// Other
.count(enable: boolean)
.build(): string
.reset(): this
```

### Filter Operators

```typescript
interface IFilterCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'ge' | 'lt' | 'le' | 'contains' | 'startswith' | 'endswith';
  value: string | number | boolean | Date;
}
```

## Examples

### Focus Sessions (Reference Implementation)
- **Frontend**: `client/src/components/FocusSession/FocusSessionHistory.tsx`
- **API**: `client/src/api/focusSession.ts` → `getFocusSessions()`
- **Backend**: `server/Controllers/FocusController.cs` → `GetSessions()`
- **Service**: `server/Services/FocusSessionService.cs` → `GetSessions()`

### Analytics Implementation
- **Frontend**: Uses same pattern with `useFocusSessionAnalytics()`
- **Backend**: `GetAnalyticsData()` endpoint with `[EnableQuery]`

## Benefits

1. **Consistency**: Same query patterns across all endpoints
2. **Performance**: Database-level filtering with `IQueryable<T>`
3. **Flexibility**: Clients build exactly the queries they need
4. **Type Safety**: Full TypeScript support in query builder
5. **Timezone Aware**: Automatic date conversion in `dateRangeFilter`
6. **Maintainable**: Single responsibility - API fetches, components build queries
7. **Testable**: Easy to unit test query building separately

## Future Considerations

- All new list/filter endpoints should follow this OData pattern
- Consider adding more query builder methods as needed (e.g., groupBy, aggregate functions)
- Maintain backward compatibility when extending the query builder
- Document any custom OData operators in this file

---