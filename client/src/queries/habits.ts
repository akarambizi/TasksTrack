import { getHabitData, getHabitById, deleteHabit, archiveHabit, activateHabit, createHabit, IHabit } from '@/api';
import { getHabitKey } from './queryKeys';
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { CACHE_TIMES } from './constants';

/**
 * Custom hook for fetching habit data.
 * @param {string} query - The query string for filtering habits.
 * @param {UseQueryOptions} options - Additional options for the query.
 * @returns {QueryObserverResult<IHabit[], AxiosError>} The result of the `useQuery` hook.
 */
export const useHabitData = (query: string, options?: UseQueryOptions<IHabit[], AxiosError, IHabit[], ReturnType<typeof getHabitKey>>) => {
    return useQuery({
        queryKey: getHabitKey(query),
        queryFn: () => getHabitData(query),
        staleTime: CACHE_TIMES.LONG, // 5 minutes
        ...options,
    });
};

/**
 * Custom hook for fetching a single habit by ID.
 * @param {number} habitId - The ID of the habit to fetch.
 * @param {UseQueryOptions} options - Additional options for the query.
 * @returns {QueryObserverResult<IHabit, AxiosError>} The result of the `useQuery` hook.
 */
export const useHabitById = (habitId: number, options?: UseQueryOptions<IHabit, AxiosError, IHabit, string[]>) => {
    return useQuery({
        queryKey: ['habit', habitId.toString()],
        queryFn: () => getHabitById(habitId),
        staleTime: CACHE_TIMES.LONG, // 5 minutes
        enabled: !!habitId && habitId > 0,
        ...options,
    });
};

/**
 * Mutation hook for deleting a habit.
 */
export const useDeleteHabitMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteHabit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getHabitKey('') });
        },
    });
};

/**
 * Mutation hook for archiving a habit.
 */
export const useArchiveHabitMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: archiveHabit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getHabitKey('') });
        },
    });
};

/**
 * Mutation hook for activating a habit.
 */
export const useActivateHabitMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: activateHabit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getHabitKey('') });
        },
    });
};

/**
 * Mutation hook for creating a new habit.
 */
export const useCreateHabitMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createHabit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getHabitKey('') });
        },
    });
};
