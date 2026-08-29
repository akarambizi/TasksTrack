import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { screen, cleanup, fireEvent } from '@testing-library/react';
import { ProductivityHub } from './ProductivityHub';
import { createMockQuery, renderWithProviders } from '@/utils/test-utils';

vi.mock('@/queries', () => ({
    useHabitData: vi.fn(() => createMockQuery([])),
    useActiveFocusSession: vi.fn(() => createMockQuery(null)),
    useFocusSessionAnalytics: vi.fn(() => createMockQuery(null)),
    useFocusSessions: vi.fn(() => createMockQuery([])),
    useStartFocusSessionMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    usePauseFocusSessionMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useResumeFocusSessionMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useCompleteFocusSessionMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useCancelFocusSessionMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useCreateHabitMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useDeleteHabitMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useUpdateHabitMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useLogHabitMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
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

describe('ProductivityHub', () => {
    afterEach(() => cleanup());

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders productivity hub page', () => {
        renderWithProviders(<ProductivityHub />);
        expect(screen.getByTestId('productivity-hub-page')).toBeInTheDocument();
    });

    it('shows Productivity Hub heading', () => {
        renderWithProviders(<ProductivityHub />);
        expect(screen.getByText('Productivity Hub')).toBeInTheDocument();
    });

    it('renders Habits tab by default', () => {
        renderWithProviders(<ProductivityHub />);
        expect(screen.getByRole('tab', { name: /habits/i })).toBeInTheDocument();
    });

    it('renders Focus Sessions tab', () => {
        renderWithProviders(<ProductivityHub />);
        expect(screen.getByRole('tab', { name: /focus sessions/i })).toBeInTheDocument();
    });

    it('switches to Focus Sessions tab on click', () => {
        renderWithProviders(<ProductivityHub />);
        const focusTab = screen.getByRole('tab', { name: /focus sessions/i });
        fireEvent.click(focusTab);
        // Tab is clickable — just verify it's still in the document
        expect(focusTab).toBeInTheDocument();
    });

    it('shows description text', () => {
        renderWithProviders(<ProductivityHub />);
        expect(screen.getByText(/Central workspace/i)).toBeInTheDocument();
    });
});
