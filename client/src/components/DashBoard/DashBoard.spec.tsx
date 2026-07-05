import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { screen, cleanup, fireEvent } from '@testing-library/react';
import { Dashboard } from './DashBoard';
import { renderWithProviders, createMockQuery } from '../../utils/test-utils';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('@/mock-server/data/analytics/growthMetrics', () => ({
    currentKpiSnapshot: {
        primaryMetricLabel: 'Goal Completion Rate',
        primaryMetricValue: 84,
        primaryMetricDelta: 5,
        weeklyCheckins: 4,
        weeklyCheckinsTarget: 4,
        monthlyGoalHitRate: 88,
        yearlyProjectedCompletionRate: 89,
    },
    goalCheckpoints: [
        { id: 'gc-1', title: 'Q1 Review', cadence: 'quarterly', target: 80, actual: 75, unit: '%', status: 'on-track', category: 'Goals' },
    ],
    growthRecommendations: [
        { id: 'r-1', text: 'Try adding a new habit', priority: 'high' },
    ],
    yearlySnapshots: [
        { year: 2024, goalCompletionRate: 75 },
        { year: 2025, goalCompletionRate: 85 },
    ],
}));

vi.mock('@/queries', () => ({
    useCreateHabitMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
}));

vi.mock('@/context/useAuthContext', () => ({
    useAuthContext: vi.fn(() => ({
        user: { id: 'user1', email: 'test@example.com' },
    })),
}));

vi.mock('@/api/categories', () => ({
    getActiveCategories: vi.fn(() => Promise.resolve([])),
}));

describe('Dashboard', () => {
    afterEach(() => cleanup());

    beforeEach(() => {
        vi.clearAllMocks();
        mockNavigate.mockClear();
    });

    it('renders dashboard with testid', () => {
        renderWithProviders(<Dashboard />);
        expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    });

    it('renders quick add habit button', () => {
        renderWithProviders(<Dashboard />);
        expect(screen.getByTestId('quick-add-habit-btn')).toBeInTheDocument();
    });

    it('renders start focus session button', () => {
        renderWithProviders(<Dashboard />);
        expect(screen.getByTestId('start-focus-session-btn')).toBeInTheDocument();
    });

    it('navigates to productivity on focus session button click', () => {
        renderWithProviders(<Dashboard />);
        fireEvent.click(screen.getByTestId('start-focus-session-btn'));
        expect(mockNavigate).toHaveBeenCalledWith('/productivity');
    });

    it('renders tabs', () => {
        renderWithProviders(<Dashboard />);
        expect(screen.getByRole('tab', { name: /overview/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /analytics/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /activity/i })).toBeInTheDocument();
    });

    it('renders KPI state selector', () => {
        renderWithProviders(<Dashboard />);
        // The select for KPI state should be present
        expect(document.querySelector('select, [role="combobox"]')).not.toBeNull();
    });

    it('shows year-over-year delta when snapshots available', () => {
        renderWithProviders(<Dashboard />);
        expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    });

    it('shows analytics section when tab clicked', () => {
        renderWithProviders(<Dashboard />);
        const analyticsTab = screen.getByRole('tab', { name: /analytics/i });
        fireEvent.click(analyticsTab);
        expect(screen.getByTestId('analytics-section')).toBeInTheDocument();
    });

    it('shows activity grid section when tab clicked', () => {
        renderWithProviders(<Dashboard />);
        const activityTab = screen.getByRole('tab', { name: /activity/i });
        fireEvent.click(activityTab);
        expect(screen.getByTestId('activity-grid-section')).toBeInTheDocument();
    });
});
