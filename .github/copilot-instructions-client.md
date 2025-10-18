# TasksTrack Client - GitHub Copilot Instructions

## Follow Existing Project Patterns

**🎯 IMPORTANT: Always examine and follow the patterns already established in the existing codebase rather than creating new ones.**

### Project Architecture

- **React 18** with functional components and hooks
- **TypeScript** for type safety
- **Vite** for fast development and building
- **TanStack Query** for server state management
- **Tailwind CSS + shadcn/ui** for styling
- **React Router** for navigation
- **Custom hooks** for business logic

## Key Principles for Code Generation

### 1. **Follow Existing Naming Conventions**

**Examine these files to understand the established patterns:**
- `client/src/api/` - for API interface naming (e.g., `IToDoTask`, `IAuthData`)
- `client/src/hooks/` - for custom hook patterns (e.g., `useAuth.ts`, `useForm.ts`)
- `client/src/components/` - for component structure and naming

**Key Patterns Already Established:**
- ✅ Interfaces: Start with "I" + PascalCase (`IToDoTask`, `IAuthData`)
- ✅ Components: PascalCase exports (`Login`, `Tasks`, `TasksContainer`)
- ✅ Custom hooks: camelCase starting with "use" (`useForm`, `useTodoTaskData`)
- ✅ Files: PascalCase for components, camelCase for utilities

### 2. **Follow Existing Project Structure**

**Reference the actual folder structure in:**

```text
client/src/
├── api/                    # API service functions and types
├── components/            # UI components organized by feature
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── services/             # Business logic services
├── lib/                  # Utility functions
└── mock-server/          # Development mock server
```

**When creating new files, examine existing files in the same directory to match:**
- File naming conventions
- Export patterns
- Import organization
- Component structure

### 3. **Reference Existing Interface Patterns**

**Before creating new interfaces, check these existing files:**

- `client/src/api/toDoTask.types.ts` - for task-related interfaces
- `client/src/api/userAuth.types.ts` - for authentication interfaces
- `client/src/hooks/useForm.ts` - for hook return type patterns

**Always maintain consistency with the established interface patterns:**

- Use the same property naming conventions as existing interfaces
- Follow the same optional property patterns (`?:`)
- Match the data types already established in the codebase

### 4. **Follow Existing Component Patterns**

**Study these component examples to understand the established patterns:**

- `client/src/components/Auth/Login.tsx` - for form components and validation
- `client/src/components/Tasks/Tasks.tsx` - for data fetching and rendering patterns
- `client/src/components/Tasks/TasksContainer.tsx` - for container component structure

**Key patterns to follow:**

- Component export pattern: `export const ComponentName = () => {}`
- Hook usage patterns from existing components
- CSS class naming conventions using Tailwind
- State management patterns already established
- Event handler naming and structure

### 5. **Follow Existing Custom Hook Patterns**

**Reference these existing hooks before creating new ones:**

- `client/src/hooks/useAuth.ts` - for authentication-related hooks
- `client/src/hooks/useTasks.ts` - for task management hooks
- `client/src/hooks/useForm.ts` - for form handling patterns

**Key patterns to maintain:**

- Hook naming and export structure
- TanStack Query usage patterns already established
- Error handling approach used in existing hooks
- Type definitions and return patterns
- JSDoc comment style for hook documentation

### 6. **Follow Existing API Service Patterns**

**Study the established API patterns in:**

- `client/src/api/toDoTask.ts` - for task-related API functions
- `client/src/api/userAuth.ts` - for authentication API functions
- `client/src/hooks/useQueryHooks.ts` - for query key patterns

**Maintain consistency with:**

- Function naming conventions already used
- Error handling patterns established
- Type definitions and interfaces
- Request/response structure patterns
- Export patterns used in API files

### 7. **Reference Existing Form Patterns**

**Study the form handling approach in:**

- `client/src/hooks/useForm.ts` - for form validation and state management
- `client/src/components/Auth/Login.tsx` - for form component structure
- `client/src/components/Auth/SignUp.tsx` - for form submission patterns

**Follow the established patterns for:**

