import { renderWithProviders } from '../../utils/test-utils';
import { HABIT_COLORS, TARGET_FREQUENCY, HABIT_ICONS } from '@/types/constants';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FocusTimer } from './FocusTimer';
import type { IHabit } from '@/types';

// Mock all dependencies
vi.mock('@/queries', () => ({
    useActiveFocusSession: vi.fn(),
    useStartFocusSessionMutation: vi.fn(),
    usePauseFocusSessionMutation: vi.fn(),
    useResumeFocusSessionMutation: vi.fn(),
    useCompleteFocusSessionMutation: vi.fn(),
    useCancelFocusSessionMutation: vi.fn()
}));

vi.mock('@/services/focusNotificationService', () => ({
    focusNotificationService: {
        notifySessionStarted: vi.fn(),
        notifySessionPaused: vi.fn(),
        notifySessionResumed: vi.fn(),
        notifySessionCompleted: vi.fn(),
        notifySessionCancelled: vi.fn()
    }
}));

vi.mock('@/hooks/useFocusTimerContext', () => ({
    useFocusTimerContext: vi.fn()
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
        updateTimerState: vi.fn(),
        setCompletionCelebration: vi.fn()
    }))
}));

vi.mock('@/utils/focusTimer', () => ({
    formatTime: vi.fn((seconds) => ({
        formatted: `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`
    })),
    getActualMinutesCompleted: vi.fn()
}));

const {
    useStartFocusSessionMutation,
    usePauseFocusSessionMutation,
    useResumeFocusSessionMutation,
    useCompleteFocusSessionMutation,
    useCancelFocusSessionMutation
} = await import('@/queries');

const { useFocusTimerContext } = await import('@/hooks/useFocusTimerContext');

