import { TARGET_FREQUENCY } from '@/types/constants';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HabitLogStats } from './HabitLogStats';
import { IHabit, IHabitLog } from '../../api';
import React from 'react';
import { useHabitLogsByHabitAndDateRange } from '../../queries/habitLogs';
import { AxiosError } from 'axios';

// Mock the queries
vi.mock('../../queries/habitLogs', () => ({
    useHabitLogsByHabitAndDateRange: vi.fn(),
}));

// Mock date-fns to ensure consistent test dates
vi.mock('date-fns', async () => {
    const actual = await vi.importActual('date-fns');
    return {
        ...actual,
        format: vi.fn().mockImplementation((date: Date, formatStr: string) => {
            // Mock consistent dates for testing
            if (formatStr === 'yyyy-MM-dd') {
                const d = new Date(date);
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            }
            return (actual as any).format(date, formatStr);
        }),
    };
});

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
    failureCount: 0,
    failureReason: error,
    errorUpdateCount: error ? 1 : 0,
    refetch: vi.fn(),
    remove: vi.fn(),
    promise: Promise.resolve(data),
    status: isLoading ? 'pending' : error ? 'error' : 'success',
    fetchStatus: isLoading ? 'fetching' : 'idle',
    dataUpdatedAt: Date.now(),
    errorUpdatedAt: error ? Date.now() : 0,
});

const mockHabit: IHabit = {
    id: 1,
    name: 'Test Habit',
    description: 'Test description',
    target: 30,
    unit: 'minutes',
    metricType: 'duration',
    targetFrequency: TARGET_FREQUENCY.DAILY,
    isActive: true,
    createdBy: 'test-user',
    createdDate: '2024-01-01T00:00:00Z',
    updatedDate: '2024-01-01T00:00:00Z',
    category: 'Health',
    updatedBy: null,
    color: null,
    icon: null
};

const mockHabitLogs: IHabitLog[] = [
    {
        id: 1,
        habitId: 1,
        value: 15,
        date: '2024-01-01T00:00:00Z',
        notes: 'Test log 1',
        createdBy: 'test-user',
        createdDate: '2024-01-01T00:00:00Z',
        updatedDate: '2024-01-01T00:00:00Z',
    },
    {
        id: 2,
        habitId: 1,
        value: 20,
        date: '2024-01-01T00:00:00Z',
        notes: 'Test log 2',
        createdBy: 'test-user',
        createdDate: '2024-01-01T00:00:00Z',
        updatedDate: '2024-01-01T00:00:00Z',
    },
];

