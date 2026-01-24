import { useParams, Navigate } from 'react-router-dom';
import { useHabitById } from '@/queries';
import { HabitLogs } from './HabitLogs';
import { HabitLogStats } from './HabitLogStats';
import { AddHabitLogDialog } from './AddHabitLogDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Activity, Target, Calendar } from 'lucide-react';

export const HabitDetailPage = () => {
    const { habitId } = useParams<{ habitId: string }>();
    const { data: habit, isLoading, error } = useHabitById(Number(habitId));

    if (isLoading) {
        return (
            <div className="flex-1 overflow-auto p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        ))}
                    </div>
                    <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
            </div>
        );
    }

    if (error || !habit) {
        return <Navigate to="/habits" replace />;
    }

    const displayUnit = habit.unit || habit.metricType || 'units';

    return (
        <div className="flex-1 overflow-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.history.back()}
                        className="p-2"
                    >
                        <ArrowLeft size={16} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: habit.color || '#3b82f6' }}
                            />
                            {habit.name}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {habit.description || 'Track your progress and build consistency'}
                        </p>
                    </div>
                </div>
                <AddHabitLogDialog habit={habit} />
            </div>

            {/* Habit Info Card */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Habit Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Target</div>
                            <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                {habit.target} {displayUnit} {habit.targetFrequency}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Category</div>
                            <Badge variant="secondary" className="mt-1">
                                {habit.category || 'No Category'}
                            </Badge>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Status</div>
                            <Badge
                                variant={habit.isActive ? "default" : "secondary"}
                                className={`mt-1 ${habit.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}`}
                            >
                                {habit.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Progress Overview
                </h2>
                <HabitLogStats habit={habit} />
            </div>

            {/* Activity Logs */}
            <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Activity History
                </h2>
                <HabitLogs habit={habit} />
            </div>
        </div>
    );
};