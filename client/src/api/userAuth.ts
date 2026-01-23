import { IAuthData, IAuthResult } from './userAuth.types';
import { apiPost } from './apiClient';
import { ToastService } from '../services/toastService';

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
        ToastService.success('Registration successful! Please log in.');
        return response;
    } catch (error) {
        console.error('Registration failed:', error);
        ToastService.error('Registration failed. Please try again.');
        throw error;
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
        ToastService.success('Login successful!');
        return response;
    } catch (error) {
        console.error('Login failed:', error);
        ToastService.error('Login failed. Please check your credentials.');
        throw error;
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
        ToastService.success('Logged out successfully.');
        return response;
    } catch (error) {
        console.error('Logout failed:', error);
        // Don't show error toast for logout as we handle it in the query layer
        throw error;
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
        ToastService.success('Password reset link has been sent to your email');
        return response;
    } catch (error) {
        console.error('Password reset failed:', error);
        ToastService.error('Failed to send password reset email. Please try again.');
        throw error;
    }
};
