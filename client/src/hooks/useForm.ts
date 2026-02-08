import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin, useRegister, useResetPassword } from '@/queries';
import {
    authFormSchema,
    type IAuthFormData
} from '@/types';

// Login form hook
export function useLoginForm() {
    const loginMutation = useLogin();

    const form = useReactHookForm<IAuthFormData>({
        resolver: zodResolver(authFormSchema),
        defaultValues: { email: '', password: '' },
        mode: 'onChange'
    });

    const onSubmit = (data: IAuthFormData) => {
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

    const form = useReactHookForm<IAuthFormData>({
        resolver: zodResolver(authFormSchema),
        defaultValues: { email: '', password: '' },
        mode: 'onChange'
    });

    const onSubmit = (data: IAuthFormData) => {
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

    const form = useReactHookForm<IAuthFormData>({
        resolver: zodResolver(authFormSchema),
        defaultValues: { email: '', password: '' },
        mode: 'onChange'
    });

    const onSubmit = (data: IAuthFormData) => {
        // Pass the data directly as it matches the expected format
        resetPasswordMutation.mutate(data);
    };

    return {
        ...form,
        isLoading: resetPasswordMutation.isPending,
        onSubmit
    };
}
