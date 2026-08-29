import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, cleanup } from '@testing-library/react';
import { Habits } from './Habits';
import { renderWithProviders, mockHabit, createMockQuery } from '../../utils/test-utils';

vi.mock('@/queries', () => ({
    useHabitData: vi.fn(),
    useCreateHabitMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useDeleteHabitMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useUpdateHabitMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useLogHabitMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useArchiveHabitMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useActivateHabitMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useActiveFocusSession: vi.fn(() => createMockQuery(null)),
    useStartFocusSessionMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    usePauseFocusSessionMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useResumeFocusSessionMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useCompleteFocusSessionMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useCancelFocusSessionMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useFocusSessions: vi.fn(() => createMockQuery([])),
    useFocusSessionAnalytics: vi.fn(() => createMockQuery(null)),
    useGetCategories: vi.fn(() => createMockQuery([])),
    useCreateCategoryMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useUpdateCategoryMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useDeleteCategoryMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useArchiveCategoryMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
}));

vi.mock('@/hooks/useFocusTimerContext', () => ({
    useFocusTimerContext: vi.fn(() => ({
        timeLeft: 1500,
        totalDuration: 1500,
        isRunning: false,
        progress: 0,
        hasActiveSession: false,
        showCompletionCelebration: false,
        activeSession: null,
        isLoadingSession: false,
        startSession: vi.fn(),
        pauseSession: vi.fn(),
        resumeSession: vi.fn(),
        completeSession: vi.fn(),
        cancelSession: vi.fn(),
    })),
}));

vi.mock('@/context/useAuthContext', () => ({
    useAuthContext: vi.fn(() => ({
        user: { id: 'user1', email: 'test@example.com' },
    })),
}));

vi.mock('@/api/categories', () => ({
    getActiveCategories: vi.fn(() => Promise.resolve([])),
    getParentCategories: vi.fn(() => Promise.resolve([])),
}));

vi.mock('@/queries/categories', () => ({
    useActiveCategoriesQuery: vi.fn(() => ({ data: [], isLoading: false, refetch: vi.fn() })),
    useParentCategoriesQuery: vi.fn(() => ({ data: [], isLoading: false, refetch: vi.fn() })),
    useCreateCategoryMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useUpdateCategoryMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useDeleteCategoryMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useArchiveCategoryMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
}));

import * as habitQueries from '@/queries';
const mockUseHabitData = habitQueries.useHabitData as ReturnType<typeof vi.fn>;

const activeHabit = { ...mockHabit, id: 1, isActive: true };
const inactiveHabit = { ...mockHabit, id: 2, name: 'Inactive Habit', isActive: false };

describe('Habits', () => {
    afterEach(() => cleanup());

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseHabitData.mockReturnValue(createMockQuery([activeHabit, inactiveHabit]));
    });

    it('renders habit list section', () => {
        renderWithProviders(<Habits />);
        expect(screen.getByTestId('habit-list')).toBeInTheDocument();
    });

    it('renders Your Habits heading', () => {
        renderWithProviders(<Habits />);
        expect(screen.getByText('Your Habits')).toBeInTheDocument();
    });

    it('renders Add Habit button', () => {
        renderWithProviders(<Habits />);
        expect(screen.getByTestId('add-habit-button')).toBeInTheDocument();
    });

    it('renders active habits', () => {
        renderWithProviders(<Habits />);
        expect(screen.getByText('Test Habit')).toBeInTheDocument();
    });

    it('renders inactive habits section when inactive habits exist', () => {
        renderWithProviders(<Habits />);
        expect(screen.getByText('Inactive Habit')).toBeInTheDocument();
    });

    it('shows empty state when no habits', () => {
        mockUseHabitData.mockReturnValue(createMockQuery([]));
        renderWithProviders(<Habits />);
        expect(screen.getByText(/no active habits yet/i)).toBeInTheDocument();
    });

    it('shows quick stats section', () => {
        renderWithProviders(<Habits />);
        // "Active Habits" appears in both stats card and section heading; just confirm it exists
        expect(screen.getAllByText(/Active Habits/i).length).toBeGreaterThan(0);
    });

    it('renders habit cards with data-testid', () => {
        renderWithProviders(<Habits />);
        const habitCards = screen.getAllByTestId('habit-card');
        expect(habitCards.length).toBeGreaterThan(0);
    });
});
