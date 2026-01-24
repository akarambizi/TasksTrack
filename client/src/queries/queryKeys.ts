export const getHabitKey = (query: string) => ['HabitData', query];

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
