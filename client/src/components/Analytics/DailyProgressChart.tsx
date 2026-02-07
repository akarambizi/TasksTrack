import React from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
    Line
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { IDailyProgress } from '@/types';
import { ChartCard } from '@/components/ui/common/chart-card';

interface IDailyProgressChartProps {
    data: IDailyProgress[];
    isLoading?: boolean;
    error?: string | null;
    title?: string;
    description?: string;
    className?: string;
}

interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        payload: IDailyProgress & { formattedDate: string; completionRate: number };
    }>;
}

export const DailyProgressChart: React.FC<IDailyProgressChartProps> = ({
    data,
    isLoading = false,
    error = null,
    title = 'Daily Progress',
    description = 'Your activity over time',
    className = ''
}) => {
    const chartData = data.map(item => ({
        ...item,
        formattedDate: format(parseISO(item.date), 'MMM dd'),
        completionRate: Math.round(item.activityIntensity)
    }));

    const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length > 0) {
            const data = payload[0].payload;
            return (
                <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                    <p className="font-medium text-sm mb-2">{format(parseISO(data.date), 'EEEE, MMM dd')}</p>
                    <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Minutes:</span>
                            <span className="font-medium">{data.totalMinutes}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Sessions:</span>
                            <span className="font-medium">{data.sessionCount}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Habits:</span>
                            <span className="font-medium">{data.habitsCompleted}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Achievement:</span>
                            <span className="font-medium">{data.completionRate}%</span>
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
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="minutesGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                        dataKey="formattedDate"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="totalMinutes"
                        stroke="hsl(var(--primary))"
                        fillOpacity={1}
                        fill="url(#minutesGradient)"
                        strokeWidth={2}
                    />
                    <Line
                        type="monotone"
                        dataKey="sessionCount"
                        stroke="hsl(var(--secondary))"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};