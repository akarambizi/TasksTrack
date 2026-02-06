/**
 * Analytics API Types - matches server-side analytics models
 */

export interface IAnalyticsResponse {
    period: string;
    startDate: string;
    endDate: string;
    totalHabitsTracked: number;
    totalSessions: number;
    totalMinutes: number;
    averageSessionDuration: number;
    activeDays: number;
    totalDays: number;
    activityRate: number;
    currentStreak: number;
    longestStreak: number;
    habitBreakdown: IHabitAnalytics[];
    categoryBreakdown: ICategoryAnalytics[];
    dailyProgress: IDailyProgress[];
    goalProgress: IGoalProgress;
}

export interface IHabitAnalytics {
    habitId: number;
    name: string;
    category: string;
    sessionCount: number;
    totalMinutes: number;
    averageSessionDuration: number;
    completionRate: number;
    currentStreak: number;
    longestStreak: number;
    lastActivity: string;
    activityIntensity: number;
}

export interface ICategoryAnalytics {
    category: string;
    habitCount: number;
    sessionCount: number;
    totalMinutes: number;
    averageSessionDuration: number;
    completionRate: number;
}

export interface IDailyProgress {
    date: string;
    sessionCount: number;
    totalMinutes: number;
    completedHabits: number;
    targetMinutes: number;
    achievementRate: number;
}

export interface IGoalProgress {
    targetMinutesPerPeriod: number;
    actualMinutes: number;
    progressPercentage: number;
    targetSessionsPerPeriod: number;
    actualSessions: number;
    onTrack: boolean;
    daysRemaining: number;
    requiredDailyAverage: number;
}

// Currently unused interfaces - commented out to pass linting
// export interface ICustomAnalyticsRequest {
//     startDate: string;
//     endDate: string;
//     habitIds?: number[];
//     categories?: string[];
// }

// export interface IComparisonAnalyticsResponse {
//     currentPeriod: IAnalyticsResponse;
//     previousPeriod: IAnalyticsResponse;
//     improvement: {
//         sessionsChange: number;
//         minutesChange: number;
//         activityRateChange: number;
//         streakChange: number;
//         performanceTrend: 'improving' | 'declining' | 'stable';
//     };
// }

// export interface IExportAnalyticsRequest {
//     startDate: string;
//     endDate: string;
//     format: 'json' | 'csv';
//     includeHabitBreakdown?: boolean;
//     includeCategoryBreakdown?: boolean;
//     includeDailyBreakdown?: boolean;
//     includeGoalProgress?: boolean;
// }

// export interface IExportAnalyticsResponse {
//     data: Uint8Array;
//     contentType: string;
//     fileName: string;
// }