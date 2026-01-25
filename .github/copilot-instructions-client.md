# TasksTrack Client - GitHub Copilot Instructions

## Follow Existing Project Patterns

**IMPORTANT: Always examine and follow the patterns already established in the existing codebase rather than creating new ones.**

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
- `client/src/api/` - for API interface naming (e.g., `IHabit`, `IAuthData`)
- `client/src/hooks/` - for custom hook patterns (e.g., `useAuth.ts`, `useForm.ts`)
- `client/src/components/` - for component structure and naming

**Key Patterns Already Established:**
- Interfaces: Start with "I" + PascalCase (`IHabit`, `IAuthData`)
- Components: PascalCase exports (`Login`, `Tasks`, `TasksContainer`)
- Custom hooks: camelCase starting with "use" (`useForm`, `useHabitData`)
- Files: PascalCase for components, camelCase for utilities

### 2. **Follow Existing Project Structure**

**Reference the actual folder structure in:**

```text
client/src/
├── api/                    # API service functions and types
├── assets/                 # Static assets (images, icons, etc.)
├── components/            # UI components organized by feature
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── mock-server/          # Development mock server
├── queries/              # TanStack Query hooks (useQuery, useMutation)
└── services/             # Business logic services
```

**When creating new files, examine existing files in the same directory to match:**
- File naming conventions
- Export patterns
- Import organization
- Component structure

### 3. **Testing with Vitest**

**Use Vitest as the test runner with `.spec.ts` or `.spec.tsx` file extensions:**

```typescript
// Component testing with Vitest + React Testing Library
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// Note: jest-dom matchers are imported via src/test-setup.ts

// Hook testing
import { renderHook, act } from '@testing-library/react';

// Test file naming:
// - useAuth.spec.ts (for hooks)
// - Login.spec.tsx (for components)
// - habitLog.spec.ts (for API functions)
```

**Key Testing Patterns:**
- Use QueryClient wrapper for components using TanStack Query
- Mock API functions and services using `vi.mock()`
- Test user interactions with `fireEvent` and `waitFor`
- Use descriptive test names that explain the expected behavior
- jest-dom matchers like `toBeInTheDocument()` are available via test setup

### 4. **Reference Existing Interface Patterns**

**Before creating new interfaces, check these existing files:**

- `client/src/api/*.types.ts` - for all API-related interfaces (habit.types.ts, userAuth.types.ts, etc.)
- `client/src/components/Habits/useHabitForm.ts` - for form validation and error display

**Always maintain consistency with the established interface patterns:**

- Use the same property naming conventions as existing interfaces
- Follow the same optional property patterns (`?:`)
- Match the data types already established in the codebase
- **Avoid `any` types** - Use specific interfaces, union types, or `unknown` when the type is truly unknown

### 4. **Follow Existing Component Patterns**

**Study these component examples to understand the established patterns:**

- `client/src/components/Auth/Login.tsx` - for form components and validation
- `client/src/components/Habits/Habits.tsx` - for data fetching and rendering patterns
- `client/src/components/Habits/HabitsContainer.tsx` - for container component structure

**Key patterns to follow:**

- Component export pattern: `export const ComponentName = () => {}`
- Hook usage patterns from existing components
- CSS class naming conventions using Tailwind
- State management patterns already established
- Event handler naming and structure

### 5. **Follow Existing Custom Hook Patterns**

**Reference these existing hooks before creating new ones:**

- `client/src/hooks/useAuth.ts` - for authentication-related hooks
- `client/src/components/Habits/useHabitForm.ts` - for form management hooks
- `client/src/hooks/useForm.ts` - for form handling patterns

**Key patterns to maintain:**

- Hook naming and export structure
- TanStack Query usage patterns already established
- Error handling approach used in existing hooks
- Type definitions and return patterns
- JSDoc comment style for hook documentation

### 6. **Follow Existing TanStack Query Organization**

**IMPORTANT: All TanStack Query hooks (useQuery, useMutation) must be centralized in the `queries/` folder.**

**Study the established query organization in:**

- `client/src/queries/habits.ts` - for all habit queries and mutations (useHabitData, useCreateHabitMutation, useDeleteHabitMutation, etc.)
- `client/src/queries/auth.ts` - for authentication queries
- `client/src/queries/queryKeys.ts` - for centralized query key management
- `client/src/queries/index.ts` - for centralized exports

**Key patterns to maintain:**

- **Centralized Queries**: All `useQuery` hooks belong in `queries/` folder, NOT in components
- **Centralized Mutations**: All `useMutation` hooks belong in `queries/` folder, NOT in components
- **Naming Convention**: Use descriptive names like `useCreateHabitMutation`, `useDeleteHabitMutation`
- **Query Key Management**: Import query keys from `@/queries/queryKeys` and use consistently
- **Cache Management**: Handle optimistic updates and cache invalidation in mutation hooks
- **Export Structure**: Export all queries through `queries/index.ts` for easy imports
- **Toast Notifications**:
  - **ALL features**: Handle toast notifications in API layer for consistent user feedback
  - **Query hooks**: Focus only on cache management and navigation - no toast handling
