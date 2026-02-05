import {
    IActivityGridResponse,
    IActivitySummaryResponse,
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
 * Gets activity summary for a date range.
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<IActivitySummaryResponse>} Activity summary data
 */
export const getActivitySummary = async (
    startDate: string,
    endDate: string
): Promise<IActivitySummaryResponse | null> => {
    try {
        const params = new URLSearchParams({
            startDate,
            endDate
        });

        const endpoint = `/api/activity/summary?${params}`;
        return await apiGet<IActivitySummaryResponse>(endpoint);
    } catch (error) {
        console.error('Failed to fetch activity summary:', error);
        ToastService.error('Failed to fetch activity summary');
        return null;
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

/**
 * Gets current streak for a specific habit.
 * @param {number} habitId - The ID of the habit
 * @returns {Promise<number>} Current streak count in days
 */
export const getCurrentStreak = async (habitId: number): Promise<number> => {
    try {
        const endpoint = `/api/activity/streak/current/${habitId}`;
        return await apiGet<number>(endpoint);
    } catch (error) {
        console.error('Failed to fetch current streak:', error);
        ToastService.error('Failed to fetch current streak');
        return 0;
    }
};

/**
 * Gets longest streak for a specific habit.
 * @param {number} habitId - The ID of the habit
 * @returns {Promise<number>} Longest streak count in days
 */
export const getLongestStreak = async (habitId: number): Promise<number> => {
    try {
        const endpoint = `/api/activity/streak/longest/${habitId}`;
        return await apiGet<number>(endpoint);
    } catch (error) {
        console.error('Failed to fetch longest streak:', error);
        ToastService.error('Failed to fetch longest streak');
        return 0;
    }
};

/**
 * Gets current overall streak across all habits.
 * @returns {Promise<number>} Current overall streak count in days
 */
export const getCurrentOverallStreak = async (): Promise<number> => {
    try {
        const endpoint = '/api/activity/streak/overall/current';
        return await apiGet<number>(endpoint);
    } catch (error) {
        console.error('Failed to fetch current overall streak:', error);
        ToastService.error('Failed to fetch current overall streak');
        return 0;
    }
};

/**
 * Gets longest overall streak across all habits.
 * @returns {Promise<number>} Longest overall streak count in days
 */
export const getLongestOverallStreak = async (): Promise<number> => {
    try {
        const endpoint = '/api/activity/streak/overall/longest';
        return await apiGet<number>(endpoint);
    } catch (error) {
        console.error('Failed to fetch longest overall streak:', error);
        ToastService.error('Failed to fetch longest overall streak');
        return 0;
    }
};