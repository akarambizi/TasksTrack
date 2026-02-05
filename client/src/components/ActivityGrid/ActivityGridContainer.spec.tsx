import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ActivityGridContainer } from './ActivityGridContainer';
import { useActivityGrid } from '../../queries/activity';
import { IActivityGridResponse } from '../../api/activity.types';

// Mock the activity query hook
vi.mock('../../queries/activity', () => ({
    useActivityGrid: vi.fn(),
}));

const mockUseActivityGrid = vi.mocked(useActivityGrid);

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

describe('ActivityGridContainer', () => {
    const Wrapper = createWrapper();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        mockUseActivityGrid.mockReturnValue({
            data: undefined,
            isLoading: true,
            error: null,
            isError: false,
        });

        render(<ActivityGridContainer />, { wrapper: Wrapper });

        expect(screen.getByText('Activity Overview')).toBeInTheDocument();
        // Loading skeleton should be present
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders activity grid when data is loaded', async () => {
        mockUseActivityGrid.mockReturnValue({
            data: mockGridData,
            isLoading: false,
            error: null,
            isError: false,
        });

        render(<ActivityGridContainer />, { wrapper: Wrapper });

        expect(screen.getByText('Activity Overview')).toBeInTheDocument();
        expect(screen.getByText('Activity Grid')).toBeInTheDocument();

        // Should render the grid
        expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('renders error state when query fails', () => {
        const errorMessage = 'Failed to load activity data';
        mockUseActivityGrid.mockReturnValue({
            data: undefined,
            isLoading: false,
            error: new Error(errorMessage),
            isError: true,
        });

        render(<ActivityGridContainer />, { wrapper: Wrapper });

        expect(screen.getByText('Activity Overview')).toBeInTheDocument();
        expect(screen.getByText('Failed to load activity grid. Please try refreshing the page.')).toBeInTheDocument();
    });

    it('renders empty state when no data is available', () => {
        mockUseActivityGrid.mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
            isError: false,
        });

        render(<ActivityGridContainer />, { wrapper: Wrapper });

        expect(screen.getByText('Activity Overview')).toBeInTheDocument();
        expect(screen.getByText('Activity Grid')).toBeInTheDocument();
    });

    it('calculates correct date range for query', () => {
        mockUseActivityGrid.mockReturnValue({
            data: mockGridData,
            isLoading: false,
            error: null,
            isError: false,
        });

        render(<ActivityGridContainer />, { wrapper: Wrapper });

        // Check that useActivityGrid was called with proper date range
        expect(mockUseActivityGrid).toHaveBeenCalledWith({
            endDate: expect.any(String),
            startDate: expect.any(String),
        });

        const call = mockUseActivityGrid.mock.calls[0][0];
        const startDate = new Date(call.startDate);
        const endDate = new Date(call.endDate);

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

        render(<ActivityGridContainer />, { wrapper: Wrapper });

        // Should show current year in the title
        const currentYear = new Date().getFullYear();
        expect(screen.getByText(`Activity Overview ${currentYear}`)).toBeInTheDocument();
    });
});