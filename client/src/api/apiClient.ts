import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getUrl } from './utils';

// Create a custom axios instance
const apiClient: AxiosInstance = axios.create({
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Include cookies in all requests
});

// Request interceptor to add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    // Get token from local storage
    const token = localStorage.getItem('authToken');

    // If token exists, add it to the headers
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors and token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    // Handle authentication errors

    // Check if the error is due to an expired token (401 Unauthorized)
    if (error.response?.status === 401) {
      // Clear the token since the server rejected it
      localStorage.removeItem('authToken');
      
      // No need to retry - the AuthContext will detect the missing token on next page load
      // This avoids making redundant validation API calls
      return Promise.reject(new Error('Session expired. Please log in again.'));
    }

    // For network errors, provide a helpful message
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Please check your internet connection.'));
    }

    // Handle server errors
    if (error.response?.status && error.response.status >= 500) {
      return Promise.reject(new Error('Server error. Please try again later.'));
    }

    return Promise.reject(error);
  }
);

/**
 * Wrapper function for API GET requests
 * @param endpoint - API endpoint path
 * @param config - Optional axios config
 * @returns Promise with response data
 */
export const apiGet = async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
  const url = getUrl(endpoint);
  const response = await apiClient.get<T>(url, config);
  return response.data;
};

/**
 * Wrapper function for API POST requests
 * @param endpoint - API endpoint path
 * @param data - Data to send in request body
 * @param config - Optional axios config
 * @returns Promise with response data
 */
export const apiPost = async <T>(endpoint: string, data: unknown, config?: AxiosRequestConfig): Promise<T> => {
  const url = getUrl(endpoint);
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
};

/**
 * Wrapper function for API PUT requests
 * @param endpoint - API endpoint path
 * @param data - Data to send in request body
 * @param config - Optional axios config
 * @returns Promise with response data
 */
export const apiPut = async <T>(endpoint: string, data: unknown, config?: AxiosRequestConfig): Promise<T> => {
  const url = getUrl(endpoint);
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
};

/**
 * Wrapper function for API DELETE requests
 * @param endpoint - API endpoint path
 * @param config - Optional axios config
 * @returns Promise with response data
 */
export const apiDelete = async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
  const url = getUrl(endpoint);
  const response = await apiClient.delete<T>(url, config);
  return response.data;
};

export default apiClient;
