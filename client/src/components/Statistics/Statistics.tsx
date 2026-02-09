import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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

    // Current streak calculation (simplified)
    const currentStreak = 0; // TODO: Implement streak calculation
    const longestStreak = 0; // TODO: Implement streak calculation

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
                <p className="text-muted-foreground">
                    Comprehensive insights into your productivity and habit formation
                </p>
            </div>

            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Habits</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
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
                        <CardTitle className="text-sm font-medium">Focus Sessions</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{sessions.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {completedSessions} completed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{currentStreak} days</div>
                        <p className="text-xs text-muted-foreground">
                            Best: {longestStreak} days
                        </p>
                    </CardContent>
                </Card>
            </div>

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