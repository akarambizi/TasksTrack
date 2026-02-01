import { useState, useMemo } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Pause, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { useFocusSessions } from '@/queries';
import { IFocusSession, FocusSessionStatus } from '@/api';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, subDays } from 'date-fns';
import { ODataQueryBuilder } from '@/utils/odataQueryBuilder';

interface IFocusSessionHistoryProps {
    habitId?: number;
    maxSessions?: number;
    showFilters?: boolean;
    className?: string;
}

export const FocusSessionHistory = ({
    habitId,
    maxSessions,
    showFilters = true,
    className
}: IFocusSessionHistoryProps) => {
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));
    const [useWeeklyView, setUseWeeklyView] = useState(false);

    // For weekly view, use the current week. For default view, show last 30 days
    const weekEnd = endOfWeek(currentWeekStart);
    const thirtyDaysAgo = subDays(new Date(), 30);

    const startDate = useWeeklyView ? format(currentWeekStart, 'yyyy-MM-dd') : format(thirtyDaysAgo, 'yyyy-MM-dd');
    const endDate = useWeeklyView ? format(weekEnd, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');

    console.log('🚀 FocusSessionHistory - Date calculations:');
    console.log('🚀 Current date:', new Date());
    console.log('🚀 Thirty days ago:', thirtyDaysAgo);
    console.log('🚀 Start date string:', startDate);
    console.log('🚀 End date string:', endDate);
    console.log('🚀 Use weekly view:', useWeeklyView);

    // Build OData query using the query builder
    const queryString = useMemo(() => {
        return new ODataQueryBuilder()
            .dateRangeFilter({
                field: 'startTime',
                startDate,
                endDate
            })
            .filter(habitId ? `habitId eq ${habitId}` : '')
            .filter(statusFilter !== 'all' ? `status eq '${statusFilter}'` : '')
            .orderBy('startTime desc')
            .top(maxSessions || 0)
            .build();
    }, [startDate, endDate, habitId, statusFilter, maxSessions]);

    const { data: sessions = [], isLoading, error } = useFocusSessions(queryString);

    const filteredSessions = useMemo(() => {
        let filtered = [...sessions];

        if (statusFilter !== 'all') {
            filtered = filtered.filter(session => session.status === statusFilter);
        }

        // Sort by startTime descending (newest first)
        filtered.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

        if (maxSessions) {
            filtered = filtered.slice(0, maxSessions);
        }

        return filtered;
    }, [sessions, statusFilter, maxSessions]);

    const getStatusIcon = (status: FocusSessionStatus) => {
        switch (status) {
            case FocusSessionStatus.Completed:
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case FocusSessionStatus.Interrupted:
                return <XCircle className="h-4 w-4 text-red-500" />;
            case FocusSessionStatus.Paused:
                return <Pause className="h-4 w-4 text-yellow-500" />;
            case FocusSessionStatus.Active:
                return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
            default:
                return <Clock className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status: FocusSessionStatus) => {
        switch (status) {
            case FocusSessionStatus.Completed:
                return 'bg-green-50 text-green-700 border-green-200';
            case FocusSessionStatus.Interrupted:
                return 'bg-red-50 text-red-700 border-red-200';
            case FocusSessionStatus.Paused:
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case FocusSessionStatus.Active:
                return 'bg-blue-50 text-blue-700 border-blue-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

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

    const handlePreviousWeek = () => {
        setCurrentWeekStart(subWeeks(currentWeekStart, 1));
    };

    const handleNextWeek = () => {
        setCurrentWeekStart(addWeeks(currentWeekStart, 1));
    };

    const handleCurrentWeek = () => {
        setCurrentWeekStart(startOfWeek(new Date()));
    };

    if (error) {
        return (
            <Card className={className}>
                <CardContent className="p-6">
                    <div className="text-center text-red-500">
                        <XCircle className="h-8 w-8 mx-auto mb-2" />
                        <p>Failed to load focus sessions</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Focus Sessions
                        {habitId && (
                            <Badge variant="outline">
                                Habit Filtered
                            </Badge>
                        )}
                    </div>
                    {!maxSessions && (
                        <Badge variant="secondary">
                            {useWeeklyView
                                ? `${format(currentWeekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`
                                : `Last 30 days`
                            }
                        </Badge>
                    )}
                </CardTitle>

                {showFilters && (
                    <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="All Sessions" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sessions</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="paused">Paused</SelectItem>
                                    <SelectItem value="interrupted">Interrupted</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUseWeeklyView(!useWeeklyView)}
                            className="h-8"
                        >
                            {useWeeklyView ? 'Show All' : 'Weekly View'}
                        </Button>

                        {!maxSessions && useWeeklyView && (
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePreviousWeek}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCurrentWeek}
                                    className="h-8"
                                >
                                    Today
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleNextWeek}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </CardHeader>

            <CardContent className="space-y-3">
                {isLoading ? (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-20 bg-gray-200 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredSessions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No focus sessions found</p>
                        {statusFilter !== 'all' && (
                            <Button
                                variant="link"
                                onClick={() => setStatusFilter('all')}
                                className="text-sm"
                            >
                                Show all sessions
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredSessions.map((session) => (
                            <div
                                key={session.id}
                                className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        {getStatusIcon(session.status as FocusSessionStatus)}
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium text-sm">
                                                    {session.habitName || session.habit?.name || 'Unknown Habit'}
                                                </h4>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${getStatusColor(session.status as FocusSessionStatus)}`}
                                                >
                                                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                                </Badge>
                                            </div>
                                            <div className="text-xs text-muted-foreground space-y-1">
                                                <div>
                                                    {format(new Date(session.startTime), 'MMM d, yyyy • h:mm a')}
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span>Duration: {formatDuration(session)}</span>
                                                    <span>Planned: {session.plannedDurationMinutes}m</span>
                                                </div>
                                            </div>
                                            {session.notes && (
                                                <div className="text-xs text-muted-foreground bg-muted p-2 rounded text-left">
                                                    {session.notes}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {session.status === FocusSessionStatus.Active && (
                                        <Badge variant="default" className="animate-pulse">
                                            Live
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};