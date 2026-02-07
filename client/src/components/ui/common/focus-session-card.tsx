import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Pause, Clock, Play } from 'lucide-react';
import { format } from 'date-fns';
import { IFocusSession, FocusSessionStatus } from '@/api';

interface IFocusSessionCardProps {
    session: IFocusSession;
    onResume?: () => void;
    isResuming?: boolean;
    testId?: string;
}

export const FocusSessionCard: React.FC<IFocusSessionCardProps> = ({
    session,
    onResume,
    isResuming = false,
    testId
}) => {
    const getStatusIcon = () => {
        switch (session.status) {
            case FocusSessionStatus.Completed:
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case FocusSessionStatus.Interrupted:
                return <XCircle className="h-4 w-4 text-red-500" />;
            case FocusSessionStatus.Paused:
                return <Pause className="h-4 w-4 text-yellow-500" />;
            case FocusSessionStatus.Active:
                return <Clock className="h-4 w-4 text-blue-500" />;
            default:
                return <Clock className="h-4 w-4 text-slate-400" />;
        }
    };

    const getStatusVariant = (): "default" | "destructive" | "secondary" | "outline" => {
        switch (session.status) {
            case FocusSessionStatus.Completed:
                return 'default';
            case FocusSessionStatus.Interrupted:
                return 'destructive';
            case FocusSessionStatus.Paused:
                return 'secondary';
            default:
                return 'outline';
        }
    };

    const getStatusLabel = () => {
        switch (session.status) {
            case FocusSessionStatus.Completed:
                return 'Completed';
            case FocusSessionStatus.Interrupted:
                return 'Interrupted';
            case FocusSessionStatus.Paused:
                return 'Paused';
            case FocusSessionStatus.Active:
                return 'In Progress';
            default:
                return session.status;
        }
    };

    const getDurationText = () => {
        if (session.status === FocusSessionStatus.Completed || session.actualDurationSeconds) {
            return `${Math.round((session.actualDurationSeconds || 0) / 60)} min`;
        }
        return 'In progress';
    };

    const canResume = session.status === FocusSessionStatus.Paused || session.status === FocusSessionStatus.Active;

    return (
        <Card data-testid={testId}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            {getStatusIcon()}
                        </div>
                        <div>
                            <p className="font-medium text-sm">
                                {format(new Date(session.startTime), 'MMM dd, yyyy')} at {format(new Date(session.startTime), 'h:mm a')}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {getDurationText()}
                                {session.plannedDurationMinutes && ` • Planned: ${session.plannedDurationMinutes} min`}
                                {session.pausedDurationSeconds && session.pausedDurationSeconds > 0 && ` • Paused: ${Math.round(session.pausedDurationSeconds / 60)} min`}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {canResume && onResume && (
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isResuming}
                                onClick={onResume}
                                className="flex items-center gap-1"
                            >
                                <Play className="h-3 w-3" />
                                {isResuming ? 'Resuming...' : 'Resume'}
                            </Button>
                        )}
                        <Badge variant={getStatusVariant()}>
                            {getStatusLabel()}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};