- **Error Handling**: Use consistent error handling pattern in API layer with try/catch and throw

**NEVER do this in components:**
```tsx
// DON'T: Define mutations directly in components
const deleteMutation = useMutation({
  mutationFn: deleteHabit,
  onSuccess: () => queryClient.invalidateQueries()
});
```

**ALWAYS do this instead:**
```tsx
// DO: Use centralized mutation hooks from queries folder
import { useDeleteHabitMutation } from "@/queries";
const deleteMutation = useDeleteHabitMutation();
```

**Toast Notification Pattern:**
```tsx
// ALL FEATURES: Handle toasts in API layer - no onError needed in queries
export const createHabit = async (habitData: IHabitCreateRequest): Promise<IHabit> => {
    try {
        const response = await apiPost<IHabit>(endpoint, habitData);
        ToastService.success('Habit created successfully');
        return response;
    } catch (error) {
        ToastService.error('Failed to create habit');
        throw error; // Query will naturally fail, no onError needed
    }
};

// Query layer - clean and focused on cache/navigation
export const useCreateHabitMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createHabit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getHabitKey('') });
            // Handle navigation or other side effects
        }
        // No onError needed - API layer handles all user feedback
    });
};
```

**Benefits of this approach:**
- Consistent toast messaging across the entire application
- Query hooks focus on their core responsibility (cache management)
- No duplicate error handling between API and query layers
- Easier to maintain and debug user feedback

### 7. **Follow Existing API Service Patterns**

**Study the established API patterns in:**

- `client/src/api/habit.ts` - for habit-related API functions
- `client/src/api/userAuth.ts` - for authentication API functions
- `client/src/queries/queryKeys.ts` - for query key patterns

**Maintain consistency with:**

- Function naming conventions already used
- Error handling patterns established
- Type definitions and interfaces
- Request/response structure patterns
- Export patterns used in API files

### 8. **Reference Existing Form Patterns**

**Study the form handling approach in:**

- `client/src/hooks/useForm.ts` - for form validation and state management
- `client/src/components/Auth/Login.tsx` - for form component structure
- `client/src/components/Auth/SignUp.tsx` - for form submission patterns

**Follow the established patterns for:**

- Form validation logic and error handling
- State management approach using the `useForm` hook
- Form submission and error display patterns
- Input handling and form field structure

### 9. **Follow Existing Context Patterns**

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

- `client/src/queries/habits.ts` - for query key management and data fetching patterns
- `client/src/queries/auth.ts` - for authentication query patterns
- `client/src/hooks/useAuth.ts` - for context-based state management

### 2. **Error Handling Patterns**

**Reference existing error handling in:**

- `client/src/api/habit.ts` - for API error handling and user feedback
- `client/src/services/toastService.ts` - for user notification patterns
- `client/src/components/Habits/useHabitForm.ts` - for form validation and error display

### 3. **Loading and Error State Patterns**

**Study how loading and error states are handled in:**

- `client/src/components/Habits/Habits.tsx` - for data loading and empty states
- `client/src/components/Auth/Login.tsx` - for form loading states
- `client/src/queries/habits.ts` - for mutation loading indicators

### 4. **Styling and UI Patterns**

**Follow the established styling approach in:**

- `client/src/components/ui/` - for shadcn/ui component usage
- `client/src/components/Habits/Habits.tsx` - for Tailwind CSS class patterns
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

- Test setup and mocking strategies using Vitest (`vi.mock()`, `vi.fn()`)
- Component rendering and interaction testing with `@testing-library/react`
- Hook testing with React Query using `renderHook` and QueryClient wrappers
- Test file naming: `.spec.ts` for utilities/hooks, `.spec.tsx` for components
- jest-dom matchers available globally through `src/test-setup.ts`

**Quality Requirements:**
- **Test coverage must be ≥ 80%** - Every new component and hook must include comprehensive tests
- **All tests must pass** - 100% pass rate required before merge
- **Zero TypeScript warnings** - All type issues must be resolved
- **No `any` types** - Avoid using `any` type; use proper TypeScript types, interfaces, or `unknown` when necessary
- **Test user interactions** - Include tests for loading states, error states, and user actions
- **Follow existing test patterns** - Use the same mocking and assertion approaches already established

**Before completing any feature, run:**
```bash
npm run build        # Must succeed with no errors
npm run test -- --run --coverage  # Must show ≥80% coverage and 100% pass rate
npm run lint         # Must pass with no errors
```

## Development Best Practices

### **Do This: Follow Existing Patterns**

- **Before writing new code**, examine similar existing files in the codebase
- **Maintain consistency** with established naming conventions and structure
- **Use the same libraries and approaches** already implemented in the project
- **Follow existing TypeScript patterns** for interfaces, types, and component props
- **Reference existing error handling** and loading state patterns

### **Don't Do This: Create New Patterns**

- **Don't introduce new libraries** without checking if similar functionality exists
- **Don't create new conventions** that differ from existing code patterns
- **Don't ignore existing interfaces** - extend or reuse them instead
- **Don't skip type safety** - maintain TypeScript strictness as established

## Quick Reference Files

When working on client-side code, always reference these key files first:

### **Core Patterns**

