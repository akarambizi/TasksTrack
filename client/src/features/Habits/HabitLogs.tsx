import { useHabitLogs } from '@/queries';
import { IHabit } from '@/types';
import { TrendingUp, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSkeleton, HabitLogItem } from '@/components/ui';

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
                <LoadingSkeleton />
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
                    {logs.map((log) => (
                        <HabitLogItem
                            key={log.id}
                            log={log}
                            habit={habit}
                            testId={`habit-log-${log.id}`}
                        />
                    ))}
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