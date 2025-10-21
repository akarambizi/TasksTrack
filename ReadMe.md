# TasksTrack

TasksTrack is a task tracking app with integrated Pomodoro timer functionality to enhance productivity.

## About This Project

This is a **personal learning project** designed to explore and master full-stack development concepts using modern technologies. The project demonstrates Clean Architecture principles, repository patterns, JWT authentication, and modern React development practices.

## AI-Assisted Development

This project was developed with assistance from AI tools as part of a comprehensive learning experience:

- **[GitHub Copilot](https://github.com/features/copilot)** - Used for code suggestions, completion, and learning modern development patterns
- **[GitHub MCP Server](https://github.com/modelcontextprotocol/servers)** - Utilized for code review, security analysis, and best practice recommendations

## Documentation

📚 **Comprehensive technical documentation is available in [`/server/docs`](./server/docs):**

- **[Getting Started Guide](./server/docs/getting-started.md)** - Complete setup and development workflow
- **[Clean Architecture](./server/docs/clean-architecture.md)** - Architecture patterns and implementation
- **[Repository Pattern](./server/docs/repository-pattern.md)** - Data access layer design
- **[Dependency Injection](./server/docs/dependency-injection.md)** - DI container and service management
- **[API Development](./server/docs/api-development.md)** - RESTful API design and best practices
- **[Database Setup](./server/docs/db-setup.md)** - PostgreSQL and Entity Framework configuration
- **[Authentication](./server/docs/authentication.md)** - JWT implementation and security
- **[Testing](./server/docs/unit-tests.md)** - Unit testing setup and patterns
- **[Learning Notes](./server/docs/learning-notes.md)** - Development insights and observations

The documentation is designed to help developers understand the architectural decisions, patterns used, and provide guidance for extending the application.

## Features

- **Task Management:** Create, update, delete, and organize tasks with priority levels
- **Pomodoro Timer:** Built-in timer for focused work sessions using the Pomodoro Technique
- **User Authentication:** Secure registration, login, and session management with JWT tokens
- **Session History:** Track and review completed Pomodoro sessions and productivity metrics

## Technologies

### Backend

- **[ASP.NET Core](https://dotnet.microsoft.com/apps/aspnet)** - Web API framework
- **[PostgreSQL](https://www.postgresql.org/)** - Database
- **[Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)** - Object-relational mapping
- **[JWT Authentication](https://jwt.io/)** - Secure token-based authentication

### Frontend

- **[React.js](https://reactjs.org/)** - Component-based UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server
- **[TanStack Query](https://tanstack.com/query)** - Data fetching and caching
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - UI components

## Prerequisites

- **[Docker](https://www.docker.com/get-started)** and **[Docker Compose](https://docs.docker.com/compose/)**
- **[Make](https://www.gnu.org/software/make/)** (optional, for convenience commands)

## Quick Start

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/akarambizi/TasksTrack.git
   cd TasksTrack
   ```

2. **Start with Docker Compose:**

   ```bash
   docker-compose up --build
   # Or use the Makefile shortcut
   make up
   ```

3. **Access the Application:**

   - **Frontend:** <http://localhost:3000>
   - **Backend API:** <http://localhost:5206>

### Development Commands

```bash
make up      # Start all services
make down    # Stop all services
make help    # View all available commands
```

## Development Setup

<details>
<summary>Client Development (Click to expand)</summary>

```bash
cd client
yarn install

# With Mock Server (UI development)
yarn dev:mock

# Access: http://localhost:3000
# Mock API: http://localhost:4200
# Test credentials: test@example.com / Password!123
```

</details>

<details>
<summary>Server Development (Click to expand)</summary>

```bash
cd server

# Build and run
make build
make run

# Access: http://localhost:5206
# API Documentation (Swagger): http://localhost:5206/swagger
```

</details>
