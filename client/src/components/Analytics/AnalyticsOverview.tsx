import React, { useState, useMemo } from 'react';
import { format, subWeeks, startOfWeek, endOfWeek } from 'date-fns';
import {
    Clock,
    Target,
    TrendingUp,
    Calendar,
    Zap,
    Trophy,
    Activity
} from 'lucide-react';

import {
    AnalyticsCard,
    PeriodSelector,
    TPeriodType
} from '@/components/ui';

import {
    DailyProgressChart,
    HabitBreakdownChart,
    CategoryBreakdownChart
} from '@/components/Analytics';

import {
    useWeeklyAnalytics,
    useMonthlyAnalytics,
    useQuarterlyAnalytics,
    useYearlyAnalytics
} from '@/queries';

export const AnalyticsOverview: React.FC = () => {
    const [period, setPeriod] = useState<TPeriodType>('weekly');
    const [offset, setOffset] = useState(0);

    // Query hooks based on selected period
    const weeklyQuery = useWeeklyAnalytics(offset, { enabled: period === 'weekly' });
    const monthlyQuery = useMonthlyAnalytics(offset, { enabled: period === 'monthly' });
    const quarterlyQuery = useQuarterlyAnalytics(offset, { enabled: period === 'quarterly' });
    const yearlyQuery = useYearlyAnalytics(offset, { enabled: period === 'yearly' });

    // Get current query data
    const currentQuery = useMemo(() => {
        switch (period) {
            case 'weekly':
                return weeklyQuery;
            case 'monthly':
                return monthlyQuery;
            case 'quarterly':
                return quarterlyQuery;
            case 'yearly':
                return yearlyQuery;
            default:
                return weeklyQuery;
        }
    }, [period, weeklyQuery, monthlyQuery, quarterlyQuery, yearlyQuery]);

    const { data, isLoading, isError, error } = currentQuery;

    // Calculate period dates for display
    const periodDates = useMemo(() => {
        const now = new Date();
        let start: Date, end: Date;

        switch (period) {
            case 'weekly': {
                const weekStart = startOfWeek(subWeeks(now, -offset));
                const weekEnd = endOfWeek(subWeeks(now, -offset));
                start = weekStart;
                end = weekEnd;
                break;
            }
            case 'monthly': {
                start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
                end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
                break;
            }
            case 'quarterly': {
                const quarterMonth = Math.floor(now.getMonth() / 3) * 3 + (offset * 3);
                start = new Date(now.getFullYear(), quarterMonth, 1);
                end = new Date(now.getFullYear(), quarterMonth + 3, 0);
                break;
            }
            case 'yearly': {
                start = new Date(now.getFullYear() + offset, 0, 1);
                end = new Date(now.getFullYear() + offset, 11, 31);
                break;
            }
            default: {
                start = startOfWeek(now);
                end = endOfWeek(now);
            }
        }

        return {
            start: format(start, 'MMM dd, yyyy'),
            end: format(end, 'MMM dd, yyyy')
        };
    }, [period, offset]);

    if (isError) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Failed to load analytics data</p>
                    <p className="text-sm text-red-500 mt-2">{error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                    <p className="text-muted-foreground mt-2">
                        {periodDates.start} - {periodDates.end}
                    </p>
                </div>

                <PeriodSelector
                    period={period}
                    offset={offset}
                    onPeriodChange={setPeriod}
                    onOffsetChange={setOffset}
                />
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <AnalyticsCard
                    title="Total Minutes"
                    value={isLoading ? '...' : Math.round(data?.totalMinutes || 0)}
                    subtitle={`Across ${data?.totalSessions || 0} sessions`}
                    icon={Clock}
                />

                <AnalyticsCard
                    title="Active Habits"
                    value={isLoading ? '...' : data?.totalHabitsTracked || 0}
                    subtitle={`${Math.round(data?.activityRate || 0)}% activity rate`}
                    icon={Target}
                />

                <AnalyticsCard
                    title="Current Streak"
                    value={isLoading ? '...' : `${data?.currentStreak || 0} days`}
                    subtitle={`Longest: ${data?.longestStreak || 0} days`}
                    icon={TrendingUp}
                />

                <AnalyticsCard
                    title="Active Days"
                    value={isLoading ? '...' : `${data?.activeDays || 0}/${data?.totalDays || 0}`}
                    subtitle={`${Math.round(((data?.activeDays || 0) / (data?.totalDays || 1)) * 100)}% of period`}
                    icon={Calendar}
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Progress Chart */}
                <div className="lg:col-span-2">
                    <DailyProgressChart
                        data={data?.dailyProgress || []}
                        isLoading={isLoading}
                        error={isError && error ? (error as any).message : null}
                        title={`Daily Progress - ${period.charAt(0).toUpperCase() + period.slice(1)}`}
                        description="Your daily activity and progress over time"
                    />
                </div>

                {/* Habit Breakdown Chart */}
                <HabitBreakdownChart
                    data={data?.habitBreakdown || []}
                    isLoading={isLoading}
                    error={isError && error ? (error as any).message : null}
                    title="Habit Performance"
                    description="Time spent on each habit"
                />

                {/* Category Breakdown Chart */}
                <CategoryBreakdownChart
                    data={data?.categoryBreakdown || []}
                    isLoading={isLoading}
                    error={isError && error ? (error as any).message : null}
                    title="Category Distribution"
                    description="Time allocation by category"
                />
            </div>

            {/* Goal Progress Section */}
            {data?.goalProgress && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <AnalyticsCard
                        title="Progress to Goal"
                        value={`${Math.round(data.goalProgress.progressPercentage)}%`}
                        subtitle={`${Math.round(data.goalProgress.actualMinutes)} / ${Math.round(data.goalProgress.targetMinutesPerPeriod)} min`}
                        icon={Trophy}
                        className={data.goalProgress.onTrack ? 'border-green-200' : 'border-yellow-200'}
                    />

                    <AnalyticsCard
                        title="Sessions Goal"
                        value={`${data.goalProgress.actualSessions} / ${data.goalProgress.targetSessionsPerPeriod}`}
                        subtitle={data.goalProgress.targetSessionsPerPeriod > 0 
                            ? `${Math.round((data.goalProgress.actualSessions / data.goalProgress.targetSessionsPerPeriod) * 100)}% complete`
                            : 'No target set'
                        }
                        icon={Activity}
                    />

                    <AnalyticsCard
                        title="Daily Target"
                        value={`${Math.round(data.goalProgress.requiredDailyAverage)} min`}
                        subtitle={`${data.goalProgress.daysRemaining} days remaining`}
                        icon={Zap}
                        className={data.goalProgress.onTrack ? 'border-green-200' : 'border-red-200'}
                    />
                </div>
            )}
        </div>
    );
};