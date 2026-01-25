import { useHabitLogs } from '@/queries';
import { IHabit } from '@/api';
import { Calendar, Clock, FileText, TrendingUp, Target } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface IHabitLogsProps {
    habit: IHabit;
    limit?: number;
}

export const HabitLogs: React.FC<IHabitLogsProps> = ({ habit, limit }) => {
    const { data: logs, isLoading, error } = useHabitLogs({
        habitId: habit.id,
        limit: limit || 10
    });

    if (isLoading) {
        return (
            <div className="space-y-4" data-testid="habit-logs-loading">
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Recent Activity</h3>
                <div className="space-y-2">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="bg-slate-200 dark:bg-slate-700 h-16 rounded-lg"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8" data-testid="habit-logs-error">
                <p className="text-red-600 dark:text-red-400">Failed to load activity logs</p>
            </div>
        );
    }

    if (!logs || logs.length === 0) {
        return (
            <Card data-testid="habit-logs-empty">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 dark:text-slate-400">No activity logged yet</p>
                        <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                            Start logging your progress to see your activity history here.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const displayUnit = habit.unit || habit.metricType || 'units';

    return (
        <Card data-testid="habit-logs-container">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recent Activity
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {logs.map((log) => {
                        const logDate = new Date(log.date);
                        const isToday = format(logDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                        const targetMet = habit.target ? log.value >= habit.target : false;

                        return (
                            <div
                                key={log.id}
                                data-testid={`habit-log-${log.id}`}
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
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300" data-testid={`log-date-${log.id}`}>
                                                {format(logDate, 'MMM d, yyyy')}
                                                {isToday && (
                                                    <Badge variant="secondary" className="ml-2 text-xs" data-testid={`today-badge-${log.id}`}>
                                                        Today
                                                    </Badge>
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4 text-slate-500" />
                                                <span className="text-lg font-semibold text-slate-800 dark:text-slate-100" data-testid={`log-value-${log.id}`}>
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
                                            <div className="flex items-start gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700" data-testid={`log-notes-${log.id}`}>
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
                    })}
                </div>

                {logs.length >= (limit || 10) && (
                    <div className="text-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <p className="text-sm text-slate-500">
                            Showing recent {limit || 10} activities
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};