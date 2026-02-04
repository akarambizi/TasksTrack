import React from 'react';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IFocusSession, IHabit } from '@/api';

interface ITimerControlsProps {
    activeSession: IFocusSession | null;
    isRunning: boolean;
    isLoading: boolean;
    habit?: IHabit;
    onStart: (plannedDurationMinutes?: number) => void;
    onPause: () => void;
    onResume: () => void;
    onComplete: () => void;
    onCancel: () => void;
}

export const TimerControls: React.FC<ITimerControlsProps> = ({
    activeSession,
    isRunning,
    isLoading,
    habit,
    onStart,
    onPause,
    onResume,
    onComplete,
    onCancel
}) => {
    return (
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {!activeSession ? (
                <Button
                    onClick={() => onStart(25)}
                    disabled={!habit || isLoading}
                    size="sm"
                    className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base px-3 sm:px-4"
                    data-testid="start-session-button"
                >
                    <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                    Start Focus
                </Button>
            ) : (
                <>
                    {isRunning ? (
                        <Button
                            onClick={onPause}
                            disabled={isLoading}
                            size="sm"
                            variant="secondary"
                            className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base px-3 sm:px-4"
                            data-testid="pause-session-button"
                        >
                            <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
                            Pause
                        </Button>
                    ) : (
                        <Button
                            onClick={onResume}
                            disabled={isLoading}
                            size="sm"
                            className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base px-3 sm:px-4"
                            data-testid="resume-session-button"
                        >
                            <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                            Resume
                        </Button>
                    )}

                    <Button
                        onClick={onComplete}
                        disabled={isLoading}
                        size="sm"
                        variant="default"
                        className="flex items-center gap-1 sm:gap-2 bg-green-600 hover:bg-green-700 text-sm sm:text-base px-3 sm:px-4"
                        data-testid="complete-session-button"
                    >
                        <Square className="h-3 w-3 sm:h-4 sm:w-4" />
                        Complete
                    </Button>
                </>
            )}

            <Button
                onClick={activeSession ? onCancel : () => {}}
                disabled={isLoading}
                size="sm"
                variant="outline"
                className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base px-3 sm:px-4"
                data-testid="cancel-session-button"
            >
                <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                {activeSession ? 'Cancel' : 'Reset'}
            </Button>
        </div>
    );
};