- `client/src/hooks/useAuth.ts` - Authentication and mutations
- `client/src/components/Habits/useHabitForm.ts` - Form handling and validation
- `client/src/queries/habits.ts` - Data fetching and state management
- `client/src/api/` - API interfaces and function patterns

### **Component Patterns**

- `client/src/components/Auth/Login.tsx` - Form components
- `client/src/components/Habits/Habits.tsx` - Data display components
- `client/src/components/Habits/HabitsContainer.tsx` - Container component patterns
- `client/src/components/` - General component structure

### **Configuration**

- `client/package.json` - Available scripts and dependencies
- `client/src/App.tsx` - Route structure and app organization

**Remember: Consistency with existing patterns is more important than following external conventions. Always examine the current codebase first!**

## Additional Important Guidelines

### **State Management Best Practices**

- **Server State**: Always use TanStack Query for server state management (API data)
- **Client State**: Use React's built-in state (useState, useContext) for UI-only state
- **Form State**: Use custom form hooks like `useHabitForm` for form management
- **Global State**: Use React Context for authentication and global UI state

### **Performance Optimization Patterns**

- **Query Caching**: Leverage TanStack Query's caching with appropriate staleTime
- **Optimistic Updates**: Implement optimistic updates in mutation hooks for better UX
- **Code Splitting**: Use React.lazy() for route-based code splitting when needed
- **Memoization**: Use React.memo, useMemo, useCallback judiciously for expensive operations

### **UI/UX Consistency Patterns**

- **Design System**: Always use shadcn/ui components for consistent styling
- **Loading States**: Show loading indicators during async operations
- **Error Handling**: Display user-friendly error messages with toast notifications
- **Empty States**: Provide meaningful empty states with calls-to-action

### **Security and Error Handling**

- **Input Validation**: Always validate user inputs both client-side and server-side
- **Error Boundaries**: Use error boundaries for graceful error recovery
- **Type Safety**: Leverage TypeScript strictly - avoid `any` types
- **Authentication**: Protect routes and handle authentication states properly

## Testing Requirements and Best Practices

### **Test Coverage Standards**

- **Minimum Coverage**: All test suites must maintain **at least 80% code coverage**
- **Coverage Types**: Monitor statements, branches, functions, and lines coverage
- **Coverage Reports**: Use `npm test` to generate coverage reports with Istanbul
- **Failing Tests**: Tests failing to meet 80% coverage should be improved before merging

### **Test File Naming Convention**

- **Unit Tests**: Use `.spec.ts` for TypeScript files without JSX
- **Component Tests**: Use `.spec.tsx` for React component tests with JSX
- **Location**: Place test files alongside the source files they test
- **Examples**:
  - `useHabitForm.spec.ts` for custom hooks
  - `AddHabitDialog.spec.tsx` for React components
  - `habitLog.spec.ts` for API service functions

### **Testing Framework Configuration**

**Vitest Setup** (already configured):
- Uses Vitest as the test runner with Happy-DOM environment
- @testing-library/jest-dom matchers available globally via `src/test-setup.ts`
- Configuration in `vitest.config.ts` with setupFiles pointing to test setup
- Coverage reporting enabled with Istanbul

### **Component Testing Best Practices**

**Use testid attributes for reliable element selection:**

```tsx
// Good: Add data-testid for complex selectors
<Button data-testid="submit-habit-form" onClick={handleSubmit}>
    Add Habit
</Button>

// Good: Use testid for dynamic content that's hard to select
<div data-testid={`habit-${habit.id}`} className="habit-card">
    <h3 data-testid="habit-title">{habit.title}</h3>
    <span data-testid="habit-streak">{habit.streak} days</span>
</div>
```

**Testing Strategy:**
- **Render Testing**: Ensure components render without crashing
- **User Interactions**: Test click events, form submissions, keyboard navigation
- **Conditional Rendering**: Test different states (loading, error, empty, populated)
- **Integration**: Test component behavior with real API calls when appropriate
- **Accessibility**: Verify screen reader compatibility and keyboard navigation

### **Testing Patterns to Follow**

**Study existing test patterns in:**
- `client/src/hooks/useHabitLogForm.spec.ts` - for custom hook testing
- `client/src/components/Auth/Login.spec.tsx` - for component testing
- `client/src/api/habitLog.spec.ts` - for API service testing
- `client/src/queries/habitLogs.spec.tsx` - for TanStack Query hook testing

**Maintain consistency with:**
- Mock patterns for API functions and external dependencies
- Test wrapper setup for QueryClient and providers
- Assertion patterns and error handling tests
- Query key testing and cache invalidation verification

### **Coverage Improvement Strategies**

- **Add testid attributes** to interactive elements and dynamic content
- **Test edge cases** like empty states, error conditions, and loading states
- **Test user workflows** like form submission, validation, and success/error handling
- **Mock external dependencies** properly to isolate component logic
- **Test conditional rendering** based on props and state changes

Remember: Focus on understanding the "why" behind each pattern, not just the "how." Frontend development is constantly evolving with new patterns, hooks, and optimization techniques - there's always room to learn and improve your React, TypeScript, and state management skills as you build this project.