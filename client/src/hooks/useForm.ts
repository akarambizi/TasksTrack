import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin, useRegister, useResetPassword } from '@/queries';
import {
    loginFormSchema,
    registerFormSchema,
    resetPasswordFormSchema,
    type LoginFormData,
    type RegisterFormData,
    type ResetPasswordFormData
} from '@/types';

// Login form hook
export function useLoginForm() {
    const loginMutation = useLogin();

    const form = useReactHookForm<LoginFormData>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: { email: '', password: '' },
        mode: 'onChange'
    });

    const onSubmit = (data: LoginFormData) => {
        loginMutation.mutate(data);
    };

    return {
        ...form,
        isLoading: loginMutation.isPending,
        onSubmit
    };
}

// Register form hook
export function useRegisterForm() {
    const registerMutation = useRegister();

    const form = useReactHookForm<RegisterFormData>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: { email: '', password: '' },
        mode: 'onChange'
    });

    const onSubmit = (data: RegisterFormData) => {
        registerMutation.mutate(data);
    };

    return {
        ...form,
        isLoading: registerMutation.isPending,
        onSubmit
    };
}

// Reset password form hook
export function useResetPasswordForm() {
    const resetPasswordMutation = useResetPassword();

    const form = useReactHookForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: { email: '', newPassword: '' },
        mode: 'onChange'
    });

    const onSubmit = (data: ResetPasswordFormData) => {
        // Pass the data directly as it matches the expected format
        resetPasswordMutation.mutate(data);
    };

    return {
        ...form,
        isLoading: resetPasswordMutation.isPending,
        onSubmit
    };
}
