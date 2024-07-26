import { IUserData, loginUser, logoutUser, registerUser, requestPasswordReset, resetPasswordWithToken } from '@/api';
import { useMutation } from 'react-query';

export const useRegisterUser = () => {
    return useMutation({
        mutationFn: (userData: IUserData) => registerUser(userData)
    });
};

export const useLoginUser = () => {
    return useMutation({
        mutationFn: (userData: IUserData) => loginUser(userData)
    });
};

export const useLogoutUser = () => {
    return useMutation({
        mutationFn: () => logoutUser()
    });
};

export const useRequestPasswordReset = () => {
    return useMutation({
        mutationFn: (email: string) => requestPasswordReset(email)
    });
};

export const useResetPasswordWithToken = () => {
    return useMutation({
        mutationFn: ({ newPassword, token }: { newPassword: string; token: string }) => resetPasswordWithToken(newPassword, token)
    });
};
