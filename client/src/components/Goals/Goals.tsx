import { useEffect, useMemo, useRef, useState } from 'react';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Input, Label, Progress, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { goalItems } from '@/mock-server/data/analytics/growthMetrics';
import { TCadence } from '@/types';
import { Plus, Target } from 'lucide-react';

const cadenceOptions: TCadence[] = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];

type TGoalStatus = 'on-track' | 'behind' | 'exceeded';

const statusCycle: TGoalStatus[] = ['behind', 'on-track', 'exceeded'];

const statusStyles: Record<string, string> = {
    'on-track': 'bg-success/10 text-success border-success/30',
    behind: 'bg-warning/20 text-warning-foreground border-warning/40',
    exceeded: 'bg-primary/10 text-primary border-primary/30'
};

export const Goals = () => {
    const [cadenceFilter, setCadenceFilter] = useState<'all' | TCadence>('all');
    const [goals, setGoals] = useState(goalItems);
    const [newGoalName, setNewGoalName] = useState('');
    const [newGoalTarget, setNewGoalTarget] = useState('');
    const [newGoalCadence, setNewGoalCadence] = useState<TCadence>('weekly');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const saveTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current !== null) {
                window.clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    const filteredGoals = useMemo(() => {
        const visibleGoals = goals.filter((goal) => !goal.archived);

        if (cadenceFilter === 'all') {
            return visibleGoals;
        }

        return visibleGoals.filter((goal) => goal.cadence === cadenceFilter);
    }, [cadenceFilter, goals]);

    const cycleGoalStatus = (goalId: string) => {
        setGoals((currentGoals) => currentGoals.map((goal) => {
            if (goal.id !== goalId) {
                return goal;
            }

            const currentIndex = statusCycle.indexOf(goal.status as TGoalStatus);
            const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];

            return { ...goal, status: nextStatus };
        }));
    };

    const archiveGoal = (goalId: string) => {
        setGoals((currentGoals) => currentGoals.map((goal) => (
            goal.id === goalId ? { ...goal, archived: true } : goal
        )));
    };

    const createGoal = () => {
        const trimmedName = newGoalName.trim();
        const parsedTarget = Number(newGoalTarget);

        if (!trimmedName) {
            setFormError('Goal name is required.');
            setSubmitState('error');
            return;
        }

        if (!Number.isFinite(parsedTarget) || parsedTarget <= 0) {
            setFormError('Target value must be a positive number.');
            setSubmitState('error');
            return;
        }

        setSubmitState('submitting');
        setFormError(null);

        saveTimeoutRef.current = window.setTimeout(() => {
            saveTimeoutRef.current = null;
            setGoals((currentGoals) => [{
                id: `goal-${Date.now()}`,
                title: trimmedName,
                cadence: newGoalCadence,
                target: parsedTarget,
                actual: 0,
                unit: 'units',
                status: 'on-track',
                category: 'Custom'
            }, ...currentGoals]);

            setSubmitState('success');
            setNewGoalName('');
            setNewGoalTarget('');
            setNewGoalCadence('weekly');
        }, 300);
    };

    const targetIsInvalid = newGoalTarget.trim().length > 0 && (!Number.isFinite(Number(newGoalTarget)) || Number(newGoalTarget) <= 0);

    return (
        <div className="space-y-6" data-testid="goals-page">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Goals Management</h1>
                    <p className="text-muted-foreground">Set measurable targets across every cadence and keep progress editable, visible, and accountable.</p>
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

                    <Dialog
                        open={isCreateDialogOpen}
                        onOpenChange={(open) => {
                            setIsCreateDialogOpen(open);
                            if (!open) {
                                if (saveTimeoutRef.current !== null) {
                                    window.clearTimeout(saveTimeoutRef.current);
                                    saveTimeoutRef.current = null;
                                }
                                setSubmitState('idle');
                                setFormError(null);
                            }
                        }}
                    >
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
                                    This mock form validates inputs locally and previews what the eventual API submission will look like.
                                </DialogDescription>
                            </DialogHeader>

                            {submitState === 'submitting' && (
                                <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                                    Saving goal locally and preparing the optimistic update...
                                </div>
                            )}

                            {submitState === 'success' && (
                                <div className="rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
                                    Goal saved. The optimistic update is now visible in the list below.
                                </div>
                            )}

                            {formError && (
                                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                    {formError}
                                </div>
                            )}

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
                                        aria-invalid={targetIsInvalid}
                                        className={targetIsInvalid ? 'border-destructive focus-visible:ring-destructive' : ''}
                                    />
                                    {targetIsInvalid && (
                                        <p className="text-xs text-destructive">Enter a number greater than zero.</p>
                                    )}
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
                                        : 'Fill the fields to preview the mock submission.'}
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                                {submitState === 'success' ? (
                                    <Button onClick={() => setIsCreateDialogOpen(false)}>Close</Button>
                                ) : (
                                    <Button
                                        onClick={createGoal}
                                        disabled={!newGoalName.trim() || targetIsInvalid || submitState === 'submitting'}
                                    >
                                        {submitState === 'submitting' ? 'Saving...' : 'Save Goal (Mock)'}
                                    </Button>
                                )}
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
                                    <Button size="sm" variant="outline" className="flex-1" onClick={() => cycleGoalStatus(goal.id)}>Cycle Status (Mock)</Button>
                                    <Button size="sm" variant="ghost" className="flex-1" onClick={() => archiveGoal(goal.id)}>Archive (Mock)</Button>
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
                    Validate this weekly: goal completion metrics should stay visible, measurable, and trendable in dashboard and statistics views.
                </CardContent>
            </Card>
        </div>
    );
};
