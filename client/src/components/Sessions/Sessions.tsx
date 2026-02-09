import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CalendarDays, Target, CheckCircle, XCircle, Pause } from 'lucide-react';
import { useFocusSessions } from '@/queries/focusSessions';
import { format } from 'date-fns';
import { IFocusSession, FocusSessionStatus } from '@/types';

export const Sessions = () => {
    const { data: sessions = [], isLoading, error } = useFocusSessions();

    const formatDuration = (session: IFocusSession) => {
        if (session.actualDurationSeconds) {
            const minutes = Math.floor(session.actualDurationSeconds / 60);
            const seconds = session.actualDurationSeconds % 60;
            return `${minutes}m ${seconds}s`;
        }

        // For active/paused sessions, calculate elapsed time
        if (session.status === FocusSessionStatus.Active || session.status === FocusSessionStatus.Paused) {
            const startTime = new Date(session.startTime).getTime();
            const now = new Date().getTime();
            const elapsedSeconds = Math.floor((now - startTime) / 1000);
            const pausedDuration = session.pausedDurationSeconds || 0;
            const actualElapsed = Math.max(0, elapsedSeconds - pausedDuration);

            const minutes = Math.floor(actualElapsed / 60);
            const secs = actualElapsed % 60;
            return `${minutes}m ${secs}s`;
        }

        return `${session.plannedDurationMinutes}m planned`;
    };

    const getStatusBadge = (status: string) => {
        const isCompleted = status === FocusSessionStatus.Completed;
        const isInterrupted = status === FocusSessionStatus.Interrupted;
        const isPaused = status === FocusSessionStatus.Paused;
        const isActive = status === FocusSessionStatus.Active;

        let icon, variant: "default" | "secondary" | "destructive" | "outline", text;

        if (isCompleted) {
            icon = <CheckCircle size={12} />;
            variant = "default";
            text = "Completed";
        } else if (isInterrupted) {
            icon = <XCircle size={12} />;
            variant = "destructive";
            text = "Interrupted";
        } else if (isPaused) {
            icon = <Pause size={12} />;
            variant = "secondary";
            text = "Paused";
        } else if (isActive) {
            icon = <Clock size={12} className="animate-pulse" />;
            variant = "outline";
            text = "Active";
        } else {
            icon = <Clock size={12} />;
            variant = "secondary";
            text = status;
        }

        return (
            <Badge variant={variant} className="gap-1">
                {icon}
                {text}
            </Badge>
        );
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Session History</h1>
                    <p className="text-muted-foreground">Review your completed focus sessions</p>
                </div>
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Session History</h1>
                    <p className="text-muted-foreground">Review your completed focus sessions</p>
                </div>
                <Card>
                    <CardContent className="flex items-center justify-center p-8">
                        <p className="text-muted-foreground">Unable to load session history</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Session History</h1>
                <p className="text-muted-foreground">
                    Review your completed focus sessions and track your productivity
                </p>
            </div>

            {/* Sessions List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarDays size={20} />
                        Recent Sessions
                    </CardTitle>
                    <CardDescription>
                        Your focus session history with task details and completion times
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {sessions.length === 0 ? (
                        <div className="text-center py-8">
                            <Target className="mx-auto h-12 w-12 text-muted-foreground/50" />
                            <h3 className="mt-4 text-lg font-semibold">No sessions yet</h3>
                            <p className="text-muted-foreground">
                                Start your first focus session to see your history here
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Header */}
                            <div className="grid grid-cols-12 gap-4 pb-2 border-b text-sm font-medium text-muted-foreground">
                                <div className="col-span-1">#</div>
                                <div className="col-span-5">Task</div>
                                <div className="col-span-2">Duration</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-2">Date</div>
                            </div>

                            {/* Session Rows */}
                            {sessions.map((session, index) => (
                                <div
                                    key={session.id}
                                    className="grid grid-cols-12 gap-4 py-3 border-b border-border/50 hover:bg-muted/50 rounded-sm px-2 transition-colors"
                                >
                                    <div className="col-span-1 text-muted-foreground font-medium">
                                        {index + 1}
                                    </div>
                                    <div className="col-span-5">
                                        <div className="font-medium">{session.habit?.name || 'Focus Session'}</div>
                                        {session.notes && (
                                            <div className="text-sm text-muted-foreground truncate">
                                                {session.notes}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-2 flex items-center gap-1">
                                        <Clock size={14} className="text-muted-foreground" />
                                        <span className="font-medium">
                                            {formatDuration(session)}
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        {getStatusBadge(session.status)}
                                    </div>
                                    <div className="col-span-2 text-muted-foreground">
                                        {format(new Date(session.startTime), 'MMM d, yyyy')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
