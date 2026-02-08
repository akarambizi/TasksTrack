import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHabitLogForm } from './useHabitLogForm';

// Mock the useAuthContext hook
vi.mock('@/context/useAuthContext', () => ({
    useAuthContext: () => ({
        user: {
            email: 'test@example.com',
            id: 'test-user-id',
            firstName: 'John',
            lastName: 'Doe',
        },
        isAuthenticated: true,
        token: 'mock-token',
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn()
    })
}));

describe('useHabitLogForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with default form values', () => {
        const { result } = renderHook(() => useHabitLogForm(1));

        const watchedValues = result.current.watch();
        expect(watchedValues.habitId).toBe(1);
        expect(watchedValues.value).toBe(0);
        expect(watchedValues.date).toBe(new Date().toISOString().split('T')[0]);
        expect(watchedValues.notes).toBe('');
        expect(watchedValues.createdBy).toBe('test-user-id');
    });

    it('should use default habitId of 0 when not provided', () => {
        const { result } = renderHook(() => useHabitLogForm());

        const watchedValues = result.current.watch();
        expect(watchedValues.habitId).toBe(0);
    });

    it('should set values correctly', () => {
        const { result } = renderHook(() => useHabitLogForm(1));

        act(() => {
            result.current.setValue('value', 25);
            result.current.setValue('notes', 'Great workout!');
        });

        const watchedValues = result.current.watch();
        expect(watchedValues.value).toBe(25);
        expect(watchedValues.notes).toBe('Great workout!');
    });

    it('should reset form to default values', () => {
        const { result } = renderHook(() => useHabitLogForm(1));

        act(() => {
            result.current.setValue('value', 25);
            result.current.setValue('notes', 'Great workout!');
        });

        act(() => {
            result.current.reset();
        });

        const watchedValues = result.current.watch();
        expect(watchedValues.value).toBe(0);
        expect(watchedValues.notes).toBe('');
    });

    it('should provide all required React Hook Form methods', () => {
        const { result } = renderHook(() => useHabitLogForm(1));

        expect(typeof result.current.register).toBe('function');
        expect(typeof result.current.setValue).toBe('function');
        expect(typeof result.current.watch).toBe('function');
        expect(typeof result.current.getValues).toBe('function');
        expect(typeof result.current.trigger).toBe('function');
        expect(typeof result.current.reset).toBe('function');
        expect(typeof result.current.handleSubmit).toBe('function');
        expect(result.current.formState).toBeDefined();
    });
});