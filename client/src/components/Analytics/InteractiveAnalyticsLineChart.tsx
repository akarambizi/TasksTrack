import { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IDailyProgress } from '@/types';

type TMetric = 'totalMinutes' | 'sessionCount' | 'completionRate';

interface IInteractiveAnalyticsLineChartProps {
    data: IDailyProgress[];
}

const chartConfig = {
    totalMinutes: {
        label: 'Minutes',
        color: 'hsl(var(--primary))'
    },
    sessionCount: {
        label: 'Sessions',
        color: 'hsl(var(--success))'
    },
    completionRate: {
        label: 'Completion %',
        color: 'hsl(var(--warning))'
    }
} satisfies ChartConfig;

export const InteractiveAnalyticsLineChart = ({ data }: IInteractiveAnalyticsLineChartProps) => {
    const [metric, setMetric] = useState<TMetric>('totalMinutes');

    const chartData = useMemo(
        () => data.map((item) => ({
            ...item,
            formattedDate: format(parseISO(item.date), 'MMM dd')
        })),
        [data]
    );

    return (
        <Card>
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <CardTitle>Interactive Trend Line</CardTitle>
                    <CardDescription>Shadcn chart + Recharts line for quick metric switching.</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={metric === 'totalMinutes' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMetric('totalMinutes')}
                    >
                        Minutes
                    </Button>
                    <Button
                        variant={metric === 'sessionCount' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMetric('sessionCount')}
                    >
                        Sessions
                    </Button>
                    <Button
                        variant={metric === 'completionRate' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMetric('completionRate')}
                    >
                        Completion
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <LineChart data={chartData} margin={{ left: 12, right: 12, top: 8, bottom: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="formattedDate"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Line
                            type="monotone"
                            dataKey={metric}
                            stroke={`var(--color-${metric})`}
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};
