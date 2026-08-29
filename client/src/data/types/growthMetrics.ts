export type TCadence = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface IGoalCheckpoint {
    id: string;
    cadence: TCadence;
    label: string;
    target: number;
    actual: number;
    unit: string;
}

export interface IYearSnapshot {
    year: number;
    goalCompletionRate: number;
    consistencyRate: number;
    focusMinutes: number;
    completedGoals: number;
}

export interface IYearlyMilestone {
    year: number;
    label: string;
    note: string;
}

export interface IYearMonthHighlight {
    year: number;
    bestMonth: string;
    bestMonthRate: number;
    worstMonth: string;
    worstMonthRate: number;
    note: string;
}

export interface ISyncEvent {
    id: string;
    source: 'habit-log' | 'focus-session' | 'goal';
    state: 'synced' | 'queued' | 'failed';
    occurredAt: string;
}

export interface ISyncKpis {
    mode: 'manual' | 'near-real-time';
    successRate: number;
    freshnessSecondsP95: number;
    queuedEvents: number;
    failedEvents: number;
    lastSyncedAt: string;
}

export interface ICurrentKpiSnapshot {
    primaryMetricLabel: string;
    primaryMetricValue: number;
    primaryMetricDelta: number;
    weeklyCheckins: number;
    weeklyCheckinsTarget: number;
    monthlyGoalHitRate: number;
    yearlyProjectedCompletionRate: number;
}
