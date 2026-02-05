import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ActivityStatistics } from './ActivityStatistics';
import { useActivityStatistics } from '../../queries/activity';
import { IActivityStatisticsResponse } from '../../api/activity.types';

// Mock the activity statistics query hook
vi.mock('../../queries/activity', () => ({
    useActivityStatistics: vi.fn(),
}));

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

const mockStatisticsData: IActivityStatisticsResponse = {
    overview: {
        totalActiveDays: 150,
        currentStreak: 7,
        longestStreak: 21,
        averageIntensity: 2.5,
        totalHabitsCompleted: 450
    },
    streaks: {
        current: 7,
        longest: 21,
        thisMonth: 15,
        thisWeek: 5
    },
    bestPerformingHabits: [
        { habitName: 'Morning Exercise', completionRate: 0.95, totalCompletions: 142 },
        { habitName: 'Daily Reading', completionRate: 0.87, totalCompletions: 130 },
        { habitName: 'Meditation', completionRate: 0.75, totalCompletions: 112 }
    ],
    weeklyBreakdown: {
        sunday: 18,
        monday: 22,
        tuesday: 25,
        wednesday: 20,
        thursday: 19,
        friday: 21,
        saturday: 16
    },
    monthlyAverages: [
        { month: 'Jan', average: 2.1 },
        { month: 'Feb', average: 2.8 },
        { month: 'Mar', average: 3.2 },
        { month: 'Apr', average: 2.9 }
    ]
};

describe('ActivityStatistics', () => {
    const Wrapper = createWrapper();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        mockUseActivityStatistics.mockReturnValue({
            data: undefined,
            isLoading: true,
            error: null,
            isError: false,
        });

        render(<ActivityStatistics />, { wrapper: Wrapper });

        expect(screen.getByText('Activity Statistics')).toBeInTheDocument();
        // Loading skeleton should be present
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders activity statistics when data is loaded', () => {
        mockUseActivityStatistics.mockReturnValue({
            data: mockStatisticsData,
            isLoading: false,
            error: null,
            isError: false,
        });

        render(<ActivityStatistics />, { wrapper: Wrapper });

        expect(screen.getByText('Activity Statistics')).toBeInTheDocument();

        // Check overview stats
        expect(screen.getByText('Total Active Days')).toBeInTheDocument();
        expect(screen.getByText('150')).toBeInTheDocument();
        expect(screen.getByText('Current Streak')).toBeInTheDocument();
        expect(screen.getByText('7')).toBeInTheDocument();
    });

    it('displays streak information correctly', () => {
        mockUseActivityStatistics.mockReturnValue({
            data: mockStatisticsData,
            isLoading: false,
            error: null,
            isError: false,
        });

        render(<ActivityStatistics />, { wrapper: Wrapper });

        expect(screen.getByText('Streak Statistics')).toBeInTheDocument();
        expect(screen.getByText('Current: 7 days')).toBeInTheDocument();
        expect(screen.getByText('Longest: 21 days')).toBeInTheDocument();
        expect(screen.getByText('This Month: 15 days')).toBeInTheDocument();
        expect(screen.getByText('This Week: 5 days')).toBeInTheDocument();
    });

    it('displays best performing habits', () => {
        mockUseActivityStatistics.mockReturnValue({
            data: mockStatisticsData,
            isLoading: false,
            error: null,
            isError: false,
        });

        render(<ActivityStatistics />, { wrapper: Wrapper });

        expect(screen.getByText('Best Performing Habits')).toBeInTheDocument();
        expect(screen.getByText('Morning Exercise')).toBeInTheDocument();
        expect(screen.getByText('95%')).toBeInTheDocument();
        expect(screen.getByText('Daily Reading')).toBeInTheDocument();
        expect(screen.getByText('87%')).toBeInTheDocument();
    });

    it('displays weekly breakdown', () => {
        mockUseActivityStatistics.mockReturnValue({
            data: mockStatisticsData,
            isLoading: false,
            error: null,
            isError: false,
        });

        render(<ActivityStatistics />, { wrapper: Wrapper });

        expect(screen.getByText('Weekly Activity Pattern')).toBeInTheDocument();
        expect(screen.getByText('Mon: 22')).toBeInTheDocument();
        expect(screen.getByText('Tue: 25')).toBeInTheDocument();
        expect(screen.getByText('Wed: 20')).toBeInTheDocument();
    });

    it('displays monthly averages', () => {
        mockUseActivityStatistics.mockReturnValue({
            data: mockStatisticsData,
            isLoading: false,
            error: null,
            isError: false,
        });

        render(<ActivityStatistics />, { wrapper: Wrapper });

        expect(screen.getByText('Monthly Trends')).toBeInTheDocument();
        expect(screen.getByText('Jan: 2.1')).toBeInTheDocument();
        expect(screen.getByText('Feb: 2.8')).toBeInTheDocument();
    });

    it('renders error state when query fails', () => {
        const errorMessage = 'Failed to load statistics';
        mockUseActivityStatistics.mockReturnValue({
            data: undefined,
            isLoading: false,
            error: new Error(errorMessage),
            isError: true,
        });

        render(<ActivityStatistics />, { wrapper: Wrapper });

        expect(screen.getByText('Activity Statistics')).toBeInTheDocument();
        expect(screen.getByText('Failed to load activity statistics. Please try refreshing the page.')).toBeInTheDocument();
    });

    it('handles zero values gracefully', () => {
        const zeroData: IActivityStatisticsResponse = {
            overview: {
                totalActiveDays: 0,
                currentStreak: 0,
                longestStreak: 0,
                averageIntensity: 0,
                totalHabitsCompleted: 0
            },
            streaks: {
                current: 0,
                longest: 0,
                thisMonth: 0,
                thisWeek: 0
            },
            bestPerformingHabits: [],
            weeklyBreakdown: {
                sunday: 0,
                monday: 0,
                tuesday: 0,
                wednesday: 0,
                thursday: 0,
                friday: 0,
                saturday: 0
            },
            monthlyAverages: []
        };

        mockUseActivityStatistics.mockReturnValue({
            data: zeroData,
            isLoading: false,
            error: null,
            isError: false,
        });

        render(<ActivityStatistics />, { wrapper: Wrapper });

        expect(screen.getByText('No habits completed yet. Start building your routine!')).toBeInTheDocument();
    });
});