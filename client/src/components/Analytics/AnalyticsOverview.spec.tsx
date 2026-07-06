import type { PropsWithChildren } from 'react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { AnalyticsOverview } from './AnalyticsOverview';
import { renderWithProviders } from '../../utils/test-utils';

type MockChildrenProps = PropsWithChildren;

vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: MockChildrenProps) => <div>{children}</div>,
    AreaChart: ({ children }: MockChildrenProps) => <div>{children}</div>,
    BarChart: ({ children }: MockChildrenProps) => <div>{children}</div>,
    LineChart: ({ children }: MockChildrenProps) => <div>{children}</div>,
    PieChart: ({ children }: MockChildrenProps) => <div>{children}</div>,
    Area: () => null,
    Bar: () => null,
    Line: () => null,
    Pie: () => null,
    Cell: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    Legend: () => null,
}));

vi.mock('@/components/ui/chart', () => ({
    ChartContainer: ({ children }: MockChildrenProps) => <div>{children}</div>,
    ChartTooltip: () => null,
    ChartTooltipContent: () => null,
}));

const mockUseWeeklyAnalytics = vi.fn();
const mockUseMonthlyAnalytics = vi.fn();
const mockUseQuarterlyAnalytics = vi.fn();
const mockUseYearlyAnalytics = vi.fn();

vi.mock('@/queries', () => ({
    useWeeklyAnalytics: (...args: unknown[]) => mockUseWeeklyAnalytics(...args),
    useMonthlyAnalytics: (...args: unknown[]) => mockUseMonthlyAnalytics(...args),
    useQuarterlyAnalytics: (...args: unknown[]) => mockUseQuarterlyAnalytics(...args),
    useYearlyAnalytics: (...args: unknown[]) => mockUseYearlyAnalytics(...args),
}));

vi.mock('@/mock-server/data/analytics/growthMetrics', () => ({
    yearlySnapshots: [
        { year: 2024, goalCompletionRate: 78, consistencyRate: 72, focusMinutes: 1800, completedGoals: 6 },
        { year: 2025, goalCompletionRate: 86, consistencyRate: 81, focusMinutes: 2600, completedGoals: 9 },
    ],
    yearlyMilestones: [
        { label: '100 Sessions', note: 'Reached in March 2025' },
        { label: '200 Hours', note: 'Reached in July 2025' },
    ],
    growthRecommendations: [
        'Review your longest streak habits',
        'Schedule a deep work block each morning',
    ],
}));

const mockAnalyticsData = {
    totalMinutes: 450,
    totalSessions: 15,
    totalHabitsTracked: 5,
    activityRate: 80,
    currentStreak: 7,
    longestStreak: 14,
    activeDays: 10,
    totalDays: 14,
    dailyProgress: [
        { date: '2026-01-01', sessionCount: 2, totalMinutes: 30, completionRate: 0.8, averageSessionDuration: 15, activeHabits: 3, activityIntensity: 2, habitsCompleted: 2 },
    ],
    habitBreakdown: [
        { habitId: 1, name: 'Exercise', category: 'Health', sessionCount: 5, totalMinutes: 120, averageSessionDuration: 24, completionRate: 0.8, consistencyScore: 0.7, targetAchievementRate: 0.85, currentStreak: 3 },
    ],
    categoryBreakdown: [
        { category: 'Health', sessionCount: 5, totalSessions: 5, totalMinutes: 120, averageSessionDuration: 24, habitCount: 1, completionRate: 0.8, targetAchievementRate: 0.85, consistencyScore: 0.7 },
    ],
    goalProgress: {
        progressPercentage: 75,
        actualMinutes: 450,
        targetMinutesPerPeriod: 600,
        onTrack: true,
        actualSessions: 15,
        targetSessionsPerPeriod: 20,
        requiredDailyAverage: 30,
        daysRemaining: 5,
    },
};

