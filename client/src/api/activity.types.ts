export interface IActivityGridResponse {
    date: string;
    activityCount: number;
    totalValue: number;
    intensityLevel: number; // 0-4 for GitHub-style colors
    habitsSummary: IHabitActivitySummary[];
}

export interface IHabitActivitySummary {
    habitId: number;
    habitName: string;
    metricType: string;
    unit?: string;
    value: number;
    color?: string;
    icon?: string;
}

export interface IActivityStatisticsResponse {
    totalDaysTracked: number;
    totalActiveDays: number;
    totalActivities: number;
    totalHabits: number;
    activeHabits: number;
    totalValue: number;
    averageValue: number;
    completionRate: number;
    currentOverallStreak: number;
    longestOverallStreak: number;
    mostActiveDayOfWeek: number;
    mostActiveDayName?: string;
    bestPerformingHabit?: IHabitPerformance;
    monthlyStats: IMonthlyStatistics[];
    weeklyStats: IWeeklyStatistics[];
}

export interface IHabitPerformance {
    habitId: number;
    habitName: string;
    totalValue: number;
    activityCount: number;
    completionRate: number;
}

export interface IMonthlyStatistics {
    year: number;
    month: number;
    monthName: string;
    activityCount: number;
    totalValue: number;
    activeDays: number;
}

export interface IWeeklyStatistics {
    weekStartDate: string;
    weekEndDate: string;
    activityCount: number;
    totalValue: number;
    activeDays: number;
}