import axios from 'axios';
import { getUrl } from './utils';

/**
 * Interface for User data
 */
export interface IUser {
  id: number;
  username: string;
  email: string;
  createdDate?: string;
  updatedDate?: string;
}

/**
 * Gets all users.
 * @returns {Promise<IUser[]>} Promise resolving to an array of users
 */
export const getUsers = async (): Promise<IUser[]> => {
  try {
    const url = getUrl('/api/users');
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
};

/**
 * Get a user by ID.
 * @param {number} id - The user ID to retrieve
 * @returns {Promise<IUser>} Promise resolving to a user object
 */
export const getUserById = async (id: number): Promise<IUser | null> => {
  try {
    const url = getUrl(`/api/users/${id}`);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch user with ID ${id}:`, error);
    return null;
  }
};

/**
 * Create a new user.
 * @param {Omit<IUser, 'id'>} userData - The user data to create
 * @returns {Promise<IUser>} Promise resolving to the created user
 */
export const createUser = async (userData: Omit<IUser, 'id'>): Promise<IUser> => {
  try {
    const url = getUrl('/api/users');
    const response = await axios.post(url, userData);
    return response.data;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw new Error('Failed to create user');
  }
};

/**
 * Update an existing user.
 * @param {number} id - The ID of the user to update
 * @param {Partial<IUser>} userData - The user data to update
 * @returns {Promise<IUser>} Promise resolving to the updated user
 */
export const updateUser = async (id: number, userData: Partial<IUser>): Promise<IUser> => {
  try {
    const url = getUrl(`/api/users/${id}`);
    const response = await axios.put(url, userData);
    return response.data;
  } catch (error) {
    console.error('Failed to update user:', error);
    throw new Error('Failed to update user');
  }
};

/**
 * Delete a user.
 * @param {number} id - The ID of the user to delete
 * @returns {Promise<void>}
 */
export const deleteUser = async (id: number): Promise<void> => {
  try {
    const url = getUrl(`/api/users/${id}`);
    await axios.delete(url);
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw new Error('Failed to delete user');
  }
};

/**
 * Get the current user profile.
 * @returns {Promise<IUser>} Promise resolving to the current user
 */
export const getCurrentUser = async (): Promise<IUser | null> => {
  try {
    const url = getUrl('/api/users/current');
    const response = await axios.get(url, {
      withCredentials: true // Include cookies in the request
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    return null;
  }
};
