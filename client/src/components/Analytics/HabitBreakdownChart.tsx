import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { IHabitAnalytics } from '@/api/analytics.types';
import { ChartCard } from '@/components/ui/common/chart-card';

interface IHabitBreakdownChartProps {
    data: IHabitAnalytics[];
    isLoading?: boolean;
    error?: string | null;
    title?: string;
    description?: string;
    className?: string;
}

interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        payload: IHabitAnalytics;
    }>;
}

export const HabitBreakdownChart: React.FC<IHabitBreakdownChartProps> = ({
    data,
    isLoading = false,
    error = null,
    title = 'Habit Breakdown',
    description = 'Time spent on each habit',
    className = ''
}) => {
    // Sort by total minutes and take top 10
    const chartData = data
        .sort((a, b) => b.totalMinutes - a.totalMinutes)
        .slice(0, 10)
        .map(habit => ({
            ...habit,
            name: habit.name.length > 15 ? `${habit.name.substring(0, 15)}...` : habit.name,
            fullName: habit.name
        }));

    const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length > 0) {
            const data = payload[0].payload;
            return (
                <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                    <p className="font-medium text-sm mb-2">{data.name}</p>
                    <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Total Minutes:</span>
                            <span className="font-medium">{Math.round(data.totalMinutes)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Sessions:</span>
                            <span className="font-medium">{data.sessionCount}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Avg. Duration:</span>
                            <span className="font-medium">{Math.round(data.averageSessionDuration)}min</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Current Streak:</span>
                            <span className="font-medium">{data.currentStreak} days</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Category:</span>
                            <span className="font-medium">{data.category}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <ChartCard
            title={title}
            description={description}
            isLoading={isLoading}
            error={error}
            className={className}
        >
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        label={{ 
                            value: 'Minutes', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle' }
                        }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                        dataKey="totalMinutes"
                        fill="hsl(var(--primary))"
                        radius={[2, 2, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};