import { getHabitData, IHabit } from '@/api';
import { getHabitKey } from '@/hooks/queryKeys';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
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