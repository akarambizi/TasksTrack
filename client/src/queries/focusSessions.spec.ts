import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
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
import { FocusSessionStatus } from '@/api';
import * as focusSessionApi from '@/api/focusSession';

// Mock the API functions
vi.mock('@/api/focusSession');

const mockStartFocusSession = vi.mocked(focusSessionApi.startFocusSession);
const mockPauseFocusSession = vi.mocked(focusSessionApi.pauseFocusSession);
const mockResumeFocusSession = vi.mocked(focusSessionApi.resumeFocusSession);
const mockCompleteFocusSession = vi.mocked(focusSessionApi.completeFocusSession);
const mockCancelFocusSession = vi.mocked(focusSessionApi.cancelFocusSession);
const mockGetFocusSessions = vi.mocked(focusSessionApi.getFocusSessions);
const mockGetActiveFocusSession = vi.mocked(focusSessionApi.getActiveFocusSession);
const mockGetFocusSessionAnalytics = vi.mocked(focusSessionApi.getFocusSessionAnalytics);

// Test wrapper component
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return ({ children }: { children: React.ReactNode }) =>
        createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('Focus Session Query Hooks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('useFocusSessions', () => {
        it('should fetch focus sessions successfully', async () => {
            const mockSessions = [
                {
                    id: 1,
                    habitId: 1,
                    status: FocusSessionStatus.Completed,
                    plannedDurationMinutes: 25,
                    startTime: '2026-01-31T10:00:00Z',
                    createdBy: 'user1',
                    createdDate: '2026-01-31T10:00:00Z',
                    actualDurationSeconds: 1500,
                    pausedDurationSeconds: 0
                }
            ];

            mockGetFocusSessions.mockResolvedValue(mockSessions);

            const { result } = renderHook(
                () => useFocusSessions('?$filter=habitId eq 1'),
                { wrapper: createWrapper() }
            );

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(mockGetFocusSessions).toHaveBeenCalledWith('?$filter=habitId eq 1');
            expect(result.current.data).toEqual(mockSessions);
        });

        it('should handle errors gracefully', async () => {
            mockGetFocusSessions.mockRejectedValue(new Error('Failed to fetch'));

            const { result } = renderHook(
                () => useFocusSessions(),
                { wrapper: createWrapper() }
            );

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            expect(result.current.error).toBeInstanceOf(Error);
        });
    });

    describe('useActiveFocusSession', () => {
        it('should fetch active session', async () => {
            const mockActiveSession = {
                id: 1,
                habitId: 1,
                status: FocusSessionStatus.Active,
                plannedDurationMinutes: 25,
                startTime: '2026-01-31T10:00:00Z',
                createdBy: 'user1',
                createdDate: '2026-01-31T10:00:00Z',
                actualDurationSeconds: 0,
                pausedDurationSeconds: 0
            };

            mockGetActiveFocusSession.mockResolvedValue(mockActiveSession);

            const { result } = renderHook(
                () => useActiveFocusSession(),
                { wrapper: createWrapper() }
            );

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(mockGetActiveFocusSession).toHaveBeenCalled();
            expect(result.current.data).toEqual(mockActiveSession);
        });

        it('should handle no active session (null)', async () => {
            mockGetActiveFocusSession.mockResolvedValue(null);

            const { result } = renderHook(
                () => useActiveFocusSession(),
                { wrapper: createWrapper() }
            );

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.data).toBeNull();
        });
    });

    describe('useFocusSessionAnalytics', () => {
        it('should fetch analytics data', async () => {
            const mockAnalytics = {
                totalSessions: 10,
                completedSessions: 8,
                totalMinutes: 200,
                averageSessionMinutes: 25,
                longestSessionMinutes: 45,
                currentStreak: 3,
                longestStreak: 5,
                completionRate: 0.8
            };

            mockGetFocusSessionAnalytics.mockResolvedValue(mockAnalytics);

            const { result } = renderHook(
                () => useFocusSessionAnalytics('?$filter=habitId eq 1'),
                { wrapper: createWrapper() }
            );

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(mockGetFocusSessionAnalytics).toHaveBeenCalledWith('?$filter=habitId eq 1');
            expect(result.current.data).toEqual(mockAnalytics);
        });
    });
});

