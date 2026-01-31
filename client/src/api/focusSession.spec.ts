import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    startFocusSession,
    pauseFocusSession,
    resumeFocusSession,
    completeFocusSession,
    cancelFocusSession,
    getFocusSessions,
    getActiveFocusSession,
    getFocusSessionAnalytics
} from '@/api/focusSession';
import { apiGet, apiPost } from '@/api/apiClient';
import { ToastService } from '@/services/toastService';

// Mock the API client and toast service
vi.mock('@/api/apiClient');
vi.mock('@/services/toastService');

const mockApiGet = vi.mocked(apiGet);
const mockApiPost = vi.mocked(apiPost);
const mockToastService = vi.mocked(ToastService);

describe('Focus Session API Functions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('startFocusSession', () => {
        it('should start a focus session and show success toast', async () => {
            const mockSession = {
                id: 1,
                habitId: 1,
                status: 'active',
                plannedDurationMinutes: 25,
                startTime: '2026-01-31T10:00:00Z',
                createdBy: 'user1',
                createdDate: '2026-01-31T10:00:00Z'
            };

            mockApiPost.mockResolvedValue(mockSession);

            const result = await startFocusSession({ habitId: 1, plannedDurationMinutes: 25 });

            expect(mockApiPost).toHaveBeenCalledWith('/api/focus/start', { habitId: 1, plannedDurationMinutes: 25 });
            expect(mockToastService.success).toHaveBeenCalledWith('Focus session started successfully');
            expect(result).toEqual(mockSession);
        });

        it('should handle errors and show error toast', async () => {
            const error = new Error('Failed to start session');
            mockApiPost.mockRejectedValue(error);

            await expect(startFocusSession({ habitId: 1 })).rejects.toThrow(error);
            expect(mockToastService.error).toHaveBeenCalledWith('Failed to start focus session');
        });
    });

    describe('pauseFocusSession', () => {
        it('should pause active session and show success toast', async () => {
            const mockSession = {
                id: 1,
                habitId: 1,
                status: 'paused',
                plannedDurationMinutes: 25,
                startTime: '2026-01-31T10:00:00Z',
                pauseTime: '2026-01-31T10:10:00Z',
                createdBy: 'user1',
                createdDate: '2026-01-31T10:00:00Z'
            };

            mockApiPost.mockResolvedValue(mockSession);

            const result = await pauseFocusSession();

            expect(mockApiPost).toHaveBeenCalledWith('/api/focus/pause', {});
            expect(mockToastService.success).toHaveBeenCalledWith('Focus session paused');
            expect(result).toEqual(mockSession);
        });

        it('should handle errors and show error toast', async () => {
            const error = new Error('No active session');
            mockApiPost.mockRejectedValue(error);

            await expect(pauseFocusSession()).rejects.toThrow(error);
            expect(mockToastService.error).toHaveBeenCalledWith('Failed to pause focus session');
        });
    });

    describe('resumeFocusSession', () => {
        it('should resume paused session and show success toast', async () => {
            const mockSession = {
                id: 1,
                habitId: 1,
                status: 'active',
                plannedDurationMinutes: 25,
                startTime: '2026-01-31T10:00:00Z',
                resumeTime: '2026-01-31T10:15:00Z',
                createdBy: 'user1',
                createdDate: '2026-01-31T10:00:00Z'
            };

            mockApiPost.mockResolvedValue(mockSession);

            const result = await resumeFocusSession();

            expect(mockApiPost).toHaveBeenCalledWith('/api/focus/resume', {});
            expect(mockToastService.success).toHaveBeenCalledWith('Focus session resumed');
            expect(result).toEqual(mockSession);
        });
    });

    describe('completeFocusSession', () => {
        it('should complete session and show success toast', async () => {
            const mockSession = {
                id: 1,
                habitId: 1,
                status: 'completed',
                plannedDurationMinutes: 25,
                actualDurationSeconds: 1500,
                startTime: '2026-01-31T10:00:00Z',
                endTime: '2026-01-31T10:25:00Z',
                createdBy: 'user1',
                createdDate: '2026-01-31T10:00:00Z'
            };

            mockApiPost.mockResolvedValue(mockSession);

            const result = await completeFocusSession({ notes: 'Great session!' });

            expect(mockApiPost).toHaveBeenCalledWith('/api/focus/complete', { notes: 'Great session!' });
            expect(mockToastService.success).toHaveBeenCalledWith('Focus session completed!');
            expect(result).toEqual(mockSession);
        });
    });

    describe('cancelFocusSession', () => {
        it('should cancel session and show success toast', async () => {
            const mockSession = {
                id: 1,
                habitId: 1,
                status: 'interrupted',
                plannedDurationMinutes: 25,
                startTime: '2026-01-31T10:00:00Z',
                endTime: '2026-01-31T10:10:00Z',
                createdBy: 'user1',
                createdDate: '2026-01-31T10:00:00Z'
            };

            mockApiPost.mockResolvedValue(mockSession);

            const result = await cancelFocusSession({ notes: 'Interrupted' });

            expect(mockApiPost).toHaveBeenCalledWith('/api/focus/cancel', { notes: 'Interrupted' });
            expect(mockToastService.success).toHaveBeenCalledWith('Focus session cancelled');
            expect(result).toEqual(mockSession);
        });
    });

    describe('getFocusSessions', () => {
        it('should fetch focus sessions with filters', async () => {
            const mockSessions = [
                {
                    id: 1,
                    habitId: 1,
                    status: 'completed',
                    plannedDurationMinutes: 25,
                    startTime: '2026-01-31T10:00:00Z',
                    createdBy: 'user1',
                    createdDate: '2026-01-31T10:00:00Z'
                }
            ];

            mockApiGet.mockResolvedValue(mockSessions);

            const result = await getFocusSessions({ habitId: 1, status: 'completed' });

            expect(mockApiGet).toHaveBeenCalledWith('/api/focus/sessions?habitId=1&status=completed');
            expect(result).toEqual(mockSessions);
        });

        it('should handle empty filters', async () => {
            mockApiGet.mockResolvedValue([]);

            const result = await getFocusSessions();

            expect(mockApiGet).toHaveBeenCalledWith('/api/focus/sessions');
            expect(result).toEqual([]);
        });

        it('should handle errors gracefully and return empty array', async () => {
            mockApiGet.mockRejectedValue(new Error('Network error'));

            const result = await getFocusSessions();

            expect(mockToastService.error).toHaveBeenCalledWith('Failed to fetch focus sessions');
            expect(result).toEqual([]);
        });
    });

    describe('getActiveFocusSession', () => {
        it('should fetch active session', async () => {
            const mockSession = {
                id: 1,
                habitId: 1,
                status: 'active',
                plannedDurationMinutes: 25,
                startTime: '2026-01-31T10:00:00Z',
                createdBy: 'user1',
                createdDate: '2026-01-31T10:00:00Z'
            };

            mockApiGet.mockResolvedValue(mockSession);

            const result = await getActiveFocusSession();

            expect(mockApiGet).toHaveBeenCalledWith('/api/focus/active');
            expect(result).toEqual(mockSession);
        });

        it('should return null when no active session exists', async () => {
            mockApiGet.mockRejectedValue(new Error('No active session'));

            const result = await getActiveFocusSession();

            expect(result).toBeNull();
        });
    });

    describe('getFocusSessionAnalytics', () => {
        it('should fetch analytics data', async () => {
            const mockAnalytics = {
                totalSessions: 10,
                totalMinutes: 250,
                completedSessions: 8,
                averageSessionMinutes: 25,
                longestSessionMinutes: 30,
                currentStreak: 3,
                longestStreak: 5,
                completionRate: 80,
                weeklyStats: [],
                monthlyStats: []
            };

            mockApiGet.mockResolvedValue(mockAnalytics);

            const result = await getFocusSessionAnalytics({ habitId: 1 });

            expect(mockApiGet).toHaveBeenCalledWith('/api/focus/analytics?habitId=1');
            expect(result).toEqual(mockAnalytics);
        });

        it('should handle errors and show error toast', async () => {
            const error = new Error('Analytics failed');
            mockApiGet.mockRejectedValue(error);

            await expect(getFocusSessionAnalytics()).rejects.toThrow(error);
            expect(mockToastService.error).toHaveBeenCalledWith('Failed to fetch analytics');
        });
    });
});