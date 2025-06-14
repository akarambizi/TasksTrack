import { Play, Pause, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { IToDoTask } from '@/api';

interface PomodoroProps {
    task?: IToDoTask; // Optional task - makes the component reusable
}

export const Pomodoro = ({ task }: PomodoroProps) => {
    const [timerRunning, setTimerRunning] = useState(false);
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [timerMode, setTimerMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');

    // Reset timer when mode changes
    useEffect(() => {
        if (timerMode === 'pomodoro') {
            setMinutes(25);
        } else if (timerMode === 'shortBreak') {
            setMinutes(5);
        } else {
            setMinutes(15);
        }
        setSeconds(0);
        setTimerRunning(false);
    }, [timerMode]);

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (timerRunning) {
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        // Timer completed
                        setTimerRunning(false);
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                } else {
                    setSeconds(seconds - 1);
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [timerRunning, minutes, seconds]);

    const toggleTimer = () => {
        setTimerRunning(!timerRunning);
    };

    const resetTimer = () => {
        if (timerMode === 'pomodoro') {
            setMinutes(25);
        } else if (timerMode === 'shortBreak') {
            setMinutes(5);
        } else {
            setMinutes(15);
        }
        setSeconds(0);
        setTimerRunning(false);
    };

    return (
        <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 text-center">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Pomodoro Timer</h3>

                    <div className="mb-8">
                        <div className="text-6xl font-bold text-slate-800 dark:text-slate-100 mb-8">
                            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                        </div>

                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={toggleTimer}
                                className={`h-14 w-14 rounded-full flex items-center justify-center ${timerRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>
                                {timerRunning ?
                                    <Pause size={24} /> :
                                    <Play size={24} className="ml-1" />
                                }
                            </button>

                            <button
                                onClick={resetTimer}
                                className="h-14 w-14 rounded-full flex items-center justify-center bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200">
                                <RefreshCw size={20} />
                            </button>
                        </div>
                    </div>

                    {task && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">Current Task</h4>
                            <p className="text-blue-700 dark:text-blue-300">{task.title}</p>
                        </div>
                    )}

                    <div className="flex justify-between mt-6">
                        <button
                            onClick={() => setTimerMode('pomodoro')}
                            className={`px-4 py-2 rounded-lg ${
                                timerMode === 'pomodoro'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}>
                            25 min
                        </button>
                        <button
                            onClick={() => setTimerMode('shortBreak')}
                            className={`px-4 py-2 rounded-lg ${
                                timerMode === 'shortBreak'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}>
                            5 min
                        </button>
                        <button
                            onClick={() => setTimerMode('longBreak')}
                            className={`px-4 py-2 rounded-lg ${
                                timerMode === 'longBreak'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}>
                            15 min
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
