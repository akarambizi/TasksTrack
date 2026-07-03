import {
    ICurrentKpiSnapshot,
    IGoalCheckpoint,
    IGoalItem,
    ISyncEvent,
    ISyncKpis,
    IWeeklyReviewItem,
    IYearlyMilestone,
    IYearSnapshot
} from '@/types';

export const goalCheckpoints: IGoalCheckpoint[] = [
    { id: 'g1', cadence: 'daily', label: 'Deep Work', target: 120, actual: 95, unit: 'min' },
    { id: 'g2', cadence: 'weekly', label: 'Focus Sessions', target: 10, actual: 8, unit: 'sessions' },
    { id: 'g3', cadence: 'monthly', label: 'Reading', target: 600, actual: 540, unit: 'min' },
    { id: 'g4', cadence: 'quarterly', label: 'Workout Blocks', target: 120, actual: 103, unit: 'sessions' },
    { id: 'g5', cadence: 'yearly', label: 'Total Focus Time', target: 72000, actual: 49120, unit: 'min' }
];

export const yearlySnapshots: IYearSnapshot[] = [
    { year: 2023, goalCompletionRate: 61, consistencyRate: 58, focusMinutes: 21420, completedGoals: 104 },
    { year: 2024, goalCompletionRate: 68, consistencyRate: 64, focusMinutes: 28950, completedGoals: 138 },
    { year: 2025, goalCompletionRate: 74, consistencyRate: 71, focusMinutes: 36480, completedGoals: 172 },
    { year: 2026, goalCompletionRate: 79, consistencyRate: 76, focusMinutes: 49120, completedGoals: 219 }
];

export const goalItems: IGoalItem[] = [
    {
        id: 'goal-1',
        title: 'Deep Work Sessions',
        cadence: 'daily',
        target: 120,
        actual: 95,
        unit: 'min',
        status: 'behind',
        category: 'Work'
    },
    {
        id: 'goal-2',
        title: 'Weekly Focus Blocks',
        cadence: 'weekly',
        target: 10,
        actual: 11,
        unit: 'sessions',
        status: 'exceeded',
        category: 'Work'
    },
    {
        id: 'goal-3',
        title: 'Reading Volume',
        cadence: 'monthly',
        target: 600,
        actual: 540,
        unit: 'min',
        status: 'on-track',
        category: 'Learning'
    },
    {
        id: 'goal-4',
        title: 'Training Sessions',
        cadence: 'quarterly',
        target: 120,
        actual: 103,
        unit: 'sessions',
        status: 'on-track',
        category: 'Health'
    },
    {
        id: 'goal-5',
        title: 'Yearly Focus Time',
        cadence: 'yearly',
        target: 72000,
        actual: 49120,
        unit: 'min',
        status: 'on-track',
        category: 'Work'
    }
];

export const weeklyReviewChecklist: IWeeklyReviewItem[] = [
    { id: 'wr-1', label: 'Reviewed weekly goals', completed: true },
    { id: 'wr-2', label: 'Planned recovery actions', completed: false },
    { id: 'wr-3', label: 'Updated next week priorities', completed: true },
    { id: 'wr-4', label: 'Scheduled high-focus blocks', completed: true }
];

export const yearlyMilestones: IYearlyMilestone[] = [
    { year: 2023, label: 'Consistency Foundation', note: 'Built first stable routine across 8 habits' },
    { year: 2024, label: 'Focus Expansion', note: 'Crossed 28k focus minutes milestone' },
    { year: 2025, label: 'Execution Year', note: 'Highest completed goals and strongest streak velocity' },
    { year: 2026, label: 'Optimization Year', note: 'Best goal completion rate and planning discipline' }
];

export const syncEvents: ISyncEvent[] = [
    { id: 'se-1', source: 'habit-log', state: 'synced', occurredAt: '2026-07-03T09:02:00.000Z' },
    { id: 'se-2', source: 'focus-session', state: 'synced', occurredAt: '2026-07-03T09:03:40.000Z' },
    { id: 'se-3', source: 'goal', state: 'queued', occurredAt: '2026-07-03T09:05:15.000Z' },
    { id: 'se-4', source: 'habit-log', state: 'failed', occurredAt: '2026-07-03T09:07:20.000Z' }
];

export const syncKpis: ISyncKpis = {
    mode: 'near-real-time',
    successRate: 98.4,
    freshnessSecondsP95: 7.2,
    queuedEvents: 1,
    failedEvents: 1,
    lastSyncedAt: '2026-07-03T09:07:20.000Z'
};

export const currentKpiSnapshot: ICurrentKpiSnapshot = {
    primaryMetricLabel: 'Goal Completion Rate',
    primaryMetricValue: 79,
    primaryMetricDelta: 5,
    weeklyCheckins: 3,
    weeklyCheckinsTarget: 4,
    monthlyGoalHitRate: 82,
    yearlyProjectedCompletionRate: 84
};

export const growthRecommendations = [
    'Protect your first 90 minutes for deep work 5 days this week.',
    'Recover the daily goal gap by adding one 25-minute evening block.',
    'Push monthly reading to 620 minutes to exceed target by 3%.'
];
