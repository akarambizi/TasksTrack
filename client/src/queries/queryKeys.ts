export const getHabitKey = (query: string) => ['HabitData', query];

/**
 * Focus Session API keys for React Query
 */
export const focusSessionKeys = {
    all: ['focusSessions'] as const,
    lists: () => [...focusSessionKeys.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...focusSessionKeys.lists(), { filters }] as const,
    details: () => [...focusSessionKeys.all, 'detail'] as const,
    detail: (id: number) => [...focusSessionKeys.details(), id] as const,
    active: () => [...focusSessionKeys.all, 'active'] as const,
    analytics: () => [...focusSessionKeys.all, 'analytics'] as const,
    analyticsWithFilters: (filters: Record<string, any>) => [...focusSessionKeys.analytics(), { filters }] as const,
    byHabit: (habitId: number) => [...focusSessionKeys.all, 'byHabit', habitId] as const,
    byStatus: (status: string) => [...focusSessionKeys.all, 'byStatus', status] as const,
    byDateRange: (startDate: string, endDate: string) => [...focusSessionKeys.all, 'byDateRange', { startDate, endDate }] as const,
};

/**
 * Habit Log API keys for React Query
 */
export const habitLogKeys = {
    all: ['habitLogs'] as const,
    lists: () => [...habitLogKeys.all, 'list'] as const,
    list: (filters: string) => [...habitLogKeys.lists(), { filters }] as const,
    details: () => [...habitLogKeys.all, 'detail'] as const,
    detail: (id: number) => [...habitLogKeys.details(), id] as const,
    byHabit: (habitId: number) => [...habitLogKeys.all, 'byHabit', habitId] as const,
    byDate: (date: string) => [...habitLogKeys.all, 'byDate', date] as const,
    byDateRange: (startDate: string, endDate: string) => [...habitLogKeys.all, 'byDateRange', { startDate, endDate }] as const,
    byHabitAndDate: (habitId: number, date: string) => [...habitLogKeys.all, 'byHabitAndDate', { habitId, date }] as const,
    byHabitAndDateRange: (habitId: number, startDate: string, endDate: string) => [...habitLogKeys.all, 'byHabitAndDateRange', { habitId, startDate, endDate }] as const,
};

/**
 * Authentication API keys for React Query
 */
export const authKeys = {
    all: ['auth'] as const,
    login: () => [...authKeys.all, 'login'] as const,
    register: () => [...authKeys.all, 'register'] as const,
    logout: () => [...authKeys.all, 'logout'] as const,
    resetPassword: () => [...authKeys.all, 'reset-password'] as const
};

/**
 * Activity API keys for React Query
 */
export const ACTIVITY_KEYS = {
    all: ['activity'] as const,
    grid: (startDate: string, endDate: string) => [...ACTIVITY_KEYS.all, 'grid', { startDate, endDate }] as const,
    summary: (startDate: string, endDate: string) => [...ACTIVITY_KEYS.all, 'summary', { startDate, endDate }] as const,
    statistics: () => [...ACTIVITY_KEYS.all, 'statistics'] as const,
    streaks: () => [...ACTIVITY_KEYS.all, 'streaks'] as const,
    currentStreak: (habitId: number) => [...ACTIVITY_KEYS.streaks(), 'current', habitId] as const,
    longestStreak: (habitId: number) => [...ACTIVITY_KEYS.streaks(), 'longest', habitId] as const,
    currentOverallStreak: () => [...ACTIVITY_KEYS.streaks(), 'currentOverall'] as const,
    longestOverallStreak: () => [...ACTIVITY_KEYS.streaks(), 'longestOverall'] as const,
};

/**
 * Analytics API keys for React Query
 */
export const ANALYTICS_KEYS = {
    all: ['analytics'] as const,
    weekly: (weekOffset: number) => [...ANALYTICS_KEYS.all, 'weekly', weekOffset] as const,
    monthly: (monthOffset: number) => [...ANALYTICS_KEYS.all, 'monthly', monthOffset] as const,
    quarterly: (quarterOffset: number) => [...ANALYTICS_KEYS.all, 'quarterly', quarterOffset] as const,
    yearly: (yearOffset: number) => [...ANALYTICS_KEYS.all, 'yearly', yearOffset] as const,
    custom: (request: Record<string, any>) => [...ANALYTICS_KEYS.all, 'custom', request] as const,
    comparison: (period: string, offset: number) => [...ANALYTICS_KEYS.all, 'comparison', { period, offset }] as const,
    goalProgress: (startDate: string, endDate: string, targetMinutes?: number, targetSessions?: number) => 
        [...ANALYTICS_KEYS.all, 'goalProgress', { startDate, endDate, targetMinutes, targetSessions }] as const,
    dashboard: () => [...ANALYTICS_KEYS.all, 'dashboard'] as const,
};
