import { useHabitLogsByDateRange } from '@/queries';
import { IHabit } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns';

interface IHabitLogStatsProps {
    habit: IHabit;
}

export const HabitLogStats: React.FC<IHabitLogStatsProps> = ({ habit }) => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Sunday

    // Get today's logs
    const { data: todayLogs } = useHabitLogsByDateRange(
        format(startOfDay(today), 'yyyy-MM-dd'),
        format(endOfDay(today), 'yyyy-MM-dd')
    );

    // Get this week's logs
    const { data: weekLogs } = useHabitLogsByDateRange(
        format(weekStart, 'yyyy-MM-dd'),
        format(weekEnd, 'yyyy-MM-dd')
    );

    const displayUnit = habit.unit || habit.metricType || 'units';

    // Calculate today's total
    const todayTotal = todayLogs?.reduce((sum, log) => sum + log.value, 0) || 0;
    const todayTargetMet = habit.target ? todayTotal >= habit.target : false;
    const todayProgress = habit.target ? Math.round((todayTotal / habit.target) * 100) : 0;

    // Calculate week's total and average
    const weekTotal = weekLogs?.reduce((sum, log) => sum + log.value, 0) || 0;
    const weekDays = weekLogs?.length || 0;
    const weekAverage = weekDays > 0 ? Math.round(weekTotal / weekDays * 100) / 100 : 0;

    // Calculate streak (days this week with logs)
    const daysWithActivity = new Set(weekLogs?.map(log => format(new Date(log.date), 'yyyy-MM-dd')) || []).size;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Today's Progress */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Today</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {todayTotal} {displayUnit}
                    </div>
                    {habit.target && (
                        <div className="flex items-center gap-2 mt-2">
                            <Badge
                                variant={todayTargetMet ? "default" : "secondary"}
                                className={todayTargetMet ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""}
                            >
                                {todayProgress}% of target
                            </Badge>
                            {todayTargetMet && <span className="text-sm text-green-600">✓</span>}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Week Total */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">This Week</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {weekTotal} {displayUnit}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Avg: {weekAverage} {displayUnit}/day
                    </p>
                </CardContent>
            </Card>

            {/* Weekly Target Progress */}
            {habit.target && habit.targetFrequency === 'weekly' && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Weekly Target</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Math.round((weekTotal / habit.target) * 100)}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {weekTotal} of {habit.target} {displayUnit}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Active Days This Week */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Days</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {daysWithActivity}/7
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Days this week
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};