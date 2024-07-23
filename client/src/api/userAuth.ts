import axios from 'axios';
import { getUrl } from './utils';

export const registerUser = async (userData: { email: string; password: string }) => {
    try {
        const url = getUrl('/api/auth/register');
        const response = await axios.post(url, userData);
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error);
        throw new Error('Registration failed');
    }
};
