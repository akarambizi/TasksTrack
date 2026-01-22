import { Target, TrendingUp } from 'lucide-react';
import { AddHabitDialog } from './AddHabitDialog';

export const HabitsEmpty = () => {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-8 flex space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                    <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
            </div>
            
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                No Habits Yet
            </h3>
            
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
                Ready to start building positive habits? Create your first habit and begin tracking your progress toward your goals.
            </p>
            
            <AddHabitDialog />
        </div>
    );
};