import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
    useFocusSessions,
    useActiveFocusSession,
    useFocusSessionAnalytics,
    useStartFocusSessionMutation,
    usePauseFocusSessionMutation,
    useResumeFocusSessionMutation,
    useCompleteFocusSessionMutation,
    useCancelFocusSessionMutation
} from '@/queries/focusSessions';
import { TestWrapper, mockFocusSessions, mockActiveFocusSession, mockFocusSessionAnalytics, mockStartedFocusSession, mockPausedFocusSession, mockResumedFocusSession, mockCompletedFocusSession, mockCancelledFocusSession } from '../utils/test-utils';

import * as focusSessionApi from '@/api';

// Mock the API functions
vi.mock('@/api', () => ({
    startFocusSession: vi.fn(),
    pauseFocusSession: vi.fn(),
    resumeFocusSession: vi.fn(),
    completeFocusSession: vi.fn(),
    cancelFocusSession: vi.fn(),
    getFocusSessions: vi.fn(),
    getActiveFocusSession: vi.fn(),
    getFocusSessionAnalytics: vi.fn(),
}));

describe('Focus Session Query Hooks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('useFocusSessions', () => {
        it('should fetch focus sessions successfully', async () => {
            vi.mocked(focusSessionApi.getFocusSessions).mockResolvedValue(mockFocusSessions);

            const { result } = renderHook(
                () => useFocusSessions('?$filter=habitId eq 1'),
                { wrapper: TestWrapper }
            );

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(vi.mocked(focusSessionApi.getFocusSessions)).toHaveBeenCalledWith('?$filter=habitId eq 1');
            expect(result.current.data).toEqual(mockFocusSessions);
        });

        it('should handle errors gracefully', async () => {
            vi.mocked(focusSessionApi.getFocusSessions).mockRejectedValue(new Error('Failed to fetch'));

            const { result } = renderHook(
                () => useFocusSessions(),
                { wrapper: TestWrapper }
            );

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            expect(result.current.error).toBeInstanceOf(Error);
        });
    });

    describe('useActiveFocusSession', () => {
        it('should fetch active session', async () => {
            vi.mocked(focusSessionApi.getActiveFocusSession).mockResolvedValue(mockActiveFocusSession);

            const { result } = renderHook(
                () => useActiveFocusSession(),
                { wrapper: TestWrapper }
            );

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(vi.mocked(focusSessionApi.getActiveFocusSession)).toHaveBeenCalled();
            expect(result.current.data).toEqual(mockActiveFocusSession);
        });

        it('should handle no active session (null)', async () => {
            vi.mocked(focusSessionApi.getActiveFocusSession).mockResolvedValue(null);

            const { result } = renderHook(
                () => useActiveFocusSession(),
                { wrapper: TestWrapper }
            );

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.data).toBeNull();
        });
    });

    describe('useFocusSessionAnalytics', () => {
        it('should fetch analytics data', async () => {
            vi.mocked(focusSessionApi.getFocusSessionAnalytics).mockResolvedValue(mockFocusSessionAnalytics);

            const { result } = renderHook(
                () => useFocusSessionAnalytics('?$filter=habitId eq 1'),
                { wrapper: TestWrapper }
            );

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(vi.mocked(focusSessionApi.getFocusSessionAnalytics)).toHaveBeenCalledWith('?$filter=habitId eq 1');
            expect(result.current.data).toEqual(mockFocusSessionAnalytics);
        });
    });
});

describe('Focus Session Mutation Hooks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('useStartFocusSessionMutation', () => {
        it('should start focus session successfully', async () => {
            vi.mocked(focusSessionApi.startFocusSession).mockResolvedValue(mockStartedFocusSession);

            const { result } = renderHook(
                () => useStartFocusSessionMutation(),
                { wrapper: TestWrapper }
            );

            result.current.mutate({ habitId: 1, plannedDurationMinutes: 25 });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(vi.mocked(focusSessionApi.startFocusSession)).toHaveBeenCalledWith({ habitId: 1, plannedDurationMinutes: 25 });
            expect(result.current.data).toEqual(mockStartedFocusSession);
        });

        it('should handle start session errors', async () => {
            vi.mocked(focusSessionApi.startFocusSession).mockRejectedValue(new Error('Start failed'));

            const { result } = renderHook(
                () => useStartFocusSessionMutation(),
                { wrapper: TestWrapper }
            );

            result.current.mutate({ habitId: 1 });

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            expect(result.current.error).toBeInstanceOf(Error);
        });
    });

    describe('usePauseFocusSessionMutation', () => {
        it('should pause focus session successfully', async () => {
            vi.mocked(focusSessionApi.pauseFocusSession).mockResolvedValue(mockPausedFocusSession);

            const { result } = renderHook(
                () => usePauseFocusSessionMutation(),
                { wrapper: TestWrapper }
            );

            result.current.mutate();

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(vi.mocked(focusSessionApi.pauseFocusSession)).toHaveBeenCalled();
            expect(result.current.data).toEqual(mockPausedFocusSession);
        });
    });

    describe('useResumeFocusSessionMutation', () => {
        it('should resume focus session successfully', async () => {
            vi.mocked(focusSessionApi.resumeFocusSession).mockResolvedValue(mockResumedFocusSession);

            const { result } = renderHook(
                () => useResumeFocusSessionMutation(),
                { wrapper: TestWrapper }
            );

            result.current.mutate();

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(vi.mocked(focusSessionApi.resumeFocusSession)).toHaveBeenCalled();
            expect(result.current.data).toEqual(mockResumedFocusSession);
        });
    });

    describe('useCompleteFocusSessionMutation', () => {
        it('should complete focus session successfully', async () => {
            vi.mocked(focusSessionApi.completeFocusSession).mockResolvedValue(mockCompletedFocusSession);

            const { result } = renderHook(
                () => useCompleteFocusSessionMutation(),
                { wrapper: TestWrapper }
            );

            result.current.mutate({ notes: 'Completed successfully' });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(vi.mocked(focusSessionApi.completeFocusSession)).toHaveBeenCalledWith({ notes: 'Completed successfully' });
            expect(result.current.data).toEqual(mockCompletedFocusSession);
        });
    });

    describe('useCancelFocusSessionMutation', () => {
        it('should cancel focus session successfully', async () => {
            vi.mocked(focusSessionApi.cancelFocusSession).mockResolvedValue(mockCancelledFocusSession);

            const { result } = renderHook(
                () => useCancelFocusSessionMutation(),
                { wrapper: TestWrapper }
            );

            result.current.mutate({ notes: 'Cancelled by user' });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(vi.mocked(focusSessionApi.cancelFocusSession)).toHaveBeenCalledWith({ notes: 'Cancelled by user' });
            expect(result.current.data).toEqual(mockCancelledFocusSession);
        });
    });
});