describe('Focus Session Mutation Hooks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('useStartFocusSessionMutation', () => {
        it('should start focus session successfully', async () => {
            const mockSession = {
                id: 1,
                habitId: 1,
                status: FocusSessionStatus.Active,
                plannedDurationMinutes: 25,
                startTime: '2026-01-31T10:00:00Z',
                createdBy: 'user1',
                createdDate: '2026-01-31T10:00:00Z',
                actualDurationSeconds: 0,
                pausedDurationSeconds: 0
            };

            mockStartFocusSession.mockResolvedValue(mockSession);

            const { result } = renderHook(
                () => useStartFocusSessionMutation(),
                { wrapper: createWrapper() }
            );

            result.current.mutate({ habitId: 1, plannedDurationMinutes: 25 });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(mockStartFocusSession).toHaveBeenCalledWith({ habitId: 1, plannedDurationMinutes: 25 });
            expect(result.current.data).toEqual(mockSession);
        });

        it('should handle start session errors', async () => {
            mockStartFocusSession.mockRejectedValue(new Error('Start failed'));

            const { result } = renderHook(
                () => useStartFocusSessionMutation(),
                { wrapper: createWrapper() }
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
            const mockSession = {
                id: 1,
                habitId: 1,
                status: FocusSessionStatus.Paused,
                plannedDurationMinutes: 25,
                startTime: '2026-01-31T10:00:00Z',
                pauseTime: '2026-01-31T10:10:00Z',
                createdBy: 'user1',
                createdDate: '2026-01-31T10:00:00Z',
                actualDurationSeconds: 600,
                pausedDurationSeconds: 0
            };

            mockPauseFocusSession.mockResolvedValue(mockSession);

            const { result } = renderHook(
                () => usePauseFocusSessionMutation(),
                { wrapper: createWrapper() }
            );

            result.current.mutate();

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(mockPauseFocusSession).toHaveBeenCalled();
            expect(result.current.data).toEqual(mockSession);
        });
    });

    describe('useResumeFocusSessionMutation', () => {
        it('should resume focus session successfully', async () => {
            const mockSession = {
                id: 1,
                habitId: 1,
                status: FocusSessionStatus.Active,
                plannedDurationMinutes: 25,
                startTime: '2026-01-31T10:00:00Z',
                resumeTime: '2026-01-31T10:15:00Z',
                createdBy: 'user1',
                createdDate: '2026-01-31T10:00:00Z',
                actualDurationSeconds: 900,
                pausedDurationSeconds: 300
            };

            mockResumeFocusSession.mockResolvedValue(mockSession);

            const { result } = renderHook(
                () => useResumeFocusSessionMutation(),
                { wrapper: createWrapper() }
            );

            result.current.mutate();

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(mockResumeFocusSession).toHaveBeenCalled();
            expect(result.current.data).toEqual(mockSession);
        });
    });

    describe('useCompleteFocusSessionMutation', () => {
        it('should complete focus session successfully', async () => {
            const mockSession = {
                id: 1,
                habitId: 1,
                status: FocusSessionStatus.Completed,
                plannedDurationMinutes: 25,
                actualDurationSeconds: 1500,
                startTime: '2026-01-31T10:00:00Z',
                endTime: '2026-01-31T10:25:00Z',
                createdBy: 'user1',
                createdDate: '2026-01-31T10:00:00Z',
                pausedDurationSeconds: 0
            };

            mockCompleteFocusSession.mockResolvedValue(mockSession);

            const { result } = renderHook(
                () => useCompleteFocusSessionMutation(),
                { wrapper: createWrapper() }
            );

            result.current.mutate({ notes: 'Completed successfully' });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(mockCompleteFocusSession).toHaveBeenCalledWith({ notes: 'Completed successfully' });
            expect(result.current.data).toEqual(mockSession);
        });
    });

    describe('useCancelFocusSessionMutation', () => {
        it('should cancel focus session successfully', async () => {
            const mockSession = {
                id: 1,
                habitId: 1,
                status: FocusSessionStatus.Interrupted,
                plannedDurationMinutes: 25,
                startTime: '2026-01-31T10:00:00Z',
                endTime: '2026-01-31T10:10:00Z',
                createdBy: 'user1',
                createdDate: '2026-01-31T10:00:00Z',
                actualDurationSeconds: 600,
                pausedDurationSeconds: 0
            };

            mockCancelFocusSession.mockResolvedValue(mockSession);

            const { result } = renderHook(
                () => useCancelFocusSessionMutation(),
                { wrapper: createWrapper() }
            );

            result.current.mutate({ notes: 'Cancelled by user' });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(mockCancelFocusSession).toHaveBeenCalledWith({ notes: 'Cancelled by user' });
            expect(result.current.data).toEqual(mockSession);
        });
    });
});