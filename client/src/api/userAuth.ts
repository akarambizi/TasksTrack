import { IAuthData, IAuthResult } from './userAuth.types';
import { apiPost } from './apiClient';
import { ToastService } from '../services/toastService';

/**
 * Authentication API key for React Query
 */
export const authKeys = {
  all: ['auth'] as const,
  login: () => [...authKeys.all, 'login'] as const,
  register: () => [...authKeys.all, 'register'] as const,
  logout: () => [...authKeys.all, 'logout'] as const,
  resetPassword: () => [...authKeys.all, 'reset-password'] as const,
  validateToken: () => [...authKeys.all, 'validate-token'] as const,
};

/**
 * Registers a new user.
 * @param userData - The user data including email, username, and password.
 * @returns A promise that resolves to the response data.
 * @throws An error if the registration fails.
 */
export const registerUser = async (userData: IAuthData): Promise<IAuthResult> => {
    try {
        const endpoint = '/api/auth/register';
        const response = await apiPost<IAuthResult>(endpoint, userData);
        ToastService.success('Registration successful');
        return response;
    } catch (error) {
        console.error('Registration failed:', error);
        ToastService.error('Registration failed');
        throw new Error('Registration failed');
    }
};

/**
 * Logs in a user with the provided email and password.
 * @param userData - The user data containing the email and password.
 * @returns A Promise that resolves to the response data from the login API.
 * @throws An error if the login fails.
 */
export const loginUser = async (userData: IAuthData): Promise<IAuthResult> => {
    try {
        const endpoint = '/api/auth/login';
        const response = await apiPost<IAuthResult>(endpoint, userData);

        // Save token to local storage if provided
        if (response.token) {
            localStorage.setItem('authToken', response.token);
        }

        ToastService.success('Login successful');
        return response;
    } catch (error) {
        ToastService.error('Login failed');
        throw new Error('Login failed');
    }
};

/**
 * Logs out the user by making a POST request to the logout API endpoint.
 * @returns {Promise<IAuthResult>} A promise that resolves to the response data from the API.
 * @throws {Error} If the logout request fails.
 */
export const logoutUser = async (): Promise<IAuthResult> => {
    try {
        const endpoint = '/api/auth/logout';
        const response = await apiPost<IAuthResult>(endpoint, {});

        // Clear token from localStorage
        localStorage.removeItem('authToken');

        ToastService.success('Logout successful');
        return response;
    } catch (error) {
        ToastService.error('Logout failed');
        throw new Error('Logout failed');
    }
};

/**
 * Resets the user's password.
 * @param {IAuthData} data - The data including email, token, and new password.
 * @returns {Promise<IAuthResult>} - A promise that resolves to the response data.
 * @throws {Error} - If the password reset request fails.
 */
export const resetPassword = async (data: IAuthData): Promise<IAuthResult> => {
    try {
        const endpoint = '/api/auth/reset-password';
        const response = await apiPost<IAuthResult>(endpoint, data);
        ToastService.success('Password reset request successful');
        return response;
    } catch (error) {
        ToastService.error('Password reset request failed');
        throw new Error('Password reset request failed');
    }
};

/**
 * Validates the provided token by making a POST request to the validate-token API endpoint.
 * @param {string} token - The token to validate.
 * @returns {Promise<IAuthResult>} - A promise that resolves to the response data.
 * @throws {Error} - If the token validation request fails.
 */
export const validateToken = async (token: string): Promise<IAuthResult> => {
    try {
        const endpoint = '/api/auth/validate-token';
        return await apiPost<IAuthResult>(endpoint, { token });
    } catch (error) {
        console.error('Token validation failed:', error);
        throw new Error('Token validation failed');
    }
};
