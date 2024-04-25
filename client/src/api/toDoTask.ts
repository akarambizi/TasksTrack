import axios from 'axios';
import { IToDoTask } from './toDoTask.types';
import { getUrl } from './utils';

/**
 * Gets todo task data.
 * @param {string} query - The search query string.
 * @returns {Promise<ICity[]>}  array of cities results.
 */
export const getTodoTaskData = async (query = ''): Promise<IToDoTask[]> => {
    try {
        const url = getUrl('/tasks');
        const response = await axios.get(`${url}${query}`);
        return response?.data ?? [];
    } catch (error) {
        console.error('Failed to fetch todo tasks:', error);
        return [];
    }
};
