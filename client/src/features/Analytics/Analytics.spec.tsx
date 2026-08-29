import type { PropsWithChildren } from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen, cleanup, fireEvent } from '@testing-library/react';
import { DailyProgressChart } from './DailyProgressChart';
import { HabitBreakdownChart } from './HabitBreakdownChart';
import { CategoryBreakdownChart } from './CategoryBreakdownChart';
import { InteractiveAnalyticsLineChart } from './InteractiveAnalyticsLineChart';
import { PerformanceHub } from '@/pages/AnalyticsPage';
import { renderWithProviders } from '@/utils/test-utils';
import type { IDailyProgress } from '@/types';

type MockChildrenProps = PropsWithChildren;

// Mock recharts to avoid rendering issues in test environment
vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: MockChildrenProps) => <div data-testid="responsive-container">{children}</div>,
    AreaChart: ({ children }: MockChildrenProps) => <div data-testid="area-chart">{children}</div>,
    BarChart: ({ children }: MockChildrenProps) => <div data-testid="bar-chart">{children}</div>,
    LineChart: ({ children }: MockChildrenProps) => <div data-testid="line-chart">{children}</div>,
    PieChart: ({ children }: MockChildrenProps) => <div data-testid="pie-chart">{children}</div>,
    ChartContainer: ({ children }: MockChildrenProps) => <div data-testid="chart-container">{children}</div>,
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
    ChartContainer: ({ children }: MockChildrenProps) => <div data-testid="chart-container">{children}</div>,
    ChartTooltip: () => null,
    ChartTooltipContent: () => null,
}));

vi.mock('@/queries', () => ({
    useActivityStatistics: vi.fn(() => ({ data: null, isLoading: false })),
    useFocusSessions: vi.fn(() => ({ data: [], isLoading: false })),
    useHabitData: vi.fn(() => ({ data: [], isLoading: false })),
    useWeeklyAnalytics: vi.fn(() => ({ data: null, isLoading: false })),
    useMonthlyAnalytics: vi.fn(() => ({ data: null, isLoading: false })),
    useQuarterlyAnalytics: vi.fn(() => ({ data: null, isLoading: false })),
    useYearlyAnalytics: vi.fn(() => ({ data: null, isLoading: false })),
}));

vi.mock('@/queries/activity', () => ({
    useActivityStatistics: vi.fn(() => ({ data: null, isLoading: false })),
}));

vi.mock('@/queries/habits', () => ({
    useHabitData: vi.fn(() => ({ data: [], isLoading: false })),
}));

vi.mock('@/queries/focusSessions', () => ({
    useFocusSessions: vi.fn(() => ({ data: [], isLoading: false })),
}));

vi.mock('@/mock-server/data/analytics/growthMetrics', () => ({
    yearlySnapshots: [
        { year: 2024, goalCompletionRate: 80, consistencyRate: 75, focusMinutes: 1200, completedGoals: 5 },
        { year: 2025, goalCompletionRate: 85, consistencyRate: 80, focusMinutes: 2400, completedGoals: 8 },
    ],
    yearlyMilestones: [],
    yearlyMonthHighlights: [],
    growthRecommendations: [],
    goalCheckpoints: [],
    goalItems: [],
    syncKpis: { mode: 'near-real-time', successRate: 97.2, freshnessSecondsP95: 8.6, queuedEvents: 2, failedEvents: 1, lastSyncedAt: '2026-07-03T09:07:20.000Z' },
    syncEvents: [],
}));

const mockDailyData = [
    { date: '2026-01-01', sessionCount: 3, totalMinutes: 45, completionRate: 0.75, averageSessionDuration: 15, activeHabits: 3, activityIntensity: 2, habitsCompleted: 2 },
    { date: '2026-01-02', sessionCount: 5, totalMinutes: 60, completionRate: 0.9, averageSessionDuration: 12, activeHabits: 4, activityIntensity: 3, habitsCompleted: 4 },
];

const mockHabitData = [
    { habitId: 1, name: 'Exercise', category: 'Health', sessionCount: 5, totalMinutes: 120, averageSessionDuration: 24, completionRate: 0.8, consistencyScore: 0.7, targetAchievementRate: 0.85, currentStreak: 3 },
    { habitId: 2, name: 'Reading', category: 'Learning', sessionCount: 3, totalMinutes: 60, averageSessionDuration: 20, completionRate: 0.6, consistencyScore: 0.5, targetAchievementRate: 0.65, currentStreak: 1 },
];

const mockCategoryData = [
    { category: 'Health', sessionCount: 5, totalSessions: 5, totalMinutes: 180, averageSessionDuration: 36, habitCount: 2, completionRate: 0.75, targetAchievementRate: 0.8, consistencyScore: 0.7 },
    { category: 'Learning', sessionCount: 3, totalSessions: 3, totalMinutes: 90, averageSessionDuration: 30, habitCount: 1, completionRate: 0.6, targetAchievementRate: 0.65, consistencyScore: 0.6 },
];

