import axios from 'axios';
import { IUserData } from './userAuth.types';
import { getUrl } from './utils';

/**
 * Registers a new user.
 * @param userData - The user data including email and password.
 * @returns A promise that resolves to the response data.
 * @throws An error if the registration fails.
 */
export const registerUser = async (userData: IUserData) => {
    try {
        const url = getUrl('/api/auth/register');
        const response = await axios.post(url, userData);
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error);
        throw new Error('Registration failed');
    }
};

/**
 * Logs in a user with the provided email and password.
 * @param userData - The user data containing the email and password.
 * @returns A Promise that resolves to the response data from the login API.
 * @throws An error if the login fails.
 */
export const loginUser = async (userData: IUserData) => {
    try {
        const url = getUrl('/api/auth/login');
        const response = await axios.post(url, userData);
        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw new Error('Login failed');
    }
};

/**
 * Logs out the user by making a POST request to the logout API endpoint.
 * @returns {Promise<any>} A promise that resolves to the response data from the API.
 * @throws {Error} If the logout request fails.
 */
export const logoutUser = async () => {
    try {
        const url = getUrl('/api/auth/logout');
        const response = await axios.post(url);
        return response.data;
    } catch (error) {
        console.error('Logout failed:', error);
        throw new Error('Logout failed');
    }
};

/**
 * Sends a request to reset the user's password.
 * @param {string} email - The email address of the user.
 * @returns {Promise<any>} - A promise that resolves to the response data.
 * @throws {Error} - If the password reset request fails.
 */
export const requestPasswordReset = async (email: string) => {
    try {
        const url = getUrl('/api/auth/request-password-reset');
        const response = await axios.post(url, { email });
        return response.data;
    } catch (error) {
        console.error('Password reset request failed:', error);
        throw new Error('Password reset request failed');
    }
};

/**
 * Resets the user's password using a token.
 * @param {string} newPassword - The new password to set.
 * @param {string} token - The token used for password reset.
 * @returns {Promise<any>} - A promise that resolves to the response data.
 * @throws {Error} - If the password reset fails.
 */
export const resetPasswordWithToken = async (newPassword: string, token: string) => {
    try {
        const url = getUrl('/api/auth/reset-password-with-token');
        const response = await axios.post(url, { newPassword, token });
        return response.data;
    } catch (error) {
        console.error('Password reset failed:', error);
        throw new Error('Password reset failed');
    }
};