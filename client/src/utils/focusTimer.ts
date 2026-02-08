import { IFocusSession, FocusSessionStatus } from '@/types';
import { differenceInSeconds, parseISO, format, addSeconds } from 'date-fns';

/**
 * Calculate elapsed time from session start, accounting for paused duration
 */
export const calculateElapsedTime = (session: IFocusSession): number => {
    const startTime = parseISO(session.startTime);
    const now = new Date();
    const elapsedSeconds = differenceInSeconds(now, startTime);
    const pausedDuration = session.pausedDurationSeconds || 0;
    return Math.max(0, elapsedSeconds - pausedDuration);
};

/**
 * Calculate remaining time for a focus session
 */
export const calculateTimeLeft = (session: IFocusSession): number => {
    const elapsedSeconds = calculateElapsedTime(session);
    const plannedDurationSeconds = session.plannedDurationMinutes * 60;
    return Math.max(0, plannedDurationSeconds - elapsedSeconds);
};

/**
 * Calculate progress percentage for a session
 */
export const calculateProgress = (timeLeft: number, totalDuration: number): number => {
    if (totalDuration <= 0) return 0;
    return ((totalDuration - timeLeft) / totalDuration) * 100;
};

/**
 * Format time in seconds to MM:SS format using date-fns
 */
export const formatTime = (seconds: number): { minutes: number; seconds: number; formatted: string } => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Create a date object for formatting (using Unix epoch + seconds)
    const timeDate = addSeconds(new Date(0), seconds);
    const formatted = format(timeDate, 'mm:ss');

    return {
        minutes,
        seconds: remainingSeconds,
        formatted
    };
};

/**
 * Check if session is currently running
 */
export const isSessionRunning = (session: IFocusSession | null): boolean => {
    return session?.status === FocusSessionStatus.Active;
};

/**
 * Get session state from active session data
 */
export const getSessionState = (
    activeSession: IFocusSession | null,
    plannedDurationMinutes: number
) => {
    if (activeSession) {
        const timeLeft = calculateTimeLeft(activeSession);
        const totalDuration = activeSession.plannedDurationMinutes * 60;
        const isRunning = isSessionRunning(activeSession);
        const progress = calculateProgress(timeLeft, totalDuration);

        return {
            timeLeft,
            totalDuration,
            isRunning,
            progress,
            hasActiveSession: true
        };
    }

    // No active session - default state
    const defaultDuration = plannedDurationMinutes * 60;
    return {
        timeLeft: defaultDuration,
        totalDuration: defaultDuration,
        isRunning: false,
        progress: 0,
        hasActiveSession: false
    };
};



/**
 * Convert minutes to readable string
 */
export const getActualMinutesCompleted = (totalDuration: number, timeLeft: number): number => {
    return Math.floor((totalDuration - timeLeft) / 60);
};