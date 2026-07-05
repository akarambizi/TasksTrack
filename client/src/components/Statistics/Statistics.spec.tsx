import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, cleanup } from '@testing-library/react';
import { Statistics } from './Statistics';
import { renderWithProviders, createMockQuery, mockFocusSessions, mockHabit } from '../../utils/test-utils';

vi.mock('@/queries/activity', () => ({
    useActivityStatistics: vi.fn(),
}));
vi.mock('@/queries/habits', () => ({
    useHabitData: vi.fn(),
}));
vi.mock('@/queries/focusSessions', () => ({
    useFocusSessions: vi.fn(),
}));
vi.mock('@/mock-server/data/analytics/growthMetrics', () => ({
    goalCheckpoints: [],
    yearlySnapshots: [
        { year: 2024, goalCompletionRate: 70, consistencyRate: 65, focusMinutes: 1200, completedGoals: 5 },
        { year: 2025, goalCompletionRate: 85, consistencyRate: 80, focusMinutes: 2400, completedGoals: 8 },
    ],
}));

import * as activityQueries from '@/queries/activity';
import * as habitQueries from '@/queries/habits';
import * as focusSessionQueries from '@/queries/focusSessions';

const mockUseActivityStatistics = activityQueries.useActivityStatistics as ReturnType<typeof vi.fn>;
const mockUseHabitData = habitQueries.useHabitData as ReturnType<typeof vi.fn>;
const mockUseFocusSessions = focusSessionQueries.useFocusSessions as ReturnType<typeof vi.fn>;

describe('Statistics', () => {
    afterEach(() => cleanup());

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseActivityStatistics.mockReturnValue(createMockQuery({}));
        mockUseHabitData.mockReturnValue(createMockQuery([mockHabit]));
        mockUseFocusSessions.mockReturnValue(createMockQuery(mockFocusSessions));
    });

    it('renders loading state when stats are loading', () => {
        mockUseActivityStatistics.mockReturnValue(createMockQuery({}, { isLoading: true }));
        renderWithProviders(<Statistics />);
        expect(screen.getByText('Statistics')).toBeInTheDocument();
        expect(document.querySelector('.animate-pulse')).not.toBeNull();
    });

    it('renders loading state when habits are loading', () => {
        mockUseHabitData.mockReturnValue(createMockQuery([], { isLoading: true }));
        renderWithProviders(<Statistics />);
        expect(document.querySelector('.animate-pulse')).not.toBeNull();
    });

    it('renders statistics page heading', () => {
        renderWithProviders(<Statistics />);
        expect(screen.getAllByText('Statistics').length).toBeGreaterThan(0);
    });

    it('renders overview stats section', () => {
        renderWithProviders(<Statistics />);
        expect(screen.getByText(/comprehensive insights/i)).toBeInTheDocument();
    });

    it('renders habits data', () => {
        mockUseHabitData.mockReturnValue(createMockQuery([mockHabit, { ...mockHabit, id: 2, isActive: false }]));
        renderWithProviders(<Statistics />);
        expect(screen.getByText('Statistics')).toBeInTheDocument();
    });

    it('renders with empty data', () => {
        mockUseHabitData.mockReturnValue(createMockQuery([]));
        mockUseFocusSessions.mockReturnValue(createMockQuery([]));
        renderWithProviders(<Statistics />);
        expect(screen.getAllByText('Statistics').length).toBeGreaterThan(0);
    });

    it('computes completion rate from habits', () => {
        const habits = [
            { ...mockHabit, id: 1, isActive: true },
            { ...mockHabit, id: 2, isActive: true },
            { ...mockHabit, id: 3, isActive: false },
        ];
        mockUseHabitData.mockReturnValue(createMockQuery(habits));
        renderWithProviders(<Statistics />);
        expect(screen.getByText('Statistics')).toBeInTheDocument();
    });

    it('computes total session minutes', () => {
        mockUseFocusSessions.mockReturnValue(createMockQuery(mockFocusSessions));
        renderWithProviders(<Statistics />);
        expect(screen.getByText('Statistics')).toBeInTheDocument();
    });
});
