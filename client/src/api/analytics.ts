import {
    IAnalyticsResponse,
    // ICustomAnalyticsRequest,
    // IComparisonAnalyticsResponse,
    // IExportAnalyticsRequest,
    // IExportAnalyticsResponse,
    // IGoalProgress
} from './analytics.types';
import { apiGet } from './apiClient'; // apiPost unused
import { ToastService } from '../services/toastService';

/**
 * Gets weekly analytics data for the specified week offset.
 * @param {number} weekOffset - Week offset from current week (0 = current week, -1 = last week, etc.)
 * @returns {Promise<IAnalyticsResponse>} Weekly analytics data
 */
export const getWeeklyAnalytics = async (weekOffset: number = 0): Promise<IAnalyticsResponse | null> => {
    try {
        const endpoint = `/api/analytics/weekly?weekOffset=${weekOffset}`;
        return await apiGet<IAnalyticsResponse>(endpoint);
    } catch (error) {
        console.error('Failed to fetch weekly analytics:', error);
        ToastService.error('Failed to fetch weekly analytics');
        return null;
    }
};

/**
 * Gets monthly analytics data for the specified month offset.
 * @param {number} monthOffset - Month offset from current month (0 = current month, -1 = last month, etc.)
 * @returns {Promise<IAnalyticsResponse>} Monthly analytics data
 */
export const getMonthlyAnalytics = async (monthOffset: number = 0): Promise<IAnalyticsResponse | null> => {
    try {
        const endpoint = `/api/analytics/monthly?monthOffset=${monthOffset}`;
        return await apiGet<IAnalyticsResponse>(endpoint);
    } catch (error) {
        console.error('Failed to fetch monthly analytics:', error);
        ToastService.error('Failed to fetch monthly analytics');
        return null;
    }
};

/**
 * Gets quarterly analytics data for the specified quarter offset.
 * @param {number} quarterOffset - Quarter offset from current quarter (0 = current quarter, -1 = last quarter, etc.)
 * @returns {Promise<IAnalyticsResponse>} Quarterly analytics data
 */
export const getQuarterlyAnalytics = async (quarterOffset: number = 0): Promise<IAnalyticsResponse | null> => {
    try {
        const endpoint = `/api/analytics/quarterly?quarterOffset=${quarterOffset}`;
        return await apiGet<IAnalyticsResponse>(endpoint);
    } catch (error) {
        console.error('Failed to fetch quarterly analytics:', error);
        ToastService.error('Failed to fetch quarterly analytics');
        return null;
    }
};

/**
 * Gets yearly analytics data for the specified year offset.
 * @param {number} yearOffset - Year offset from current year (0 = current year, -1 = last year, etc.)
 * @returns {Promise<IAnalyticsResponse>} Yearly analytics data
 */
export const getYearlyAnalytics = async (yearOffset: number = 0): Promise<IAnalyticsResponse | null> => {
    try {
        const endpoint = `/api/analytics/yearly?yearOffset=${yearOffset}`;
        return await apiGet<IAnalyticsResponse>(endpoint);
    } catch (error) {
        console.error('Failed to fetch yearly analytics:', error);
        ToastService.error('Failed to fetch yearly analytics');
        return null;
    }
};

/**
 * Gets custom analytics data for a specific date range and filters - Currently unused
 * @param {ICustomAnalyticsRequest} request - Custom analytics request parameters
 * @returns {Promise<IAnalyticsResponse>} Custom analytics data
 */
// export const getCustomAnalytics = async (request: ICustomAnalyticsRequest): Promise<IAnalyticsResponse | null> => {
//     try {
//         const endpoint = '/api/analytics/custom';
//         return await apiPost<IAnalyticsResponse>(endpoint, request);
//     } catch (error) {
//         console.error('Failed to fetch custom analytics:', error);
//         ToastService.error('Failed to fetch custom analytics');
//         return null;
//     }
// };

/**
 * Gets comparison analytics between current and previous period - Currently unused
 * @param {string} period - Period type ('weekly', 'monthly', 'quarterly', 'yearly')
 * @param {number} offset - Period offset (0 for current period)
 * @returns {Promise<IComparisonAnalyticsResponse>} Comparison analytics data
 */
// export const getComparisonAnalytics = async (
//     period: string,
//     offset: number = 0
// ): Promise<IComparisonAnalyticsResponse | null> => {
//     try {
//         const endpoint = `/api/analytics/comparison?period=${period}&offset=${offset}`;
//         return await apiGet<IComparisonAnalyticsResponse>(endpoint);
//     } catch (error) {
//         console.error('Failed to fetch comparison analytics:', error);
//         ToastService.error('Failed to fetch comparison analytics');
//         return null;
//     }
// };

/**
 * Exports analytics data in specified format - Currently unused
 * @param {IExportAnalyticsRequest} request - Export request parameters
 * @returns {Promise<IExportAnalyticsResponse>} Export data
 */
// export const exportAnalytics = async (request: IExportAnalyticsRequest): Promise<IExportAnalyticsResponse | null> => {
//     try {
//         const endpoint = '/api/analytics/export';
//         return await apiPost<IExportAnalyticsResponse>(endpoint, request);
//     } catch (error) {
//         console.error('Failed to export analytics:', error);
//         ToastService.error('Failed to export analytics');
//         return null;
//     }
// };

/**
 * Gets goal progress for a specific date range - Currently unused
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @param {number} targetMinutes - Optional target minutes for the period
 * @param {number} targetSessions - Optional target sessions for the period
 * @returns {Promise<IGoalProgress>} Goal progress data
 */
// export const getGoalProgress = async (
//     startDate: string,
//     endDate: string,
//     targetMinutes?: number,
//     targetSessions?: number
// ): Promise<IGoalProgress | null> => {
//     try {
//         const params = new URLSearchParams({
//             startDate,
//             endDate,
//             ...(targetMinutes && { targetMinutes: targetMinutes.toString() }),
//             ...(targetSessions && { targetSessions: targetSessions.toString() })
//         });
// 
//         const endpoint = `/api/analytics/goal-progress?${params}`;
//         return await apiGet<IGoalProgress>(endpoint);
//     } catch (error) {
//         console.error('Failed to fetch goal progress:', error);
//         ToastService.error('Failed to fetch goal progress');
//         return null;
//     }
// };

/**
 * Gets dashboard overview with key metrics and visualizations - Currently unused
 * @returns {Promise<IAnalyticsResponse>} Dashboard overview data
 */
// export const getDashboardOverview = async (): Promise<IAnalyticsResponse | null> => {
//     try {
//         const endpoint = '/api/analytics/dashboard';
//         return await apiGet<IAnalyticsResponse>(endpoint);
//     } catch (error) {
//         console.error('Failed to fetch dashboard overview:', error);
//         ToastService.error('Failed to fetch dashboard overview');
//         return null;
//     }
// };