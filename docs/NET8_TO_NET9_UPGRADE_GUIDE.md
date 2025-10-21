# .NET 8 to .NET 9 Upgrade Guide

## Overview

This document details the complete process of upgrading TasksTrack from .NET 8 to .NET 9, including all challenges encountered and solutions implemented. This serves as a learning reference for future .NET version upgrades.

## Pre-Upgrade State

**Before the upgrade:**
- Target Framework: `net8.0`
- .NET SDK: 8.0.403
- Package versions:
  - `Microsoft.AspNetCore.Authentication.JwtBearer`: 8.0.0
  - `Microsoft.EntityFrameworkCore`: 8.0.0
  - `Microsoft.EntityFrameworkCore.Design`: 8.0.0
  - `Npgsql.EntityFrameworkCore.PostgreSQL`: 8.0.0
  - `System.IdentityModel.Tokens.Jwt`: 8.8.0
  - `Microsoft.IdentityModel.Tokens`: 8.8.0

## Step-by-Step Upgrade Process

### 1. Install .NET 9 SDK

**What we did:**
```bash
# Downloaded and installed .NET 9 SDK
curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --channel 9.0
```

**Verification:**
```bash
dotnet --version
# Output: 9.0.306
```

**Learning Point:** Always verify the SDK installation before proceeding with project changes.

### 2. Update Target Framework

**Files modified:**
- `/server/server.csproj`
- `/server/Tests/Tests.csproj`

**Changes made:**
```xml
<!-- Before -->
<TargetFramework>net8.0</TargetFramework>

<!-- After -->
<TargetFramework>net9.0</TargetFramework>
```

**Learning Point:** All projects in the solution must use the same target framework version to avoid compatibility issues.

### 3. Update Package References

**Strategy:** Update packages in dependency order to avoid conflicts.

**Order of updates:**
1. Core packages first
2. Authentication packages
3. Entity Framework packages
4. Third-party packages

**Commands used:**
```bash
# Core packages
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL

# Additional packages
dotnet add package Microsoft.AspNetCore.OpenApi
dotnet add package Swashbuckle.AspNetCore
dotnet add package BCrypt.Net-Next

# JWT packages (updated to resolve version conflicts)
dotnet add package System.IdentityModel.Tokens.Jwt
dotnet add package Microsoft.IdentityModel.Tokens
```

**Final package versions:**
```xml
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="9.0.10" />
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="9.0.10" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="9.0.10" />
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="9.0.4" />
<PackageReference Include="System.IdentityModel.Tokens.Jwt" Version="8.14.0" />
<PackageReference Include="Microsoft.IdentityModel.Tokens" Version="8.14.0" />
<PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="9.0.6" />
<PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="9.0.10" />
```

### 4. Resolve Package Version Conflicts

**Problem encountered:**
```
warning MSB3277: Found conflicts between different versions of "Microsoft.EntityFrameworkCore.Relational"
```

**Root cause:** Test project was missing EntityFramework packages, causing version conflicts between main project and test project.

**Solution applied:**
Added missing packages to test project (`Tests.csproj`):
```xml
<PackageReference Include="Microsoft.EntityFrameworkCore.Relational" Version="9.0.10" />
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="9.0.4" />
```

**Learning Point:** When upgrading packages, ensure all projects in the solution have compatible package references, especially for shared dependencies.

### 5. Update Infrastructure Files

#### 5.1 GitHub Workflow (`.github/workflows/run-tests.yml`)

**Change:**
```yaml
# Before
- name: Setup .NET
  uses: actions/setup-dotnet@v4
  with:
    dotnet-version: '8.0.x'

# After  
- name: Setup .NET
  uses: actions/setup-dotnet@v4
  with:
    dotnet-version: '9.0.x'
```

#### 5.2 Dockerfile (`server/Dockerfile`)

**Changes:**
```dockerfile
# Before
FROM mcr.microsoft.com/dotnet/sdk:8.0
RUN dotnet tool install --global dotnet-ef --version 8.0.*

# After
FROM mcr.microsoft.com/dotnet/sdk:9.0
RUN dotnet tool install --global dotnet-ef --version 9.0.*
```

**Learning Point:** Infrastructure files (CI/CD, Docker) must be updated alongside application code to maintain consistency.

### 6. Handle Database Migration Issues

#### 6.1 Problem: Docker Container Using Old SDK

**Error encountered:**
```
error NETSDK1045: The current .NET SDK does not support targeting .NET 9.0
```

**Root cause:** Docker images were built with .NET 8 SDK but project now targets .NET 9.

