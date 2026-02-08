import { useQuery } from '@tanstack/react-query';
import {
    getActivityGrid,
    getActivityStatistics
} from '../api/activity';
import {
    IActivityGridResponse,
    IActivityStatisticsResponse
} from '@/types';
import { ACTIVITY_KEYS } from './queryKeys';
import { CACHE_TIMES } from './constants';

/**
 * Hook to get activity grid data for a specific date range
 */
export const useActivityGrid = (
    startDate: string,
    endDate: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<IActivityGridResponse[]>({
        queryKey: ACTIVITY_KEYS.grid(startDate, endDate),
        queryFn: () => getActivityGrid(startDate, endDate),
        enabled: options?.enabled !== false && !!startDate && !!endDate,
        staleTime: CACHE_TIMES.MEDIUM,
        gcTime: CACHE_TIMES.LONG,
    });
};

/**
 * Hook to get overall activity statistics
 */
export const useActivityStatistics = (options?: { enabled?: boolean }) => {
    return useQuery<IActivityStatisticsResponse | null>({
        queryKey: ACTIVITY_KEYS.statistics(),
        queryFn: getActivityStatistics,
        enabled: options?.enabled !== false,
        staleTime: CACHE_TIMES.LONG,
        gcTime: CACHE_TIMES.LONG * 3, // 15 minutes
    });
};