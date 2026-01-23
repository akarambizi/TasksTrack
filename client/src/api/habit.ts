import { IHabit, IHabitCreateRequest, IHabitUpdateRequest } from './habit.types';
import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';
import { ToastService } from '../services/toastService';
import { getHabitKey } from '@/hooks/queryKeys';

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
 * Creates a new habit using full habit object (temporary fix for backend expecting full object).
 * @param {Partial<IHabit>} habitData - The habit data object.
 * @returns {Promise<IHabit>} The created habit with generated ID.
 */
export const createHabitDirect = async (habitData: Partial<IHabit>): Promise<IHabit> => {
    try {
        const endpoint = '/api/habits';
        const response = await apiPost<IHabit>(endpoint, habitData);
        ToastService.success('Habit created successfully');
        return response;
    } catch (error) {
        console.error('Failed to create habit:', error);
        ToastService.error('Failed to create habit');
        throw new Error('Failed to create habit');
    }
};

/**
 * Creates a new habit.
 * @param {IHabitCreateRequest} habitData - The habit data to create.
 * @returns {Promise<IHabit>} The created habit with generated ID.
 */
export const createHabit = async (habitData: IHabitCreateRequest): Promise<IHabit> => {
    try {
        const endpoint = '/api/habits';
        const response = await apiPost<IHabit>(endpoint, habitData);
        ToastService.success('Habit created successfully');
        return response;
    } catch (error) {
        console.error('Failed to create habit:', error);
        ToastService.error('Failed to create habit');
        throw new Error('Failed to create habit');
    }
};

/**
 * Updates an existing habit.
 * @param {number} id - The ID of the habit to update.
 * @param {IHabitUpdateRequest} habitData - The habit data to update.
 * @returns {Promise<IHabit>} The updated habit.
 */
export const updateHabit = async (id: number, habitData: IHabitUpdateRequest): Promise<IHabit> => {
    try {
        const endpoint = `/api/habits/${id}`;
        const response = await apiPut<IHabit>(endpoint, habitData);
        ToastService.success('Habit updated successfully');
        return response;
    } catch (error) {
        console.error('Failed to update habit:', error);
        ToastService.error('Failed to update habit');
        throw new Error('Failed to update habit');
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
        throw new Error('Failed to delete habit');
    }
};

/**
 * Gets a single habit by ID.
 * @param {number} id - The ID of the habit to retrieve.
 * @returns {Promise<IHabit>} The requested habit.
 */
export const getHabitById = async (id: number): Promise<IHabit> => {
    try {
        const endpoint = `/api/habits/${id}`;
        const response = await apiGet<IHabit>(endpoint);
        return response;
    } catch (error) {
        console.error(`Failed to fetch habit with ID ${id}:`, error);
        ToastService.error(`Failed to fetch habit #${id}`);
        throw new Error(`Failed to fetch habit with ID ${id}`);
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
        throw new Error('Failed to archive habit');
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
        throw new Error('Failed to activate habit');
    }
};

/**
 * Gets active habits only.
 * @returns {Promise<IHabit[]>} Array of active habits.
 */
export const getActiveHabits = async (): Promise<IHabit[]> => {
    try {
        const endpoint = '/api/habits?active=true';
        return await apiGet<IHabit[]>(endpoint);
    } catch (error) {
        console.error('Failed to fetch active habits:', error);
        ToastService.error('Failed to fetch active habits');
        return [];
    }
};