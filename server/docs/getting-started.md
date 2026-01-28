# Getting Started Guide for TasksTrack Development

## Overview

This guide helps new developers get up and running with the TasksTrack project quickly.
It covers the essential setup steps, key concepts, and common development workflows.

## Prerequisites Checklist

Before starting development, ensure you have:

- [ ] **.NET 8 SDK** - [Download here](https://dotnet.microsoft.com/download)
- [ ] **Node.js 18+** - [Download here](https://nodejs.org/)
- [ ] **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop)
- [ ] **Git** - [Download here](https://git-scm.com/)
- [ ] **Visual Studio Code** or **Visual Studio 2022**
- [ ] **PostgreSQL** (optional - can use Docker)

## Quick Start (Development)

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/akarambizi/TasksTrack.git
cd TasksTrack

# Start the full stack with Docker (recommended for beginners)
docker-compose up --build

# Alternative: Use Make commands
make up
```

**Access Points:**

- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:5206>
- **Database**: `localhost:5432` (PostgreSQL)

### 2. Development Mode (Separate Processes)

If you want to run client and server separately for development:

**Terminal 1 - Database:**

```bash
# Start only PostgreSQL with Docker
docker-compose up postgres
```

**Terminal 2 - Backend:**

```bash
cd server
dotnet restore
dotnet run
```

**Terminal 3 - Frontend:**

```bash
cd client
npm install
npm run dev:mock  # Uses mock server for backend
# OR
npm run dev       # Uses real backend server
```

## Project Structure Overview

```text
TasksTrack/
├── server/                    # ASP.NET Core 8 Web API
│   ├── Controllers/          # HTTP request handlers
│   ├── Services/             # Business logic layer
│   ├── Repositories/         # Data access layer
│   ├── Models/               # Data models and DTOs
│   ├── Data/                 # Database context
│   ├── Tests/                # Unit and integration tests
│   └── docs/                 # Server documentation
├── client/                    # React 18 + TypeScript
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── api/              # API service functions
│   │   ├── context/          # React Context providers
│   │   └── services/         # Business logic services
│   └── mock-server/          # Development mock server
└── .github/                   # Documentation and CI/CD
    ├── copilot-instructions.md         # Main project guide
    ├── copilot-instructions-server.md  # Backend development guide
    └── copilot-instructions-client.md  # Frontend development guide
```

## Understanding the Architecture

### Backend Architecture (Clean Architecture)

```text
HTTP Request → Controller → Service → Repository → Database
                    ↓          ↓          ↓
                HTTP      Business   Data Access
               Handling    Logic      Layer
```

**Key Files to Understand:**

1. **`Program.cs`** - Application startup and configuration
2. **`DependencyInjectionSetup.cs`** - Service registration
3. **`Controllers/AuthController.cs`** - Example API controller
4. **`Services/AuthService.cs`** - Example business logic
5. **`Repositories/AuthRepository.cs`** - Example data access

### Frontend Architecture

```text
Component → Custom Hook → API Service → Backend API
    ↓           ↓            ↓
  UI Logic   State Mgmt   HTTP Calls
```

**Key Files to Understand:**

1. **`src/App.tsx`** - Main application component
2. **`src/hooks/useAuth.ts`** - Authentication logic
3. **`src/api/userAuth.ts`** - API service functions
4. **`src/context/AuthProvider.tsx`** - Global auth state

## Development Workflows

### Adding a New Feature

**Backend (Example: Add Task Categories)**

1. **Create the Model:**

   ```csharp
   // server/Models/TaskCategory.cs
   public class TaskCategory
   {
       public int Id { get; set; }
       public string Name { get; set; }
       public string Description { get; set; }
   }
   ```

2. **Create Repository Interface:**

   ```csharp
   // server/Repositories/ITaskCategoryRepository.cs
   public interface ITaskCategoryRepository
   {
       Task<IEnumerable<TaskCategory>> GetAllAsync();
       Task<TaskCategory> GetByIdAsync(int id);
       Task<TaskCategory> CreateAsync(TaskCategory category);
   }
   ```

3. **Implement Repository:**

   ```csharp
   // server/Repositories/TaskCategoryRepository.cs
   public class TaskCategoryRepository : ITaskCategoryRepository
   {
       // Implementation using Entity Framework
   }
   ```

4. **Create Service Interface and Implementation**
5. **Create Controller**
6. **Register Services in DI Container**
7. **Add Database Migration**
8. **Write Tests**

**Frontend (Example: Add Task Categories UI)**

1. **Create API Types:**

   ```typescript
   // client/src/api/taskCategories.types.ts
   export interface ITaskCategory {
       id: number;
       name: string;
       description: string;
   }
   ```

2. **Create API Service:**

   ```typescript
   // client/src/api/taskCategories.ts
   export const getTaskCategories = async (): Promise<ITaskCategory[]> => {
       // API call implementation
   };
   ```

3. **Create Custom Hook:**

   ```typescript
   // client/src/hooks/useTaskCategories.ts
   export const useTaskCategories = () => {
       // TanStack Query hook implementation
   };
   ```

4. **Create UI Components**
5. **Add to Navigation/Routes**

### Running Tests

**Backend Tests:**

```bash
cd server
dotnet test                    # Run all tests
dotnet test --logger "console;verbosity=detailed"  # Verbose output

# With coverage
make test-coverage
make test-coverage-report
```

**Frontend Tests:**

```bash
cd client
npm test                      # Run tests
npm run test:coverage         # Run with coverage
```

### Database Operations

**Add Migration:**

```bash
cd server
dotnet ef migrations add MigrationName
dotnet ef database update
```

**Reset Database:**

```bash
cd server
dotnet ef database drop
dotnet ef database update
```

## Development Best Practices

### Code Style and Conventions

**Backend (C#):**

- Classes: PascalCase (`AuthService`)
- Interfaces: Start with "I" (`IAuthService`)
- Methods: PascalCase (`RegisterAsync`)
- Private fields: camelCase with underscore (`_authRepository`)

**Frontend (TypeScript):**

- Interfaces: Start with "I" (`IAuthData`)
- Components: PascalCase (`TaskCard`)
- Hooks: Start with "use" (`useAuth`)
- Files: kebab-case (`task-card.tsx`)

### Git Workflow

1. **Create Feature Branch:**

   ```bash
   git checkout -b feature/add-task-categories
   ```

2. **Make Changes and Commit:**

   ```bash
   git add .
   git commit -m "feat: add task categories functionality"
   ```

3. **Push and Create Pull Request:**

   ```bash
   git push origin feature/add-task-categories
   ```

### Debugging Tips

**Backend Debugging:**

- Use Visual Studio debugger or VS Code debugger
- Set breakpoints in controllers, services, and repositories
- Check server logs for errors
- Use Swagger UI for API testing

**Frontend Debugging:**

- Use browser dev tools
- Check Network tab for API requests
- Use React Developer Tools extension
- Console.log for quick debugging

**Database Debugging:**

- Use pgAdmin or database client to inspect data
- Check migration files for schema changes
- Verify connection strings and credentials

## Common Commands Reference

### .NET CLI Commands

```bash
# Project commands
dotnet restore                # Restore packages
dotnet build                  # Build project
dotnet run                    # Run project
dotnet test                   # Run tests

# Entity Framework commands
dotnet ef migrations add Name # Add migration
dotnet ef database update     # Apply migrations
dotnet ef database drop       # Drop database

# Package management
dotnet add package PackageName
dotnet remove package PackageName
```

### NPM Commands

```bash
# Client development
npm install                   # Install dependencies
npm run dev                   # Start dev server
npm run dev:mock             # Start with mock server
npm run build                # Build for production
npm test                     # Run tests
npm run lint                 # Run linting
```

### Docker Commands

```bash
# Development
docker-compose up            # Start all services
docker-compose up --build   # Rebuild and start
docker-compose down          # Stop all services
docker-compose logs api      # View API logs

# Database only
docker-compose up postgres   # Start only database
```

## Environment Configuration

### Backend Configuration

**Development Settings (`appsettings.Development.json`):**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=taskstrack;User Id=postgres;Password=postgres;"
  },
  "Jwt": {
    "Secret": "your-secret-key-must-be-at-least-32-characters-long"
  }
}
```

**Environment Variables (Production):**

```bash
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection="production-connection-string"
Jwt__Secret="production-jwt-secret"
```

### Frontend Configuration

**Environment Variables (`.env.local`):**

```bash
VITE_API_URL=http://localhost:5206/api
VITE_APP_NAME=TasksTrack
```

## Learning Resources

### Essential Documentation

1. **Project Docs**: Start with `/server/docs/` folder
   - `clean-architecture.md` - Understand the architecture
   - `repository-pattern.md` - Learn data access patterns
   - `dependency-injection.md` - Understand DI concepts
   - `learning-notes.md` - Development insights and tips

2. **GitHub Instructions**:
   - `.github/copilot-instructions.md` - Main project overview
   - `.github/copilot-instructions-server.md` - Backend development guide
   - `.github/copilot-instructions-client.md` - Frontend development guide

### External Resources

**ASP.NET Core:**

- [Official ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [Clean Architecture Template](https://github.com/jasontaylordev/CleanArchitecture)

**React + TypeScript:**

- [React Official Docs](https://reactjs.org/docs/getting-started.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TanStack Query](https://tanstack.com/query)

## Troubleshooting

### Common Issues

**Database Connection Errors:**

```bash
# Check if PostgreSQL is running
docker-compose ps

# Reset database
cd server
dotnet ef database drop
dotnet ef database update
```

**Port Already in Use:**

```bash
# Find process using port
lsof -i :5206  # Check backend port
lsof -i :3000  # Check frontend port

# Kill process
kill -9 PID
```

**Build Errors:**

```bash
# Clean and restore
cd server
dotnet clean
dotnet restore
dotnet build

# For frontend
cd client
rm -rf node_modules
npm install
```

## Getting Help

### Code Understanding

1. **Read existing code** - Start with similar features
2. **Check documentation** - Project docs explain patterns
3. **Follow the data flow** - Trace requests through layers
4. **Use the debugger** - Step through code execution

### Development Questions

1. **Check the existing patterns** - How are similar features implemented?
2. **Review the tests** - They show how components should be used
3. **Consult the documentation** - Architecture explanations and best practices
4. **Use git history** - See how features were added previously

### Next Steps

1. **Explore the codebase** - Understand existing features
2. **Run the tests** - Ensure everything works
3. **Make a small change** - Add a simple feature
4. **Read the documentation** - Understand the architecture
5. **Start building** - Follow the established patterns

---

*Welcome to TasksTrack development! This project is designed for learning - feel free to experiment and explore.*
