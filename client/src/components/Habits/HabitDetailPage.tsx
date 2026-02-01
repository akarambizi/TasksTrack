import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useHabitById } from '@/queries';
import { useFocusSessionsByHabit, useResumeFocusSessionMutation } from '@/queries/focusSessions';
import { HabitLogs } from './HabitLogs';
import { HabitLogStats } from './HabitLogStats';
import { AddHabitLogDialog } from './AddHabitLogDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Activity, Target, Calendar, Clock, CheckCircle, XCircle, Pause, Play } from 'lucide-react';
import { format } from 'date-fns';
import { FocusSessionStatus } from '@/api';

export const HabitDetailPage = () => {
    const { habitId } = useParams<{ habitId: string }>();
    const navigate = useNavigate();
    const { data: habit, isLoading, error } = useHabitById(Number(habitId));
    const { data: focusSessions = [], isLoading: isLoadingFocusSessions } = useFocusSessionsByHabit(Number(habitId));
    const resumeMutation = useResumeFocusSessionMutation();

    const handleResume = () => {
        resumeMutation.mutate(undefined, {
            onSuccess: () => {
                // Navigate to focus sessions page to see the active timer
                navigate('/focus-sessions');
            },
        });
    };

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
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Activity History
                </h2>
                <HabitLogs habit={habit} />
            </div>

            {/* Focus Sessions */}
            <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Focus Sessions
                </h2>

                {isLoadingFocusSessions ? (
                    <Card>
                        <CardContent className="p-6">
                            <div className="animate-pulse space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ) : focusSessions.length > 0 ? (
                    <div className="space-y-3">
                        {focusSessions.slice(0, 5).map((session) => (
                            <Card key={session.id}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                {session.status === FocusSessionStatus.Completed && (
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                )}
                                                {session.status === FocusSessionStatus.Interrupted && (
                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                )}
                                                {session.status === FocusSessionStatus.Paused && (
                                                    <Pause className="h-4 w-4 text-yellow-500" />
                                                )}
                                                {session.status === FocusSessionStatus.Active && (
                                                    <Clock className="h-4 w-4 text-blue-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {format(new Date(session.startTime), 'MMM dd, yyyy')} at {format(new Date(session.startTime), 'h:mm a')}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {session.status === FocusSessionStatus.Completed || session.actualDurationSeconds ?
                                                        `${Math.round((session.actualDurationSeconds || 0) / 60)} min` :
                                                        'In progress'
                                                    }
                                                    {session.plannedDurationMinutes && ` • Planned: ${session.plannedDurationMinutes} min`}
                                                    {session.pausedDurationSeconds && session.pausedDurationSeconds > 0 && ` • Paused: ${Math.round(session.pausedDurationSeconds / 60)} min`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {(session.status === FocusSessionStatus.Paused || session.status === FocusSessionStatus.Active) && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={resumeMutation.isPending}
                                                    onClick={handleResume}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Play className="h-3 w-3" />
                                                    {resumeMutation.isPending ? 'Resuming...' : 'Resume'}
                                                </Button>
                                            )}
                                            <Badge variant={
                                                session.status === FocusSessionStatus.Completed ? 'default' :
                                                session.status === FocusSessionStatus.Interrupted ? 'destructive' :
                                                session.status === FocusSessionStatus.Paused ? 'secondary' :
                                                'outline'
                                            }>
                                                {session.status === FocusSessionStatus.Completed ? 'Completed' :
                                                 session.status === FocusSessionStatus.Interrupted ? 'Interrupted' :
                                                 session.status === FocusSessionStatus.Paused ? 'Paused' :
                                                 session.status === FocusSessionStatus.Active ? 'In Progress' :
                                                 session.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {focusSessions.length > 5 && (
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {focusSessions.length - 5} more focus sessions...
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-6 text-center">
                            <Clock className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                No focus sessions yet for this habit.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};