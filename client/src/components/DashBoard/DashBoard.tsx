import { ActivityGridContainer } from '../ActivityGrid';
import { AnalyticsOverview } from '../Analytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AddHabitDialog } from '../Habits/AddHabitDialog';
import { useState } from 'react';
import {
    TrendingUp,
    Target,
    Clock,
    Calendar,
    Plus,
    Sparkles
} from 'lucide-react';

export const Dashboard = () => {
    const [showAddHabitDialog, setShowAddHabitDialog] = useState(false);

    const handleStartFocusSession = () => {
        // Navigate to focus session - we'll implement this
        window.location.href = '/focus';
    };

    return (
        <div className="space-y-8" data-testid="dashboard">
            {/* Welcome Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Good morning! 👋</h1>
                    <p className="text-muted-foreground">
                        Ready to make today productive? Let's track your progress.
                    </p>
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
                </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-success">85%</div>
                        <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-success" />
                            <p className="text-xs text-muted-foreground">
                                +12% from yesterday
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Habits</CardTitle>
                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">
                            6 completed today
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Focus Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2h 45m</div>
                        <p className="text-xs text-muted-foreground">
                            This week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12 days</div>
                        <div className="flex items-center gap-1">
                            <Badge variant="secondary" className="text-xs">Personal best!</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Analytics Dashboard Section */}
            <div data-testid="analytics-section">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp size={20} />
                            Analytics Overview
                        </CardTitle>
                        <CardDescription>
                            Track your progress and identify patterns in your habits
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AnalyticsOverview />
                    </CardContent>
                </Card>
            </div>

            {/* Activity Grid Section */}
            <div data-testid="activity-grid-section">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar size={20} />
                            Activity Grid
                        </CardTitle>
                        <CardDescription>
                            Visual representation of your daily consistency
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ActivityGridContainer />
                    </CardContent>
                </Card>
            </div>

            {/* Add Habit Dialog */}
            <AddHabitDialog
                isOpen={showAddHabitDialog}
                onClose={() => setShowAddHabitDialog(false)}
                showButton={false}
            />
        </div>
    );
};
