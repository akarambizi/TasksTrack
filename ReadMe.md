# TasksTrack

TasksTrack is a task tracking app with integrated Pomodoro timer functionality to enhance productivity.

## About This Project

This is a **personal learning project** designed to explore and master full-stack development concepts using modern technologies. The project demonstrates Clean Architecture principles, repository patterns, JWT authentication, and modern React development practices.

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

Before running the application, ensure you have the following installed:

- **[Docker](https://www.docker.com/get-started)** and **[Docker Compose](https://docs.docker.com/compose/)**
- **[Node.js](https://nodejs.org/)** (v18+ recommended) and **[Yarn](https://yarnpkg.com/)**
- **[.NET 8 SDK](https://dotnet.microsoft.com/download)** (for local server development)
- **[Make](https://www.gnu.org/software/make/)** (optional, for convenience commands)

## Quick Start

### Option 1: Docker Compose (Recommended)

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/akarambizi/TasksTrack.git
   cd TasksTrack
   ```

2. **Start with Docker Compose:**

   ```bash
   docker-compose up --build
   ```

3. **Access the Application:**

   - **Frontend:** <http://localhost:3000>
   - **Backend API:** <http://localhost:5206>

### Option 2: Makefile Commands

```bash
# Start all services with live logs
make up

# Stop all services
make down

# View all available commands
make help
```

## Running Client and Server Separately

### Client Development

1. **Navigate to Client Directory:**

   ```bash
   cd client
   ```

2. **Install Dependencies:**

   ```bash
   yarn install
   ```

3. **Development Options:**

   - **With Mock Server (Recommended for UI development):**

     ```bash
     yarn dev:mock
     ```

     This starts both the Vite dev server (<http://localhost:3000>) and mock server (<http://localhost:4200>)

   - **Separate Processes:**

     ```bash
     # Terminal 1: Start development server
     yarn dev

     # Terminal 2: Start mock server
     yarn mock-server
     ```

     When using the mock server for testing, use these credentials:

        ```text
        Email: test@example.com
        Password: Password!123
        ```

    **Note:** The mock server simulates API responses for development and testing purposes.

#### Server Development

1. **Navigate to Server Directory:**

   ```bash
   cd server
   ```

2. **Build and Run:**

   ```bash
   # Build the server
   make build

   # Run the server
   make run
   ```

3. **Access the Server:**

   - **API Endpoint:** <http://localhost:5206>
   - **API Documentation:** Available via Swagger UI
