import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUser, logoutUser, registerUser, resetPassword } from '../api/userAuth';
import { IAuthData, IAuthResult } from '../api/userAuth.types';
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
        mutationFn: (userData: IAuthData) => registerUser(userData),
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
        mutationFn: (userData: IAuthData) => loginUser(userData),
        onSuccess: (data: IAuthResult) => {
            // If login is successful and token is provided
            if (data.success && data.token) {
                // Update auth state via context
                login(data.token, data.userEmail, data.userId);

                // Update auth state - invalidate all auth queries
                queryClient.invalidateQueries({ queryKey: authKeys.all });

                // Redirect to dashboard
                navigate('/dashboard');
            }
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
        mutationFn: (data: IAuthData) => resetPassword(data),
        onSuccess: () => {
            navigate('/login');
        }
    });
};