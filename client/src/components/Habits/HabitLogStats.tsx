import { useHabitLogsByHabitAndDateRange } from '@/queries';
import { IHabit } from '@/api';

import { TrendingUp, Target, Calendar, Award } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns';
import { StatsCard } from '@/components/ui';

interface IHabitLogStatsProps {
    habit: IHabit;
}

export const HabitLogStats: React.FC<IHabitLogStatsProps> = ({ habit }) => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Sunday

    // Get today's logs for this specific habit
    const { data: todayLogs } = useHabitLogsByHabitAndDateRange(
        habit.id,
        format(startOfDay(today), 'yyyy-MM-dd'),
        format(endOfDay(today), 'yyyy-MM-dd')
    );

    // Get this week's logs for this specific habit
    const { data: weekLogs } = useHabitLogsByHabitAndDateRange(
        habit.id,
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
            <StatsCard
                title="Today"
                value={`${todayTotal} ${displayUnit}`}
                icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                subtitle={habit.target ? `${todayProgress}% of target${todayTargetMet ? ' ✓' : ''}` : undefined}
            />

            {/* Week Total */}
            <StatsCard
                title="This Week"
                value={`${weekTotal} ${displayUnit}`}
                icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
                subtitle={`Avg: ${weekAverage} ${displayUnit}/day`}
            />

            {/* Weekly Target Progress */}
            {habit.target && habit.targetFrequency === 'weekly' && (
                <StatsCard
                    title="Weekly Target"
                    value={`${Math.round((weekTotal / habit.target) * 100)}%`}
                    icon={<Target className="h-4 w-4 text-muted-foreground" />}
                    subtitle={`${weekTotal} of ${habit.target} ${displayUnit}`}
                />
            )}

            {/* Active Days This Week */}
            <StatsCard
                title="Active Days"
                value={`${daysWithActivity}/7`}
                icon={<Award className="h-4 w-4 text-muted-foreground" />}
                subtitle="Days this week"
            />
        </div>
    );
};