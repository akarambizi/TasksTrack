import { IToDoTask } from './toDoTask.types';
import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';
import { ToastService } from '../services/toastService';

export const getTodoTaskKey = (query = '') => ['tasks', query];

/**
 * Gets todo task data.
 * @param {string} query - The search query string.
 * @returns {Promise<IToDoTask[]>}  array of todo tasks results.
 */
export const getTodoTaskData = async (query = ''): Promise<IToDoTask[]> => {
    try {
        const endpoint = `/api/tasks${query ? `?${query}` : ''}`;
        return await apiGet<IToDoTask[]>(endpoint);
    } catch (error) {
        console.error('Failed to fetch todo tasks:', error);
        ToastService.error('Failed to fetch tasks');
        return [];
    }
};

/**
 * Creates a new task.
 * @param {Omit<IToDoTask, 'id' | 'createdDate' | 'createBy'>} taskData - The task data to create.
 * @returns {Promise<IToDoTask>} The created task with generated ID.
 */
export const createTask = async (taskData: Omit<IToDoTask, 'id' | 'createdDate' | 'createBy'>): Promise<IToDoTask> => {
    try {
        const endpoint = '/api/tasks';
        const response = await apiPost<IToDoTask>(endpoint, taskData);
        ToastService.success('Task created successfully');
        return response;
    } catch (error) {
        console.error('Failed to create task:', error);
        ToastService.error('Failed to create task');
        throw new Error('Failed to create task');
    }
};

/**
 * Updates an existing task.
 * @param {number} id - The ID of the task to update.
 * @param {Partial<IToDoTask>} taskData - The task data to update.
 * @returns {Promise<IToDoTask>} The updated task.
 */
export const updateTask = async (id: number, taskData: Partial<IToDoTask>): Promise<IToDoTask> => {
    try {
        const endpoint = `/api/tasks/${id}`;
        const response = await apiPut<IToDoTask>(endpoint, taskData);
        ToastService.success('Task updated successfully');
        return response;
    } catch (error) {
        console.error('Failed to update task:', error);
        ToastService.error('Failed to update task');
        throw new Error('Failed to update task');
    }
};

/**
 * Updates just the completion status of a task.
 * @param {number} id - The ID of the task to update.
 * @param {boolean} completed - The new completion status.
 * @returns {Promise<IToDoTask>} The updated task.
 */
export const updateTaskCompletion = async (id: number, completed: boolean): Promise<IToDoTask> => {
    return updateTask(id, { completed });
};

/**
 * Updates the priority of a task.
 * @param {number} id - The ID of the task to update.
 * @param {'low' | 'medium' | 'high'} priority - The new priority value.
 * @returns {Promise<IToDoTask>} The updated task.
 */
export const updateTaskPriority = async (id: number, priority: 'low' | 'medium' | 'high'): Promise<IToDoTask> => {
    try {
        const response = await updateTask(id, { priority });
        ToastService.success('Task priority updated');
        return response;
    } catch (error) {
        ToastService.error('Failed to update task priority');
        throw error;
    }
};

/**
 * Deletes a task.
 * @param {number} id - The ID of the task to delete.
 * @returns {Promise<void>}
 */
export const deleteTask = async (id: number): Promise<void> => {
    try {
        const endpoint = `/api/tasks/${id}`;
        await apiDelete(endpoint);
        ToastService.success('Task deleted successfully');
    } catch (error) {
        console.error('Failed to delete task:', error);
        ToastService.error('Failed to delete task');
        throw new Error('Failed to delete task');
    }
};

/**
 * Gets a single task by ID.
 * @param {number} id - The ID of the task to retrieve.
 * @returns {Promise<IToDoTask>} The requested task.
 */
export const getTaskById = async (id: number): Promise<IToDoTask> => {
    try {
        const endpoint = `/api/tasks/${id}`;
        const response = await apiGet<IToDoTask>(endpoint);
        return response;
    } catch (error) {
        console.error(`Failed to fetch task with ID ${id}:`, error);
        ToastService.error(`Failed to fetch task #${id}`);
        throw new Error(`Failed to fetch task with ID ${id}`);
    }
};
