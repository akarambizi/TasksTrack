import {
    startFocusSession,
    pauseFocusSession,
    resumeFocusSession,
    completeFocusSession,
    cancelFocusSession,
    getFocusSessions,
    getActiveFocusSession,
    getFocusSessionAnalytics,
    IFocusSession,
    IFocusSessionCreateRequest,
    IFocusSessionUpdateRequest,
    IFocusSessionAnalytics
} from '@/api';
import { focusSessionKeys } from './queryKeys';
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { CACHE_TIMES } from './constants';
import { ODataQueryBuilder } from '@/utils/odataQueryBuilder';

/**
 * Custom hook for fetching focus sessions with a pre-built query string.
 * @param {string} queryString - Pre-built OData query string.
 * @param {UseQueryOptions} options - Additional options for the query.
 * @returns The result of the `useQuery` hook.
 */
export const useFocusSessions = (
    queryString?: string,
    options?: UseQueryOptions<IFocusSession[], AxiosError>
) => {
    return useQuery({
        queryKey: focusSessionKeys.list({ queryString: queryString || '' }),
        queryFn: () => getFocusSessions(queryString),
        staleTime: CACHE_TIMES.SHORT, // 1 minute - focus sessions change frequently
        ...options,
    });
};

/**
 * Custom hook for fetching the active focus session.
 * @param {UseQueryOptions} options - Additional options for the query.
 * @returns The result of the `useQuery` hook.
 */
export const useActiveFocusSession = (options?: UseQueryOptions<IFocusSession | null, AxiosError>) => {
    return useQuery({
        queryKey: focusSessionKeys.active(),
        queryFn: getActiveFocusSession,
        staleTime: CACHE_TIMES.SHORT, // 1 minute - active session changes frequently
        refetchInterval: 30000, // Refetch every 30 seconds for active session
        ...options,
    });
};

/**
 * Custom hook for fetching focus session analytics with query string support.
 * @param {string} queryString - Pre-built OData query string.
 * @param {UseQueryOptions} options - Additional options for the query.
 * @returns The result of the `useQuery` hook.
 */
export const useFocusSessionAnalytics = (
    queryString?: string,
    options?: UseQueryOptions<IFocusSessionAnalytics, AxiosError>
) => {
    return useQuery({
        queryKey: focusSessionKeys.analyticsWithFilters({ queryString: queryString || '' }),
        queryFn: () => getFocusSessionAnalytics(queryString),
        staleTime: CACHE_TIMES.MEDIUM, // 2 minutes
        ...options,
    });
};

/**
 * Mutation hook for starting a new focus session.
 */
export const useStartFocusSessionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: IFocusSessionCreateRequest) => startFocusSession(data),
        onSuccess: () => {
            // Invalidate both sessions list and active session
            queryClient.invalidateQueries({ queryKey: focusSessionKeys.all });
            queryClient.invalidateQueries({ queryKey: focusSessionKeys.active() });
        },
    });
};

/**
 * Mutation hook for pausing the active focus session.
 */
export const usePauseFocusSessionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: pauseFocusSession,
        onSuccess: (data) => {
            // Update the active session cache with the paused session
            queryClient.setQueryData(focusSessionKeys.active(), data);
            queryClient.invalidateQueries({ queryKey: focusSessionKeys.lists() });
        },
    });
};

/**
 * Mutation hook for resuming the paused focus session.
 */
export const useResumeFocusSessionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: resumeFocusSession,
        onSuccess: (data) => {
            // Update the active session cache with the resumed session
            queryClient.setQueryData(focusSessionKeys.active(), data);
            queryClient.invalidateQueries({ queryKey: focusSessionKeys.lists() });
        },
    });
};

/**
 * Mutation hook for completing the active focus session.
 */
export const useCompleteFocusSessionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data?: IFocusSessionUpdateRequest) => completeFocusSession(data),
        onSuccess: () => {
            // Clear the active session and invalidate related queries
            queryClient.setQueryData(focusSessionKeys.active(), null);
            queryClient.invalidateQueries({ queryKey: focusSessionKeys.all });
            queryClient.invalidateQueries({ queryKey: focusSessionKeys.analytics() });
        },
    });
};

/**
 * Mutation hook for cancelling/interrupting the active focus session.
 */
export const useCancelFocusSessionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data?: IFocusSessionUpdateRequest) => cancelFocusSession(data),
        onSuccess: () => {
            // Clear the active session and invalidate related queries
            queryClient.setQueryData(focusSessionKeys.active(), null);
            queryClient.invalidateQueries({ queryKey: focusSessionKeys.all });
            queryClient.invalidateQueries({ queryKey: focusSessionKeys.analytics() });
        },
    });
};

/**
 * Custom hook for focus sessions by habit ID.
 * @param {number} habitId - The habit ID to filter by.
 * @param {UseQueryOptions} options - Additional options for the query.
 * @returns The result of the `useQuery` hook.
 */
export const useFocusSessionsByHabit = (
    habitId: number,
    options?: UseQueryOptions<IFocusSession[], AxiosError>
) => {
    // Build query for specific habit
    const queryString = new ODataQueryBuilder()
        .filter(`habitId eq ${habitId}`)
        .orderBy('startTime desc')
        .build();

    return useQuery({
        queryKey: focusSessionKeys.byHabit(habitId),
        queryFn: () => getFocusSessions(queryString),
        staleTime: CACHE_TIMES.MEDIUM, // 2 minutes
        enabled: !!habitId && habitId > 0,
        ...options,
    });
};