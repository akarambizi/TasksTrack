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

        expect(result.current.formData.value).toBe(0);
        expect(result.current.formData.date).toBe(new Date().toISOString().split('T')[0]);
        expect(result.current.formData.notes).toBe('');
        expect(result.current.formData.habitId).toBe(1);
    });

    it('should update form data when handleChange is called', () => {
        const { result } = renderHook(() => useHabitLogForm(1));

        act(() => {
            result.current.handleChange('value')(45);
        });

        expect(result.current.formData.value).toBe(45);
    });

    it('should handle string values', () => {
        const { result } = renderHook(() => useHabitLogForm(1));

        act(() => {
            result.current.handleChange('notes')('Great workout!');
        });

        expect(result.current.formData.notes).toBe('Great workout!');
    });

    it('should handle date changes', () => {
        const { result } = renderHook(() => useHabitLogForm(1));

        act(() => {
            result.current.handleChange('date')('2024-01-15');
        });

        expect(result.current.formData.date).toBe('2024-01-15');
    });

    it('should reset form to initial values', () => {
        const { result } = renderHook(() => useHabitLogForm(1));

        // Change some values
        act(() => {
            result.current.handleChange('value')(50);
            result.current.handleChange('notes')('Test notes');
        });

        // Reset form
        act(() => {
            result.current.resetForm();
        });

        expect(result.current.formData.value).toBe(0);
        expect(result.current.formData.notes).toBe('');
        expect(result.current.formData.habitId).toBe(1);
    });

    it('should handle error state', () => {
        const { result } = renderHook(() => useHabitLogForm(1));

        expect(result.current.error).toBeNull();

        act(() => {
            result.current.setError('Test error');
        });

        expect(result.current.error).toBe('Test error');

        act(() => {
            result.current.setError(null);
        });

        expect(result.current.error).toBeNull();
    });

    it('should initialize with default habitId when none provided', () => {
        const { result } = renderHook(() => useHabitLogForm());

        expect(result.current.formData.habitId).toBe(0);
    });
});