import { useQuery } from '@tanstack/react-query';
import {
    getWeeklyAnalytics,
    getMonthlyAnalytics,
    getQuarterlyAnalytics,
    getYearlyAnalytics,
    // getCustomAnalytics,
    // getComparisonAnalytics,
    // exportAnalytics,
    // getGoalProgress,
    // getDashboardOverview
} from '../api/analytics';
import {
    IAnalyticsResponse,
    // ICustomAnalyticsRequest,
    // IComparisonAnalyticsResponse,
    // IExportAnalyticsRequest,
    // IExportAnalyticsResponse,
    // IGoalProgress
} from '@/types';
import { ANALYTICS_KEYS } from './queryKeys';
import { CACHE_TIMES } from './constants';

/**
 * Hook to get weekly analytics data
 */
export const useWeeklyAnalytics = (
    weekOffset: number = 0,
    options?: { enabled?: boolean }
) => {
    return useQuery<IAnalyticsResponse | null>({
        queryKey: ANALYTICS_KEYS.weekly(weekOffset),
        queryFn: () => getWeeklyAnalytics(weekOffset),
        enabled: options?.enabled !== false,
        staleTime: CACHE_TIMES.MEDIUM,
        gcTime: CACHE_TIMES.LONG,
    });
};

/**
 * Hook to get monthly analytics data
 */
export const useMonthlyAnalytics = (
    monthOffset: number = 0,
    options?: { enabled?: boolean }
) => {
    return useQuery<IAnalyticsResponse | null>({
        queryKey: ANALYTICS_KEYS.monthly(monthOffset),
        queryFn: () => getMonthlyAnalytics(monthOffset),
        enabled: options?.enabled !== false,
        staleTime: CACHE_TIMES.LONG,
        gcTime: CACHE_TIMES.LONG * 2,
    });
};

/**
 * Hook to get quarterly analytics data
 */
export const useQuarterlyAnalytics = (
    quarterOffset: number = 0,
    options?: { enabled?: boolean }
) => {
    return useQuery<IAnalyticsResponse | null>({
        queryKey: ANALYTICS_KEYS.quarterly(quarterOffset),
        queryFn: () => getQuarterlyAnalytics(quarterOffset),
        enabled: options?.enabled !== false,
        staleTime: CACHE_TIMES.LONG,
        gcTime: CACHE_TIMES.LONG * 3,
    });
};

/**
 * Hook to get yearly analytics data
 */
export const useYearlyAnalytics = (
    yearOffset: number = 0,
    options?: { enabled?: boolean }
) => {
    return useQuery<IAnalyticsResponse | null>({
        queryKey: ANALYTICS_KEYS.yearly(yearOffset),
        queryFn: () => getYearlyAnalytics(yearOffset),
        enabled: options?.enabled !== false,
        staleTime: CACHE_TIMES.LONG * 2, // Longer cache for yearly data
        gcTime: CACHE_TIMES.LONG * 6,
    });
};

/**
 * Hook to get custom analytics data - Currently unused
 */
// export const useCustomAnalytics = (
//     request: ICustomAnalyticsRequest | null,
//     options?: { enabled?: boolean }
// ) => {
//     return useQuery<IAnalyticsResponse | null>({
//         queryKey: ANALYTICS_KEYS.custom(request || {}),
//         queryFn: () => request ? getCustomAnalytics(request) : Promise.resolve(null),
//         enabled: options?.enabled !== false && !!request,
//         staleTime: CACHE_TIMES.SHORT, // Shorter cache for custom queries
//         gcTime: CACHE_TIMES.MEDIUM,
//     });
// };

/**
 * Hook to get comparison analytics data - Currently unused
 */
// export const useComparisonAnalytics = (
//     period: string,
//     offset: number = 0,
//     options?: { enabled?: boolean }
// ) => {
//     return useQuery<IComparisonAnalyticsResponse | null>({
//         queryKey: ANALYTICS_KEYS.comparison(period, offset),
//         queryFn: () => getComparisonAnalytics(period, offset),
//         enabled: options?.enabled !== false && !!period,
//         staleTime: CACHE_TIMES.MEDIUM,
//         gcTime: CACHE_TIMES.LONG,
//     });
// };

/**
 * Hook to get goal progress data - Currently unused
 */
// export const useGoalProgress = (
//     startDate: string,
//     endDate: string,
//     targetMinutes?: number,
//     targetSessions?: number,
//     options?: { enabled?: boolean }
// ) => {
//     return useQuery<IGoalProgress | null>({
//         queryKey: ANALYTICS_KEYS.goalProgress(startDate, endDate, targetMinutes, targetSessions),
//         queryFn: () => getGoalProgress(startDate, endDate, targetMinutes, targetSessions),
//         enabled: options?.enabled !== false && !!startDate && !!endDate,
//         staleTime: CACHE_TIMES.SHORT, // Goals change frequently
//         gcTime: CACHE_TIMES.MEDIUM,
//     });
// };

/**
 * Hook to get dashboard overview data - Currently unused
 */
// export const useDashboardOverview = (options?: { enabled?: boolean }) => {
//     return useQuery<IAnalyticsResponse | null>({
//         queryKey: ANALYTICS_KEYS.dashboard(),
//         queryFn: getDashboardOverview,
//         enabled: options?.enabled !== false,
//         staleTime: CACHE_TIMES.SHORT, // Dashboard needs fresh data
//         gcTime: CACHE_TIMES.MEDIUM,
//     });
// };

/**
 * Mutation hook for exporting analytics data - Currently unused
 */
// export const useExportAnalytics = () => {
//     return useMutation<IExportAnalyticsResponse | null, Error, IExportAnalyticsRequest>({
//         mutationFn: exportAnalytics,
//         onSuccess: (data) => {
//             if (data) {
//                 // Create download link
//                 const blob = new Blob([data.data], { type: data.contentType });
//                 const url = URL.createObjectURL(blob);
//                 const a = document.createElement('a');
//                 a.href = url;
//                 a.download = data.fileName;
//                 document.body.appendChild(a);
//                 a.click();
//                 document.body.removeChild(a);
//                 URL.revokeObjectURL(url);
//             }
//         },
//     });
// };

/**
 * Hook to prefetch analytics data for performance - Currently unused
 */
// export const usePrefetchAnalytics = () => {
//     const queryClient = useQueryClient();

//     const prefetchWeekly = (weekOffset: number = 0) => {
//         queryClient.prefetchQuery({
//             queryKey: ANALYTICS_KEYS.weekly(weekOffset),
//             queryFn: () => getWeeklyAnalytics(weekOffset),
//             staleTime: CACHE_TIMES.MEDIUM,
//         });
//     };

//     const prefetchMonthly = (monthOffset: number = 0) => {
//         queryClient.prefetchQuery({
//             queryKey: ANALYTICS_KEYS.monthly(monthOffset),
//             queryFn: () => getMonthlyAnalytics(monthOffset),
//             staleTime: CACHE_TIMES.LONG,
//         });
//     };

//     const prefetchDashboard = () => {
//         queryClient.prefetchQuery({
//             queryKey: ANALYTICS_KEYS.dashboard(),
//             queryFn: getDashboardOverview,
//             staleTime: CACHE_TIMES.SHORT,
//         });
//     };

//     return {
//         prefetchWeekly,
//         prefetchMonthly,
//         prefetchDashboard,
//     };
// };