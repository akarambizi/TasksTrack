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

export interface IActivitySummaryResponse {
    startDate: string;
    endDate: string;
    totalDays: number;
    activeDays: number;
    totalActivities: number;
    totalValue: number;
    averageValue: number;
    longestStreak: number;
    currentStreak: number;
    categoryBreakdown: ICategorySummary[];
    habitBreakdown: IHabitSummary[];
}

export interface ICategorySummary {
    category: string;
    activityCount: number;
    totalValue: number;
    percentage: number;
}

export interface IHabitSummary {
    habitId: number;
    habitName: string;
    metricType: string;
    unit?: string;
    activityCount: number;
    totalValue: number;
    averageValue: number;
    longestStreak: number;
    currentStreak: number;
    category?: string;
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