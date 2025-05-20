import { Play } from 'lucide-react';
import { useState } from 'react';

export const Pomodoro = () => {
    const [timerRunning, setTimerRunning] = useState(false);
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    return (
        <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">Pomodoro Timer</h3>

                    <div className="mb-8">
                        <div className="text-6xl font-bold text-slate-800 mb-8">
                            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                        </div>

                        <div className="flex justify-center space-x-4">
                            <button className={`h-14 w-14 rounded-full flex items-center justify-center ${timerRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>
                                {timerRunning ? <div className="h-4 w-4 bg-white rounded" /> : <Play size={24} className="ml-1" />}
                            </button>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-slate-800 mb-2">Current Task</h4>
                        <p className="text-blue-700">Complete UI Design</p>
                    </div>

                    <div className="flex justify-between mt-6">
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50">25 min</button>
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50">5 min</button>
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50">15 min</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
