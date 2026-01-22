import { useHabitData } from '@/queries';
import { CheckCircle } from 'lucide-react';
import { AddHabitDialog } from './AddHabitDialog';
import { HabitOptionsMenu } from './HabitOptionsMenu';
import { PomodoroDialog } from '../Pomodoro/PomodoroDialog';

export const Habits = () => {
    const { data: habits } = useHabitData('');
    console.log('habits data', habits);
    return (
        <section>
            <div className="flex-1 overflow-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Your Habits</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Build and track your daily habits</p>
                    </div>
                    <AddHabitDialog />
                </div>

                <div className="grid gap-4">
                    {habits?.map((habit) => (
                        <div
                            key={habit.id}
                            className={`p-4 rounded-lg border ${!habit.isActive ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}
                            style={{
                                borderLeftColor: habit.color || '#3b82f6',
                                borderLeftWidth: '4px'
                            }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center ${habit.isActive ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'border-2 border-slate-300 dark:border-slate-600'}`}>
                                        {habit.isActive && <CheckCircle size={14} />}
                                    </div>
                                    <div>
                                        <h4 className={`font-medium ${!habit.isActive ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100'}`}>{habit.name}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            Target: {habit.target} {habit.unit} {habit.targetFrequency}
                                        </p>
                                        {habit.category && (
                                            <span className="inline-block px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full mt-1">
                                                {habit.category}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <PomodoroDialog habit={habit} />
                                    <HabitOptionsMenu habit={habit} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
