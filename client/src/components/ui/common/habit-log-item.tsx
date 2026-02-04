import { Calendar, Clock, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { IHabit, IHabitLog } from '@/api';

interface IHabitLogItemProps {
    log: IHabitLog;
    habit: IHabit;
    testId?: string;
}

export const HabitLogItem: React.FC<IHabitLogItemProps> = ({ log, habit, testId }) => {
    const logDate = new Date(log.date);
    const isToday = format(logDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    const displayUnit = habit.unit || habit.metricType || 'units';
    const targetMet = habit.target ? log.value >= habit.target : false;

    return (
        <div
            data-testid={testId || `habit-log-${log.id}`}
            className={`p-4 rounded-lg border ${
                isToday
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
            }`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span
                            className="text-sm font-medium text-slate-600 dark:text-slate-300"
                            data-testid={`log-date-${log.id}`}
                        >
                            {format(logDate, 'MMM d, yyyy')}
                            {isToday && (
                                <Badge
                                    variant="secondary"
                                    className="ml-2 text-xs"
                                    data-testid={`today-badge-${log.id}`}
                                >
                                    Today
                                </Badge>
                            )}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-slate-500" />
                            <span
                                className="text-lg font-semibold text-slate-800 dark:text-slate-100"
                                data-testid={`log-value-${log.id}`}
                            >
                                {log.value} {displayUnit}
                            </span>
                        </div>

                        {habit.target && (
                            <Badge
                                variant={targetMet ? "default" : "secondary"}
                                className={targetMet ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""}
                                data-testid={`target-badge-${log.id}`}
                            >
                                {targetMet ? '✓ Target Met' : `${Math.round((log.value / habit.target) * 100)}% of target`}
                            </Badge>
                        )}
                    </div>

                    {log.notes && (
                        <div
                            className="flex items-start gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700"
                            data-testid={`log-notes-${log.id}`}
                        >
                            <FileText className="h-4 w-4 text-slate-500 mt-0.5" />
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {log.notes}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};