- Form validation logic and error handling
- State management approach using the `useForm` hook
- Form submission and error display patterns
- Input handling and form field structure

### 8. **Follow Existing Context Patterns**

**Reference the established context implementation:**

- `client/src/context/AuthContext.tsx` - for context structure and typing
- `client/src/context/AuthProvider.tsx` - for provider implementation patterns
- `client/src/context/ProtectedRoute.tsx` - for route protection patterns

**Maintain consistency with:**

- Context value interface definitions
- Provider component structure and state management
- Custom hook patterns for context consumption
- Error boundary and protection patterns

## Key Areas to Reference Before Creating New Code

### 1. **TanStack Query Patterns**

**Study the existing query patterns in:**

- `client/src/hooks/useQueryHooks.ts` - for query key management and data fetching
- `client/src/hooks/useAuth.ts` - for mutation patterns and error handling
- `client/src/hooks/useTasks.ts` - for optimistic updates and cache management

### 2. **Error Handling Patterns**

**Reference existing error handling in:**

- `client/src/hooks/useAuth.ts` - for API error handling and user feedback
- `client/src/services/toastService.ts` - for user notification patterns
- `client/src/hooks/useForm.ts` - for form validation and error display

### 3. **Loading and Error State Patterns**

**Study how loading and error states are handled in:**

- `client/src/components/Tasks/Tasks.tsx` - for data loading and empty states
- `client/src/components/Auth/Login.tsx` - for form loading states
- `client/src/hooks/useAuth.ts` - for mutation loading indicators

### 4. **Styling and UI Patterns**

**Follow the established styling approach in:**

- `client/src/components/ui/` - for shadcn/ui component usage
- `client/src/components/Tasks/Tasks.tsx` - for Tailwind CSS class patterns
- `client/src/components/Auth/Login.tsx` - for form styling consistency

### 5. **Routing Patterns**

**Reference routing implementation in:**

- `client/src/App.tsx` - for route structure and protected routes
- `client/src/context/ProtectedRoute.tsx` - for route protection logic

## Testing Patterns

**Study existing test patterns in:**

- `client/src/components/Auth/Login.spec.tsx` - for component testing approaches
- `client/src/components/Habits/HabitsCardList.spec.tsx` - for testing with mocks and queries

**Follow the established testing patterns for:**

- Test setup and mocking strategies
- Component rendering and interaction testing
- Hook testing with React Query
- Test file naming and organization

## Development Best Practices

### ✅ **Do This: Follow Existing Patterns**

- **Before writing new code**, examine similar existing files in the codebase
- **Maintain consistency** with established naming conventions and structure
- **Use the same libraries and approaches** already implemented in the project
- **Follow existing TypeScript patterns** for interfaces, types, and component props
- **Reference existing error handling** and loading state patterns

### ❌ **Don't Do This: Create New Patterns**

- **Don't introduce new libraries** without checking if similar functionality exists
- **Don't create new conventions** that differ from existing code patterns
- **Don't ignore existing interfaces** - extend or reuse them instead
- **Don't skip type safety** - maintain TypeScript strictness as established

## Quick Reference Files

When working on client-side code, always reference these key files first:

### 📁 **Core Patterns**

- `client/src/hooks/useAuth.ts` - Authentication and mutations
- `client/src/hooks/useForm.ts` - Form handling and validation
- `client/src/hooks/useTasks.ts` - Data fetching and state management
- `client/src/api/` - API interfaces and function patterns

### 🎨 **Component Patterns**

- `client/src/components/Auth/Login.tsx` - Form components
- `client/src/components/Tasks/Tasks.tsx` - Data display components
- `client/src/components/` - General component structure

### 🔧 **Configuration**

- `client/package.json` - Available scripts and dependencies
- `client/src/App.tsx` - Route structure and app organization

**Remember: Consistency with existing patterns is more important than following external conventions. Always examine the current codebase first!**

Remember: Focus on understanding the "why" behind each pattern, not just the "how." Frontend development is constantly evolving with new patterns, hooks, and optimization techniques - there's always room to learn and improve your React, TypeScript, and state management skills as you build this project.