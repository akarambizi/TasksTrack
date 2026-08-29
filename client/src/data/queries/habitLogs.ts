import {
    getHabitLogs,
    getHabitLogsByHabitId,
    getHabitLogsByHabitAndDateRange,
    createHabitLog,
    IHabitLog,
} from '@/api/habitLog';
import { habitLogKeys, getHabitKey } from './queryKeys';
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { CACHE_TIMES } from './constants';

interface IUseHabitLogsOptions {
    habitId?: number;
    limit?: number;
}

/**
 * Custom hook for fetching habit logs with optional filtering.
 */
export const useHabitLogs = (options?: IUseHabitLogsOptions, queryOptions?: UseQueryOptions<IHabitLog[], AxiosError>) => {
    const { habitId, limit } = options || {};

    return useQuery({
        queryKey: habitId ? habitLogKeys.byHabit(habitId) : habitLogKeys.lists(),
        queryFn: () => {
            if (habitId) {
                return getHabitLogsByHabitId(habitId, limit);
            }
            return getHabitLogs();
        },
        staleTime: CACHE_TIMES.MEDIUM, // 2 minutes
        enabled: habitId ? !!habitId : true,
        ...queryOptions,
    });
};






/**
 * Custom hook for fetching habit logs for a specific habit and date range.
 */
export const useHabitLogsByHabitAndDateRange = (habitId: number, startDate: string, endDate: string, options?: UseQueryOptions<IHabitLog[], AxiosError>) => {
    return useQuery({
        queryKey: habitLogKeys.byHabitAndDateRange(habitId, startDate, endDate),
        queryFn: () => getHabitLogsByHabitAndDateRange(habitId, startDate, endDate),
        enabled: !!habitId && !!startDate && !!endDate,
        staleTime: CACHE_TIMES.MEDIUM,
        ...options,
    });
};


/**
 * Mutation hook for creating a new habit log.
 */
export const useCreateHabitLogMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createHabitLog,
        onSuccess: (data) => {
            // Invalidate multiple related queries
            queryClient.invalidateQueries({ queryKey: habitLogKeys.all });
            queryClient.invalidateQueries({ queryKey: habitLogKeys.byHabit(data.habitId) });
            queryClient.invalidateQueries({ queryKey: habitLogKeys.byDate(data.date) });
            queryClient.invalidateQueries({ queryKey: habitLogKeys.byHabitAndDate(data.habitId, data.date) });
            // Also invalidate habit data as it might affect habit statistics
            queryClient.invalidateQueries({ queryKey: getHabitKey('') });
        },
    });
};
