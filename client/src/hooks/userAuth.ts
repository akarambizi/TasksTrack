import { IAuthData, loginUser, logoutUser, registerUser, resetPassword, validateToken } from '@/api';
import { useMutation } from 'react-query';

export const useRegisterUser = () => {
    return useMutation({
        mutationFn: (userData: IAuthData) => registerUser(userData)
    });
};

export const useLoginUser = () => {
    return useMutation({
        mutationFn: (userData: IAuthData) => loginUser(userData)
    });
};

export const useLogoutUser = () => {
    return useMutation({
        mutationFn: () => logoutUser()
    });
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: (data: IAuthData) => resetPassword(data)
    });
};

export const useValidateToken = () => {
    return useMutation({
        mutationFn: (token: string) => validateToken(token)
    });
};
