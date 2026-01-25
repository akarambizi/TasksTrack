import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HabitLogs } from './HabitLogs';
import { IHabit, IHabitLog } from '../../api';
import React from 'react';
import { useHabitLogs } from '../../queries/habitLogs';
import { AxiosError } from 'axios';

// Mock the queries
vi.mock('../../queries/habitLogs', () => ({
    useHabitLogs: vi.fn(),
}));

// Helper to create mock query results
const createMockQueryResult = (data: IHabitLog[] | undefined, isLoading = false, error: AxiosError | null = null) => ({
    data,
    isLoading,
    error,
    isError: !!error,
    isSuccess: !isLoading && !error && data !== undefined,
    isPending: isLoading,
    isFetching: isLoading,
    isFetched: !isLoading,
    isFetchedAfterMount: !isLoading,
    isRefetching: false,
    isLoadingError: false,
    isRefetchError: false,
    isStale: false,
    isPlaceholderData: false,
    isPaused: false,
    failureCount: error ? 1 : 0,
    failureReason: error,
    status: isLoading ? 'pending' : error ? 'error' : 'success',
    fetchStatus: isLoading ? 'fetching' : 'idle',
    refetch: vi.fn(),
} as any);

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

const mockHabit: IHabit = {
    id: 1,
    name: 'Exercise',
    target: 30,
    unit: 'minutes',
    metricType: 'duration',
    targetFrequency: 'daily',
    isActive: true,
    createdDate: '2024-01-01T00:00:00Z',
    updatedDate: '2024-01-01T00:00:00Z',
    createdBy: 'user1',
    updatedBy: 'user1',
};

const mockHabitLogs: IHabitLog[] = [
    {
        id: 1,
        habitId: 1,
        value: 35,
        date: '2024-01-23',
        notes: 'Great workout today!',
        createdDate: '2024-01-23T10:00:00Z',
        updatedDate: '2024-01-23T10:00:00Z',
        createdBy: 'user1',
        updatedBy: 'user1',
    },
    {
        id: 2,
        habitId: 1,
        value: 25,
        date: '2024-01-22',
        notes: 'Felt tired but pushed through',
        createdDate: '2024-01-22T10:00:00Z',
        updatedDate: '2024-01-22T10:00:00Z',
        createdBy: 'user1',
        updatedBy: 'user1',
    },
    {
        id: 3,
        habitId: 1,
        value: 40,
        date: '2024-01-21',
        notes: undefined,
        createdDate: '2024-01-21T10:00:00Z',
        updatedDate: '2024-01-21T10:00:00Z',
        createdBy: 'user1',
        updatedBy: 'user1',
    }
];

