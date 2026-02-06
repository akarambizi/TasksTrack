import {
    IActivityGridResponse,
    IActivityStatisticsResponse
} from './activity.types';
import { apiGet } from './apiClient';
import { ToastService } from '../services/toastService';

/**
 * Gets activity grid data for a specific date range.
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @param {string} query - Additional OData query parameters
 * @returns {Promise<IActivityGridResponse[]>} Array of activity grid data
 */
export const getActivityGrid = async (
    startDate: string,
    endDate: string,
    query = ''
): Promise<IActivityGridResponse[]> => {
    try {
        const params = new URLSearchParams({
            startDate,
            endDate,
            ...(query && { $filter: query })
        });

        const endpoint = `/api/activity/grid?${params}`;
        return await apiGet<IActivityGridResponse[]>(endpoint);
    } catch (error) {
        console.error('Failed to fetch activity grid:', error);
        ToastService.error('Failed to fetch activity grid');
        return [];
    }
};

/**
 * Gets overall activity statistics for the user.
 * @returns {Promise<IActivityStatisticsResponse>} Activity statistics data
 */
export const getActivityStatistics = async (): Promise<IActivityStatisticsResponse | null> => {
    try {
        const endpoint = '/api/activity/statistics';
        return await apiGet<IActivityStatisticsResponse>(endpoint);
    } catch (error) {
        console.error('Failed to fetch activity statistics:', error);
        ToastService.error('Failed to fetch activity statistics');
        return null;
    }
};
