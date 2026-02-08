# React Hook Form + Zod Implementation Guide

## Overview

TasksTrack uses **React Hook Form** with **Zod** for all form handling across the client application.
This provides type-safe, performant form management with minimal re-renders and excellent developer experience.

## Why React Hook Form + Zod?

### Key Benefits
- **Performance**: Uncontrolled components with minimal re-renders
- **Type Safety**: End-to-end type safety from schema to API calls
- **Developer Experience**: Excellent TypeScript integration and debugging
- **Bundle Size**: Lightweight compared to alternatives like Formik
- **Validation**: Single source of truth for validation rules

## Implementation Pattern

### 1. Define Zod Schema
```typescript
// types/forms.ts
export const loginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
```

### 2. Create Simple Form Hook
```typescript
// hooks/useForm.ts
export function useLoginForm() {
  return useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange'
  });
}
```

### 3. Use Controller Pattern in Components
```typescript
// components/Auth/Login.tsx
export const Login: React.FC = () => {
  const { control, handleSubmit, formState } = useLoginForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        control={control}
        name="email"
        label="Email"
        placeholder="Enter your email"
      />
      <FormField
        control={control}
        name="password"
        label="Password"
        type="password"
      />
    </form>
  );
};
```

## Key Decisions

### Controller Pattern Only
- **Use**: `<FormField control={control} name="email" />`
- **Avoid**: `<input {...register('email')} />`

### Simple Form Hooks
- Return `useForm` result directly
- No complex interfaces or wrappers needed

### Standardized Form Components
- `FormField` for standard inputs
- `TextareaField` for multi-line text
- All exported from `@/components/ui`

## Testing Approach

Keep mocks simple and focused:

```typescript
// ✅ Simple mock
vi.mocked(useLoginForm).mockReturnValue({
  control: {} as any,
  handleSubmit: vi.fn((fn) => fn),
  formState: { isSubmitting: false },
  reset: vi.fn()
} as any);
```

## Reference Files

- `client/src/hooks/useForm.ts` - Form hook patterns
- `client/src/components/Auth/Login.tsx` - Controller pattern example
- `client/src/components/Habits/AddHabitLogDialog.tsx` - Complex form example