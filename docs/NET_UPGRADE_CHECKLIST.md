# .NET Version Upgrade Checklist

## Pre-Upgrade Preparation

- [ ] **Backup your project and database**
- [ ] **Check .NET version compatibility matrix**
- [ ] **Review breaking changes in release notes**
- [ ] **Ensure all team members are aware of the upgrade**

## Step 1: SDK Installation

- [ ] Download and install new .NET SDK
- [ ] Verify installation: `dotnet --version`
- [ ] Update IDE/editor to support new version

## Step 2: Project File Updates

- [ ] Update `<TargetFramework>` in all `.csproj` files
  - Main project
  - Test projects
  - Any additional projects in solution
- [ ] Build solution to check for immediate issues

## Step 3: Package Updates

- [ ] Update core packages first:
  - [ ] `Microsoft.AspNetCore.*` packages
  - [ ] `Microsoft.EntityFrameworkCore.*` packages
  - [ ] Authentication packages
- [ ] Update third-party packages
- [ ] Resolve any package version conflicts
- [ ] Add missing packages to test projects if needed

## Step 4: Infrastructure Updates

- [ ] **Docker files**
  - [ ] Update base image versions
  - [ ] Update tool installation commands
- [ ] **CI/CD pipelines**
  - [ ] GitHub Actions workflow files
  - [ ] Build scripts
  - [ ] Deployment configurations
- [ ] **Docker Compose**
  - [ ] Check service configurations
  - [ ] Update environment variables if needed

## Step 5: Database Migrations

- [ ] **Check for pending model changes**
  - Run: `dotnet ef migrations list`
- [ ] **Create new migration if needed**
  - Run: `dotnet ef migrations add UpgradeToNetX`
- [ ] **Review generated migration**
  - Check for breaking changes
  - Add custom SQL for complex conversions
- [ ] **Test migration in development**
  - Backup database first
  - Apply migration: `dotnet ef database update`

## Step 6: Docker Image Management

- [ ] **Rebuild all Docker images**
  - Use: `docker-compose build --no-cache`
- [ ] **Test container startup**
  - Run: `docker-compose up`
- [ ] **Verify all services work correctly**

## Step 7: Testing and Verification

- [ ] **Build verification**
  - [ ] Solution builds without warnings
  - [ ] All projects compile successfully
- [ ] **Unit tests**
  - [ ] All existing tests pass
  - [ ] No new test failures introduced
- [ ] **Integration tests**
  - [ ] API endpoints work correctly
  - [ ] Database operations function properly
- [ ] **End-to-end testing**
  - [ ] Full application workflow works
  - [ ] Authentication and authorization work
  - [ ] Data persistence functions correctly

## Step 8: Performance and Security Review

- [ ] **Check for performance improvements**
  - Monitor startup time
  - Check memory usage
  - Validate response times
- [ ] **Verify security enhancements**
  - Test authentication flows
  - Validate authorization policies
  - Check for new security features

## Common Issues and Solutions

### Package Version Conflicts
- **Solution**: Ensure all projects reference compatible package versions
- **Command**: `dotnet list package --outdated`

### Docker Build Failures
- **Solution**: Use `--no-cache` flag when rebuilding images
- **Command**: `docker-compose build --no-cache`

### Database Migration Errors
- **Solution**: Use explicit SQL for complex type conversions
- **Example**: Add `USING` clauses for PostgreSQL type changes

### EF Core Model Changes
- **Solution**: Create new migration and review changes carefully
- **Command**: `dotnet ef migrations add UpdateModelForNetX`

## Rollback Plan

If issues arise during upgrade:

1. **Code rollback**
   - [ ] Revert target framework changes
   - [ ] Downgrade package versions
   - [ ] Restore previous Docker configurations

2. **Database rollback**
   - [ ] Restore database from backup
   - [ ] Or remove recent migrations: `dotnet ef migrations remove`

3. **Infrastructure rollback**
   - [ ] Revert CI/CD changes
   - [ ] Rebuild Docker images with old configuration

## Post-Upgrade Tasks

- [ ] **Update documentation**
  - API documentation
  - Deployment guides
  - Development setup instructions
- [ ] **Team communication**
  - Share upgrade notes with team
  - Update development environment setup
  - Schedule team review session
- [ ] **Monitor production**
  - Watch for performance changes
  - Monitor error logs
  - Track resource usage

## Resources

- [.NET Release Notes](https://docs.microsoft.com/en-us/dotnet/core/whats-new/)
- [EF Core Breaking Changes](https://docs.microsoft.com/en-us/ef/core/what-is-new/)
- [ASP.NET Core Migration Guides](https://docs.microsoft.com/en-us/aspnet/core/migration/)

---

*Keep this checklist handy for future .NET version upgrades!*