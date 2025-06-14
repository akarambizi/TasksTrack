# API Documentation for TasksTrack

This document describes the API structure and usage for the TasksTrack application.

## API Structure Overview

The API layer is organized into several modules:

- **Task Management**: CRUD operations for tasks
- **Authentication**: User registration, login, logout, and password reset
- **User Management**: User profile management

## API Client

The application uses a custom Axios client with interceptors for:

- Authentication header management
- Token refresh handling
- Error handling
- Response processing

## Task Management API

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tasks` | GET | Get all tasks |
| `/api/tasks` | POST | Create a new task |
| `/api/tasks/:id` | GET | Get a task by ID |
| `/api/tasks/:id` | PUT | Update a task |
| `/api/tasks/:id` | DELETE | Delete a task |

### Available Functions

- `getTodoTaskData(query)`: Fetch tasks with optional query parameters
- `getTaskById(id)`: Fetch a single task by ID
- `createTask(taskData)`: Create a new task
- `updateTask(id, taskData)`: Update an existing task
- `updateTaskCompletion(id, completed)`: Toggle task completion status
- `updateTaskPriority(id, priority)`: Update task priority
- `deleteTask(id)`: Delete a task

## Authentication API

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register a new user |
| `/api/auth/login` | POST | Login user |
| `/api/auth/logout` | POST | Logout user |
| `/api/auth/reset-password` | POST | Request password reset |
| `/api/auth/validate-token` | POST | Validate auth token |

### Available Functions

- `registerUser(userData)`: Register a new user
- `loginUser(userData)`: Login a user
- `logoutUser()`: Logout the current user
- `resetPassword(data)`: Request a password reset
- `validateToken(token)`: Validate auth token

## User Management API

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users` | GET | Get all users |
| `/api/users/:id` | GET | Get user by ID |
| `/api/users` | POST | Create a new user |
| `/api/users/:id` | PUT | Update user |
| `/api/users/:id` | DELETE | Delete user |
| `/api/users/current` | GET | Get current user profile |

### Available Functions

- `getUsers()`: Get all users
- `getUserById(id)`: Get user by ID
- `createUser(userData)`: Create a new user
- `updateUser(id, userData)`: Update user
- `deleteUser(id)`: Delete user
- `getCurrentUser()`: Get current user profile

## React Query Hooks

For convenient data fetching and state management, the application provides custom React Query hooks:

### Task Hooks

- `useTasks(query)`: Fetch all tasks with optional filtering
- `useTask(id)`: Fetch a single task
- `useCreateTask()`: Create a new task
- `useUpdateTask()`: Update a task
- `useToggleTaskCompletion()`: Toggle task completion status
- `useUpdateTaskPriority()`: Update task priority
- `useDeleteTask()`: Delete a task

### Authentication Hooks

- `useRegister()`: Register a new user
- `useLogin()`: Login a user
- `useLogout()`: Logout the current user
- `useResetPassword()`: Request a password reset
- `useIsAuthenticated()`: Check if the user is currently authenticated

## Toast Notifications

All API operations provide user feedback through toast notifications using the `ToastService`:

- `ToastService.success(message, title)`: Show success notification
- `ToastService.error(message, title)`: Show error notification
- `ToastService.info(message, title)`: Show info notification
- `ToastService.warning(message, title)`: Show warning notification
