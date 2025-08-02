import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUser, logoutUser, registerUser, resetPassword, authKeys } from '../api/userAuth';
import { IAuthData, IAuthResult } from '../api/userAuth.types';
import { ToastService } from '../services/toastService';

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

  return useMutation({
    mutationKey: authKeys.login(),
    mutationFn: (userData: IAuthData) => loginUser(userData),
    onSuccess: (data: IAuthResult) => {
      // If login is successful and token is provided
      if (data.success && data.token) {
        // Store token in local storage
        localStorage.setItem('authToken', data.token);

        // Update auth state
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });

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

  return useMutation({
    mutationKey: authKeys.logout(),
    mutationFn: logoutUser,
    onSuccess: () => {
      // Clear local storage
      localStorage.removeItem('authToken');

      // Clear the query cache
      queryClient.clear();

      // Redirect to login page
      navigate('/login');
    },
    onError: () => {
      // Even if the API call fails, we still want to clear local state
      localStorage.removeItem('authToken');
      queryClient.clear();
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
    }
  });
};
