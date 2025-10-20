import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUser, logoutUser, registerUser, resetPassword } from '../api/userAuth';
import { IAuthData, IAuthResult } from '../api/userAuth.types';
import { ToastService } from '../services/toastService';
import { useAuthContext } from '@/context/useAuthContext';

// Type for API error responses
interface ApiError extends Error {
    response?: {
        data?: {
            message?: string;
        };
    };
}

/**
 * Authentication API key for React Query
 */
export const authKeys = {
    all: ['auth'] as const,
    login: () => [...authKeys.all, 'login'] as const,
    register: () => [...authKeys.all, 'register'] as const,
    logout: () => [...authKeys.all, 'logout'] as const,
    resetPassword: () => [...authKeys.all, 'reset-password'] as const
};

/**
 * Hook for user registration
 */
export const useRegister = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationKey: authKeys.register(),
        mutationFn: (userData: IAuthData) => registerUser(userData),
        onSuccess: () => {
            ToastService.success('Registration successful! Please log in.');
            // Redirect to login page after successful registration
            navigate('/login');
        },
        onError: (error: ApiError) => {
            const errorMessage = error?.response?.data?.message || 'Registration failed. Please try again.';
            ToastService.error(errorMessage);
        }
    });
};

/**
 * Hook for user login
 */
export const useLogin = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { login } = useAuthContext();

    return useMutation({
        mutationKey: authKeys.login(),
        mutationFn: (userData: IAuthData) => loginUser(userData),
        onSuccess: (data: IAuthResult, userData: IAuthData) => {
            // If login is successful and token is provided
            if (data.success && data.token) {
                // Update auth state via context
                login(data.token, userData.email);

                // Update auth state - invalidate all auth queries
                queryClient.invalidateQueries({ queryKey: authKeys.all });

                ToastService.success('Login successful!');

                // Redirect to dashboard
                navigate('/dashboard');
            }
        },
        onError: (error: ApiError) => {
            const errorMessage = error?.response?.data?.message || 'Login failed. Please check your credentials.';
            ToastService.error(errorMessage);
        }
    });
};

/**
 * Hook for user logout
 */
export const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { logout } = useAuthContext();

    return useMutation({
        mutationKey: authKeys.logout(),
        mutationFn: logoutUser,
        onSuccess: () => {
            // Clear auth state via context
            logout();

            // Clear the query cache
            queryClient.clear();

            ToastService.success('Logged out successfully.');
            // Redirect to login page
            navigate('/login');
        },
        onError: () => {
            // Even if the API call fails, we still want to clear local state
            logout();

            queryClient.clear();

            ToastService.warning('Logged out locally due to server error.');
            navigate('/login');
        }
    });
};

/**
 * Hook for password reset
 */
export const useResetPassword = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationKey: authKeys.resetPassword(),
        mutationFn: (data: IAuthData) => resetPassword(data),
        onSuccess: () => {
            ToastService.success('Password reset link has been sent to your email');
            navigate('/login');
        },
        onError: (error: ApiError) => {
            const errorMessage = error?.response?.data?.message || 'Failed to send password reset email. Please try again.';
            ToastService.error(errorMessage);
        }
    });
};