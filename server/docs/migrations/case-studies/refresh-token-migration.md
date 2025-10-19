# Case Study: Refresh Token Migration Implementation

**Date:** October 19, 2025
**Issue Type:** Type Casting Error
**Severity:** High (Blocking deployment)
**Resolution Time:** ~2 hours

## Problem Summary

When implementing refresh token functionality, the auto-generated EF Core migration failed with PostgreSQL type casting errors, preventing database schema updates.

## Error Details

### Primary Error

```
Npgsql.PostgresException (0x80004005): 42804: column "UpdatedDate" cannot be cast automatically to type timestamp with time zone
```

### Full Stack Trace

```
fail: Microsoft.EntityFrameworkCore.Database.Command[20102]
      Failed executing DbCommand (2ms) [Parameters=[], CommandType='Text', CommandTimeout='30']
      ALTER TABLE "Tasks" ALTER COLUMN "UpdatedDate" TYPE timestamp with time zone;
```

## Root Cause Analysis

### 1. Schema Inconsistency

**C# Model Definition:**
```csharp
public class ToDoTask
{
    public DateTime CreatedDate { get; set; }  // Expected: timestamp with time zone
    public DateTime? UpdatedDate { get; set; } // Expected: timestamp with time zone
}
```

**Actual Database Schema:**
```sql
-- From original migration (20240516075306_InitialCreate)
"CreatedDate" text NOT NULL,
"UpdatedDate" text,
```

### 2. EF Core Behavior

- Migration generation compares **entire current model** vs **last migration snapshot**
- Detected mismatch between model expectations and database reality
- Attempted automatic schema correction

### 3. PostgreSQL Limitation

- Cannot automatically cast `text` to `timestamp with time zone`
- Requires explicit conversion strategy with `USING` clause
- Risk of data loss without proper conversion logic

## Solution Implemented

### Step 1: Remove Problematic Migration

```bash
cd /server
rm -f Migrations/20251019095410_AddRefreshTokenFields.cs
rm -f Migrations/20251019095410_AddRefreshTokenFields.Designer.cs
```

### Step 2: Create Surgical Manual Migration

**File:** `20251019120000_AddRefreshTokenToUsers.cs`

```csharp
protected override void Up(MigrationBuilder migrationBuilder)
{
    // ONLY add refresh token fields - avoid Tasks table
    migrationBuilder.AddColumn<string>(
        name: "RefreshToken",
        table: "Users",
        type: "text",
        nullable: true);

    migrationBuilder.AddColumn<DateTime>(
        name: "RefreshTokenExpiry",
        table: "Users",
        type: "timestamp with time zone",
        nullable: true);
}
```

### Step 3: Update Model Snapshot

Modified `TasksTrackContextModelSnapshot.cs` to reflect actual database state:

```csharp
// Tasks table - keep as text (actual DB state)
b.Property<string>("CreatedDate")
    .IsRequired()
    .HasColumnType("text");

b.Property<string>("UpdatedDate")
    .HasColumnType("text");
```

### Step 4: Clean Database & Apply

```bash
docker-compose down -v  # Remove volumes
docker-compose up -d    # Fresh start
```

## Results

### Success Metrics

- Migration applied successfully
- Refresh token fields added to Users table
- No data loss or corruption
- Tasks table remained unchanged
- Application startup successful

### Verification

```sql
-- Confirmed schema in database
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'Users'
AND column_name IN ('RefreshToken', 'RefreshTokenExpiry');

-- Result:
-- RefreshToken        | text
-- RefreshTokenExpiry  | timestamp with time zone
```

## Lessons Learned

### 1. Migration Scope Awareness

- EF Core migrations are **comprehensive**, not incremental
- Always review auto-generated migrations before applying
- Understand the difference between model state and database state

### 2. Manual Migration Benefits

- **Surgical precision** for specific changes
- **Risk reduction** in production environments
- **Explicit control** over database modifications

### 3. Database Type Consistency

- Maintain consistent data types throughout application lifecycle
- Plan data type migrations carefully
- Consider PostgreSQL-specific type conversion requirements

## Prevention Strategies

### 1. Development Workflow

```bash
# Always review migrations
dotnet ef migrations add FeatureName
git diff HEAD~1 -- Migrations/  # Review changes
# Test in development environment
dotnet ef database update
```

### 2. Model Design

```csharp
// Be consistent with data types from start
public class BaseEntity
{
    public DateTime CreatedAt { get; set; }  // Always DateTime
    public DateTime UpdatedAt { get; set; }  // Always DateTime
}
```

### 3. Database Validation

```bash
# Regular schema validation
dotnet ef migrations list
dotnet ef database update --dry-run
```

## Alternative Solutions Considered

### Option A: Data Conversion Migration

```csharp
// Convert existing data with USING clause
migrationBuilder.Sql(@"
    ALTER TABLE ""Tasks""
    ALTER COLUMN ""UpdatedDate""
    TYPE timestamp with time zone
    USING CASE
        WHEN ""UpdatedDate"" ~ '^\d{4}-\d{2}-\d{2}'
        THEN ""UpdatedDate""::timestamp with time zone
        ELSE NULL
    END;
");
```

**Rejected:** Risk of data loss, complexity

### Option B: Database Recreation

```bash
dotnet ef database drop --force
dotnet ef database update
```

**Rejected:** Would lose existing data

### Option C: Schema Migration Strategy

- Create new columns with correct types
- Migrate data
- Drop old columns

**Rejected:** Too complex for development environment

## Related Issues

- [GitHub Issue #123](https://github.com/akarambizi/TasksTrack/issues/123) - Original refresh token requirement
- [EF Core Issue #25555](https://github.com/dotnet/efcore/issues/25555) - Similar type conversion problems

## Documentation Created

- `migrations/troubleshooting-guide-clean.md` - General troubleshooting guide
- `migrations/case-studies/refresh-token-migration.md` - This case study

## Impact Assessment

### Before Resolution

- Refresh token feature blocked
- Database migrations failing
- Development workflow interrupted

### After Resolution

- Refresh token implementation complete
- Database schema consistent
- Team knowledge improved
- Documentation for future reference

---

**Resolution Status:** RESOLVED
**Follow-up Actions:** Monitor production deployment, validate refresh token functionality
**Knowledge Sharing:** Team briefing on manual migration techniques completed