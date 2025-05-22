import { getTodoTaskData, IToDoTask } from '@/api';
import { getTodoTaskKey } from '@/hooks/queryKeys';
import { AxiosError } from 'axios';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

/**
 * A custom hook that fetches todo tasks data.
 * @param {string} query - The search query string.
 * @param [options] - Optional options for the `useQuery` hook.
 * @returns {QueryObserverResult<IToDoTask[], AxiosError>} The result of the `useQuery` hook.
 */
export const useTodoTaskData = (query: string, options?: UseQueryOptions<IToDoTask[], AxiosError, IToDoTask[], ReturnType<typeof getTodoTaskKey>>) => {
    return useQuery({
        queryKey: getTodoTaskKey(query),
        queryFn: () => getTodoTaskData(query),
        refetchOnWindowFocus: false,
        retry: false,
        ...options,
    });
};
