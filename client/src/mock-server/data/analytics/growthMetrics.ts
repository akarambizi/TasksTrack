import {
    ICurrentKpiSnapshot,
    IGoalCheckpoint,
    IGoalItem,
    IYearMonthHighlight,
    ISyncEvent,
    ISyncKpis,
    IWeeklyReviewItem,
    IYearlyMilestone,
    IYearSnapshot
} from '@/types';

export const goalCheckpoints: IGoalCheckpoint[] = [
    { id: 'g1', cadence: 'daily', label: 'Deep Work', target: 120, actual: 120, unit: 'min' },
    { id: 'g2', cadence: 'weekly', label: 'Focus Sessions', target: 10, actual: 8, unit: 'sessions' },
    { id: 'g3', cadence: 'monthly', label: 'Reading', target: 600, actual: 540, unit: 'min' },
    { id: 'g4', cadence: 'quarterly', label: 'Workout Blocks', target: 120, actual: 126, unit: 'sessions' },
    { id: 'g5', cadence: 'yearly', label: 'Total Focus Time', target: 72000, actual: 49120, unit: 'min' }
];

export const yearlySnapshots: IYearSnapshot[] = [
    { year: 2021, goalCompletionRate: 42, consistencyRate: 38, focusMinutes: 12480, completedGoals: 58 },
    { year: 2022, goalCompletionRate: 53, consistencyRate: 49, focusMinutes: 17640, completedGoals: 81 },
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
        actual: 120,
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
    },
    {
        id: 'goal-6',
        title: 'Hydration Check-ins',
        cadence: 'daily',
        target: 8,
        actual: 8,
        unit: 'glasses',
        status: 'on-track',
        category: 'Health'
    },
    {
        id: 'goal-7',
        title: 'Language Flashcards',
        cadence: 'weekly',
        target: 60,
        actual: 72,
        unit: 'flashcards',
        status: 'exceeded',
        category: 'Learning'
    },
    {
        id: 'goal-8',
        title: 'Personal Writing',
        cadence: 'monthly',
        target: 400,
        actual: 260,
        unit: 'min',
        status: 'behind',
        category: 'Personal'
    }
];

export const weeklyReviewChecklist: IWeeklyReviewItem[] = [
    { id: 'wr-1', label: 'Reviewed weekly goals', completed: true },
    { id: 'wr-2', label: 'Planned recovery actions', completed: false },
    { id: 'wr-3', label: 'Updated next week priorities', completed: true },
    { id: 'wr-4', label: 'Scheduled high-focus blocks', completed: true },
    { id: 'wr-5', label: 'Checked streak risk and recovery prompts', completed: false },
    { id: 'wr-6', label: 'Confirmed calendar commitments', completed: true }
];

export const yearlyMilestones: IYearlyMilestone[] = [
    { year: 2021, label: 'Baseline Year', note: 'Defined the first repeatable habits and metric conventions' },
    { year: 2022, label: 'System Cleanup', note: 'Consolidated duplicate goals and simplified tracking' },
    { year: 2023, label: 'Consistency Foundation', note: 'Built first stable routine across 8 habits' },
    { year: 2024, label: 'Focus Expansion', note: 'Crossed 28k focus minutes milestone' },
    { year: 2025, label: 'Execution Year', note: 'Highest completed goals and strongest streak velocity' },
    { year: 2026, label: 'Optimization Year', note: 'Best goal completion rate and planning discipline' }
];

export const yearlyMonthHighlights: IYearMonthHighlight[] = [
    {
        year: 2021,
        bestMonth: 'November',
        bestMonthRate: 48,
        worstMonth: 'February',
        worstMonthRate: 31,
        note: 'Early data showed the first meaningful lift after adding a weekly review routine.'
    },
    {
        year: 2022,
        bestMonth: 'September',
        bestMonthRate: 57,
        worstMonth: 'January',
        worstMonthRate: 44,
        note: 'Recovery blocks and clearer cadence definitions reduced the early-year dip.'
    },
    {
        year: 2023,
        bestMonth: 'October',
        bestMonthRate: 67,
        worstMonth: 'February',
        worstMonthRate: 54,
        note: 'First year where the recovery plan clearly lifted the curve.'
    },
    {
        year: 2024,
        bestMonth: 'June',
        bestMonthRate: 72,
        worstMonth: 'January',
        worstMonthRate: 60,
        note: 'Mid-year consistency was strongest after the weekly review cadence tightened.'
    },
    {
        year: 2025,
        bestMonth: 'September',
        bestMonthRate: 77,
        worstMonth: 'March',
        worstMonthRate: 66,
        note: 'Focus volume increased once the work blocks were grouped by category.'
    },
    {
        year: 2026,
        bestMonth: 'April',
        bestMonthRate: 82,
        worstMonth: 'July',
        worstMonthRate: 71,
        note: 'Current year shows the best completion rate with the narrowest month-to-month drift.'
    }
];

export const syncEvents: ISyncEvent[] = [
    { id: 'se-1', source: 'habit-log', state: 'synced', occurredAt: '2026-07-03T09:02:00.000Z' },
    { id: 'se-2', source: 'focus-session', state: 'synced', occurredAt: '2026-07-03T09:03:40.000Z' },
    { id: 'se-3', source: 'goal', state: 'queued', occurredAt: '2026-07-03T09:05:15.000Z' },
    { id: 'se-4', source: 'habit-log', state: 'failed', occurredAt: '2026-07-03T09:07:20.000Z' },
    { id: 'se-5', source: 'goal', state: 'synced', occurredAt: '2026-07-03T09:12:20.000Z' },
    { id: 'se-6', source: 'focus-session', state: 'queued', occurredAt: '2026-07-03T09:13:05.000Z' }
];

export const syncKpis: ISyncKpis = {
    mode: 'near-real-time',
    successRate: 97.2,
    freshnessSecondsP95: 8.6,
    queuedEvents: 2,
    failedEvents: 1,
    lastSyncedAt: '2026-07-03T09:07:20.000Z'
};

export const currentKpiSnapshot: ICurrentKpiSnapshot = {
    primaryMetricLabel: 'Goal Completion Rate',
    primaryMetricValue: 84,
    primaryMetricDelta: 5,
    weeklyCheckins: 4,
    weeklyCheckinsTarget: 4,
    monthlyGoalHitRate: 88,
    yearlyProjectedCompletionRate: 89
};

export const growthRecommendations = [
    'Protect your first 90 minutes for deep work 5 days this week.',
    'Recover the daily goal gap by adding one 25-minute evening block.',
    'Push monthly reading to 620 minutes to exceed target by 3%.',
    'Use the hydration habit as a low-friction streak stabilizer.',
    'Move one weekly planning block earlier to reduce recovery drift.'
];
