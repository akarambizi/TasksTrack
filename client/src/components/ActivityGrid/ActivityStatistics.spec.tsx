import { renderWithProviders } from '../../utils/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { ActivityStatistics } from './ActivityStatistics';
import { useActivityStatistics } from '../../queries/activity';
import { IActivityStatisticsResponse } from '@/types';

// Mock the activity statistics query hook
vi.mock('../../queries/activity', () => ({
    useActivityStatistics: vi.fn(),
}));

const mockUseActivityStatistics = vi.mocked(useActivityStatistics);



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
        totalValue: 300,
        activityCount: 142,
        completionRate: 0.95
    },
    monthlyStats: [
        {
            year: 2024,
            month: 1,
            monthName: 'January',
            activityCount: 28,
            totalValue: 200,
            activeDays: 25
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

describe('ActivityStatistics', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        mockUseActivityStatistics.mockReturnValue({
            data: undefined,
            isLoading: true,
            error: null,
            isError: false,
        } as any);

        renderWithProviders(<ActivityStatistics />);

        expect(screen.getByText('Activity Statistics')).toBeInTheDocument();
        // Loading skeleton should be present
        const statusElements = screen.getAllByRole('status');
        expect(statusElements.length).toBeGreaterThan(0);
    });

    it('renders activity statistics when data is loaded', () => {
        mockUseActivityStatistics.mockReturnValue({
            data: mockStatisticsData,
            isLoading: false,
            error: null,
            isError: false,
        } as any);

        renderWithProviders(<ActivityStatistics />);

        expect(screen.getByText('Activity Statistics')).toBeInTheDocument();
        expect(screen.getByText('Active Days')).toBeInTheDocument();
        expect(screen.getByText('150')).toBeInTheDocument();
    });

    it('displays streak information correctly', () => {
        mockUseActivityStatistics.mockReturnValue({
            data: mockStatisticsData,
            isLoading: false,
            error: null,
            isError: false,
        } as any);

        renderWithProviders(<ActivityStatistics />);

        expect(screen.getByText('Current Streak')).toBeInTheDocument();
        expect(screen.getByText('7 days')).toBeInTheDocument();
        expect(screen.getByText('Longest Streak')).toBeInTheDocument();
        expect(screen.getByText('21 days')).toBeInTheDocument();
    });

    it('displays best performing habits', () => {
        mockUseActivityStatistics.mockReturnValue({
            data: mockStatisticsData,
            isLoading: false,
            error: null,
            isError: false,
        } as any);

        renderWithProviders(<ActivityStatistics />);

        expect(screen.getByText('Best Performing Habit')).toBeInTheDocument();
        expect(screen.getByText('Exercise')).toBeInTheDocument();
    });

    it('displays weekly breakdown', () => {
        mockUseActivityStatistics.mockReturnValue({
            data: mockStatisticsData,
            isLoading: false,
            error: null,
            isError: false,
        } as any);

        renderWithProviders(<ActivityStatistics />);

        expect(screen.getByText('Recent Weekly Activity')).toBeInTheDocument();
    });

    it('displays monthly averages', () => {
        mockUseActivityStatistics.mockReturnValue({
            data: mockStatisticsData,
            isLoading: false,
            error: null,
            isError: false,
        } as any);

        renderWithProviders(<ActivityStatistics />);

        expect(screen.getByText('Monthly Progress')).toBeInTheDocument();
    });

    it('renders error state when query fails', () => {
        const errorMessage = 'Failed to load activity statistics';
        mockUseActivityStatistics.mockReturnValue({
            data: undefined,
            isLoading: false,
            error: new Error(errorMessage),
            isError: true,
        } as any);

        renderWithProviders(<ActivityStatistics />);

        expect(screen.getByText('Activity Statistics')).toBeInTheDocument();
        expect(screen.getByText('Failed to load activity statistics')).toBeInTheDocument();
        expect(screen.getByText('Please try again later')).toBeInTheDocument();
    });

    it('handles zero values gracefully', () => {
        const zeroData: IActivityStatisticsResponse = {
            ...mockStatisticsData,
            totalActiveDays: 0,
            currentOverallStreak: 0,
            longestOverallStreak: 0
        };

        mockUseActivityStatistics.mockReturnValue({
            data: zeroData,
            isLoading: false,
            error: null,
            isError: false,
        } as any);

        renderWithProviders(<ActivityStatistics />);

        expect(screen.getByText('Activity Statistics')).toBeInTheDocument();
        // Should handle zero values without errors
        const zeroDaysElements = screen.getAllByText('0 days');
        expect(zeroDaysElements.length).toBeGreaterThan(0);
    });
});