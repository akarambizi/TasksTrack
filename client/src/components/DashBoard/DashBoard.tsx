import { ActivityGridContainer } from '../ActivityGrid';
import { AnalyticsOverview } from '../Analytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui';
import { AddHabitDialog } from '../Habits/AddHabitDialog';
import { useState } from 'react';
import { currentKpiSnapshot, goalCheckpoints, growthRecommendations, yearlySnapshots } from '@/mock-server/data/analytics/growthMetrics';
import {
    TrendingUp,
    Target,
    Clock,
    Calendar,
    Plus,
    Sparkles,
    ArrowUpRight,
    Trophy,
    BarChart3,
    ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

type TDashboardKpiState = 'success' | 'loading' | 'empty' | 'error';

export const Dashboard = () => {
    const [showAddHabitDialog, setShowAddHabitDialog] = useState(false);
    const [kpiState, setKpiState] = useState<TDashboardKpiState>('success');

    const handleStartFocusSession = () => {
        window.location.href = '/focus-sessions';
    };

    const latestYear = yearlySnapshots[yearlySnapshots.length - 1];
    const previousYear = yearlySnapshots[yearlySnapshots.length - 2];
    const yearOverYearDelta = latestYear && previousYear
        ? latestYear.goalCompletionRate - previousYear.goalCompletionRate
        : 0;

    const cadenceLabelMap = {
        daily: 'Daily',
        weekly: 'Weekly',
        monthly: 'Monthly',
        quarterly: 'Quarterly',
        yearly: 'Yearly'
    } as const;

    const renderKpiCards = () => {
        if (kpiState === 'loading') {
            return [1, 2, 3, 4].map((index) => (
                <Card key={index} className="animate-pulse">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="h-4 w-24 rounded bg-muted" />
                        <div className="h-4 w-4 rounded-full bg-muted" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="h-8 w-20 rounded bg-muted" />
                        <div className="h-3 w-full rounded bg-muted" />
                        <div className="h-3 w-3/4 rounded bg-muted" />
                    </CardContent>
                </Card>
            ));
        }

        if (kpiState === 'empty') {
            return (
                <Card className="md:col-span-2 lg:col-span-4">
                    <CardHeader>
                        <CardTitle>No KPI data yet</CardTitle>
                        <CardDescription>Mock empty state for future sync gaps or brand-new accounts.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" onClick={() => setKpiState('success')}>Restore sample data</Button>
                    </CardContent>
                </Card>
            );
        }

        if (kpiState === 'error') {
            return (
                <Card className="md:col-span-2 lg:col-span-4 border-destructive/30 bg-destructive/5">
                    <CardHeader>
                        <CardTitle>KPI feed unavailable</CardTitle>
                        <CardDescription>The dashboard can surface a recoverable error state when a KPI group fails to load.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center gap-3">
                        <Button onClick={() => setKpiState('success')}>Retry sample load</Button>
                        <Button variant="outline" onClick={() => setKpiState('loading')}>Show loading</Button>
                    </CardContent>
                </Card>
            );
        }

        return [
            <Card key="primary-kpi">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Primary KPI</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-success">{currentKpiSnapshot.primaryMetricValue}%</div>
                    <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-success" />
                        <p className="text-xs text-muted-foreground">{currentKpiSnapshot.primaryMetricLabel}</p>
                    </div>
                </CardContent>
            </Card>,
            <Card key="weekly-checkins">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Weekly Check-ins</CardTitle>
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{currentKpiSnapshot.weeklyCheckins}/{currentKpiSnapshot.weeklyCheckinsTarget}</div>
                    <p className="text-xs text-muted-foreground">Habit review cadence</p>
                </CardContent>
            </Card>,
            <Card key="monthly-hit-rate">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Hit Rate</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{currentKpiSnapshot.monthlyGoalHitRate}%</div>
                    <p className="text-xs text-muted-foreground">Goals completed this month</p>
                </CardContent>
            </Card>,
            <Card key="yoy-momentum">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">YoY Momentum</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{yearOverYearDelta}%</div>
                    <div className="flex items-center gap-1">
                        <Badge variant="secondary" className="text-xs">{latestYear?.year ?? 'Current'} vs {previousYear?.year ?? 'Previous'}</Badge>
                    </div>
                </CardContent>
            </Card>
        ];
    };

    return (
        <div className="space-y-8" data-testid="dashboard">
            {/* Welcome Header */}
            <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-primary/10 via-background to-success/10 p-6 md:p-8">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10" />
                <div className="absolute -bottom-12 right-20 h-28 w-28 rounded-full bg-success/10" />

                <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Numbers-first growth system</p>
                        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Goal Completion Rate: {currentKpiSnapshot.primaryMetricValue}%</h1>
                        <p className="text-muted-foreground">
                            Keep this as the north-star metric. Every habit and session should move the completion rate upward.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-success">
                            <ArrowUpRight className="h-4 w-4" />
                            +{currentKpiSnapshot.primaryMetricDelta}% vs previous period
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            className="gap-2"
                            onClick={() => setShowAddHabitDialog(true)}
                            data-testid="quick-add-habit-btn"
                        >
                            <Plus size={16} />
                            Quick Add Habit
                        </Button>
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={handleStartFocusSession}
                            data-testid="start-focus-session-btn"
                        >
                            <Clock size={16} />
                            Start Focus Session
                        </Button>
                        <div className="min-w-[170px] rounded-xl border bg-background/90 p-3 shadow-sm backdrop-blur">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">KPI state</p>
                            <Select value={kpiState} onValueChange={(value) => setKpiState(value as TDashboardKpiState)}>
                                <SelectTrigger className="mt-2 h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="success">Success</SelectItem>
                                    <SelectItem value="loading">Loading</SelectItem>
                                    <SelectItem value="empty">Empty</SelectItem>
                                    <SelectItem value="error">Error</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {renderKpiCards()}
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="h-auto w-full justify-start rounded-xl bg-muted/60 p-1">
                    <TabsTrigger className="rounded-lg px-4 py-2 text-sm" value="overview">Overview</TabsTrigger>
                    <TabsTrigger className="rounded-lg px-4 py-2 text-sm" value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger className="rounded-lg px-4 py-2 text-sm" value="actions">Actions</TabsTrigger>
                    <TabsTrigger className="rounded-lg px-4 py-2 text-sm" value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar size={18} />
                                Cadence Checkpoints
                            </CardTitle>
                            <CardDescription>
                                Daily to yearly target performance with measurable progress.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                            {goalCheckpoints.map((checkpoint) => {
                                const progressValue = checkpoint.target > 0
                                    ? Math.min(100, Math.round((checkpoint.actual / checkpoint.target) * 100))
                                    : 0;

                                return (
                                    <div key={checkpoint.id} className="rounded-xl border p-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                {cadenceLabelMap[checkpoint.cadence]}
                                            </p>
                                            <Badge variant={progressValue >= 100 ? 'default' : 'secondary'}>
                                                {progressValue}%
                                            </Badge>
                                        </div>
                                        <p className="font-semibold leading-tight">{checkpoint.label}</p>
                                        <Progress value={progressValue} />
                                        <p className="text-xs text-muted-foreground">
                                            {checkpoint.actual} / {checkpoint.target} {checkpoint.unit}
                                        </p>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics" data-testid="analytics-section">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp size={20} />
                                Analytics Overview
                            </CardTitle>
                            <CardDescription>
                                    Track your progress and identify the patterns that move your completion rate.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AnalyticsOverview />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="actions">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles size={18} />
                                    Weekly Review
                                </CardTitle>
                                <CardDescription>
                                    Keep weekly reflection focused and run it in the dedicated flow.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-sm text-muted-foreground">
                                    Run one structured review each week to protect your KPI momentum and execution quality.
                                </p>
                                <Button asChild className="w-full justify-between">
                                    <Link to="/weekly-review">
                                        Open Weekly Review Wizard
                                        <ArrowRight size={16} />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles size={18} />
                                    Next Best Actions
                                </CardTitle>
                                <CardDescription>
                                    Mock recommendations that keep the current KPI trajectory moving.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {growthRecommendations.map((recommendation, index) => (
                                    <div key={recommendation} className="rounded-lg border p-3">
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Action {index + 1}</p>
                                        <p className="text-sm mt-1">{recommendation}</p>
                                    </div>
                                ))}

                                <Button asChild variant="outline" className="w-full justify-between">
                                    <Link to="/sync">
                                        Review Sheets Sync Health
                                        <ArrowRight size={16} />
                                    </Link>
                                </Button>
                                <Button asChild variant="ghost" className="w-full justify-between">
                                    <Link to="/retrospective">
                                        Open Yearly Retrospective
                                        <ArrowRight size={16} />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="activity" data-testid="activity-grid-section">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar size={20} />
                                Activity Grid
                            </CardTitle>
                            <CardDescription>
                                Visual representation of your daily consistency.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ActivityGridContainer />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Add Habit Dialog */}
            <AddHabitDialog
                isOpen={showAddHabitDialog}
                onClose={() => setShowAddHabitDialog(false)}
                showButton={false}
            />
        </div>
    );
};
