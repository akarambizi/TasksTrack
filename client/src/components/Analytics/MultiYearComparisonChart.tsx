import { useMemo } from 'react';
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { IYearSnapshot } from '@/types';
import { TrendingUp } from 'lucide-react';
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from 'recharts';

export type TYearMetric = 'goalCompletionRate' | 'consistencyRate' | 'focusMinutes' | 'completedGoals';

interface IMultiYearComparisonChartProps {
    snapshots: IYearSnapshot[];
    selectedMetric: TYearMetric;
    onMetricChange: (metric: TYearMetric) => void;
    title?: string;
    description?: string;
}

const metricLabels: Record<TYearMetric, string> = {
    goalCompletionRate: 'Goal Completion Rate',
    consistencyRate: 'Consistency Rate',
    focusMinutes: 'Focus Minutes',
    completedGoals: 'Completed Goals'
};

const metricUnits: Record<TYearMetric, string> = {
    goalCompletionRate: '%',
    consistencyRate: '%',
    focusMinutes: 'min',
    completedGoals: 'goals'
};

const chartConfig = {
    value: {
        label: 'Value',
        color: 'hsl(var(--primary))'
    }
} satisfies ChartConfig;

export const MultiYearComparisonChart = ({
    snapshots,
    selectedMetric,
    onMetricChange,
    title = 'Multi-Year Comparison',
    description = 'Visual trajectory across years using mock analytics data.'
}: IMultiYearComparisonChartProps) => {
    const chartData = useMemo(
        () => snapshots.map((snapshot) => ({
            year: String(snapshot.year),
            value: snapshot[selectedMetric],
            labelValue: snapshot[selectedMetric].toLocaleString()
        })),
        [selectedMetric, snapshots]
    );

    const latest = snapshots[snapshots.length - 1];
    const previous = snapshots[snapshots.length - 2];
    const delta = latest && previous ? latest[selectedMetric] - previous[selectedMetric] : 0;

    const formatValue = (value: number) => `${value.toLocaleString()}${metricUnits[selectedMetric]}`;

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp size={18} />
                            {title}
                        </CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>

                    <div className="flex items-center gap-3">
                        <Select
                            value={selectedMetric}
                            onValueChange={(value) => onMetricChange(value as TYearMetric)}
                        >
                            <SelectTrigger className="w-[220px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="goalCompletionRate">Goal Completion Rate</SelectItem>
                                <SelectItem value="consistencyRate">Consistency Rate</SelectItem>
                                <SelectItem value="focusMinutes">Focus Minutes</SelectItem>
                                <SelectItem value="completedGoals">Completed Goals</SelectItem>
                            </SelectContent>
                        </Select>
                        <Badge variant={delta >= 0 ? 'default' : 'secondary'}>
                            {delta >= 0 ? '+' : ''}{delta.toLocaleString()} {metricUnits[selectedMetric]}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig} className="h-[320px] w-full">
                    <LineChart data={chartData} margin={{ left: 12, right: 12, top: 26, bottom: 8 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="year"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={12}
                        />
                        <YAxis hide domain={[0, 'auto']} />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    indicator="line"
                                    formatter={(value) => formatValue(Number(value ?? 0))}
                                    labelFormatter={(label) => `Year ${label}`}
                                />
                            }
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="var(--color-value)"
                            strokeWidth={3}
                            dot={{ r: 5, fill: 'var(--color-value)' }}
                            activeDot={{ r: 7 }}
                        >
                            <LabelList
                                dataKey="labelValue"
                                position="top"
                                offset={8}
                                fill="hsl(var(--foreground))"
                                fontSize={12}
                            />
                        </Line>
                    </LineChart>
                </ChartContainer>

                <p className="mt-4 text-xs text-muted-foreground">
                    Metric: {metricLabels[selectedMetric]} | Latest: {latest?.[selectedMetric].toLocaleString() ?? 0}{metricUnits[selectedMetric]}
                </p>
            </CardContent>
        </Card>
    );
};