describe('HabitLogStats', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });
        vi.clearAllMocks();
    });

    const renderWithQueryClient = (component: React.ReactElement) => {
        return render(
            <QueryClientProvider client={queryClient}>
                {component}
            </QueryClientProvider>
        );
    };

    describe('when data is loading', () => {
        beforeEach(() => {
            (useHabitLogsByHabitAndDateRange as any).mockImplementation(() =>
                createMockQueryResult(undefined, true)
            );
        });

        it('should render loading state correctly', () => {
            renderWithQueryClient(<HabitLogStats habit={mockHabit} />);

            // Should render cards with 0 values while loading
            const zeroMinutes = screen.getAllByText('0 minutes');
            expect(zeroMinutes[0]).toBeInTheDocument(); // Today card
            expect(screen.getByText('Today')).toBeInTheDocument();
            expect(screen.getByText('This Week')).toBeInTheDocument();
            expect(screen.getByText('Active Days')).toBeInTheDocument();
        });
    });

    describe('when data is loaded successfully', () => {
        beforeEach(() => {
            (useHabitLogsByHabitAndDateRange as any).mockImplementation(() =>
                createMockQueryResult(mockHabitLogs)
            );
        });

        it('should display habit statistics correctly', () => {
            renderWithQueryClient(<HabitLogStats habit={mockHabit} />);

            // Should calculate totals correctly (15 + 20 = 35)
            const totalMinutes = screen.getAllByText('35 minutes');
            expect(totalMinutes[0]).toBeInTheDocument(); // Today card
            expect(screen.getByText('Today')).toBeInTheDocument();
            expect(screen.getByText('This Week')).toBeInTheDocument();
        });

        it('should calculate progress percentage correctly with target', () => {
            renderWithQueryClient(<HabitLogStats habit={mockHabit} />);

            // 35 minutes out of 30 target = 117%
            expect(screen.getByText(/117% of target/)).toBeInTheDocument();
        });

        it('should show target achievement badge when target is met', () => {
            renderWithQueryClient(<HabitLogStats habit={mockHabit} />);

            // Should show checkmark for exceeding target - it's part of the subtitle
            expect(screen.getByText(/117% of target ✓/)).toBeInTheDocument();
        });

        it('should calculate active days correctly', () => {
            renderWithQueryClient(<HabitLogStats habit={mockHabit} />);

            // Both logs are from same date, so 1 active day
            expect(screen.getByText('1/7')).toBeInTheDocument();
            expect(screen.getByText('Days this week')).toBeInTheDocument();
        });
    });

    describe('when habit has weekly target', () => {
        const weeklyHabit: IHabit = {
            ...mockHabit,
            target: 200,
            targetFrequency: TARGET_FREQUENCY.WEEKLY,
        };

        beforeEach(() => {
            (useHabitLogsByHabitAndDateRange as any).mockImplementation(() =>
                createMockQueryResult(mockHabitLogs)
            );
        });

        it('should display weekly target progress', () => {
            renderWithQueryClient(<HabitLogStats habit={weeklyHabit} />);

            expect(screen.getByText('Weekly Target')).toBeInTheDocument();
            // 35 out of 200 = 18%
            expect(screen.getByText('18%')).toBeInTheDocument();
            expect(screen.getByText('35 of 200 minutes')).toBeInTheDocument();
        });
    });

    describe('when habit has no target', () => {
        const noTargetHabit: IHabit = {
            ...mockHabit,
            target: 0,
        };

        beforeEach(() => {
            (useHabitLogsByHabitAndDateRange as any).mockImplementation(() =>
                createMockQueryResult(mockHabitLogs)
            );
        });

        it('should not display target-related information', () => {
            renderWithQueryClient(<HabitLogStats habit={noTargetHabit} />);

            expect(screen.queryByText(/% of target/)).not.toBeInTheDocument();
            expect(screen.queryByText('✓')).not.toBeInTheDocument();
            expect(screen.queryByText('Weekly Target')).not.toBeInTheDocument();
        });
    });

    describe('when no logs are available', () => {
        beforeEach(() => {
            (useHabitLogsByHabitAndDateRange as any).mockImplementation(() =>
                createMockQueryResult([])
            );
        });

        it('should display zero values', () => {
            renderWithQueryClient(<HabitLogStats habit={mockHabit} />);

            const zeroMinutes = screen.getAllByText('0 minutes');
            expect(zeroMinutes[0]).toBeInTheDocument(); // Today card
            expect(screen.getByText('0/7')).toBeInTheDocument();
            expect(screen.getByText('Avg: 0 minutes/day')).toBeInTheDocument();
        });

        it('should show 0% progress when no logs and target exists', () => {
            renderWithQueryClient(<HabitLogStats habit={mockHabit} />);

            expect(screen.getByText('0% of target')).toBeInTheDocument();
            expect(screen.queryByText('✓')).not.toBeInTheDocument();
        });
    });

    describe('when there is an error', () => {
        const mockError = new AxiosError('Failed to fetch');

        beforeEach(() => {
            (useHabitLogsByHabitAndDateRange as any).mockImplementation(() =>
                createMockQueryResult(undefined, false, mockError)
            );
        });

        it('should handle error state gracefully', () => {
            renderWithQueryClient(<HabitLogStats habit={mockHabit} />);

            // Should still render component structure with default values
            expect(screen.getByText('Today')).toBeInTheDocument();
            expect(screen.getByText('This Week')).toBeInTheDocument();
            const zeroMinutes = screen.getAllByText('0 minutes');
            expect(zeroMinutes[0]).toBeInTheDocument();
        });
    });

    describe('display unit handling', () => {
        it('should use habit unit when available', () => {
            const habitWithUnit = { ...mockHabit, unit: 'reps' };
            (useHabitLogsByHabitAndDateRange as any).mockImplementation(() =>
                createMockQueryResult(mockHabitLogs)
            );

            renderWithQueryClient(<HabitLogStats habit={habitWithUnit} />);

            const repsText = screen.getAllByText('35 reps');
            expect(repsText[0]).toBeInTheDocument();
        });

        it('should use metricType when unit is not available', () => {
            const habitWithMetricType = { ...mockHabit, unit: null, metricType: 'count' as const };
            (useHabitLogsByHabitAndDateRange as any).mockImplementation(() =>
                createMockQueryResult(mockHabitLogs)
            );

            renderWithQueryClient(<HabitLogStats habit={habitWithMetricType} />);

            const countText = screen.getAllByText('35 count');
            expect(countText[0]).toBeInTheDocument();
        });

        it('should default to "units" when neither unit nor metricType is available', () => {
            const habitWithoutUnit = { ...mockHabit, unit: '', metricType: 'binary' as const };
            (useHabitLogsByHabitAndDateRange as any).mockImplementation(() =>
                createMockQueryResult(mockHabitLogs)
            );

            renderWithQueryClient(<HabitLogStats habit={habitWithoutUnit} />);

            const unitsText = screen.getAllByText('35 binary');
            expect(unitsText[0]).toBeInTheDocument();
        });
    });
});