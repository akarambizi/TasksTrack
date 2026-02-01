import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FocusSessionHistory } from './FocusSessionHistory';

// Mock dependencies
vi.mock('@/queries', () => ({
    useFocusSessions: vi.fn(),
    useFocusSessionAnalytics: vi.fn()
}));

vi.mock('date-fns', () => ({
    format: vi.fn((_, formatStr) => {
        if (formatStr === 'MMM d') return 'Jan 31';
        if (formatStr === 'MMM d, yyyy • h:mm a') return 'Jan 31, 2026 • 2:00 AM';
        return 'Jan 31, 2026';
    }),
    subDays: vi.fn(() => new Date('2026-01-25')),
    addDays: vi.fn(() => new Date('2026-01-31')),
    startOfDay: vi.fn(() => new Date('2026-01-31T00:00:00')),
    endOfDay: vi.fn(() => new Date('2026-01-31T23:59:59')),
    startOfWeek: vi.fn(() => new Date('2026-01-25T00:00:00')),
    endOfWeek: vi.fn(() => new Date('2026-01-31T23:59:59')),
    parseISO: vi.fn((dateString) => new Date(dateString)),
    isValid: vi.fn(() => true)
}));

const { useFocusSessions, useFocusSessionAnalytics } = await import('@/queries');