describe('HabitLogs', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state', () => {

        vi.mocked(useHabitLogs).mockReturnValue(createMockQueryResult(undefined, true));

        const wrapper = createWrapper();

        render(
            <HabitLogs habit={mockHabit} />,
            { wrapper }
        );

        expect(screen.getByTestId('habit-logs-loading')).toBeInTheDocument();
        expect(screen.getByText('Recent Activity')).toBeInTheDocument();

        // Should show loading skeletons
        const { container } = render(<HabitLogs habit={mockHabit} />, { wrapper });
        const skeletons = container.querySelectorAll('.animate-pulse');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('shows error state', () => {

        const axiosError = { isAxiosError: true, toJSON: () => ({}) } as AxiosError;
        vi.mocked(useHabitLogs).mockReturnValue(createMockQueryResult(undefined, false, axiosError));

        const wrapper = createWrapper();

        render(
            <HabitLogs habit={mockHabit} />,
            { wrapper }
        );

        expect(screen.getByTestId('habit-logs-error')).toBeInTheDocument();
        expect(screen.getByText('Failed to load activity logs')).toBeInTheDocument();
    });

    it('shows empty state when no logs exist', () => {

        vi.mocked(useHabitLogs).mockReturnValue(createMockQueryResult([]));

        const wrapper = createWrapper();

        render(
            <HabitLogs habit={mockHabit} />,
            { wrapper }
        );

        expect(screen.getByTestId('habit-logs-empty')).toBeInTheDocument();
        expect(screen.getByText('No activity logged yet')).toBeInTheDocument();
        expect(screen.getByText(/Start logging your progress/)).toBeInTheDocument();
    });

    it('displays habit logs correctly', () => {

        vi.mocked(useHabitLogs).mockReturnValue(createMockQueryResult(mockHabitLogs));

        const wrapper = createWrapper();

        render(
            <HabitLogs habit={mockHabit} />,
            { wrapper }
        );

        expect(screen.getByTestId('habit-logs-container')).toBeInTheDocument();
        expect(screen.getByText('Recent Activity')).toBeInTheDocument();

        // Check each log is rendered
        mockHabitLogs.forEach((log) => {
            expect(screen.getByTestId(`habit-log-${log.id}`)).toBeInTheDocument();
            expect(screen.getByTestId(`log-value-${log.id}`)).toHaveTextContent(`${log.value} minutes`);
        });
    });

    it('shows today badge for today\'s logs', () => {
        const today = new Date();
        const todayLog = {
            ...mockHabitLogs[0],
            date: today.toISOString(), // Use full ISO string to avoid timezone issues
        };


        vi.mocked(useHabitLogs).mockReturnValue(createMockQueryResult([todayLog]));

        const wrapper = createWrapper();

        render(
            <HabitLogs habit={mockHabit} />,
            { wrapper }
        );

        expect(screen.getByTestId(`today-badge-${todayLog.id}`)).toBeInTheDocument();
        expect(screen.getByText('Today')).toBeInTheDocument();
    });

    it('shows target achievement status', () => {

        vi.mocked(useHabitLogs).mockReturnValue(createMockQueryResult(mockHabitLogs));

        const wrapper = createWrapper();

        render(
            <HabitLogs habit={mockHabit} />,
            { wrapper }
        );

        // First log (35 minutes) should show target met (target is 30)
        expect(screen.getByTestId(`target-badge-${mockHabitLogs[0].id}`)).toHaveTextContent('✓ Target Met');

        // Second log (25 minutes) should show percentage
        expect(screen.getByTestId(`target-badge-${mockHabitLogs[1].id}`)).toHaveTextContent('83% of target');

        // Third log (40 minutes) should show target met
        expect(screen.getByTestId(`target-badge-${mockHabitLogs[2].id}`)).toHaveTextContent('✓ Target Met');
    });

    it('displays notes when present', () => {

        vi.mocked(useHabitLogs).mockReturnValue(createMockQueryResult(mockHabitLogs));

        const wrapper = createWrapper();

        render(
            <HabitLogs habit={mockHabit} />,
            { wrapper }
        );

        // First log has notes
        expect(screen.getByTestId(`log-notes-${mockHabitLogs[0].id}`)).toBeInTheDocument();
        expect(screen.getByText('Great workout today!')).toBeInTheDocument();

        // Second log has notes
        expect(screen.getByTestId(`log-notes-${mockHabitLogs[1].id}`)).toBeInTheDocument();
        expect(screen.getByText('Felt tired but pushed through')).toBeInTheDocument();

        // Third log has no notes
        expect(screen.queryByTestId(`log-notes-${mockHabitLogs[2].id}`)).not.toBeInTheDocument();
    });

    it('handles habit without target', () => {
        const habitWithoutTarget = {
            ...mockHabit,
            target: undefined,
        };

        vi.mocked(useHabitLogs).mockReturnValue(createMockQueryResult([mockHabitLogs[0]]));

        const wrapper = createWrapper();

        render(
            <HabitLogs habit={habitWithoutTarget} />,
            { wrapper }
        );

        // Should not show target badge when habit has no target
        expect(screen.queryByTestId(`target-badge-${mockHabitLogs[0].id}`)).not.toBeInTheDocument();
    });

    it('handles habit without unit', () => {
        const habitWithoutUnit = {
            ...mockHabit,
            unit: undefined,
        };

        vi.mocked(useHabitLogs).mockReturnValue(createMockQueryResult([mockHabitLogs[0]]));

        const wrapper = createWrapper();

        render(
            <HabitLogs habit={habitWithoutUnit} />,
            { wrapper }
        );

        // Should fallback to metricType or 'units'
        expect(screen.getByTestId(`log-value-${mockHabitLogs[0].id}`)).toHaveTextContent('35 duration');
    });

    it('respects limit prop', () => {


        render(
            <HabitLogs habit={mockHabit} limit={5} />,
            { wrapper: createWrapper() }
        );

        expect(useHabitLogs).toHaveBeenCalledWith({
            habitId: mockHabit.id,
            limit: 5,
        });
    });

    it('uses default limit when not specified', () => {


        render(
            <HabitLogs habit={mockHabit} />,
            { wrapper: createWrapper() }
        );

        expect(useHabitLogs).toHaveBeenCalledWith({
            habitId: mockHabit.id,
            limit: 10,
        });
    });
});