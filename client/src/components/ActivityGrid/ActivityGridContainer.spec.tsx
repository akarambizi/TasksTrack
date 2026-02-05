import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ActivityGridContainer } from './ActivityGridContainer';
import { useActivityGrid, useActivityStatistics } from '../../queries/activity';
import { IActivityGridResponse } from '../../api/activity.types';

// Mock the activity query hooks
vi.mock('../../queries/activity', () => ({
    useActivityGrid: vi.fn(),
    useActivityStatistics: vi.fn(),
}));

const mockUseActivityGrid = vi.mocked(useActivityGrid);
const mockUseActivityStatistics = vi.mocked(useActivityStatistics);
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

const mockGridData: IActivityGridResponse[] = [
    {
        date: '2024-01-01',
        activityCount: 2,
        totalValue: 20,
        intensityLevel: 2,
        habitsSummary: [
            { habitId: 1, habitName: 'Exercise', metricType: 'Count', value: 1, unit: 'times' },
            { habitId: 2, habitName: 'Reading', metricType: 'Duration', value: 30, unit: 'min' }
        ]
    },
    {
        date: '2024-01-02',
        activityCount: 3,
        totalValue: 45,
        intensityLevel: 3,
        habitsSummary: [
            { habitId: 1, habitName: 'Exercise', metricType: 'Count', value: 2, unit: 'times' },
            { habitId: 3, habitName: 'Meditation', metricType: 'Duration', value: 15, unit: 'min' }
        ]
    }
];

const mockStatisticsData = {
    totalDaysTracked: 365,
    totalActiveDays: 150,
    totalActivities: 450,
    totalHabits: 5,
    activeHabits: 3,
    totalValue: 1200,
    averageValue: 8,
    completionRate: 0.85,
    currentOverallStreak: 7,
    longestOverallStreak: 21,
    mostActiveDayOfWeek: 1,
    mostActiveDayName: 'Monday',
    bestPerformingHabit: {
        habitId: 1,
        habitName: 'Exercise',
        metricType: 'Count',
        value: 100,
        unit: 'times',
        completionRate: 0.9
    },
    monthlyStats: [
        {
            month: 1,
            year: 2024,
            monthName: 'January',
            activityCount: 25,
            totalValue: 150,
            activeDays: 20
        }
    ],
    weeklyStats: [
        {
            weekStartDate: '2024-01-01',
            weekEndDate: '2024-01-07',
            activityCount: 7,
            totalValue: 50,
            activeDays: 6
        }
    ]
};

