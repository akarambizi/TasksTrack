import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';
import { ICategoryAnalytics } from '@/api/analytics.types';
import { ChartCard } from '@/components/ui/common/chart-card';

interface ICategoryBreakdownChartProps {
    data: ICategoryAnalytics[];
    isLoading?: boolean;
    error?: string | null;
    title?: string;
    description?: string;
    className?: string;
}

interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        payload: ICategoryAnalytics & { percentage: number };
    }>;
}

// Colors for different categories
const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff7300',
    '#00ff7f',
    '#ff1493',
    '#00bfff',
    '#ff6347'
];

export const CategoryBreakdownChart: React.FC<ICategoryBreakdownChartProps> = ({
    data,
    isLoading = false,
    error = null,
    title = 'Category Breakdown',
    description = 'Time distribution by category',
    className = ''
}) => {
    const totalMinutes = data.reduce((sum, item) => sum + item.totalMinutes, 0);
    
    const chartData = data.map((item, index) => ({
        ...item,
        percentage: totalMinutes > 0 ? Math.round((item.totalMinutes / totalMinutes) * 100) : 0,
        color: COLORS[index % COLORS.length]
    }));

    const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length > 0) {
            const data = payload[0].payload;
            return (
                <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                    <p className="font-medium text-sm mb-2">{data.category}</p>
                    <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Total Minutes:</span>
                            <span className="font-medium">{Math.round(data.totalMinutes)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Percentage:</span>
                            <span className="font-medium">{data.percentage}%</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Habits:</span>
                            <span className="font-medium">{data.habitCount}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Sessions:</span>
                            <span className="font-medium">{data.sessionCount}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Avg. Duration:</span>
                            <span className="font-medium">{Math.round(data.averageSessionDuration)}min</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    interface LegendProps {
        payload?: Array<{
            value: string;
            color: string;
        }>;
    }

    const CustomLegend: React.FC<LegendProps> = ({ payload }) => {
        if (!payload) return null;
        
        return (
            <div className="flex flex-wrap gap-3 justify-center mt-4">
                {payload.map((entry, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-muted-foreground">
                            {entry.value} ({chartData.find(d => d.category === entry.value)?.percentage}%)
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    if (data.length === 0) {
        return (
            <ChartCard
                title={title}
                description={description}
                isLoading={isLoading}
                error={error || 'No category data available'}
                className={className}
            >
                <div></div>
            </ChartCard>
        );
    }

    return (
        <ChartCard
            title={title}
            description={description}
            isLoading={isLoading}
            error={error}
            className={className}
        >
            <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="45%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="totalMinutes"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={<CustomLegend />} />
                </PieChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};