import { useState } from 'react';
import { Play, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FocusTimer, FocusSessionHistory } from '@/components/FocusSession';
import { useHabitData, useActiveFocusSession, useFocusSessionAnalytics } from '@/queries';
import { IHabit } from '@/types';
import { FocusTimerProvider } from '@/context/FocusTimerContext';

export const FocusSessions = () => {
    const [selectedHabit, setSelectedHabit] = useState<IHabit | null>(null);
    const [plannedDuration, setPlannedDuration] = useState(25);

    const { data: habits = [] } = useHabitData('');
    const { data: activeSession } = useActiveFocusSession();
    const { data: analytics } = useFocusSessionAnalytics();

    const handleHabitChange = (habitId: string) => {
        const habit = habits.find(h => h.id === parseInt(habitId));
        setSelectedHabit(habit || null);
    };

    const durations = [
        { value: 15, label: '15 minutes' },
        { value: 25, label: '25 minutes (Pomodoro)' },
        { value: 30, label: '30 minutes' },
        { value: 45, label: '45 minutes' },
        { value: 60, label: '1 hour' },
        { value: 90, label: '1.5 hours' },
    ];

    return (
        <div className="container mx-auto py-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        Focus Sessions
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Build deep focus with timed work sessions
                    </p>
                </div>
            </div>

            {/* Analytics Cards */}
            {analytics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.totalSessions}</div>
                            <p className="text-xs text-muted-foreground">
                                {analytics.completedSessions} completed
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Focus Time</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {analytics ? `${Math.round(analytics.totalMinutes || 0)}m` : '0m'}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Avg {Math.round(analytics?.averageSessionMinutes || 0)}m per session
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {Math.round(analytics.completionRate)}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Sessions completed
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                            <Play className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.currentStreak ?? 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Best: {analytics.longestStreak ?? 0}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Active Session Management */}
            {activeSession && (
                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Play className="h-5 w-5 text-blue-600" />
                            Active Focus Session
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div>
                                    <p className="font-medium text-lg">{activeSession.habit?.name || 'Unknown Habit'}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            activeSession.status === 'active'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                : activeSession.status === 'paused'
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                        }`}>
                                            {activeSession.status.charAt(0).toUpperCase() + activeSession.status.slice(1)}
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {activeSession.plannedDurationMinutes} min planned
                                        </span>
                                    </div>
                                </div>

                                {/* Status Message for Better User Feedback */}
                                {activeSession.status === 'paused' && (
                                    <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                                        <p className="text-xs text-yellow-800 dark:text-yellow-300">
                                            🛈 Session is paused. You can resume it anytime or cancel if you're done.
                                        </p>
                                    </div>
                                )}

                                {activeSession.status === 'active' && (
                                    <div className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                                        <p className="text-xs text-green-800 dark:text-green-300">
                                            ✅ Session is running. Stay focused!
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <FocusTimerProvider>
                                    <FocusTimer
                                        habit={activeSession.habit}
                                        className="shadow-none border-0 bg-transparent"
                                    />
                                </FocusTimerProvider>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Timer Section - Only show when no active session */}
                {!activeSession && (
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Start a Focus Session</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Habit Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Select Habit</label>
                                    <Select
                                        value={selectedHabit?.id.toString() || ''}
                                        onValueChange={handleHabitChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a habit to focus on" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {habits.filter(h => h.isActive).map((habit) => (
                                                <SelectItem key={habit.id} value={habit.id.toString()}>
                                                    {habit.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Duration Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Session Duration</label>
                                    <Select
                                        value={plannedDuration.toString()}
                                        onValueChange={(value) => setPlannedDuration(parseInt(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {durations.map((duration) => (
                                                <SelectItem key={duration.value} value={duration.value.toString()}>
                                                    {duration.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Focus Timer */}
                        {selectedHabit && (
                            <FocusTimerProvider>
                                <FocusTimer habit={selectedHabit} />
                            </FocusTimerProvider>
                        )}
                    </div>
                )}

                {/* History Section */}
                <div className={activeSession ? "lg:col-span-2" : ""}>
                    <FocusSessionHistory
                        maxSessions={10}
                        showFilters={true}
                    />
                </div>
            </div>
        </div>
    );
};