describe('DailyProgressChart', () => {
    afterEach(() => cleanup());

    it('renders with title', () => {
        renderWithProviders(<DailyProgressChart data={mockDailyData} title="My Progress" />);
        expect(screen.getByText('My Progress')).toBeInTheDocument();
    });

    it('renders default title', () => {
        renderWithProviders(<DailyProgressChart data={mockDailyData} />);
        expect(screen.getByText('Daily Progress')).toBeInTheDocument();
    });

    it('shows loading state', () => {
        renderWithProviders(<DailyProgressChart data={[]} isLoading={true} />);
        expect(document.querySelector('.animate-pulse')).not.toBeNull();
    });

    it('shows error message', () => {
        renderWithProviders(<DailyProgressChart data={[]} error="Failed to load" />);
        expect(screen.getByText(/Failed to load chart data/i)).toBeInTheDocument();
    });

    it('renders chart container even with empty data', () => {
        renderWithProviders(<DailyProgressChart data={[]} />);
        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });

    it('renders chart with data', () => {
        renderWithProviders(<DailyProgressChart data={mockDailyData} />);
        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });
});

describe('HabitBreakdownChart', () => {
    afterEach(() => cleanup());

    it('renders with title', () => {
        renderWithProviders(<HabitBreakdownChart data={mockHabitData} title="Habit Stats" />);
        expect(screen.getByText('Habit Stats')).toBeInTheDocument();
    });

    it('renders default title', () => {
        renderWithProviders(<HabitBreakdownChart data={mockHabitData} />);
        expect(screen.getByText('Habit Breakdown')).toBeInTheDocument();
    });

    it('shows loading state', () => {
        renderWithProviders(<HabitBreakdownChart data={[]} isLoading={true} />);
        expect(document.querySelector('.animate-pulse')).not.toBeNull();
    });

    it('shows error state', () => {
        renderWithProviders(<HabitBreakdownChart data={[]} error="Error loading" />);
        expect(screen.getByText(/Failed to load chart data/i)).toBeInTheDocument();
    });

    it('renders chart container with data', () => {
        renderWithProviders(<HabitBreakdownChart data={mockHabitData} />);
        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });

    it('renders chart with data', () => {
        renderWithProviders(<HabitBreakdownChart data={mockHabitData} />);
        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });
});

describe('CategoryBreakdownChart', () => {
    afterEach(() => cleanup());

    it('renders with title', () => {
        renderWithProviders(<CategoryBreakdownChart data={mockCategoryData} title="Categories" />);
        expect(screen.getByText('Categories')).toBeInTheDocument();
    });

    it('renders default title', () => {
        renderWithProviders(<CategoryBreakdownChart data={mockCategoryData} />);
        expect(screen.getByText('Category Breakdown')).toBeInTheDocument();
    });

    it('shows loading state', () => {
        renderWithProviders(<CategoryBreakdownChart data={[]} isLoading={true} />);
        expect(document.querySelector('.animate-pulse')).not.toBeNull();
    });

    it('shows error', () => {
        renderWithProviders(<CategoryBreakdownChart data={[]} error="Load error" />);
        expect(screen.getByText(/Failed to load chart data/i)).toBeInTheDocument();
    });

    it('shows "No category data available" when data is empty', () => {
        renderWithProviders(<CategoryBreakdownChart data={[]} />);
        expect(screen.getByText(/No category data available/i)).toBeInTheDocument();
    });
});

describe('InteractiveAnalyticsLineChart', () => {
    afterEach(() => cleanup());

    it('renders chart with data', () => {
        renderWithProviders(
            <InteractiveAnalyticsLineChart data={mockDailyData as IDailyProgress[]} />
        );
        expect(screen.getByText('Interactive Trend Line')).toBeInTheDocument();
    });

    it('renders metric selector buttons', () => {
        renderWithProviders(
            <InteractiveAnalyticsLineChart data={mockDailyData as IDailyProgress[]} />
        );
        expect(screen.getByRole('button', { name: /minutes/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sessions/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /completion/i })).toBeInTheDocument();
    });

    it('renders chart container', () => {
        renderWithProviders(
            <InteractiveAnalyticsLineChart data={mockDailyData as IDailyProgress[]} />
        );
        expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    });

    it('renders with empty data without crashing', () => {
        renderWithProviders(
            <InteractiveAnalyticsLineChart data={[]} />
        );
        expect(screen.getByText('Interactive Trend Line')).toBeInTheDocument();
    });

    it('changes active metric on button click', () => {
        renderWithProviders(
            <InteractiveAnalyticsLineChart data={mockDailyData as IDailyProgress[]} />
        );
        fireEvent.click(screen.getByRole('button', { name: /sessions/i }));
        // Sessions button should now have default variant styling
        expect(screen.getByRole('button', { name: /sessions/i })).toBeInTheDocument();
    });
});

describe('PerformanceHub', () => {
    afterEach(() => cleanup());

    it('renders analytics hub', () => {
        renderWithProviders(<PerformanceHub />);
        expect(screen.getByTestId('analytics-hub-page')).toBeInTheDocument();
    });

    it('shows Analytics Hub heading', () => {
        renderWithProviders(<PerformanceHub />);
        expect(screen.getByText('Analytics Hub')).toBeInTheDocument();
    });

    it('renders Overview tab by default', () => {
        renderWithProviders(<PerformanceHub />);
        expect(screen.getByRole('tab', { name: /overview/i })).toBeInTheDocument();
    });

    it('renders Activity and Retrospective tabs', () => {
        renderWithProviders(<PerformanceHub />);
        expect(screen.getByRole('tab', { name: /activity/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /retrospective/i })).toBeInTheDocument();
    });
});
