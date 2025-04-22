import axios from 'axios';
import { IAuthData } from './userAuth.types';
import { getUrl } from './utils';

/**
 * Registers a new user.
 * @param userData - The user data including email, username, and password.
 * @returns A promise that resolves to the response data.
 * @throws An error if the registration fails.
 */
export const registerUser = async (userData: IAuthData) => {
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
export const loginUser = async (userData: IAuthData) => {
    try {
        const url = getUrl('/api/auth/login');
        const response = await axios.post(url, userData, {
            withCredentials: true // Include cookies in the request
        });
        return response.data;
    } catch (error) {
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
        const response = await axios.post(url, {}, {
            withCredentials: true // Include cookies in the request
        });
        return response.data;
    } catch (error) {
        throw new Error('Logout failed');
    }
};

/**
 * Resets the user's password.
 * @param {IAuthData} data - The data including email, token, and new password.
 * @returns {Promise<any>} - A promise that resolves to the response data.
 * @throws {Error} - If the password reset request fails.
 */
export const resetPassword = async (data: IAuthData) => {
    try {
        const url = getUrl('/api/auth/reset-password');
        const response = await axios.post(url, data);
        return response.data;
    } catch (error) {
        throw new Error('Password reset request failed');
    }
};
