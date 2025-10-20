import { IAuthData, IAuthResult } from './userAuth.types';
import { apiPost } from './apiClient';

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
        return response;
    } catch (error) {
        console.error('Registration failed:', error);
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
    const endpoint = '/api/auth/login';
    return await apiPost<IAuthResult>(endpoint, userData);
};

/**
 * Logs out the user by making a POST request to the logout API endpoint.
 * @returns {Promise<IAuthResult>} A promise that resolves to the response data from the API.
 * @throws {Error} If the logout request fails.
 */
export const logoutUser = async (): Promise<IAuthResult> => {
    const endpoint = '/api/auth/logout';
    return await apiPost<IAuthResult>(endpoint, {});
};

/**
 * Resets the user's password.
 * @param {IAuthData} data - The data including email, token, and new password.
 * @returns {Promise<IAuthResult>} - A promise that resolves to the response data.
 * @throws {Error} - If the password reset request fails.
 */
export const resetPassword = async (data: IAuthData): Promise<IAuthResult> => {
    const endpoint = '/api/auth/reset-password';
    return await apiPost<IAuthResult>(endpoint, data);
};
