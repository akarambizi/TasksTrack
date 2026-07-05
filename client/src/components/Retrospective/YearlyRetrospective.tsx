import { useMemo, useState } from 'react';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MultiYearComparisonChart, TYearMetric } from '@/components/Analytics/MultiYearComparisonChart';
import { growthRecommendations, yearlyMilestones, yearlyMonthHighlights, yearlySnapshots } from '@/mock-server/data/analytics/growthMetrics';
import { CalendarClock, Goal } from 'lucide-react';
import { Link } from 'react-router-dom';

export const YearlyRetrospective = () => {
    const [selectedMetric, setSelectedMetric] = useState<TYearMetric>('goalCompletionRate');
    const [selectedYear, setSelectedYear] = useState<string>(String(yearlySnapshots[yearlySnapshots.length - 1]?.year ?? '2026'));
    const [selectedHabitFilter, setSelectedHabitFilter] = useState('All habits');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All categories');

    const selectedSnapshot = useMemo(
        () => yearlySnapshots.find((snapshot) => String(snapshot.year) === selectedYear),
        [selectedYear]
    );

    const selectedHighlights = useMemo(
        () => yearlyMonthHighlights.find((highlight) => highlight.year === Number(selectedYear)),
        [selectedYear]
    );

    return (
        <div className="space-y-6" data-testid="yearly-retrospective-page">
            <div className="tt-panel relative overflow-hidden p-6 lg:p-8">
                <div className="absolute right-0 top-0 h-40 w-40 -translate-y-8 translate-x-6 rounded-full bg-primary/10" />
                <div className="absolute left-0 bottom-0 h-36 w-36 -translate-x-8 translate-y-8 rounded-full bg-warning/10" />
                <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight tt-section-title md:text-4xl">Yearly Retrospective</h1>
                    <p className="text-muted-foreground max-w-2xl">
                        Dedicated annual reflection view focused on completion rate, consistency, execution quality, and what to tune next.
                    </p>
                </div>

                <div className="w-full md:w-[220px]">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                            {yearlySnapshots.map((snapshot) => (
                                <SelectItem key={snapshot.year} value={String(snapshot.year)}>
                                    {snapshot.year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Trend Filters</CardTitle>
                    <CardDescription>UI-only controls for slicing the retrospective by year, habit, and category.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-3">
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Year</p>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                                {yearlySnapshots.map((snapshot) => (
                                    <SelectItem key={snapshot.year} value={String(snapshot.year)}>
                                        {snapshot.year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">Habit</p>
                        <Select value={selectedHabitFilter} onValueChange={setSelectedHabitFilter}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All habits">All habits</SelectItem>
                                <SelectItem value="Deep Work">Deep Work</SelectItem>
                                <SelectItem value="Reading">Reading</SelectItem>
                                <SelectItem value="Training">Training</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">Category</p>
                        <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All categories">All categories</SelectItem>
                                <SelectItem value="Work">Work</SelectItem>
                                <SelectItem value="Learning">Learning</SelectItem>
                                <SelectItem value="Health">Health</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Goal Completion</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{selectedSnapshot?.goalCompletionRate ?? 0}%</p>
                        <p className="text-xs text-muted-foreground">Primary KPI</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Consistency Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{selectedSnapshot?.consistencyRate ?? 0}%</p>
                        <p className="text-xs text-muted-foreground">Cadence discipline</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Focus Minutes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{selectedSnapshot?.focusMinutes.toLocaleString() ?? 0}</p>
                        <p className="text-xs text-muted-foreground">Deep work volume</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Completed Goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{selectedSnapshot?.completedGoals ?? 0}</p>
                        <p className="text-xs text-muted-foreground">Execution output</p>
                    </CardContent>
                </Card>
            </div>

            {selectedHighlights && (
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <Badge variant="default">Best month</Badge>
                                Peak performance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <p className="text-2xl font-bold">{selectedHighlights.bestMonth}</p>
                            <p className="text-sm text-muted-foreground">{selectedHighlights.bestMonthRate}% completion in {selectedSnapshot?.year ?? selectedYear}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <Badge variant="secondary">Worst month</Badge>
                                Recovery window
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <p className="text-2xl font-bold">{selectedHighlights.worstMonth}</p>
                            <p className="text-sm text-muted-foreground">{selectedHighlights.worstMonthRate}% completion, with the biggest opportunity for improvement.</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            <MultiYearComparisonChart
                snapshots={yearlySnapshots}
                selectedMetric={selectedMetric}
                onMetricChange={setSelectedMetric}
                title="Multi-Year KPI Comparison"
                description="UI-only trend visualization for strategic retrospective reviews."
            />

            <Card>
                <CardHeader>
                    <CardTitle>Retrospective Tables</CardTitle>
                    <CardDescription>
                        Tabular breakdown for year, milestone, and execution-level analysis.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold">Annual Performance Table</h3>
                        <div className="overflow-x-auto rounded-xl border bg-card">
                            <Table>
                                <TableHeader className="bg-muted/50 text-left">
                                    <TableRow>
                                        <TableHead>Year</TableHead>
                                        <TableHead>Goal Completion</TableHead>
                                        <TableHead>Consistency</TableHead>
                                        <TableHead>Focus Minutes</TableHead>
                                        <TableHead>Completed Goals</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {yearlySnapshots.map((snapshot) => (
                                        <TableRow key={snapshot.year}>
                                            <TableCell className="font-medium">{snapshot.year}</TableCell>
                                            <TableCell>{snapshot.goalCompletionRate}%</TableCell>
                                            <TableCell>{snapshot.consistencyRate}%</TableCell>
                                            <TableCell>{snapshot.focusMinutes.toLocaleString()}</TableCell>
                                            <TableCell>{snapshot.completedGoals}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold">Milestone Table</h3>
                        <div className="overflow-x-auto rounded-xl border bg-card">
                            <Table>
                                <TableHeader className="bg-muted/50 text-left">
                                    <TableRow>
                                        <TableHead>Year</TableHead>
                                        <TableHead>Milestone</TableHead>
                                        <TableHead>Context</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {yearlyMilestones.map((milestone) => (
                                        <TableRow key={milestone.year}>
                                            <TableCell className="font-medium">{milestone.year}</TableCell>
                                            <TableCell>{milestone.label}</TableCell>
                                            <TableCell className="text-muted-foreground">{milestone.note}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Goal size={18} />
                            Recommended Annual Adjustments
                        </CardTitle>
                        <CardDescription>Actions generated from the mock growth model.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {growthRecommendations.map((item) => (
                            <div key={item} className="rounded-lg border p-3 text-sm">
                                {item}
                            </div>
                        ))}
                        <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                            Filters currently point to {selectedHabitFilter.toLowerCase()} in {selectedCategoryFilter.toLowerCase()} for {selectedYear}.
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarClock size={18} />
                        Weekly-to-Yearly Bridge
                    </CardTitle>
                    <CardDescription>
                        Keep weekly execution aligned with annual outcomes.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link to="/weekly-review">Open Weekly Review Wizard</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};
