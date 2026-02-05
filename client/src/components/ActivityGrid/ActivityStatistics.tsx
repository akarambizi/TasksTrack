import React from 'react';
import { useActivityStatistics } from '../../queries/activity';
import { LoadingSkeleton } from '../ui/common/loading-skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { StatsCard } from '../ui/common/stats-card';

interface IActivityStatisticsProps {
    className?: string;
    showCard?: boolean;
    title?: string;
    description?: string;
}

const StatItem: React.FC<{
    label: string;
    value: string | number;
    description?: string;
    className?: string;
}> = ({ label, value, description, className }) => (
    <div className={className}>
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
        <dd className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</dd>
        {description && (
            <dd className="text-xs text-gray-500 dark:text-gray-400">{description}</dd>
        )}
    </div>
);

export const ActivityStatistics: React.FC<IActivityStatisticsProps> = ({
    className,
    showCard = true,
    title = "Activity Statistics",
    description = "Overall performance and insights"
}) => {
    const { data: statistics, isLoading, error } = useActivityStatistics();

    const formatNumber = (value: number | undefined): string => {
        if (value === undefined || value === null || isNaN(value)) {
            return '0';
        }
        return value.toLocaleString();
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <LoadingSkeleton className="h-4 w-20" />
                                <LoadingSkeleton className="h-8 w-16" />
                            </div>
                        ))}
                    </div>
                    <div className="space-y-4">
                        <LoadingSkeleton className="h-6 w-40" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <LoadingSkeleton key={i} className="h-20 w-full" />
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        if (error || !statistics) {
            return (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>Failed to load activity statistics</p>
                    <p className="text-sm mt-1">Please try again later</p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {/* Key Metrics */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Overview</h3>
                    <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatItem
                            label="Total Activities"
                            value={formatNumber(statistics.totalActivities)}
                        />
                        <StatItem
                            label="Active Days"
                            value={formatNumber(statistics.totalActiveDays)}
                            description={`out of ${formatNumber(statistics.totalDaysTracked)} days`}
                        />
                        <StatItem
                            label="Current Streak"
                            value={`${statistics.currentOverallStreak} days`}
                        />
                        <StatItem
                            label="Longest Streak"
                            value={`${statistics.longestOverallStreak} days`}
                        />
                    </dl>
                </div>

                {/* More Stats */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Details</h3>
                    <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatItem
                            label="Completion Rate"
                            value={`${Math.round(statistics.completionRate)}%`}
                        />
                        <StatItem
                            label="Active Habits"
                            value={`${statistics.activeHabits}/${statistics.totalHabits}`}
                        />
                        <StatItem
                            label="Average Value"
                            value={statistics.averageValue.toFixed(1)}
                        />
                        <StatItem
                            label="Most Active Day"
                            value={statistics.mostActiveDayName || 'N/A'}
                        />
                    </dl>
                </div>

                {/* Best Performing Habit */}
                {statistics.bestPerformingHabit && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Best Performing Habit</h3>
                        <StatsCard
                            title={statistics.bestPerformingHabit.habitName}
                            value={`${Math.round(statistics.bestPerformingHabit.completionRate * 100)}%`}
                            subtitle={`${formatNumber(statistics.bestPerformingHabit.activityCount)} activities • ${statistics.bestPerformingHabit.totalValue} total value`}
                            className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        />
                    </div>
                )}

                {/* Recent Weekly Stats */}
                {statistics.weeklyStats.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Recent Weekly Activity</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {statistics.weeklyStats.slice(-6).map((week, index) => (
                                <StatsCard
                                    key={index}
                                    title={`Week of ${new Date(week.weekStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                                    value={week.activityCount}
                                    subtitle={`${week.activeDays} active days • ${week.totalValue} total value`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Monthly Stats */}
                {statistics.monthlyStats.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Monthly Progress</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {statistics.monthlyStats.slice(-12).map((month, index) => (
                                <StatsCard
                                    key={index}
                                    title={`${month.monthName} ${month.year}`}
                                    value={month.activityCount}
                                    subtitle={`${month.activeDays} active days • ${month.totalValue} total value`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty state when no data */}
                {statistics.totalActivities === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <p>No habits completed yet. Start building your routine!</p>
                    </div>
                )}
            </div>
        );
    };

    if (!showCard) {
        return <div className={className}>{renderContent()}</div>;
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                {description && (
                    <CardDescription>{description}</CardDescription>
                )}
            </CardHeader>
            <CardContent>
                {renderContent()}
            </CardContent>
        </Card>
    );
};