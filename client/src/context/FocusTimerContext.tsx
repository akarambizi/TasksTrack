import React, { useEffect, useState, useCallback } from 'react';
import { useTimer } from 'react-timer-hook';
import { addSeconds } from 'date-fns';
import { useActiveFocusSession } from '@/queries';
import { IFocusSession } from '@/types';
import { getSessionState } from '@/utils/focusTimer';
import { FocusTimerContext } from '@/hooks/useFocusTimerContext';

interface IFocusTimerState {
    timeLeft: number;
    totalDuration: number;
    isRunning: boolean;
    progress: number;
    hasActiveSession: boolean;
    showCompletionCelebration: boolean;
}

interface IFocusTimerContext extends IFocusTimerState {
    activeSession: IFocusSession | null;
    isLoadingSession: boolean;
    updateTimerState: (plannedDurationMinutes: number) => void;
    setCompletionCelebration: (show: boolean) => void;
}

interface IFocusTimerProviderProps {
    children: React.ReactNode;
    plannedDurationMinutes?: number;
}

export const FocusTimerProvider = ({
    children,
    plannedDurationMinutes = 25
}: IFocusTimerProviderProps) => {
    const { data: activeSession, isLoading: isLoadingSession } = useActiveFocusSession();

    // Create timer with react-timer-hook for smooth countdown
    const expiryTime = addSeconds(new Date(), plannedDurationMinutes * 60);
    const timer = useTimer({
        expiryTimestamp: expiryTime,
        onExpire: () => {
            setShowCompletionCelebration(true);
        },
        autoStart: false
    });

    const [showCompletionCelebration, setShowCompletionCelebration] = useState(false);

    // Sync timer with backend session data
    const syncTimerWithBackend = useCallback(() => {
        if (activeSession) {
            const sessionState = getSessionState(activeSession, plannedDurationMinutes);

            // Create expiry time based on backend data
            const expiryTime = addSeconds(new Date(), sessionState.timeLeft);

            // Restart timer with backend time
            timer.restart(expiryTime, sessionState.isRunning);
        } else {
            // No active session - reset to default
            const defaultExpiryTime = addSeconds(new Date(), plannedDurationMinutes * 60);
            timer.restart(defaultExpiryTime, false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSession, plannedDurationMinutes]);

    // Sync with backend whenever activeSession or plannedDurationMinutes changes
    useEffect(() => {
        syncTimerWithBackend();
    }, [syncTimerWithBackend]);

    // Auto-hide celebration after 3 seconds
    useEffect(() => {
        if (showCompletionCelebration) {
            const timeout = setTimeout(() => {
                setShowCompletionCelebration(false);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [showCompletionCelebration]);

    // Calculate progress based on active session or default
    const getProgress = () => {
        if (activeSession) {
            const sessionState = getSessionState(activeSession, plannedDurationMinutes);
            return sessionState.progress;
        }
        const totalTime = plannedDurationMinutes * 60;
        const timeLeft = timer.totalSeconds;
        return totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
    };

    const contextValue: IFocusTimerContext = {
        timeLeft: timer.totalSeconds,
        totalDuration: activeSession ? activeSession.plannedDurationMinutes * 60 : plannedDurationMinutes * 60,
        isRunning: timer.isRunning,
        progress: getProgress(),
        hasActiveSession: !!activeSession,
        showCompletionCelebration,
        activeSession: activeSession || null,
        isLoadingSession,
        updateTimerState: syncTimerWithBackend,
        setCompletionCelebration: setShowCompletionCelebration
    };

    return (
        <FocusTimerContext.Provider value={contextValue}>
            {children}
        </FocusTimerContext.Provider>
    );
};