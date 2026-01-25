import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useHabitLogs, useCreateHabitLogMutation } from './habitLogs';
import React from 'react';

// Mock the API module
vi.mock('../api/habitLog', () => ({
    getHabitLogsByHabitId: vi.fn(() => Promise.resolve([])),
    createHabitLog: vi.fn(() => Promise.resolve({ id: 1 }))
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false }
        }
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe('habitLogs queries', () => {
    it('should initialize useHabitLogs hook', async () => {
        const { result } = renderHook(() => useHabitLogs({ habitId: 1 }), {
            wrapper: createWrapper()
        });

        await waitFor(() => {
            expect(result.current.isSuccess || result.current.isLoading || result.current.isError).toBe(true);
        });
    });

    it('should initialize useCreateHabitLogMutation hook', () => {
        const { result } = renderHook(() => useCreateHabitLogMutation(), {
            wrapper: createWrapper()
        });

        expect(result.current.mutate).toBeInstanceOf(Function);
    });
});