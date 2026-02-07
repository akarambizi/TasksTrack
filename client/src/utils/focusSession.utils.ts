import { IFocusSession, IHabit } from '@/api';

/**
 * Focus session status and action utilities
 */

export interface IFocusSessionHandlers {
    handleStart: (plannedDurationMinutes?: number) => Promise<void>;
    handlePause: () => Promise<void>;
    handleResume: () => Promise<void>;
    handleComplete: () => Promise<void>;
    handleCancel: () => Promise<void>;
}

/**
 * Check if any focus session mutation is loading
 */
export const isAnyMutationLoading = (mutations: {
    isPending: boolean;
}[]): boolean => {
    return mutations.some(mutation => mutation.isPending);
};

/**
 * Generate status messages for focus sessions
 */
export const getSessionStatusMessage = (
    activeSession: IFocusSession | null,
    habit: IHabit | undefined,
    showCompletionCelebration: boolean,
    isLoading: boolean
): {
    type: 'completion' | 'no-habit' | 'loading' | 'none';
    message: string;
} => {
    if (showCompletionCelebration) {
        return {
            type: 'completion',
            message: 'Focus session completed! Great job!'
        };
    }

    if (!habit && !activeSession) {
        return {
            type: 'no-habit',
            message: 'Select a habit to start a focus session'
        };
    }

    if (isLoading) {
        return {
            type: 'loading',
            message: 'Processing...'
        };
    }

    return {
        type: 'none',
        message: ''
    };
};

/**
 * Create focus session mutation handlers with error handling
 */
export const createFocusSessionHandlers = (
    habit: IHabit | undefined,
    activeSession: IFocusSession | null,
    timeLeft: number,
    mutations: {
        startMutation: { mutateAsync: (params: { habitId: number; plannedDurationMinutes: number }) => Promise<unknown> };
        pauseMutation: { mutateAsync: () => Promise<unknown> };
        resumeMutation: { mutateAsync: () => Promise<unknown> };
        completeMutation: { mutateAsync: (params: Record<string, never>) => Promise<unknown> };
        cancelMutation: { mutateAsync: (params: Record<string, never>) => Promise<unknown> };
    },
    notificationService: {
        notifySessionStarted: (habitName: string, duration: number) => void;
        notifySessionPaused: (habitName: string) => void;
        notifySessionResumed: (habitName: string) => void;
        notifySessionCompleted: (habitName: string, actualMinutes: number) => void;
        notifySessionCancelled: (habitName: string) => void;
    }
): IFocusSessionHandlers => {
    const { startMutation, pauseMutation, resumeMutation, completeMutation, cancelMutation } = mutations;

    const handleStart = async (plannedDurationMinutes: number = 25) => {
        if (!habit) return;

        try {
            await startMutation.mutateAsync({
                habitId: habit.id,
                plannedDurationMinutes,
            });

            notificationService.notifySessionStarted(habit.name, plannedDurationMinutes);
        } catch (error) {
            console.error('Failed to start focus session:', error);
        }
    };

    const handlePause = async () => {
        try {
            await pauseMutation.mutateAsync();

            if (activeSession?.habit?.name) {
                notificationService.notifySessionPaused(activeSession.habit.name);
            }
        } catch (error) {
            console.error('Failed to pause focus session:', error);
        }
    };

    const handleResume = async () => {
        try {
            await resumeMutation.mutateAsync();

            if (activeSession?.habit?.name) {
                notificationService.notifySessionResumed(activeSession.habit.name);
            }
        } catch (error) {
            console.error('Failed to resume focus session:', error);
        }
    };

    const handleComplete = async () => {
        try {
            await completeMutation.mutateAsync({});

            if (activeSession?.habit) {
                // Dynamically import the utility function to avoid circular dependencies
                const { getActualMinutesCompleted } = await import('@/utils/focusTimer');
                const actualMinutes = getActualMinutesCompleted(
                    activeSession.plannedDurationMinutes * 60,
                    timeLeft
                );
                notificationService.notifySessionCompleted(activeSession.habit.name, actualMinutes);
            }
        } catch (error) {
            console.error('Failed to complete focus session:', error);
        }
    };

    const handleCancel = async () => {
        try {
            await cancelMutation.mutateAsync({});

            if (activeSession?.habit?.name) {
                notificationService.notifySessionCancelled(activeSession.habit.name);
            }
        } catch (error) {
            console.error('Failed to cancel focus session:', error);
        }
    };

    return {
        handleStart,
        handlePause,
        handleResume,
        handleComplete,
        handleCancel
    };
};