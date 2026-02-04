import React from 'react';

interface ITimerDisplayProps {
    timeFormatted: string;
    progress: number;
    showCompletionCelebration: boolean;
    timeLeft: number;
    testId?: string;
}

export const TimerDisplay: React.FC<ITimerDisplayProps> = ({
    timeFormatted,
    progress,
    showCompletionCelebration,
    timeLeft,
    testId = "timer-display"
}) => {
    return (
        <div className="text-center">
            <div
                className={`text-6xl font-bold transition-all duration-300 ${
                    showCompletionCelebration ? 'text-green-500 animate-bounce' :
                    timeLeft === 0 ? 'text-green-500' :
                    'text-slate-800 dark:text-slate-100'
                }`}
                data-testid={testId}
            >
                {timeFormatted}
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
    );
};