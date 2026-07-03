import { useMemo, useState } from 'react';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Input, Label, Progress, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { goalItems } from '@/mock-server/data/analytics/growthMetrics';
import { TCadence } from '@/types';
import { Plus, Target } from 'lucide-react';

const cadenceOptions: TCadence[] = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];

const statusStyles: Record<string, string> = {
    'on-track': 'bg-success/10 text-success border-success/30',
    behind: 'bg-warning/20 text-warning-foreground border-warning/40',
    exceeded: 'bg-primary/10 text-primary border-primary/30'
};

export const Goals = () => {
    const [cadenceFilter, setCadenceFilter] = useState<'all' | TCadence>('all');
    const [newGoalName, setNewGoalName] = useState('');
    const [newGoalTarget, setNewGoalTarget] = useState('');
    const [newGoalCadence, setNewGoalCadence] = useState<TCadence>('weekly');

    const filteredGoals = useMemo(() => {
        if (cadenceFilter === 'all') {
            return goalItems;
        }

        return goalItems.filter((goal) => goal.cadence === cadenceFilter);
    }, [cadenceFilter]);

    return (
        <div className="space-y-6" data-testid="goals-page">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Goals Management</h1>
                    <p className="text-muted-foreground">Set measurable targets across every cadence and track completion rates.</p>
                </div>

                <div className="flex items-center gap-2">
                    <Select value={cadenceFilter} onValueChange={(value) => setCadenceFilter(value as 'all' | TCadence)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter cadence" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All cadences</SelectItem>
                            {cadenceOptions.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus size={16} />
                                Add Goal
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Goal (Mock)</DialogTitle>
                                <DialogDescription>
                                    This UI is mock-only for now. Backend wiring will come later.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="goal-name">Goal Name</Label>
                                    <Input
                                        id="goal-name"
                                        value={newGoalName}
                                        onChange={(e) => setNewGoalName(e.target.value)}
                                        placeholder="e.g. Weekly Deep Work"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="goal-target">Target Value</Label>
                                    <Input
                                        id="goal-target"
                                        type="number"
                                        value={newGoalTarget}
                                        onChange={(e) => setNewGoalTarget(e.target.value)}
                                        placeholder="e.g. 10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Cadence</Label>
                                    <Select value={newGoalCadence} onValueChange={(value) => setNewGoalCadence(value as TCadence)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cadenceOptions.map((option) => (
                                                <SelectItem key={option} value={option}>{option}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                                    {newGoalName && newGoalTarget
                                        ? `Preview: ${newGoalName} (${newGoalCadence}) target ${newGoalTarget}`
                                        : 'Fill values to preview the mock submission.'}
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline">Cancel</Button>
                                <Button disabled={!newGoalName || !newGoalTarget}>Save Goal (Mock)</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredGoals.map((goal) => {
                    const progress = goal.target > 0 ? Math.min(100, Math.round((goal.actual / goal.target) * 100)) : 0;

                    return (
                        <Card key={goal.id}>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center justify-between text-base">
                                    <span>{goal.title}</span>
                                    <Badge className={statusStyles[goal.status]}>{goal.status}</Badge>
                                </CardTitle>
                                <CardDescription className="flex items-center justify-between">
                                    <span className="capitalize">{goal.cadence}</span>
                                    <span>{goal.category}</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-semibold">{progress}%</span>
                                </div>
                                <Progress value={progress} />
                                <p className="text-xs text-muted-foreground">
                                    {goal.actual} / {goal.target} {goal.unit}
                                </p>

                                <div className="flex gap-2 pt-1">
                                    <Button size="sm" variant="outline" className="flex-1">Edit (Mock)</Button>
                                    <Button size="sm" variant="ghost" className="flex-1">Archive (Mock)</Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target size={18} />
                        KPI Checkpoint
                    </CardTitle>
                    <CardDescription>Goal Completion Rate should remain your primary metric while shipping this phase.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    Validate this weekly: goal completion metrics are visible, measurable, and trendable in dashboard and statistics views.
                </CardContent>
            </Card>
        </div>
    );
};
