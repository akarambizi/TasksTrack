import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    TrendingUp,
    Target,
    Clock,
    BarChart3,
    Activity,
    Trophy,
    Zap
} from 'lucide-react';
import { useActivityStatistics } from '@/queries/activity';
import { useHabitData } from '@/queries/habits';
import { useFocusSessions } from '@/queries/focusSessions';
import { goalCheckpoints, yearlySnapshots } from '@/mock-server/data/analytics/growthMetrics';

export const Statistics = () => {
    const { isLoading: statsLoading } = useActivityStatistics();
    const { data: habits = [], isLoading: habitsLoading } = useHabitData('');
    const { data: sessions = [], isLoading: sessionsLoading } = useFocusSessions();

    if (statsLoading || habitsLoading || sessionsLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
                    <p className="text-muted-foreground">Comprehensive insights into your productivity</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <div className="animate-pulse">
                                    <div className="h-4 w-16 bg-muted rounded mb-2"></div>
                                    <div className="h-8 w-24 bg-muted rounded mb-2"></div>
                                    <div className="h-3 w-20 bg-muted rounded"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    // Calculate some basic stats from the data
    const totalHabits = habits.length;
    const activeHabits = habits.filter(h => h.isActive).length;
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const totalSessionMinutes = sessions.reduce((acc, s) => acc + (s.actualDurationSeconds ? Math.round(s.actualDurationSeconds / 60) : 0), 0);

    // Calculate completion rates and streaks
    const completionRate = totalHabits > 0 ? Math.round((activeHabits / totalHabits) * 100) : 0;
    const averageSessionDuration = sessions.length > 0 ? Math.round(totalSessionMinutes / sessions.length) : 0;
    const latestYear = yearlySnapshots[yearlySnapshots.length - 1];
    const previousYear = yearlySnapshots[yearlySnapshots.length - 2];
    const yearlyDelta = latestYear && previousYear
        ? latestYear.goalCompletionRate - previousYear.goalCompletionRate
        : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="tt-panel relative overflow-hidden p-6 lg:p-8">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10" />
                <div className="absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-warning/10" />
                <div className="relative">
                <h1 className="text-3xl font-bold tracking-tight tt-section-title md:text-4xl">Statistics</h1>
                <p className="text-muted-foreground max-w-2xl mt-2">
                    Comprehensive insights into your productivity and habit formation
                </p>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Goal Completion (Year)</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-success">{latestYear?.goalCompletionRate ?? 0}%</div>
                        <p className="text-xs text-muted-foreground">
                            +{yearlyDelta}% vs previous year
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-success">{completionRate}%</div>
                        <Progress value={completionRate} className="mt-2" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Habits</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalHabits}</div>
                        <p className="text-xs text-muted-foreground">
                            {activeHabits} currently active
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Focus Sessions</CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{sessions.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {completedSessions} completed
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 size={20} />
                        Cadence KPI Checkpoints
                    </CardTitle>
                    <CardDescription>
                        Track target progress for daily to yearly habit outcomes
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    {goalCheckpoints.map((item) => {
                        const checkpointProgress = item.target > 0
                            ? Math.min(100, Math.round((item.actual / item.target) * 100))
                            : 0;
                        return (
                            <div key={item.id} className="rounded-xl border p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs uppercase tracking-wide text-muted-foreground">{item.cadence}</span>
                                    <Badge variant={checkpointProgress >= 100 ? 'default' : 'secondary'}>{checkpointProgress}%</Badge>
                                </div>
                                <p className="font-medium leading-tight">{item.label}</p>
                                <Progress value={checkpointProgress} className="h-2" />
                                <p className="text-xs text-muted-foreground">{item.actual} / {item.target} {item.unit}</p>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity size={20} />
                        Table Dashboard View
                    </CardTitle>
                    <CardDescription>
                        Structured tables for fast year-over-year and cadence-level comparisons.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold">Yearly KPI Table</h3>
                        <div className="overflow-x-auto rounded-xl border bg-card">
                            <Table>
                                <TableHeader className="bg-muted/50 text-left">
                                    <TableRow>
                                        <TableHead>Year</TableHead>
                                        <TableHead>Goal Completion</TableHead>
                                        <TableHead>Consistency</TableHead>
                                        <TableHead>Focus Minutes</TableHead>
                                        <TableHead>Completed Goals</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {yearlySnapshots.map((snapshot, index) => (
                                        <TableRow key={snapshot.year}>
                                            <TableCell className="font-medium">{snapshot.year}</TableCell>
                                            <TableCell>{snapshot.goalCompletionRate}%</TableCell>
                                            <TableCell>{snapshot.consistencyRate}%</TableCell>
                                            <TableCell>{snapshot.focusMinutes.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span>{snapshot.completedGoals}</span>
                                                    {index === yearlySnapshots.length - 1 && (
                                                        <Badge variant="default" className="text-[10px] px-1.5 py-0">Current</Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold">Cadence Target Table</h3>
                        <div className="overflow-x-auto rounded-xl border bg-card">
                            <Table>
                                <TableHeader className="bg-muted/50 text-left">
                                    <TableRow>
                                        <TableHead>Cadence</TableHead>
                                        <TableHead>Label</TableHead>
                                        <TableHead>Actual</TableHead>
                                        <TableHead>Target</TableHead>
                                        <TableHead>Progress</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {goalCheckpoints.map((checkpoint) => {
                                        const progress = checkpoint.target > 0
                                            ? Math.min(100, Math.round((checkpoint.actual / checkpoint.target) * 100))
                                            : 0;

                                        return (
                                            <TableRow key={checkpoint.id}>
                                                <TableCell className="capitalize">{checkpoint.cadence}</TableCell>
                                                <TableCell>{checkpoint.label}</TableCell>
                                                <TableCell>{checkpoint.actual} {checkpoint.unit}</TableCell>
                                                <TableCell>{checkpoint.target} {checkpoint.unit}</TableCell>
                                                <TableCell>{progress}%</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Statistics */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Habit Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 size={20} />
                            Habit Performance
                        </CardTitle>
                        <CardDescription>
                            Overview of your habit completion rates
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {habits.slice(0, 5).map((habit) => (
                            <div key={habit.id} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{habit.name}</span>
                                    <Badge variant={habit.isActive ? "default" : "secondary"}>
                                        {habit.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Progress value={75} className="flex-1" /> {/* Placeholder percentage */}
                                    <span className="text-xs text-muted-foreground">75%</span>
                                </div>
                            </div>
                        ))}

                        {habits.length === 0 && (
                            <div className="text-center py-4">
                                <p className="text-muted-foreground">No habits to display</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Focus Session Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity size={20} />
                            Focus Session Insights
                        </CardTitle>
                        <CardDescription>
                            Your focus and productivity patterns
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Total Time</p>
                                <p className="text-2xl font-bold">{Math.round(totalSessionMinutes)}min</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Avg. Session</p>
                                <p className="text-2xl font-bold">{averageSessionDuration}min</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Completed</p>
                                <p className="text-2xl font-bold text-success">{completedSessions}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Success Rate</p>
                                <p className="text-2xl font-bold text-success">
                                    {sessions.length > 0 ? Math.round((completedSessions / sessions.length) * 100) : 0}%
                                </p>
                            </div>
                        </div>

                        {sessions.length === 0 && (
                            <div className="text-center py-8">
                                <Clock className="mx-auto h-8 w-8 text-muted-foreground/50" />
                                <p className="text-muted-foreground mt-2">No sessions recorded yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Weekly/Monthly Trends */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp size={20} />
                        Activity Trends
                    </CardTitle>
                    <CardDescription>
                        Your productivity patterns over time
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">This Week</span>
                                <Badge variant="outline" className="text-success">+12%</Badge>
                            </div>
                            <Progress value={85} className="h-2" />
                            <p className="text-xs text-muted-foreground">85% completion rate</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">This Month</span>
                                <Badge variant="outline" className="text-primary">+8%</Badge>
                            </div>
                            <Progress value={78} className="h-2" />
                            <p className="text-xs text-muted-foreground">78% completion rate</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">All Time</span>
                                <Badge variant="outline">Steady</Badge>
                            </div>
                            <Progress value={72} className="h-2" />
                            <p className="text-xs text-muted-foreground">72% completion rate</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};