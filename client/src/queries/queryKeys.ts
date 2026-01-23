export const getHabitKey = (query: string) => ['HabitData', query];

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
