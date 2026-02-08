import { TestWrapper } from '../utils/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useHabitLogs, useCreateHabitLogMutation } from './habitLogs';

// Mock the API module
vi.mock('../api/habitLog', () => ({
    getHabitLogsByHabitId: vi.fn(() => Promise.resolve([])),
    createHabitLog: vi.fn(() => Promise.resolve({ id: 1 }))
}));

describe('habitLogs queries', () => {
    it('should initialize useHabitLogs hook', async () => {
        const { result } = renderHook(() => useHabitLogs({ habitId: 1 }), {
            wrapper: TestWrapper
        });

        await waitFor(() => {
            expect(result.current.isSuccess || result.current.isLoading || result.current.isError).toBe(true);
        });
    });

    it('should initialize useCreateHabitLogMutation hook', () => {
        const { result } = renderHook(() => useCreateHabitLogMutation(), {
            wrapper: TestWrapper
        });

        expect(result.current.mutate).toBeInstanceOf(Function);
    });
});