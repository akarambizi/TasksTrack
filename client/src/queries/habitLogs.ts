import {
    getHabitLogs,
    getHabitLogById,
    getHabitLogsByHabitId,
    getHabitLogsByDate,
    getHabitLogsByDateRange,
    getHabitLogsByHabitAndDateRange,
    getHabitLogByHabitAndDate,
    createHabitLog,
    updateHabitLog,
    deleteHabitLog,
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
 * Custom hook for fetching a specific habit log by ID.
 */
export const useHabitLog = (id: number, options?: UseQueryOptions<IHabitLog, AxiosError>) => {
    return useQuery({
        queryKey: habitLogKeys.detail(id),
        queryFn: () => getHabitLogById(id),
        enabled: !!id,
        staleTime: CACHE_TIMES.MEDIUM,
        ...options,
    });
};

/**
 * Custom hook for fetching habit logs for a specific habit.
 */
export const useHabitLogsByHabit = (habitId: number, options?: UseQueryOptions<IHabitLog[], AxiosError>) => {
    return useQuery({
        queryKey: habitLogKeys.byHabit(habitId),
        queryFn: () => getHabitLogsByHabitId(habitId),
        enabled: !!habitId,
        staleTime: CACHE_TIMES.MEDIUM,
        ...options,
    });
};

/**
 * Custom hook for fetching habit logs for a specific date.
 */
export const useHabitLogsByDate = (date: string, options?: UseQueryOptions<IHabitLog[], AxiosError>) => {
    return useQuery({
        queryKey: habitLogKeys.byDate(date),
        queryFn: () => getHabitLogsByDate(date),
        enabled: !!date,
        staleTime: CACHE_TIMES.MEDIUM,
        ...options,
    });
};

/**
 * Custom hook for fetching habit logs for a date range.
 */
export const useHabitLogsByDateRange = (startDate: string, endDate: string, options?: UseQueryOptions<IHabitLog[], AxiosError>) => {
    return useQuery({
        queryKey: habitLogKeys.byDateRange(startDate, endDate),
        queryFn: () => getHabitLogsByDateRange(startDate, endDate),
        enabled: !!startDate && !!endDate,
        staleTime: CACHE_TIMES.MEDIUM,
        ...options,
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
 * Custom hook for fetching a habit log for a specific habit and date.
 */
export const useHabitLogByHabitAndDate = (habitId: number, date: string, options?: UseQueryOptions<IHabitLog | null, AxiosError>) => {
    return useQuery({
        queryKey: habitLogKeys.byHabitAndDate(habitId, date),
        queryFn: () => getHabitLogByHabitAndDate(habitId, date),
        enabled: !!habitId && !!date,
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

/**
 * Mutation hook for updating a habit log.
 */
export const useUpdateHabitLogMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateHabitLog,
        onSuccess: (_, variables) => {
            // Invalidate multiple related queries
            queryClient.invalidateQueries({ queryKey: habitLogKeys.all });
            if (variables.habitId) {
                queryClient.invalidateQueries({ queryKey: habitLogKeys.byHabit(variables.habitId) });
            }
            if (variables.date) {
                queryClient.invalidateQueries({ queryKey: habitLogKeys.byDate(variables.date) });
                if (variables.habitId) {
                    queryClient.invalidateQueries({ queryKey: habitLogKeys.byHabitAndDate(variables.habitId, variables.date) });
                }
            }
            queryClient.invalidateQueries({ queryKey: habitLogKeys.detail(variables.id) });
            // Also invalidate habit data as it might affect habit statistics
            queryClient.invalidateQueries({ queryKey: getHabitKey('') });
        },
    });
};

/**
 * Mutation hook for deleting a habit log.
 */
export const useDeleteHabitLogMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteHabitLog,
        onSuccess: () => {
            // Invalidate all habit log queries since we don't know which specific queries to invalidate
            queryClient.invalidateQueries({ queryKey: habitLogKeys.all });
            // Also invalidate habit data as it might affect habit statistics
            queryClient.invalidateQueries({ queryKey: getHabitKey('') });
        },
    });
};