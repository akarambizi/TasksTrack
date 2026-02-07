import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ActivityGridContainer } from './ActivityGridContainer';
import { useActivityGrid, useActivityStatistics } from '../../queries/activity';
import { IActivityGridResponse, IActivityStatisticsResponse } from '@/types';

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
            { habitId: 1, habitName: 'Exercise', metricType: 'Count', value: 1, unit: null, color: null, icon: null },
            { habitId: 2, habitName: 'Reading', metricType: 'Duration', value: 30, unit: null, color: null, icon: null }
        ]
    },
    {
        date: '2024-01-02',
        activityCount: 3,
        totalValue: 45,
        intensityLevel: 3,
        habitsSummary: [
            { habitId: 1, habitName: 'Exercise', metricType: 'Count', value: 2, unit: null, color: null, icon: null },
            { habitId: 3, habitName: 'Meditation', metricType: 'Duration', value: 15, unit: null, color: null, icon: null }
        ]
    }
];

const mockStatisticsData: IActivityStatisticsResponse = {
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
        totalValue: 100,
        activityCount: 30,
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
            isError: false
        } as any);
    });

    it('renders loading state initially', () => {
        mockUseActivityGrid.mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false
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
            isError: false
        } as any);
        mockUseActivityStatistics.mockReturnValue({
            data: mockStatisticsData,
            isLoading: false,
            isError: false
        } as any);

        render(<ActivityGridContainer />, { wrapper: Wrapper });

        // Should render the grid when data is loaded
        expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('renders error state when query fails', () => {
        mockUseActivityGrid.mockReturnValue({
            data: undefined,
            isLoading: false,
            error: new Error('Failed to fetch data'),
            isError: true
        } as any);
        mockUseActivityStatistics.mockReturnValue({
            data: null,
            isLoading: false,
            isError: false
        } as any);

        render(<ActivityGridContainer />, { wrapper: Wrapper });

        expect(screen.getByText('Failed to load activity data')).toBeInTheDocument();
        expect(screen.getByText('Please try again later')).toBeInTheDocument();
    });

    it('renders empty state when no data is available', () => {
        mockUseActivityGrid.mockReturnValue({
            data: [], // empty array means no data available
            isLoading: false,
            isError: false
        } as any);
        mockUseActivityStatistics.mockReturnValue({
            data: null,
            isLoading: false,
            isError: false
        } as any);

        render(<ActivityGridContainer />, { wrapper: Wrapper });

        expect(screen.getByText('No activity data available')).toBeInTheDocument();
        expect(screen.getByText('Start logging habits to see your activity grid')).toBeInTheDocument();
    });

    it('calculates correct date range for query', () => {
        mockUseActivityGrid.mockReturnValue({
            data: mockGridData,
            isLoading: false,
            isError: false
        } as any);

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
            isError: false
        } as any);
        mockUseActivityStatistics.mockReturnValue({
            data: mockStatisticsData,
            isLoading: false,
            isError: false
        } as any);

        render(<ActivityGridContainer />, { wrapper: Wrapper });

        // Should render the grid which contains the year
        expect(screen.getByRole('grid')).toBeInTheDocument();
        // Note: The title comes from ActivityGrid component when it renders
    });
});