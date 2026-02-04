import { IHabit } from './habit.types';
import { apiGet, apiPost, apiDelete } from './apiClient';
import { ToastService } from '../services/toastService';

/**
 * Gets habit data.
 * @param {string} query - The search query string.
 * @returns {Promise<IHabit[]>} array of habits results.
 */
export const getHabitData = async (query = ''): Promise<IHabit[]> => {
    try {
        const endpoint = `/api/habits${query ? `?${query}` : ''}`;
        return await apiGet<IHabit[]>(endpoint);
    } catch (error) {
        console.error('Failed to fetch habits:', error);
        ToastService.error('Failed to fetch habits');
        return [];
    }
};

/**
 * Gets a single habit by ID.
 * @param {number} habitId - The ID of the habit to fetch.
 * @returns {Promise<IHabit>} The habit with the specified ID.
 */
export const getHabitById = async (habitId: number): Promise<IHabit> => {
    try {
        const endpoint = `/api/habits/${habitId}`;
        const response = await apiGet<IHabit>(endpoint);
        return response;
    } catch (error) {
        console.error('Failed to fetch habit:', error);
        ToastService.error('Failed to fetch habit');
        throw error;
    }
};

/**
 * Creates a new habit using full habit object (temporary fix for backend expecting full object).
 * @param {Partial<IHabit>} habitData - The habit data object.
 * @returns {Promise<IHabit>} The created habit with generated ID.
 */
export const createHabit = async (habitData: Partial<IHabit>): Promise<IHabit> => {
    try {
        const endpoint = '/api/habits';
        const response = await apiPost<IHabit>(endpoint, habitData);
        ToastService.success('Habit created successfully');
        return response;
    } catch (error) {
        console.error('Failed to create habit:', error);
        ToastService.error('Failed to create habit');
        throw error;
    }
};


/**
 * Deletes a habit.
 * @param {number} id - The ID of the habit to delete.
 * @returns {Promise<void>}
 */
export const deleteHabit = async (id: number): Promise<void> => {
    try {
        const endpoint = `/api/habits/${id}`;
        await apiDelete(endpoint);
        ToastService.success('Habit deleted successfully');
    } catch (error) {
        console.error('Failed to delete habit:', error);
        ToastService.error('Failed to delete habit');
        throw error;
    }
};

/**
 * Archives a habit (sets IsActive to false).
 * @param {number} id - The ID of the habit to archive.
 * @returns {Promise<void>}
 */
export const archiveHabit = async (id: number): Promise<void> => {
    try {
        const endpoint = `/api/habits/${id}/archive`;
        await apiPost(endpoint, {});
        ToastService.success('Habit archived successfully');
    } catch (error) {
        console.error('Failed to archive habit:', error);
        ToastService.error('Failed to archive habit');
        throw error;
    }
};

/**
 * Activates a habit (sets IsActive to true).
 * @param {number} id - The ID of the habit to activate.
 * @returns {Promise<void>}
 */
export const activateHabit = async (id: number): Promise<void> => {
    try {
        const endpoint = `/api/habits/${id}/activate`;
        await apiPost(endpoint, {});
        ToastService.success('Habit activated successfully');
    } catch (error) {
        console.error('Failed to activate habit:', error);
        ToastService.error('Failed to activate habit');
        throw error;
    }
};