describe('FocusSessionHistory', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false }
            }
        });
        vi.clearAllMocks();

        (useFocusSessions as ReturnType<typeof vi.fn>).mockReturnValue({
            data: [],
            isLoading: false,
            error: null
        });
        (useFocusSessionAnalytics as ReturnType<typeof vi.fn>).mockReturnValue({
            data: null,
            isLoading: false
        });
    });

    const TestWrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    it('should render focus session history component', () => {
        render(
            <TestWrapper>
                <FocusSessionHistory />
            </TestWrapper>
        );

        expect(screen.getByText('Focus Sessions')).toBeInTheDocument();
    });

    it('should show loading state', () => {
        (useFocusSessions as ReturnType<typeof vi.fn>).mockReturnValue({
            data: [],
            isLoading: true,
            error: null
        });

        render(
            <TestWrapper>
                <FocusSessionHistory />
            </TestWrapper>
        );

        // Check for skeleton loaders
        expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('should show empty state', () => {
        render(
            <TestWrapper>
                <FocusSessionHistory />
            </TestWrapper>
        );

        expect(screen.getByText('No focus sessions found')).toBeInTheDocument();
    });

    it('should display sessions when available', () => {
        const mockSessions = [
            {
                id: 1,
                status: 'completed' as const,
                startTime: '2026-01-31T10:00:00Z',
                actualDurationMinutes: 25,
                plannedDurationMinutes: 25,
                habit: {
                    id: 1,
                    name: 'Reading',
                    color: '#3B82F6'
                }
            }
        ];

        (useFocusSessions as ReturnType<typeof vi.fn>).mockReturnValue({
            data: mockSessions,
            isLoading: false,
            error: null
        });

        render(
            <TestWrapper>
                <FocusSessionHistory />
            </TestWrapper>
        );

        expect(screen.getByText('Reading')).toBeInTheDocument();
        expect(screen.getByText('Completed')).toBeInTheDocument();
    });

    it('should display different session statuses', () => {
        const mockSessions = [
            {
                id: 1,
                status: 'completed' as const,
                startTime: '2026-01-31T10:00:00Z',
                actualDurationMinutes: 25,
                plannedDurationMinutes: 25,
                habit: { id: 1, name: 'Reading', color: '#3B82F6' }
            },
            {
                id: 2,
                status: 'interrupted' as const,
                startTime: '2026-01-30T08:00:00Z',
                actualDurationMinutes: 15,
                plannedDurationMinutes: 25,
                habit: { id: 2, name: 'Writing', color: '#10B981' }
            }
        ];

        (useFocusSessions as ReturnType<typeof vi.fn>).mockReturnValue({
            data: mockSessions,
            isLoading: false,
            error: null
        });

        render(
            <TestWrapper>
                <FocusSessionHistory />
            </TestWrapper>
        );

        expect(screen.getByText('Completed')).toBeInTheDocument();
        expect(screen.getByText('Interrupted')).toBeInTheDocument();
        expect(screen.getByText('Reading')).toBeInTheDocument();
        expect(screen.getByText('Writing')).toBeInTheDocument();
    });

    it('should handle analytics data display', () => {
        const mockAnalytics = {
            totalSessions: 10,
            completedSessions: 8,
            totalFocusTime: 240,
            averageSessionLength: 24
        };

        (useFocusSessionAnalytics as ReturnType<typeof vi.fn>).mockReturnValue({
            data: mockAnalytics,
            isLoading: false
        });

        render(
            <TestWrapper>
                <FocusSessionHistory />
            </TestWrapper>
        );

        expect(screen.getByText('Focus Sessions')).toBeInTheDocument();
    });

    it('should handle error state', () => {
        (useFocusSessions as ReturnType<typeof vi.fn>).mockReturnValue({
            data: [],
            isLoading: false,
            error: new Error('Failed to fetch sessions')
        });

        render(
            <TestWrapper>
                <FocusSessionHistory />
            </TestWrapper>
        );

        expect(screen.getByText('Failed to load focus sessions')).toBeInTheDocument();
    });

    it('should handle status filter functionality', () => {
        render(
            <TestWrapper>
                <FocusSessionHistory />
            </TestWrapper>
        );

        const filterSelect = screen.getAllByRole('combobox')[0];
        filterSelect.click();

        expect(screen.getByText('All Sessions')).toBeInTheDocument();
    });

    it('should handle pagination with large datasets', () => {
        const mockHabit = {
            id: 1,
            name: 'Test Habit',
            description: 'Test Description',
            color: '#ff0000',
            isActive: true,
            metricType: 'boolean' as const,
            createdBy: 'test-user-id',
            createdDate: '2026-01-30',
            modifiedBy: 'test-user-id',
            modifiedDate: '2026-01-30'
        };

        const largeMockSessions = Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            habitId: 1,
            status: 'completed' as const,
            startTime: '2026-01-31T10:00:00Z',
            endTime: '2026-01-31T10:25:00Z',
            plannedDurationMinutes: 25,
            actualDurationMinutes: 25,
            habit: mockHabit
        }));

        (useFocusSessions as ReturnType<typeof vi.fn>).mockReturnValue({
            data: largeMockSessions,
            isLoading: false,
            error: null
        });

        render(
            <TestWrapper>
                <FocusSessionHistory />
            </TestWrapper>
        );

        expect(screen.getAllByText('Test Habit').length).toBeGreaterThan(10);
    });

    it('should handle sessions with different durations', () => {
        const mockHabit = {
            id: 1,
            name: 'Test Habit',
            description: 'Test Description',
            color: '#ff0000',
            isActive: true,
            metricType: 'boolean' as const,
            createdBy: 'test-user-id',
            createdDate: '2026-01-30',
            modifiedBy: 'test-user-id',
            modifiedDate: '2026-01-30'
        };

        const sessionsWithDifferentDurations = [
            {
                id: 1,
                habitId: 1,
                status: 'completed' as const,
                startTime: '2026-01-31T10:00:00Z',
                endTime: '2026-01-31T10:30:00Z',
                plannedDurationMinutes: 25,
                actualDurationMinutes: 30,
                habit: mockHabit
            },
            {
                id: 2,
                habitId: 1,
                status: 'completed' as const,
                startTime: '2026-01-31T10:00:00Z',
                endTime: '2026-01-31T10:15:00Z',
                plannedDurationMinutes: 25,
                actualDurationMinutes: 15,
                habit: mockHabit
            },
            {
                id: 3,
                habitId: 1,
                status: 'completed' as const,
                startTime: '2026-01-31T10:00:00Z',
                endTime: '2026-01-31T11:00:00Z',
                plannedDurationMinutes: 25,
                actualDurationMinutes: 60,
                habit: mockHabit
            }
        ];

        (useFocusSessions as ReturnType<typeof vi.fn>).mockReturnValue({
            data: sessionsWithDifferentDurations,
            isLoading: false,
            error: null
        });

        render(
            <TestWrapper>
                <FocusSessionHistory />
            </TestWrapper>
        );

        expect(screen.getByText('Focus Sessions')).toBeInTheDocument();
    });

    it('should handle sessions without end times', () => {
        const mockHabit = {
            id: 1,
            name: 'Test Habit',
            description: 'Test Description',
            color: '#ff0000',
            isActive: true,
            metricType: 'boolean' as const,
            createdBy: 'test-user-id',
            createdDate: '2026-01-30',
            modifiedBy: 'test-user-id',
            modifiedDate: '2026-01-30'
        };

        const sessionsWithoutEndTime = [{
            id: 1,
            habitId: 1,
            status: 'active' as const,
            startTime: '2026-01-31T10:00:00Z',
            endTime: undefined,
            plannedDurationMinutes: 25,
            actualDurationMinutes: undefined,
            habit: mockHabit
        }];

        (useFocusSessions as ReturnType<typeof vi.fn>).mockReturnValue({
            data: sessionsWithoutEndTime,
            isLoading: false,
            error: null
        });

        render(
            <TestWrapper>
                <FocusSessionHistory />
            </TestWrapper>
        );

        expect(screen.getByText('Test Habit')).toBeInTheDocument();
    });

    it('should handle mixed session status types', () => {
        const mockHabit = {
            id: 1,
            name: 'Test Habit',
            description: 'Test Description',
            color: '#ff0000',
            isActive: true,
            metricType: 'boolean' as const,
            createdBy: 'test-user-id',
            createdDate: '2026-01-30',
            modifiedBy: 'test-user-id',
            modifiedDate: '2026-01-30'
        };

        const mixedStatusSessions = [
            {
                id: 1,
                habitId: 1,
                status: 'completed' as const,
                startTime: '2026-01-31T10:00:00Z',
                endTime: '2026-01-31T10:25:00Z',
                plannedDurationMinutes: 25,
                actualDurationMinutes: 25,
                habit: mockHabit
            },
            {
                id: 2,
                habitId: 1,
                status: 'interrupted' as const,
                startTime: '2026-01-31T10:00:00Z',
                endTime: '2026-01-31T10:20:00Z',
                plannedDurationMinutes: 25,
                actualDurationMinutes: 20,
                habit: mockHabit
            },
            {
                id: 3,
                habitId: 1,
                status: 'paused' as const,
                startTime: '2026-01-31T10:00:00Z',
                endTime: undefined,
                plannedDurationMinutes: 25,
                actualDurationMinutes: undefined,
                habit: mockHabit
            },
            {
                id: 4,
                habitId: 1,
                status: 'active' as const,
                startTime: '2026-01-31T10:00:00Z',
                endTime: undefined,
                plannedDurationMinutes: 25,
                actualDurationMinutes: undefined,
                habit: mockHabit
            }
        ];

        (useFocusSessions as ReturnType<typeof vi.fn>).mockReturnValue({
            data: mixedStatusSessions,
            isLoading: false,
            error: null
        });

        render(
            <TestWrapper>
                <FocusSessionHistory />
            </TestWrapper>
        );

        expect(screen.getAllByText('Test Habit')).toHaveLength(4);
    });

    it('should handle empty session data gracefully', () => {
        (useFocusSessions as ReturnType<typeof vi.fn>).mockReturnValue({
            data: [],
            isLoading: false,
            error: null
        });

        render(
            <TestWrapper>
                <FocusSessionHistory />
            </TestWrapper>
        );

        expect(screen.getByText('No focus sessions found')).toBeInTheDocument();
    });

    it('should handle analytics integration', () => {
        (useFocusSessionAnalytics as ReturnType<typeof vi.fn>).mockReturnValue({
            data: {
                totalSessions: 5,
                completedSessions: 3,
                totalFocusTime: 125,
                averageSessionLength: 25,
                completionRate: 60
            },
            isLoading: false
        });

        render(
            <TestWrapper>
                <FocusSessionHistory />
            </TestWrapper>
        );

        expect(screen.getByText('Focus Sessions')).toBeInTheDocument();
    });

    it('should handle different time zones in dates', () => {
        const mockHabit = {
            id: 1,
            name: 'Test Habit',
            description: 'Test Description',
            color: '#ff0000',
            isActive: true,
            metricType: 'boolean' as const,
            createdBy: 'test-user-id',
            createdDate: '2026-01-30',
            modifiedBy: 'test-user-id',
            modifiedDate: '2026-01-30'
        };

        const sessionWithTimeZone = [{
            id: 1,
            habitId: 1,
            status: 'completed' as const,
            startTime: '2026-01-01T08:00:00+05:00',
            endTime: '2026-01-01T08:25:00+05:00',
            plannedDurationMinutes: 25,
            actualDurationMinutes: 25,
            habit: mockHabit
        }];

        (useFocusSessions as ReturnType<typeof vi.fn>).mockReturnValue({
            data: sessionWithTimeZone,
            isLoading: false,
            error: null
        });

        render(
            <TestWrapper>
                <FocusSessionHistory />
            </TestWrapper>
        );

        expect(screen.getByText('Test Habit')).toBeInTheDocument();
    });

    it('should handle analytics error states', () => {
        (useFocusSessionAnalytics as ReturnType<typeof vi.fn>).mockReturnValue({
            data: null,
            isLoading: false,
            error: new Error('Analytics failed')
        });

        render(
            <TestWrapper>
                <FocusSessionHistory />
            </TestWrapper>
        );

        expect(screen.getByText('Focus Sessions')).toBeInTheDocument();
    });

    it('should handle mixed habit types in sessions', () => {
        const mockHabit1 = {
            id: 1,
            name: 'Test Habit',
            description: 'Test Description',
            color: '#ff0000',
            isActive: true,
            metricType: 'boolean' as const,
            createdBy: 'test-user-id',
            createdDate: '2026-01-30',
            modifiedBy: 'test-user-id',
            modifiedDate: '2026-01-30'
        };

        const mockHabit2 = {
            id: 2,
            name: 'Reading',
            description: 'Daily Reading',
            color: '#00ff00',
            isActive: true,
            metricType: 'boolean' as const,
            createdBy: 'test-user-id',
            createdDate: '2026-01-30',
            modifiedBy: 'test-user-id',
            modifiedDate: '2026-01-30'
        };

        const sessionsWithDifferentHabits = [
            {
                id: 1,
                habitId: 1,
                status: 'completed' as const,
                startTime: '2026-01-31T10:00:00Z',
                endTime: '2026-01-31T10:25:00Z',
                plannedDurationMinutes: 25,
                actualDurationMinutes: 25,
                habit: mockHabit1
            },
            {
                id: 2,
                habitId: 2,
                status: 'completed' as const,
                startTime: '2026-01-31T10:00:00Z',
                endTime: '2026-01-31T10:25:00Z',
                plannedDurationMinutes: 25,
                actualDurationMinutes: 25,
                habit: mockHabit2
            }
        ];

        (useFocusSessions as ReturnType<typeof vi.fn>).mockReturnValue({
            data: sessionsWithDifferentHabits,
            isLoading: false,
            error: null
        });

        render(
            <TestWrapper>
                <FocusSessionHistory />
            </TestWrapper>
        );

        expect(screen.getByText('Test Habit')).toBeInTheDocument();
        expect(screen.getByText('Reading')).toBeInTheDocument();
    });

    it('should display habits without color gracefully', () => {
        const mockSessions = [
            {
                id: 1,
                status: 'completed' as const,
                startTime: '2026-01-31T10:00:00Z',
                actualDurationMinutes: 25,
                plannedDurationMinutes: 25,
                habit: {
                    id: 1,
                    name: 'Reading'
                    // no color property
                }
            }
        ];

        (useFocusSessions as ReturnType<typeof vi.fn>).mockReturnValue({
            data: mockSessions,
            isLoading: false,
            error: null
        });

        render(
            <TestWrapper>
                <FocusSessionHistory />
            </TestWrapper>
        );

        expect(screen.getByText('Reading')).toBeInTheDocument();
    });
});