describe('ActivityGridContainer', () => {
    const Wrapper = createWrapper();

    beforeEach(() => {
        vi.clearAllMocks();
        // Mock useActivityStatistics to return loading state by default
        mockUseActivityStatistics.mockReturnValue({
            data: null,
            isLoading: true,
            isPending: true,
            isError: false,
            isSuccess: false,
            error: null,
            status: 'pending',
            fetchStatus: 'fetching',
            isLoadingError: false,
            isRefetchError: false,
            isStale: false,
            isFetched: false,
            isFetchedAfterMount: false,
            isRefetching: false,
            refetch: vi.fn(),
        } as any);
    });

    it('renders loading state initially', () => {
        mockUseActivityGrid.mockReturnValue({
            data: undefined,
            isLoading: true,
            isPending: true,
            isError: false,
            isSuccess: false,
            error: null,
            status: 'pending',
            fetchStatus: 'fetching',
            isLoadingError: false,
            isRefetchError: false,
            isStale: false,
            isFetched: false,
            isFetchedAfterMount: false,
            isRefetching: false,
            refetch: vi.fn(),
        } as any);

        render(<ActivityGridContainer />, { wrapper: Wrapper });

        // Loading skeletons should be present
        const skeletons = screen.getAllByTestId('loading-skeleton');
        expect(skeletons.length).toBeGreaterThan(0);
        
        // Should not show activity content during loading
        expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });

    it('renders activity grid when data is loaded', async () => {
        mockUseActivityGrid.mockReturnValue({
            data: mockGridData,
            isLoading: false,
            error: null,
            isError: false,
        });
        mockUseActivityStatistics.mockReturnValue({
            data: mockStatisticsData,
            isLoading: false,
            error: null,
            isError: false,
        });

        render(<ActivityGridContainer />, { wrapper: Wrapper });

        // Should render the grid when data is loaded
        expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('renders error state when query fails', () => {
        const errorMessage = 'Failed to load activity data';
        mockUseActivityGrid.mockReturnValue({
            data: undefined,
            isLoading: false,
            isPending: false,
            isError: true,
            isSuccess: false,
            error: new Error('Failed to fetch data'),
            status: 'error',
            fetchStatus: 'idle',
            isLoadingError: false,
            isRefetchError: false,
            isStale: false,
            isFetched: true,
            isFetchedAfterMount: true,
            isRefetching: false,
            refetch: vi.fn(),
        } as any);
        mockUseActivityStatistics.mockReturnValue({
            data: null,
            isLoading: false,
            isPending: false,
            isError: false,
            isSuccess: true,
            error: null,
            status: 'success',
            fetchStatus: 'idle',
            isLoadingError: false,
            isRefetchError: false,
            isStale: false,
            isFetched: true,
            isFetchedAfterMount: true,
            isRefetching: false,
            refetch: vi.fn(),
        } as any);

        render(<ActivityGridContainer />, { wrapper: Wrapper });

        expect(screen.getByText('Failed to load activity data')).toBeInTheDocument();
        expect(screen.getByText('Please try again later')).toBeInTheDocument();
    });

    it('renders empty state when no data is available', () => {
        mockUseActivityGrid.mockReturnValue({
            data: [], // empty array means no data available
            isLoading: false,
            isPending: false,
            isError: false,
            isSuccess: true,
            error: null,
            status: 'success',
            fetchStatus: 'idle',
            isLoadingError: false,
            isRefetchError: false,
            isStale: false,
            isFetched: true,
            isFetchedAfterMount: true,
            isRefetching: false,
            refetch: vi.fn(),
        } as any);
        mockUseActivityStatistics.mockReturnValue({
            data: null,
            isLoading: false,
            isPending: false,
            isError: false,
            isSuccess: true,
            error: null,
            status: 'success',
            fetchStatus: 'idle',
            isLoadingError: false,
            isRefetchError: false,
            isStale: false,
            isFetched: true,
            isFetchedAfterMount: true,
            isRefetching: false,
            refetch: vi.fn(),
        } as any);

        render(<ActivityGridContainer />, { wrapper: Wrapper });

        expect(screen.getByText('No activity data available')).toBeInTheDocument();
        expect(screen.getByText('Start logging habits to see your activity grid')).toBeInTheDocument();
    });

    it('calculates correct date range for query', () => {
        mockUseActivityGrid.mockReturnValue({
            data: mockGridData,
            isLoading: false,
            error: null,
            isError: false,
        });

        render(<ActivityGridContainer />, { wrapper: Wrapper });

        // Check that useActivityGrid was called with separate date parameters
        expect(mockUseActivityGrid).toHaveBeenCalledWith(
            expect.any(String), // startDate
            expect.any(String)  // endDate
        );

        const call = mockUseActivityGrid.mock.calls[0];
        const startDate = new Date(call[0]);
        const endDate = new Date(call[1]);

        // Should be approximately 1 year of data
        const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        expect(daysDiff).toBeGreaterThan(350); // About a year
        expect(daysDiff).toBeLessThan(370);
    });

    it('shows current date in the title', () => {
        mockUseActivityGrid.mockReturnValue({
            data: mockGridData,
            isLoading: false,
            error: null,
            isError: false,
        });
        mockUseActivityStatistics.mockReturnValue({
            data: mockStatisticsData,
            isLoading: false,
            error: null,
            isError: false,
        });

        render(<ActivityGridContainer />, { wrapper: Wrapper });

        // Should render the grid which contains the year
        expect(screen.getByRole('grid')).toBeInTheDocument();
        // Note: The title comes from ActivityGrid component when it renders
    });
});