describe('AnalyticsOverview', () => {
    afterEach(() => cleanup());

    beforeEach(() => {
        vi.clearAllMocks();
        const successQuery = { data: mockAnalyticsData, isLoading: false, isError: false, error: null };
        mockUseWeeklyAnalytics.mockReturnValue(successQuery);
        mockUseMonthlyAnalytics.mockReturnValue(successQuery);
        mockUseQuarterlyAnalytics.mockReturnValue(successQuery);
        mockUseYearlyAnalytics.mockReturnValue(successQuery);
    });

    it('renders the Analytics Dashboard heading', () => {
        renderWithProviders(<AnalyticsOverview />);
        expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    });

    it('renders key metric cards', () => {
        renderWithProviders(<AnalyticsOverview />);
        expect(screen.getByText('Total Minutes')).toBeInTheDocument();
        expect(screen.getByText('Active Habits')).toBeInTheDocument();
        expect(screen.getByText('Current Streak')).toBeInTheDocument();
        expect(screen.getByText('Active Days')).toBeInTheDocument();
    });

    it('renders metric values from data', () => {
        renderWithProviders(<AnalyticsOverview />);
        expect(screen.getByText('450')).toBeInTheDocument();
        expect(screen.getByText('7 days')).toBeInTheDocument();
    });

    it('renders year-over-year momentum section', () => {
        renderWithProviders(<AnalyticsOverview />);
        expect(screen.getByText('Year-over-Year Momentum')).toBeInTheDocument();
    });

    it('renders growth recommendations', () => {
        renderWithProviders(<AnalyticsOverview />);
        expect(screen.getByText('Accountability + Next Best Action')).toBeInTheDocument();
        expect(screen.getByText('Review your longest streak habits')).toBeInTheDocument();
        expect(screen.getByText('Schedule a deep work block each morning')).toBeInTheDocument();
    });

    it('renders latest milestone', () => {
        renderWithProviders(<AnalyticsOverview />);
        expect(screen.getByText('200 Hours')).toBeInTheDocument();
        expect(screen.getByText('Reached in July 2025')).toBeInTheDocument();
    });

    it('renders goal progress section when data has goalProgress', () => {
        renderWithProviders(<AnalyticsOverview />);
        expect(screen.getByText('Progress to Goal')).toBeInTheDocument();
        expect(screen.getByText('Sessions Goal')).toBeInTheDocument();
        expect(screen.getByText('Daily Target')).toBeInTheDocument();
    });

    it('shows loading dots when query is loading', () => {
        const loadingQuery = { data: undefined, isLoading: true, isError: false, error: null };
        mockUseWeeklyAnalytics.mockReturnValue(loadingQuery);
        renderWithProviders(<AnalyticsOverview />);
        const dots = screen.getAllByText('...');
        expect(dots.length).toBeGreaterThan(0);
    });

    it('shows error state when query fails', () => {
        const errorQuery = { data: null, isLoading: false, isError: true, error: new Error('Network error') };
        mockUseWeeklyAnalytics.mockReturnValue(errorQuery);
        renderWithProviders(<AnalyticsOverview />);
        expect(screen.getByText('Failed to load analytics data')).toBeInTheDocument();
        expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    it('renders period selector', () => {
        renderWithProviders(<AnalyticsOverview />);
        // Period selector renders "Weekly" as the default selected value
        expect(screen.getAllByText(/weekly/i).length).toBeGreaterThan(0);
    });

    it('renders yearly snapshots in momentum section', () => {
        renderWithProviders(<AnalyticsOverview />);
        expect(screen.getByText('2024')).toBeInTheDocument();
        expect(screen.getByText('2025')).toBeInTheDocument();
    });

    it('renders without goalProgress when data has none', () => {
        const noGoalQuery = {
            data: { ...mockAnalyticsData, goalProgress: undefined },
            isLoading: false,
            isError: false,
            error: null,
        };
        mockUseWeeklyAnalytics.mockReturnValue(noGoalQuery);
        renderWithProviders(<AnalyticsOverview />);
        expect(screen.queryByText('Progress to Goal')).not.toBeInTheDocument();
    });

    it('shows monthly history section when period is monthly and data has monthlyHistory', async () => {
        const monthlyData = {
            ...mockAnalyticsData,
            monthlyHistory: [
                { year: 2025, month: 11, monthName: 'November', activityCount: 42, activeDays: 20 },
            ],
        };
        mockUseMonthlyAnalytics.mockReturnValue({ data: monthlyData, isLoading: false, isError: false, error: null });

        renderWithProviders(<AnalyticsOverview />);

        // Switch to monthly period
        const periodTrigger = screen.getByRole('combobox');
        fireEvent.click(periodTrigger);
        fireEvent.click(await screen.findByText('Monthly'));

        await waitFor(() => {
            expect(screen.getByText('Monthly History')).toBeInTheDocument();
        });
    });
});