**Solution:**
```bash
# Rebuild Docker images with no cache
/usr/local/bin/docker-compose build --no-cache server migration
```

#### 6.2 Problem: Pending Model Changes

**Error encountered:**
```
The model for context 'TasksTrackContext' has pending changes. Add a new migration before updating the database.
```

**Root cause:** .NET 9 and EF Core 9 introduced changes to default data type mappings.

**Solution:**
```bash
# Create new migration for .NET 9 changes
/usr/local/bin/docker-compose run --rm migration dotnet ef migrations add UpdateToNet9Migration
```

#### 6.3 Problem: PostgreSQL Type Conversion

**Error encountered:**
```
42804: column "UpdatedDate" cannot be cast automatically to type timestamp with time zone
Hint: You might need to specify "USING "UpdatedDate"::timestamp with time zone".
```

**Root cause:** Migration tried to convert string date columns to proper timestamp types without explicit casting.

**Solution:** Modified migration file to use explicit SQL:
```csharp
protected override void Up(MigrationBuilder migrationBuilder)
{
    // Convert string date columns to proper timestamp with time zone
    migrationBuilder.Sql(@"
        ALTER TABLE ""Tasks"" 
        ALTER COLUMN ""UpdatedDate"" TYPE timestamp with time zone 
        USING CASE 
            WHEN ""UpdatedDate"" IS NULL THEN NULL 
            ELSE ""UpdatedDate""::timestamp with time zone 
        END;
    ");

    migrationBuilder.Sql(@"
        ALTER TABLE ""Tasks"" 
        ALTER COLUMN ""CreatedDate"" TYPE timestamp with time zone 
        USING ""CreatedDate""::timestamp with time zone;
    ");
    
    // Other column updates...
}
```

**Learning Point:** When upgrading EF Core versions, be prepared for data type mapping changes that may require custom migration SQL.

## Verification Steps

### 1. Build Verification
```bash
cd server
dotnet build
# Expected: Build succeeded with no warnings
```

### 2. Test Verification
```bash
dotnet test
# Expected: All tests pass
```

### 3. Migration Verification
```bash
/usr/local/bin/docker-compose run --rm migration dotnet ef database update
# Expected: Migration applies successfully
```

### 4. Full Stack Verification
```bash
/usr/local/bin/docker-compose up
# Expected: All containers start successfully
```

## Common Pitfalls and Solutions

### 1. Version Compatibility Matrix

**Always check compatibility between:**
- .NET SDK version
- Target framework version
- Package versions
- Docker base image versions

### 2. Database Migration Strategy

**For breaking changes:**
1. Backup database before migration
2. Test migrations in development first
3. Use explicit SQL for complex type conversions
4. Consider data migration scripts for production

### 3. Docker Image Management

**When changing base images:**
1. Always use `--no-cache` flag when rebuilding
2. Update both development and production Dockerfiles
3. Test container startup after rebuild

### 4. CI/CD Pipeline Updates

**Remember to update:**
- GitHub Actions workflow files
- Docker Compose files
- Build scripts
- Deployment configurations

## Benefits Gained from .NET 9 Upgrade

### Performance Improvements
- Better memory management
- Improved JSON serialization performance
- Enhanced native AOT support

### Security Enhancements
- Latest security patches
- Improved authentication features
- Better token handling

### Developer Experience
- Enhanced IDE support
- Better debugging capabilities
- Improved error messages

## Rollback Strategy

If issues arise, rollback steps:
1. Revert target framework to `net8.0`
2. Downgrade package versions to .NET 8 compatible versions
3. Rebuild Docker images
4. Restore database from backup if needed

## Conclusion

The upgrade from .NET 8 to .NET 9 involved:
- **4 project files** updated
- **9 package references** upgraded
- **3 infrastructure files** modified
- **1 database migration** created with custom SQL
- **Multiple Docker images** rebuilt

**Total time invested:** Approximately 2-3 hours
**Key learning:** Plan for database migration complexity when upgrading EF Core versions.

## References

- [.NET 9 Release Notes](https://docs.microsoft.com/en-us/dotnet/core/whats-new/dotnet-9)
- [EF Core 9 Breaking Changes](https://docs.microsoft.com/en-us/ef/core/what-is-new/ef-core-9.0/breaking-changes)
- [ASP.NET Core 9 Migration Guide](https://docs.microsoft.com/en-us/aspnet/core/migration/80-to-90)

---

*This document was created as part of the TasksTrack project upgrade on October 20, 2025.*