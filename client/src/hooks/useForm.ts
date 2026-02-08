import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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

    const registerFormSchema = authFormSchema.extend({
        name: z.string().min(1, 'Name is required'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

    const form = useReactHookForm<z.infer<typeof registerFormSchema>>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
        mode: 'onChange'
    });

    const onSubmit = (data: z.infer<typeof registerFormSchema>) => {
        // Extract only the fields needed for the API
        const { name, email, password } = data;
        registerMutation.mutate({ name, email, password } as any);
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
