import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUser, logoutUser, registerUser, resetPassword } from '../api/userAuth';
import { IAuthFormData, IAuthResult, IRegisterRequest } from '@/types';
import { ToastService } from '../services/toastService';
import { useAuthContext } from '@/context/useAuthContext';
import { authKeys } from './queryKeys';

/**
 * Hook for user registration
 */
export const useRegister = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationKey: authKeys.register(),
        mutationFn: (userData: IRegisterRequest) => registerUser(userData),
        onSuccess: () => {
            // Redirect to login page after successful registration
            navigate('/login');
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
        mutationFn: (userData: IAuthFormData) => {
            return loginUser(userData);
        },
        onSuccess: (data: IAuthResult) => {
            // If login is successful and data is provided
            if (data.success && data.token) {
                // Update auth state via context - need to get user data from response
                const userEmail = data.user?.email || '';
                const userId = data.user?.id?.toString() || '';
                login(data.token, userEmail, userId);

                // Update auth state - invalidate all auth queries
                queryClient.invalidateQueries({ queryKey: authKeys.all });

                // Redirect to dashboard
                navigate('/dashboard');
            }
        },
        onError: (error) => {
            console.error('Login failed:', error);
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
        mutationFn: (data: IAuthFormData) => resetPassword(data),
        onSuccess: () => {
            navigate('/login');
        }
    });
};