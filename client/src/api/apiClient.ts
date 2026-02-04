import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getUrl } from './utils';

// Create a custom axios instance
const apiClient: AxiosInstance = axios.create({
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json'
  }
  // No need for withCredentials since we're using Authorization headers
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
  (error: AxiosError) => {
    // Handle authentication errors - clear token on 401
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
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

// Default export removed as unused
