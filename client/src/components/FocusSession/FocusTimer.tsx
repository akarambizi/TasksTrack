import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TimerDisplay, TimerControls } from '@/components/ui';
import {
    useStartFocusSessionMutation,
    usePauseFocusSessionMutation,
    useResumeFocusSessionMutation,
    useCompleteFocusSessionMutation,
    useCancelFocusSessionMutation,
} from '@/queries';
import { IHabit, FocusSessionStatus } from '@/api';
import { focusNotificationService } from '@/services/focusNotificationService';
import { useFocusTimerContext } from '@/hooks/useFocusTimerContext';
import { formatTime } from '@/utils/focusTimer';
import { createFocusSessionHandlers, isAnyMutationLoading, getSessionStatusMessage } from '@/utils';

interface IFocusTimerProps {
    habit?: IHabit;
    className?: string;
}

export const FocusTimer = ({ habit, className }: IFocusTimerProps) => {
    const {
        timeLeft,
        progress,
        isRunning,
        activeSession,
        showCompletionCelebration
    } = useFocusTimerContext();

    const startMutation = useStartFocusSessionMutation();
    const pauseMutation = usePauseFocusSessionMutation();
    const resumeMutation = useResumeFocusSessionMutation();
    const completeMutation = useCompleteFocusSessionMutation();
    const cancelMutation = useCancelFocusSessionMutation();

    const { formatted: formattedTime } = formatTime(timeLeft);

    // Create handlers using utility function
    const handlers = createFocusSessionHandlers(
        habit,
        activeSession,
        timeLeft,
        {
            startMutation,
            pauseMutation,
            resumeMutation,
            completeMutation,
            cancelMutation
        },
        focusNotificationService
    );

    const isLoading = isAnyMutationLoading([
        startMutation,
        pauseMutation,
        resumeMutation,
        completeMutation,
        cancelMutation
    ]);

    const statusMessage = getSessionStatusMessage(
        activeSession,
        habit,
        showCompletionCelebration,
        isLoading
    );

    return (
        <Card className={`w-full max-w-md mx-auto ${className}`} data-testid="focus-timer-card">
            <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                    <Clock className="h-5 w-5" />
                    Focus Timer
                </CardTitle>
                {activeSession && (
                    <Badge
                        variant={activeSession.status === FocusSessionStatus.Active ? "default" : "secondary"}
                        className="mx-auto mt-2"
                    >
                        {activeSession.status.charAt(0).toUpperCase() + activeSession.status.slice(1)}
                    </Badge>
                )}
            </CardHeader>

            <CardContent className="space-y-6">
                <TimerDisplay
                    timeFormatted={formattedTime}
                    progress={progress}
                    showCompletionCelebration={showCompletionCelebration}
                    timeLeft={timeLeft}
                />

                <TimerControls
                    activeSession={activeSession}
                    isRunning={isRunning}
                    isLoading={isLoading}
                    habit={habit}
                    onStart={handlers.handleStart}
                    onPause={handlers.handlePause}
                    onResume={handlers.handleResume}
                    onComplete={handlers.handleComplete}
                    onCancel={handlers.handleCancel}
                />

                {/* Status Messages */}
                {statusMessage.type === 'completion' && (
                    <div className="text-center animate-pulse" data-testid="completion-celebration">
                        <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                            {statusMessage.message}
                        </p>
                    </div>
                )}

                {statusMessage.type === 'no-habit' && (
                    <div className="text-center text-muted-foreground" data-testid="no-habit-message">
                        <p>{statusMessage.message}</p>
                    </div>
                )}

                {statusMessage.type === 'loading' && (
                    <div className="text-center text-muted-foreground">
                        <p>{statusMessage.message}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
