import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useHabitById } from '@/queries';
import { useFocusSessionsByHabit, useResumeFocusSessionMutation } from '@/queries/focusSessions';
import { HabitLogs } from './HabitLogs';
import { HabitLogStats } from './HabitLogStats';
import AddHabitLogDialog from './AddHabitLogDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Calendar, Clock } from 'lucide-react';
import {
    PageHeader,
    LoadingSkeleton,
    HabitDetailsCard,
    FocusSessionCard
} from '@/components/ui';

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
                <LoadingSkeleton className="space-y-6" />
            </div>
        );
    }

    if (error || !habit) {
        return <Navigate to="/habits" replace />;
    }

    return (
        <div className="flex-1 overflow-auto p-6">
            {/* Header */}
            <PageHeader
                title={habit.name}
                subtitle={habit.description || 'Track your progress and build consistency'}
                backPath="/habits"
                actions={<AddHabitLogDialog habit={habit} isOpen={false} onClose={() => {}} />}
            />

            {/* Habit Info Card */}
            <div className="mb-6">
                <HabitDetailsCard habit={habit} testId="habit-details-card" />
            </div>

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
                            <LoadingSkeleton />
                        </CardContent>
                    </Card>
                ) : focusSessions.length > 0 ? (
                    <div className="space-y-3">
                        {focusSessions.slice(0, 5).map((session) => (
                            <FocusSessionCard
                                key={session.id}
                                session={session}
                                onResume={handleResume}
                                isResuming={resumeMutation.isPending}
                                testId={`focus-session-${session.id}`}
                            />
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