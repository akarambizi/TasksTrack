import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Progress, Textarea } from '@/components/ui';
import { weeklyReviewChecklist } from '@/mock-server/data/analytics/growthMetrics';
import { CheckCircle2, RotateCcw } from 'lucide-react';

interface IWizardState {
    step: number;
    checklist: Array<{ id: string; label: string; completed: boolean }>;
    confidenceScore: number;
    wins: string;
    blockers: string;
    nextWeekPlan: string;
    submittedAt: string | null;
}

const LOCAL_STORAGE_KEY = 'taskstrack.weekly-review.wizard.v1';
const TOTAL_STEPS = 3;

const createInitialState = (): IWizardState => ({
    step: 1,
    checklist: weeklyReviewChecklist.map((item) => ({ ...item })),
    confidenceScore: 7,
    wins: '',
    blockers: '',
    nextWeekPlan: '',
    submittedAt: null
});

export const WeeklyReviewWizard = () => {
    const [state, setState] = useState<IWizardState>(createInitialState);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (!saved) {
                return;
            }

            const parsed = JSON.parse(saved) as IWizardState;
            if (parsed && Array.isArray(parsed.checklist)) {
                setState(parsed);
            }
        } catch {
            setState(createInitialState());
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const completedCount = useMemo(
        () => state.checklist.filter((item) => item.completed).length,
        [state.checklist]
    );
    const completionPercent = state.checklist.length > 0
        ? Math.round((completedCount / state.checklist.length) * 100)
        : 0;

    const nextStep = () => {
        setState((prev) => ({ ...prev, step: Math.min(TOTAL_STEPS, prev.step + 1) }));
    };

    const previousStep = () => {
        setState((prev) => ({ ...prev, step: Math.max(1, prev.step - 1) }));
    };

    const toggleChecklist = (id: string) => {
        setState((prev) => ({
            ...prev,
            checklist: prev.checklist.map((item) =>
                item.id === id ? { ...item, completed: !item.completed } : item
            )
        }));
    };

    const completeReview = () => {
        setState((prev) => ({ ...prev, submittedAt: new Date().toISOString() }));
    };

    const resetReview = () => {
        setState(createInitialState());
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between gap-3">
                    <span>Weekly Review Wizard</span>
                    <Badge variant="secondary">Step {state.step} / {TOTAL_STEPS}</Badge>
                </CardTitle>
                <CardDescription>
                    Persistent mock flow saved to local storage so your in-progress review survives refresh.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Wizard Progress</span>
                        <span>{Math.round((state.step / TOTAL_STEPS) * 100)}%</span>
                    </div>
                    <Progress value={Math.round((state.step / TOTAL_STEPS) * 100)} />
                </div>

                {state.step === 1 && (
                    <div className="space-y-3">
                        <div className="rounded-lg border p-3">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Checklist completion</p>
                            <p className="text-2xl font-bold">{completionPercent}%</p>
                            <Progress value={completionPercent} className="mt-2" />
                        </div>
                        {state.checklist.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => toggleChecklist(item.id)}
                                className="w-full rounded-lg border px-3 py-2 text-left transition-colors hover:bg-muted/50"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm">{item.label}</span>
                                    <Badge variant={item.completed ? 'default' : 'secondary'}>
                                        {item.completed ? 'Done' : 'Pending'}
                                    </Badge>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {state.step === 2 && (
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label htmlFor="wins">Top wins this week</Label>
                            <Textarea
                                id="wins"
                                value={state.wins}
                                onChange={(event) => setState((prev) => ({ ...prev, wins: event.target.value }))}
                                placeholder="What moved your KPI forward this week?"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="blockers">Blockers and risks</Label>
                            <Textarea
                                id="blockers"
                                value={state.blockers}
                                onChange={(event) => setState((prev) => ({ ...prev, blockers: event.target.value }))}
                                placeholder="What created drag or inconsistency?"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confidence">Confidence score (1-10)</Label>
                            <Input
                                id="confidence"
                                type="number"
                                min={1}
                                max={10}
                                value={state.confidenceScore}
                                onChange={(event) => {
                                    const parsed = Number(event.target.value);
                                    setState((prev) => ({
                                        ...prev,
                                        confidenceScore: Number.isNaN(parsed) ? 1 : Math.min(10, Math.max(1, parsed))
                                    }));
                                }}
                            />
                        </div>
                    </div>
                )}

                {state.step === 3 && (
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label htmlFor="next-week-plan">Next week plan</Label>
                            <Textarea
                                id="next-week-plan"
                                value={state.nextWeekPlan}
                                onChange={(event) => setState((prev) => ({ ...prev, nextWeekPlan: event.target.value }))}
                                placeholder="Define your top actions and schedule anchors."
                            />
                        </div>

                        <div className="rounded-lg bg-muted p-3 text-sm">
                            <p className="font-medium">Review summary</p>
                            <p className="text-muted-foreground mt-1">Checklist done: {completedCount}/{state.checklist.length}</p>
                            <p className="text-muted-foreground">Confidence: {state.confidenceScore}/10</p>
                            {state.submittedAt && (
                                <p className="text-muted-foreground">
                                    Last submitted: {format(new Date(state.submittedAt), 'PPpp')}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-2">
                    <Button variant="outline" onClick={previousStep} disabled={state.step === 1}>
                        Back
                    </Button>
                    <Button onClick={nextStep} disabled={state.step === TOTAL_STEPS}>
                        Next
                    </Button>
                    <Button
                        className="gap-2"
                        onClick={completeReview}
                        disabled={state.step !== TOTAL_STEPS || state.nextWeekPlan.trim().length === 0}
                    >
                        <CheckCircle2 size={16} />
                        Complete Review
                    </Button>
                    <Button variant="ghost" className="gap-2" onClick={resetReview}>
                        <RotateCcw size={16} />
                        Reset
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
