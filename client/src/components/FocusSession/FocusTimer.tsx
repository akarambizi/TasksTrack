import { useCallback } from 'react';
import { Play, Pause, Square, RotateCcw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { formatTime, getActualMinutesCompleted } from '@/utils/focusTimer';

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

    // Handler functions
    const handleStart = useCallback(async (plannedDurationMinutes: number = 25) => {
        if (!habit) return;

        try {
            await startMutation.mutateAsync({
                habitId: habit.id,
                plannedDurationMinutes,
            });

            focusNotificationService.notifySessionStarted(habit.name, plannedDurationMinutes);
        } catch (error) {
            console.error('Failed to start focus session:', error);
        }
    }, [habit, startMutation]);

    const handlePause = useCallback(async () => {
        try {
            await pauseMutation.mutateAsync();

            if (activeSession?.habit) {
                focusNotificationService.notifySessionPaused(activeSession.habit.name);
            }
        } catch (error) {
            console.error('Failed to pause focus session:', error);
        }
    }, [pauseMutation, activeSession]);

    const handleResume = useCallback(async () => {
        try {
            await resumeMutation.mutateAsync();

            if (activeSession?.habit) {
                focusNotificationService.notifySessionResumed(activeSession.habit.name);
            }
        } catch (error) {
            console.error('Failed to resume focus session:', error);
        }
    }, [resumeMutation, activeSession]);

    const handleComplete = useCallback(async () => {
        try {
            await completeMutation.mutateAsync({});

            if (activeSession?.habit) {
                const actualMinutes = getActualMinutesCompleted(
                    activeSession.plannedDurationMinutes * 60,
                    timeLeft
                );
                focusNotificationService.notifySessionCompleted(activeSession.habit.name, actualMinutes);
            }
        } catch (error) {
            console.error('Failed to complete focus session:', error);
        }
    }, [completeMutation, activeSession, timeLeft]);

    const handleCancel = useCallback(async () => {
        try {
            await cancelMutation.mutateAsync({});

            if (activeSession?.habit) {
                focusNotificationService.notifySessionCancelled(activeSession.habit.name);
            }
        } catch (error) {
            console.error('Failed to cancel focus session:', error);
        }
    }, [cancelMutation, activeSession]);

    const isLoading = startMutation.isPending || pauseMutation.isPending ||
                     resumeMutation.isPending || completeMutation.isPending ||
                     cancelMutation.isPending;

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
                {/* Timer Display */}
                <div className="text-center">
                    <div className={`text-6xl font-bold transition-all duration-300 ${
                        showCompletionCelebration ? 'text-green-500 animate-bounce' :
                        timeLeft === 0 ? 'text-green-500' :
                        'text-slate-800 dark:text-slate-100'
                    }`} data-testid="timer-display">
                        {formattedTime}
                    </div>

                    {progress > 0 && (
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2" data-testid="progress-bar">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                    data-testid="progress-fill"
                                ></div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                {Math.round(progress)}% complete
                            </p>
                        </div>
                    )}
                </div>

                {/* Control Buttons */}
                <div className="flex justify-center space-x-3">
                    {!activeSession ? (
                        <Button
                            onClick={() => handleStart(25)}
                            disabled={!habit || isLoading}
                            size="lg"
                            className="flex items-center gap-2"
                            data-testid="start-session-button"
                        >
                            <Play className="h-4 w-4" />
                            Start Focus
                        </Button>
                    ) : (
                        <>
                            {isRunning ? (
                                <Button
                                    onClick={handlePause}
                                    disabled={isLoading}
                                    size="lg"
                                    variant="secondary"
                                    className="flex items-center gap-2"
                                    data-testid="pause-session-button"
                                >
                                    <Pause className="h-4 w-4" />
                                    Pause
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleResume}
                                    disabled={isLoading}
                                    size="lg"
                                    className="flex items-center gap-2"
                                    data-testid="resume-session-button"
                                >
                                    <Play className="h-4 w-4" />
                                    Resume
                                </Button>
                            )}

                            <Button
                                onClick={handleComplete}
                                disabled={isLoading}
                                size="lg"
                                variant="default"
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                                data-testid="complete-session-button"
                            >
                                <Square className="h-4 w-4" />
                                Complete
                            </Button>
                        </>
                    )}

                    <Button
                        onClick={activeSession ? handleCancel : () => {}}
                        disabled={isLoading}
                        size="lg"
                        variant="outline"
                        className="flex items-center gap-2"
                        data-testid="cancel-session-button"
                    >
                        <RotateCcw className="h-4 w-4" />
                        {activeSession ? 'Cancel' : 'Reset'}
                    </Button>
                </div>

                {/* Status Messages */}
                {showCompletionCelebration && (
                    <div className="text-center animate-pulse" data-testid="completion-celebration">
                        <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                            Focus session completed! Great job!
                        </p>
                    </div>
                )}

                {!habit && !activeSession && (
                    <div className="text-center text-muted-foreground" data-testid="no-habit-message">
                        <p>Select a habit to start a focus session</p>
                    </div>
                )}

                {isLoading && (
                    <div className="text-center text-muted-foreground">
                        <p>Processing...</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
