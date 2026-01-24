import { IHabitLog, IHabitLogCreateRequest, IHabitLogUpdateRequest } from './habit.types';
import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';
import { ToastService } from '../services/toastService';
import { AxiosError } from 'axios';

// Re-export types for external use
export type { IHabitLog, IHabitLogCreateRequest, IHabitLogUpdateRequest };

/**
 * Gets all habit logs.
 * @returns {Promise<IHabitLog[]>} Array of habit logs.
 */
export const getHabitLogs = async (): Promise<IHabitLog[]> => {
    try {
        const endpoint = '/api/habit-logs';
        return await apiGet<IHabitLog[]>(endpoint);
    } catch (error) {
        console.error('Failed to fetch habit logs:', error);
        ToastService.error('Failed to fetch habit logs');
        return [];
    }
};

/**
 * Gets a habit log by ID.
 * @param {number} id - The habit log ID.
 * @returns {Promise<IHabitLog>} The habit log.
 */
export const getHabitLogById = async (id: number): Promise<IHabitLog> => {
    try {
        const endpoint = `/api/habit-logs/${id}`;
        return await apiGet<IHabitLog>(endpoint);
    } catch (error) {
        console.error(`Failed to fetch habit log ${id}:`, error);
        ToastService.error('Failed to fetch habit log');
        throw error;
    }
};

/**
 * Gets habit logs for a specific habit.
 * @param {number} habitId - The habit ID.
 * @returns {Promise<IHabitLog[]>} Array of habit logs for the habit.
 */
export const getHabitLogsByHabitId = async (habitId: number, limit?: number): Promise<IHabitLog[]> => {
    try {
        let endpoint = `/api/habit-logs/habit/${habitId}`;
        if (limit) {
            endpoint += `?limit=${limit}`;
        }
        return await apiGet<IHabitLog[]>(endpoint);
    } catch (error) {
        console.error(`Failed to fetch habit logs for habit ${habitId}:`, error);
        ToastService.error('Failed to fetch habit logs');
        throw error;
    }
};

/**
 * Gets habit logs for a specific date.
 * @param {string} date - The date in YYYY-MM-DD format.
 * @returns {Promise<IHabitLog[]>} Array of habit logs for the date.
 */
export const getHabitLogsByDate = async (date: string): Promise<IHabitLog[]> => {
    try {
        const endpoint = `/api/habit-logs/date/${date}`;
        return await apiGet<IHabitLog[]>(endpoint);
    } catch (error) {
        console.error(`Failed to fetch habit logs for date ${date}:`, error);
        ToastService.error('Failed to fetch habit logs');
        throw error;
    }
};

/**
 * Gets habit logs for a date range.
 * @param {string} startDate - The start date in YYYY-MM-DD format.
 * @param {string} endDate - The end date in YYYY-MM-DD format.
 * @returns {Promise<IHabitLog[]>} Array of habit logs for the date range.
 */
export const getHabitLogsByDateRange = async (startDate: string, endDate: string): Promise<IHabitLog[]> => {
    try {
        const endpoint = `/api/habit-logs/date-range?startDate=${startDate}&endDate=${endDate}`;
        return await apiGet<IHabitLog[]>(endpoint);
    } catch (error) {
        console.error(`Failed to fetch habit logs for date range ${startDate} to ${endDate}:`, error);
        ToastService.error('Failed to fetch habit logs');
        return [];
    }
};

/**
 * Gets habit logs for a specific habit and date range.
 * @param {number} habitId - The habit ID.
 * @param {string} startDate - The start date in YYYY-MM-DD format.
 * @param {string} endDate - The end date in YYYY-MM-DD format.
 * @returns {Promise<IHabitLog[]>} Array of habit logs for the habit and date range.
 */
export const getHabitLogsByHabitAndDateRange = async (habitId: number, startDate: string, endDate: string): Promise<IHabitLog[]> => {
    try {
        const endpoint = `/api/habit-logs/habit/${habitId}/date-range?startDate=${startDate}&endDate=${endDate}`;
        return await apiGet<IHabitLog[]>(endpoint);
    } catch (error) {
        console.error(`Failed to fetch habit logs for habit ${habitId} and date range ${startDate} to ${endDate}:`, error);
        ToastService.error('Failed to fetch habit logs');
        return [];
    }
};

/**
 * Gets a habit log for a specific habit and date.
 * @param {number} habitId - The habit ID.
 * @param {string} date - The date in YYYY-MM-DD format.
 * @returns {Promise<IHabitLog | null>} The habit log or null if not found.
 */
export const getHabitLogByHabitAndDate = async (habitId: number, date: string): Promise<IHabitLog | null> => {
    try {
        const endpoint = `/api/habit-logs/habit/${habitId}/date/${date}`;
        return await apiGet<IHabitLog>(endpoint);
    } catch (error) {
        // Return null if not found (404) instead of throwing error
        if ((error as AxiosError)?.response?.status === 404) {
            return null;
        }
        console.error(`Failed to fetch habit log for habit ${habitId} on date ${date}:`, error);
        ToastService.error('Failed to fetch habit log');
        throw error;
    }
};

/**
 * Creates a new habit log.
 * @param {IHabitLogCreateRequest} logData - The habit log data to create.
 * @returns {Promise<IHabitLog>} The created habit log with generated ID.
 */
export const createHabitLog = async (logData: IHabitLogCreateRequest): Promise<IHabitLog> => {
    try {
        const endpoint = '/api/habit-logs';
        const response = await apiPost<IHabitLog>(endpoint, logData);
        ToastService.success('Habit log created successfully');
        return response;
    } catch (error) {
        console.error('Failed to create habit log:', error);
        ToastService.error('Failed to create habit log');
        throw error;
    }
};

/**
 * Updates an existing habit log.
 * @param {IHabitLogUpdateRequest} logData - The habit log data to update.
 * @returns {Promise<void>}
 */
export const updateHabitLog = async (logData: IHabitLogUpdateRequest): Promise<void> => {
    try {
        const endpoint = `/api/habit-logs/${logData.id}`;
        await apiPut(endpoint, logData);
        ToastService.success('Habit log updated successfully');
    } catch (error) {
        console.error('Failed to update habit log:', error);
        ToastService.error('Failed to update habit log');
        throw error;
    }
};

/**
 * Deletes a habit log.
 * @param {number} id - The habit log ID to delete.
 * @returns {Promise<void>}
 */
export const deleteHabitLog = async (id: number): Promise<void> => {
    try {
        const endpoint = `/api/habit-logs/${id}`;
        await apiDelete(endpoint);
        ToastService.success('Habit log deleted successfully');
    } catch (error) {
        console.error(`Failed to delete habit log ${id}:`, error);
        ToastService.error('Failed to delete habit log');
        throw error;
    }
};