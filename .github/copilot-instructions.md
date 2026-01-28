# TasksTrack - GitHub Copilot Instructions

## Project Overview

TasksTrack is a full-stack productivity application built with:

- **Backend**: ASP.NET Core 8 Web API with PostgreSQL
- **Frontend**: React 18 + TypeScript + Vite
- **Architecture**: Clean Architecture with Repository Pattern
- **Authentication**: JWT Token-based authentication
- **Database**: Entity Framework Core with PostgreSQL
- **UI**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query for server state

## Instruction Files Structure

This project has separated instruction files for better readability and focused guidance:

### **Main Instructions** (this file)
- Project overview and general guidelines
- Development workflow and best practices
- Git workflow and code review guidelines

### **Server Instructions** (`.github/copilot-instructions-server.md`)
- References to existing ASP.NET Core 8 patterns in your codebase
- Guides Copilot to follow your established C# conventions and architecture
- Points to actual implementations (AuthController.cs, AuthService.cs, etc.)
- Emphasizes learning through understanding existing patterns
- Focuses on consistency with your Repository Pattern and JWT authentication

### **Client Instructions** (`.github/copilot-instructions-client.md`)
- References to existing React 18 + TypeScript patterns in your codebase
- Guides Copilot to follow your established component and hook patterns
- Points to actual implementations (useAuth.ts, Login.tsx, etc.)
- Emphasizes learning through understanding existing code structure
- Focuses on consistency with your TanStack Query and interface patterns

## General Guidelines

**IMPORTANT: Always examine and follow the patterns already established in your existing codebase
rather than creating new ones.**

- **Reference existing files first** before writing new code
- **Study established patterns** in your Controllers, Services, Components, and Hooks
- **Maintain consistency** with your existing naming conventions and architecture
- **Follow your established error handling** and validation approaches
- **Use the same libraries and patterns** already implemented in your project
- **Focus on learning** - understand the "why" behind existing patterns, not just the "how"
- **Avoid unnecessary emojis** in code, comments, or documentation - keep content clean and professional
## Key Naming Conventions Summary

### Server (C#/.NET)
```csharp
// Classes: PascalCase
public class HabitService

// Interfaces: Start with "I"
public interface IHabitService

// Methods: PascalCase
public async Task<bool> UpdateAsync()

// Private fields: camelCase with underscore
private readonly IHabitRepository _repository;
```

### Client (TypeScript/React)

```typescript
// Interfaces: Start with "I" + PascalCase
interface ITaskCardProps {
    task: IHabit;
    onUpdate: (task: IHabit) => void;
}

// Components: PascalCase
export const TaskCard: React.FC<ITaskCardProps> = ({ task, onUpdate }) => {
    // Component logic
};

// Custom hooks: camelCase starting with "use"
export const useTasks = () => {
    // Hook logic
};
```

### Project Structure Overview

```
TasksTrack/
├── .github/
│   ├── copilot-instructions.md         # Main instructions (this file)
│   ├── copilot-instructions-server.md  # Server-specific instructions
│   └── copilot-instructions-client.md  # Client-specific instructions
├── server/                             # ASP.NET Core 8 Web API
│   ├── Controllers/                    # API Controllers
│   ├── Services/                       # Business logic layer
│   ├── Repositories/                   # Data access layer
│   ├── Models/                         # Domain models and DTOs
│   ├── Data/                           # DbContext and configurations
│   └── Tests/                          # Unit and integration tests
└── client/                             # React 18 + TypeScript + Vite
    ├── src/
    │   ├── api/                        # API service functions and types
    │   ├── components/                 # Reusable UI components
    │   ├── hooks/                      # Custom React hooks
    │   ├── context/                    # React Context providers
    │   └── services/                   # Business logic services
    └── public/
```

## Development Workflow

### 1. Git Workflow

- Create feature branches from main
- Use conventional commit messages
- **Keep commit messages concise** - Under 50 characters for the title, be descriptive but brief
- **Separate frontend and backend PRs** - Create separate pull requests for client and server changes
  to keep PRs smaller and more focused
- Write meaningful pull request descriptions
- Test thoroughly before merging

### 2. Code Review Checklist

- [ ] Code follows established patterns
- [ ] Includes appropriate error handling
- [ ] Has unit tests for new functionality
- [ ] API endpoints are properly documented
- [ ] Security considerations are addressed
- [ ] Performance implications are considered

### 3. Quality Assurance Requirements

**MANDATORY: Every feature must meet these quality standards before completion:**

#### **Build Quality**

- [ ] **Zero compilation errors** - All code must compile successfully
- [ ] **Zero warnings** - Resolve all TypeScript/C# compiler warnings
- [ ] **Clean builds** - Both `npm run build` (frontend) and `dotnet build` (backend) must succeed

#### **Test Requirements**

- [ ] **Test coverage ≥ 80%** - Maintain minimum 80% code coverage across the project
- [ ] **All tests passing** - 100% test pass rate required before merging
- [ ] **New features have tests** - Every new feature must include comprehensive unit tests
- [ ] **Edge cases covered** - Test error conditions, null values, and boundary conditions

#### **Validation Commands**

Run these commands before considering any feature complete:

**Frontend:**
```bash
npm run build        # Must succeed with no errors
npm run test -- --run --coverage  # Must show ≥80% coverage and 100% pass rate
npm run lint         # Must pass with no errors
```

**Backend:**
```bash
dotnet build         # Must succeed with no warnings/errors
dotnet test          # Must show 100% test pass rate
```

**Quality Gate:** If any of these commands fail or show insufficient coverage, the feature is **not ready** for merge.

### 4. Debugging Tips

- Use Visual Studio/VS Code debugger effectively
- Set breakpoints in both client and server code
- Use browser dev tools for frontend debugging
- Monitor network requests in browser
- Check server logs for API issues

## Key Commands and Tools

### .NET CLI Commands

```bash
# Project management
dotnet new webapi -n MyProject
dotnet restore
dotnet build
dotnet run
dotnet test

# Entity Framework migrations
dotnet ef migrations add MigrationName
dotnet ef database update
dotnet watch run

# Package management
dotnet add package PackageName
dotnet remove package PackageName
dotnet list package
```

### Node.js/NPM Commands

```bash
# Client development
npm run dev          # Start dev server
npm run dev:mock     # Start with mock server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Run ESLint
```

### Docker Commands

```bash
# Full stack development
docker-compose up --build    # Start all services
docker-compose down          # Stop all services
make up                      # Alternative using Makefile
make down                    # Alternative using Makefile
```

## Learning Resources

For detailed implementation guidance, refer to the specific instruction files:

- **Server Development**: See `.github/copilot-instructions-server.md` for C#/.NET pattern references
- **Client Development**: See `.github/copilot-instructions-client.md` for React/TypeScript pattern references

## Key Learning Philosophy

**This is a learning project designed to help you master full-stack development through hands-on experience.**

### **Learning Approach**
- **Study existing code first** - Your codebase contains real, working implementations
- **Understand patterns before extending** - Learn why certain approaches were chosen
- **Build incrementally** - Each new feature should build upon established foundations
- **Ask questions** - Always seek to understand the reasoning behind patterns and practices

### **Growth Areas**
- **Backend**: C# language features, .NET ecosystem, Entity Framework, API design, security
- **Frontend**: React patterns, TypeScript advanced features, state management, performance optimization
- **Full-Stack**: Integration patterns, testing strategies, deployment, architecture decisions

Remember: Both frontend and backend development have endless learning opportunities.
The patterns in your codebase are your foundation - understanding them deeply will make you
a better developer as you continue to grow and evolve your skills.