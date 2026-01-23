import { getHabitData, deleteHabit, archiveHabit, activateHabit, createHabitDirect, updateHabit, IHabit, IHabitUpdateRequest } from '@/api';
import { getHabitKey } from './queryKeys';
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

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
        staleTime: 5 * 60 * 1000, // 5 minutes
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
        mutationFn: createHabitDirect,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getHabitKey('') });
        },
    });
};

/**
 * Mutation hook for updating an existing habit.
 */
export const useUpdateHabitMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: IHabitUpdateRequest) => updateHabit(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getHabitKey('') });
        },
    });
};