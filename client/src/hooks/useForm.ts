import { ChangeEvent, useState } from 'react';
import { IAuthData } from '@/api';
import { useLogin, useRegister, useResetPassword } from './useAuth';

// Email regex: Validates format like example@domain.com
export const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

// Password regex: Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
export const validatePassword = (password: string) => {
    const passwordRegex = new RegExp(
        '^' +
            '(?=.*[a-z])' + // At least one lowercase letter
            '(?=.*[A-Z])' + // At least one uppercase letter
            '(?=.*\\d)' + // At least one digit
            '(?=.*[!@#$%^&*])' + // At least one special character
            '[A-Za-z\\d!@#$%^&*]{8,}' + // Minimum 8 characters
            '$'
    );
    return passwordRegex.test(password);
};

export const validateForm = (formData: IAuthData) => {
    const errors: IAuthData = { email: '', password: '' };

    if (!validateEmail(formData.email)) {
        errors.email = 'Invalid email address. Please provide a valid email in the format: example@domain.com';
    }

    if (formData?.password && !validatePassword(formData?.password)) {
        errors.password = 'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.';
    }

    return errors;
};

export enum FormType {
    Login = 'login',
    Register = 'register',
    ResetPassword = 'reset-password'
}

// Type definition for useForm hook return value
export interface UseFormReturn {
    formData: IAuthData;
    errors: IAuthData;
    isLoading: boolean;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

// Default values for form fallback
const DEFAULT_FORM_STATE: UseFormReturn = {
    formData: { email: '', password: '' },
    errors: { email: '', password: '' },
    isLoading: false,
    handleChange: () => {},
    handleSubmit: async () => {}
};

// Custom hook to get the appropriate mutation based on form type
const useCurrentMutation = (formType: FormType) => {
    // Get all mutations (hooks must be called unconditionally)
    const loginMutation = useLogin();
    const registerMutation = useRegister();
    const resetPasswordMutation = useResetPassword();

    switch (formType) {
        case FormType.Login:
            return loginMutation;
        case FormType.Register:
            return registerMutation;
        case FormType.ResetPassword:
            return resetPasswordMutation;
        default:
            console.error(`No mutation found for form type: ${formType}`);
            return null;
    }
};

// Custom hook for form handling
export const useForm = (initialFormData: IAuthData, formType: FormType): UseFormReturn => {
    const [formData, setFormData] = useState<IAuthData>(initialFormData);
    const [errors, setErrors] = useState<IAuthData>({ email: '', password: '' });

    const currentMutation = useCurrentMutation(formType);

    // Early return if mutation doesn't exist for the form type
    if (!currentMutation) {
        return {
            ...DEFAULT_FORM_STATE,
            formData,
            errors
        };
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors = validateForm(formData);
        setErrors(newErrors);

        // Only proceed if no validation errors
        if (!newErrors.email && !newErrors.password) {
            currentMutation.mutate(formData);
        }
    };

    return {
        formData,
        errors,
        isLoading: currentMutation.isPending,
        handleChange,
        handleSubmit
    };
};