describe('FocusTimer', () => {
    const mockStartSession = vi.fn();
    const mockPauseSession = vi.fn();
    const mockResumeSession = vi.fn();
    const mockCompleteSession = vi.fn();
    const mockCancelSession = vi.fn();

    const mockHabit: IHabit = {
        id: 1,
        name: 'Test Habit',
        description: 'Test Description',
        metricType: 'duration',
        unit: 'min',
        target: 25,
        targetFrequency: TARGET_FREQUENCY.DAILY,
        category: 'Learning',
        isActive: true,
        createdDate: '2026-01-31T10:00:00Z',
        updatedDate: '2026-01-31T10:00:00Z',
        createdBy: 'user1',
        updatedBy: 'user1',
        color: HABIT_COLORS.BLUE,
        icon: HABIT_ICONS.BOOK
    };

    beforeEach(() => {
        vi.clearAllMocks();

        (useStartFocusSessionMutation as ReturnType<typeof vi.fn>).mockReturnValue({
            mutate: mockStartSession,
            mutateAsync: mockStartSession,
            isPending: false
        });
        (usePauseFocusSessionMutation as ReturnType<typeof vi.fn>).mockReturnValue({
            mutate: mockPauseSession,
            mutateAsync: mockPauseSession,
            isPending: false
        });
        (useResumeFocusSessionMutation as ReturnType<typeof vi.fn>).mockReturnValue({
            mutate: mockResumeSession,
            mutateAsync: mockResumeSession,
            isPending: false
        });
        (useCompleteFocusSessionMutation as ReturnType<typeof vi.fn>).mockReturnValue({
            mutate: mockCompleteSession,
            mutateAsync: mockCompleteSession,
            isPending: false
        });
        (useCancelFocusSessionMutation as ReturnType<typeof vi.fn>).mockReturnValue({
            mutate: mockCancelSession,
            mutateAsync: mockCancelSession,
            isPending: false
        });
    });

    it('should render timer component', () => {
        renderWithProviders(

                <FocusTimer habit={mockHabit} />

        );

        expect(screen.getByTestId('focus-timer-card')).toBeInTheDocument();
        expect(screen.getByTestId('timer-display')).toBeInTheDocument();
        expect(screen.getByText('Focus Timer')).toBeInTheDocument();
    });

    it('should display start button when no active session', () => {
        renderWithProviders(

                <FocusTimer habit={mockHabit} />

        );

        expect(screen.getByTestId('start-session-button')).toBeInTheDocument();
        expect(screen.getByText('Start Focus')).toBeInTheDocument();
    });

    it('should show no habit message when no habit provided', () => {
        renderWithProviders(

                <FocusTimer />

        );

        expect(screen.getByTestId('no-habit-message')).toBeInTheDocument();
        expect(screen.getByText('Select a habit to start a focus session')).toBeInTheDocument();
    });

    it('should display progress bar', () => {
        (useFocusTimerContext as ReturnType<typeof vi.fn>).mockReturnValue({
            timeLeft: 1200,
            totalDuration: 1500,
            isRunning: false,
            progress: 20,
            hasActiveSession: false,
            showCompletionCelebration: false,
            activeSession: null,
            isLoadingSession: false,
            updateTimerState: vi.fn(),
            setCompletionCelebration: vi.fn()
        });

        renderWithProviders(

                <FocusTimer habit={mockHabit} />

        );

        expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    });

    it('should show celebration when completed', () => {
        (useFocusTimerContext as ReturnType<typeof vi.fn>).mockReturnValue({
            timeLeft: 0,
            totalDuration: 1500,
            isRunning: false,
            progress: 100,
            hasActiveSession: false,
            showCompletionCelebration: true,
            activeSession: null,
            isLoadingSession: false,
            updateTimerState: vi.fn(),
            setCompletionCelebration: vi.fn()
        });

        renderWithProviders(

                <FocusTimer habit={mockHabit} />

        );

        expect(screen.getByTestId('completion-celebration')).toBeInTheDocument();
        expect(screen.getByText('Focus session completed! Great job!')).toBeInTheDocument();
    });

    it('should handle button clicks for different session states', () => {
        const mockStart = vi.fn();
        const mockPause = vi.fn();
        const mockResume = vi.fn();
        const mockComplete = vi.fn();
        const mockCancel = vi.fn();

        (useStartFocusSessionMutation as ReturnType<typeof vi.fn>).mockReturnValue({
            mutate: mockStart,
            mutateAsync: mockStart,
            isPending: false
        });
        (usePauseFocusSessionMutation as ReturnType<typeof vi.fn>).mockReturnValue({
            mutate: mockPause,
            mutateAsync: mockPause,
            isPending: false
        });
        (useResumeFocusSessionMutation as ReturnType<typeof vi.fn>).mockReturnValue({
            mutate: mockResume,
            mutateAsync: mockResume,
            isPending: false
        });
        (useCompleteFocusSessionMutation as ReturnType<typeof vi.fn>).mockReturnValue({
            mutate: mockComplete,
            mutateAsync: mockComplete,
            isPending: false
        });
        (useCancelFocusSessionMutation as ReturnType<typeof vi.fn>).mockReturnValue({
            mutate: mockCancel,
            mutateAsync: mockCancel,
            isPending: false
        });

        renderWithProviders(

                <FocusTimer habit={mockHabit} />

        );

        const startButton = screen.getByTestId('start-session-button');
        expect(startButton).toBeInTheDocument();
    });

    it('should display running session state', () => {
        const mockActiveSession = {
            id: 1,
            habitId: 1,
            status: 'active' as const,
            startTime: '2026-01-31T10:00:00Z',
            plannedDurationMinutes: 25
        };

        (useFocusTimerContext as ReturnType<typeof vi.fn>).mockReturnValue({
            timeLeft: 1200,
            totalDuration: 1500,
            isRunning: true,
            progress: 20,
            hasActiveSession: true,
            showCompletionCelebration: false,
            activeSession: mockActiveSession,
            isLoadingSession: false,
            updateTimerState: vi.fn(),
            setCompletionCelebration: vi.fn()
        });

        renderWithProviders(

                <FocusTimer habit={mockHabit} />

        );

        expect(screen.getByTestId('pause-session-button')).toBeInTheDocument();
        expect(screen.getByTestId('complete-session-button')).toBeInTheDocument();
        expect(screen.getByTestId('cancel-session-button')).toBeInTheDocument();
    });

    it('should display paused session state', () => {
        const mockActiveSession = {
            id: 1,
            habitId: 1,
            status: 'paused' as const,
            startTime: '2026-01-31T10:00:00Z',
            plannedDurationMinutes: 25
        };

        (useFocusTimerContext as ReturnType<typeof vi.fn>).mockReturnValue({
            timeLeft: 1200,
            totalDuration: 1500,
            isRunning: false,
            progress: 20,
            hasActiveSession: true,
            showCompletionCelebration: false,
            activeSession: mockActiveSession,
            isLoadingSession: false,
            updateTimerState: vi.fn(),
            setCompletionCelebration: vi.fn()
        });

        renderWithProviders(

                <FocusTimer habit={mockHabit} />

        );

        expect(screen.getByTestId('resume-session-button')).toBeInTheDocument();
        expect(screen.getByTestId('complete-session-button')).toBeInTheDocument();
        expect(screen.getByTestId('cancel-session-button')).toBeInTheDocument();
    });

    it('should handle loading session state', () => {
        (useFocusTimerContext as ReturnType<typeof vi.fn>).mockReturnValue({
            timeLeft: 1500,
            totalDuration: 1500,
            isRunning: false,
            progress: 0,
            hasActiveSession: false,
            showCompletionCelebration: false,
            activeSession: null,
            isLoadingSession: true,
            updateTimerState: vi.fn(),
            setCompletionCelebration: vi.fn()
        });

        renderWithProviders(

                <FocusTimer habit={mockHabit} />

        );

        expect(screen.getByText('Focus Timer')).toBeInTheDocument();
    });

    it('should handle start session with different durations', () => {
        renderWithProviders(

                <FocusTimer habit={mockHabit} />

        );

        const startButton = screen.getByTestId('start-session-button');
        startButton.click();

        expect(mockStartSession).toHaveBeenCalledWith(expect.objectContaining({
            habitId: 1,
            plannedDurationMinutes: 25
        }));
    });

    it('should handle timer tick updates with different times', () => {
        (useFocusTimerContext as ReturnType<typeof vi.fn>).mockReturnValue({
            timeLeft: 900, // 15 minutes
            totalDuration: 1500,
            isRunning: true,
            progress: 40,
            hasActiveSession: true,
            showCompletionCelebration: false,
            activeSession: {
                id: 1,
                habitId: 1,
                status: 'active' as const,
                startTime: '2026-01-31T10:00:00Z',
                plannedDurationMinutes: 25
            },
            isLoadingSession: false,
            updateTimerState: vi.fn(),
            setCompletionCelebration: vi.fn()
        });

        renderWithProviders(

                <FocusTimer habit={mockHabit} />

        );

        expect(screen.getByTestId('timer-display')).toHaveTextContent('15:00');
    });

    it('should handle session interruption scenarios', () => {
        (useFocusTimerContext as ReturnType<typeof vi.fn>).mockReturnValue({
            timeLeft: 600,
            totalDuration: 1500,
            isRunning: false,
            progress: 60,
            hasActiveSession: true,
            showCompletionCelebration: false,
            activeSession: {
                id: 1,
                habitId: 1,
                status: 'interrupted' as const,
                startTime: '2026-01-31T10:00:00Z',
                plannedDurationMinutes: 25
            },
            isLoadingSession: false,
            updateTimerState: vi.fn(),
            setCompletionCelebration: vi.fn()
        });

        renderWithProviders(

                <FocusTimer habit={mockHabit} />

        );

        expect(screen.getByTestId('timer-display')).toHaveTextContent('10:00');
    });

    it('should handle mutation loading states correctly', () => {
        (mockStartSession as { isPending?: boolean }).isPending = true;
        (mockPauseSession as { isPending?: boolean }).isPending = true;
        (mockResumeSession as { isPending?: boolean }).isPending = true;
        (mockCancelSession as { isPending?: boolean }).isPending = true;
        (mockCompleteSession as { isPending?: boolean }).isPending = true;

        renderWithProviders(

                <FocusTimer habit={mockHabit} />

        );

        const resumeButton = screen.getByTestId('resume-session-button');
        expect(resumeButton).toBeInTheDocument();
    });

    it('should handle time formatting for seconds', () => {
        (useFocusTimerContext as ReturnType<typeof vi.fn>).mockReturnValue({
            timeLeft: 65, // 1 minute 5 seconds
            totalDuration: 1500,
            isRunning: true,
            progress: 95,
            hasActiveSession: true,
            showCompletionCelebration: false,
            activeSession: {
                id: 1,
                habitId: 1,
                status: 'active' as const,
                startTime: '2026-01-31T10:00:00Z',
                plannedDurationMinutes: 25
            },
            isLoadingSession: false,
            updateTimerState: vi.fn(),
            setCompletionCelebration: vi.fn()
        });

        renderWithProviders(

                <FocusTimer habit={mockHabit} />

        );

        expect(screen.getByTestId('timer-display')).toHaveTextContent('1:05');
    });

    it('should handle progress calculation edge cases', () => {
        (useFocusTimerContext as ReturnType<typeof vi.fn>).mockReturnValue({
            timeLeft: 0,
            totalDuration: 1500,
            isRunning: false,
            progress: 100,
            hasActiveSession: true,
            showCompletionCelebration: false,
            activeSession: {
                id: 1,
                habitId: 1,
                status: 'completed' as const,
                startTime: '2026-01-31T10:00:00Z',
                plannedDurationMinutes: 25
            },
            isLoadingSession: false,
            updateTimerState: vi.fn(),
            setCompletionCelebration: vi.fn()
        });

        renderWithProviders(

                <FocusTimer habit={mockHabit} />

        );

        expect(screen.getByTestId('timer-display')).toHaveTextContent('0:00');
    });

    it('should handle various session status changes', () => {
        const { rerender } = renderWithProviders(
            <FocusTimer habit={mockHabit} />
        );

        // Test transition from idle to active
        (useFocusTimerContext as ReturnType<typeof vi.fn>).mockReturnValue({
            timeLeft: 1380,
            totalDuration: 1500,
            isRunning: true,
            progress: 8,
            hasActiveSession: true,
            showCompletionCelebration: false,
            activeSession: {
                id: 1,
                habitId: 1,
                status: 'active' as const,
                startTime: '2026-01-31T10:00:00Z',
                plannedDurationMinutes: 25
            },
            isLoadingSession: false,
            updateTimerState: vi.fn(),
            setCompletionCelebration: vi.fn()
        });

        rerender(
            <FocusTimer habit={mockHabit} />
        );

        expect(screen.getByTestId('timer-display')).toHaveTextContent('23:00');
        expect(screen.getByTestId('pause-session-button')).toBeInTheDocument();
    });

    it('should handle complete session button functionality', async () => {
        // Mock the complete mutation
        const mockMutateAsync = vi.fn().mockResolvedValue({});
        (useCompleteFocusSessionMutation as ReturnType<typeof vi.fn>).mockReturnValue({
            mutateAsync: mockMutateAsync
        });

        const mockActiveSession = {
            id: 1,
            habitId: 1,
            habit: mockHabit,
            status: 'running' as const,
            plannedDurationMinutes: 25,
            startedAt: new Date().toISOString(),
            elapsedSeconds: 900
        };

        (useFocusTimerContext as ReturnType<typeof vi.fn>).mockReturnValue({
            activeSession: mockActiveSession,
            isLoading: false,
            timeLeft: 900,
            progress: 40,
            isRunning: true
        });

        renderWithProviders(

                <FocusTimer habit={mockHabit} />

        );

        const completeButton = screen.getByTestId('complete-session-button');
        await userEvent.click(completeButton);

        expect(mockMutateAsync).toHaveBeenCalled();
    });

    it('should handle start session with error logging', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        // Mock the start mutation to reject
        const mockMutateAsync = vi.fn().mockRejectedValue(new Error('Start session failed'));
        (useStartFocusSessionMutation as ReturnType<typeof vi.fn>).mockReturnValue({
            mutateAsync: mockMutateAsync
        });

        (useFocusTimerContext as ReturnType<typeof vi.fn>).mockReturnValue({
            activeSession: null,
            isLoading: false,
            timeLeft: 0,
            progress: 0,
            isRunning: false
        });

        renderWithProviders(

                <FocusTimer habit={mockHabit} />

        );

        const startButton = screen.getByTestId('start-session-button');
        await userEvent.click(startButton);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Failed to start focus session:', expect.any(Error));
        });

        consoleSpy.mockRestore();
    });

    it('should handle pause session with error logging', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        // Mock the pause mutation to reject (since we're clicking pause button)
        const mockMutateAsync = vi.fn().mockRejectedValue(new Error('Pause session failed'));
        (usePauseFocusSessionMutation as ReturnType<typeof vi.fn>).mockReturnValue({
            mutateAsync: mockMutateAsync
        });

        // Set up context to show running state with active session
        const mockActiveSession = {
            id: 1,
            habitId: 1,
            habit: mockHabit,
            status: 'running' as const,
            plannedDurationMinutes: 25,
            startedAt: new Date().toISOString(),
            elapsedSeconds: 900
        };

        (useFocusTimerContext as ReturnType<typeof vi.fn>).mockReturnValue({
            activeSession: mockActiveSession,
            isLoading: false,
            timeLeft: 900, // 15 minutes
            progress: 40,
            isRunning: true
        });

        renderWithProviders(

                <FocusTimer habit={mockHabit} />

        );

        // In running state, click the pause button
        // The mock will reject and trigger error logging
        const pauseButton = screen.getByTestId('pause-session-button');
        await userEvent.click(pauseButton);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Failed to pause focus session:', expect.any(Error));
        });

        consoleSpy.mockRestore();
    });

    it('should handle resume session with error logging', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        // Mock the resume mutation to reject
        const mockMutateAsync = vi.fn().mockRejectedValue(new Error('Resume session failed'));
        (useResumeFocusSessionMutation as ReturnType<typeof vi.fn>).mockReturnValue({
            mutateAsync: mockMutateAsync
        });

        // Set up context to show paused state
        const mockActiveSession = {
            id: 1,
            habitId: 1,
            habit: mockHabit,
            status: 'paused' as const,
            plannedDurationMinutes: 25,
            startedAt: new Date().toISOString(),
            elapsedSeconds: 900
        };

        (useFocusTimerContext as ReturnType<typeof vi.fn>).mockReturnValue({
            activeSession: mockActiveSession,
            isLoading: false,
            timeLeft: 900, // 15 minutes
            progress: 40,
            isRunning: false
        });

        renderWithProviders(

                <FocusTimer habit={mockHabit} />

        );

        const resumeButton = screen.getByTestId('resume-session-button');
        await userEvent.click(resumeButton);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Failed to resume focus session:', expect.any(Error));
        });

        consoleSpy.mockRestore();
    });

    it('should handle complete session with error logging', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        // Mock the complete mutation to reject
        const mockMutateAsync = vi.fn().mockRejectedValue(new Error('Complete session failed'));
        (useCompleteFocusSessionMutation as ReturnType<typeof vi.fn>).mockReturnValue({
            mutateAsync: mockMutateAsync
        });

        // Set up context to show running state
        const mockActiveSession = {
            id: 1,
            habitId: 1,
            habit: mockHabit,
            status: 'running' as const,
            plannedDurationMinutes: 25,
            startedAt: new Date().toISOString(),
            elapsedSeconds: 900
        };

        (useFocusTimerContext as ReturnType<typeof vi.fn>).mockReturnValue({
            activeSession: mockActiveSession,
            isLoading: false,
            timeLeft: 600, // 10 minutes
            progress: 60,
            isRunning: true
        });

        renderWithProviders(

                <FocusTimer habit={mockHabit} />

        );

        const completeButton = screen.getByTestId('complete-session-button');
        await userEvent.click(completeButton);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Failed to complete focus session:', expect.any(Error));
        });

        consoleSpy.mockRestore();
    });

    it('should handle cancel session with error logging', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        // Mock the cancel mutation to reject
        const mockMutateAsync = vi.fn().mockRejectedValue(new Error('Cancel session failed'));
        (useCancelFocusSessionMutation as ReturnType<typeof vi.fn>).mockReturnValue({
            mutateAsync: mockMutateAsync
        });

        // Set up context to show running state
        const mockActiveSession = {
            id: 1,
            habitId: 1,
            habit: mockHabit,
            status: 'running' as const,
            plannedDurationMinutes: 25,
            startedAt: new Date().toISOString(),
            elapsedSeconds: 900
        };

        (useFocusTimerContext as ReturnType<typeof vi.fn>).mockReturnValue({
            activeSession: mockActiveSession,
            isLoading: false,
            timeLeft: 600, // 10 minutes
            progress: 60,
            isRunning: true
        });

        renderWithProviders(

                <FocusTimer habit={mockHabit} />

        );

        const cancelButton = screen.getByTestId('cancel-session-button');
        await userEvent.click(cancelButton);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Failed to cancel focus session:', expect.any(Error));
        });

        consoleSpy.mockRestore();
    });

    it('should handle notification service calls for successful operations', async () => {
        // Mock the start mutation to succeed
        const mockMutateAsync = vi.fn().mockResolvedValue({});
        (useStartFocusSessionMutation as ReturnType<typeof vi.fn>).mockReturnValue({
            mutateAsync: mockMutateAsync
        });

        const mockHabit: IHabit = {
            id: 1,
            name: 'Test Habit',
            description: 'A test habit',
            metricType: 'duration',
            unit: 'min',
            target: 25,
            targetFrequency: TARGET_FREQUENCY.DAILY,
            category: 'Learning',
            isActive: true,
            createdDate: '2024-01-01T00:00:00Z',
            updatedDate: '2024-01-01T00:00:00Z',
            createdBy: 'test-user-id',
            updatedBy: 'test-user-id',
            color: HABIT_COLORS.BLUE,
            icon: HABIT_ICONS.BOOK
        };

        (useFocusTimerContext as ReturnType<typeof vi.fn>).mockReturnValue({
            activeSession: null,
            isLoading: false,
            timeLeft: 0,
            progress: 0,
            isRunning: false
        });

        renderWithProviders(

                <FocusTimer habit={mockHabit} />

        );

        const startButton = screen.getByTestId('start-session-button');
        await userEvent.click(startButton);

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith({
                habitId: 1,
                plannedDurationMinutes: 25
            });
        });
    });

    it('should show loading state from multiple mutations', () => {
        const mockActiveSession = {
            id: 1,
            habitId: 1,
            status: 'running' as const,
            plannedDurationMinutes: 25,
            startedAt: new Date().toISOString(),
            elapsedSeconds: 900
        };
        (useFocusTimerContext as ReturnType<typeof vi.fn>).mockReturnValue({
            activeSession: mockActiveSession,
            isLoading: true,
            startSession: vi.fn(),
            pauseSession: vi.fn(),
            resumeSession: vi.fn(),
            completeSession: vi.fn(),
            cancelSession: vi.fn(),
            timeLeft: 600,
            progress: 60
        });

        renderWithProviders(

                <FocusTimer />

        );

        expect(screen.getByTestId('focus-timer-card')).toBeInTheDocument();
    });
});