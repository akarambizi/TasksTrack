import { useContext, createContext } from 'react';
import { IFocusSession } from '@/types';

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

export const FocusTimerContext = createContext<IFocusTimerContext | undefined>(undefined);

export const useFocusTimerContext = () => {
    const context = useContext(FocusTimerContext);
    if (context === undefined) {
        throw new Error('useFocusTimerContext must be used within a FocusTimerProvider');
    }
    return context;
};