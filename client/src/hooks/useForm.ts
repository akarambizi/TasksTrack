import { IAuthData, IAuthResult } from '@/api';
import { ChangeEvent, useState } from 'react';
import { useLoginUser, useRegisterUser, useResetPassword } from './userAuth';
import { useAuth } from '@/context';

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

// Custom hook for form handling
export const useForm = (initialFormData: IAuthData, formType: FormType) => {
    const { login } = useAuth();
    const [formData, setFormData] = useState<IAuthData>(initialFormData);
    const [errors, setErrors] = useState<IAuthData>({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const mutations = {
        [FormType.Login]: useLoginUser(),
        [FormType.Register]: useRegisterUser(),
        [FormType.ResetPassword]: useResetPassword()
    };

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

        if (!newErrors.email && !newErrors.password) {
            setIsLoading(true);

            try {
                const response = await mutations[formType].mutateAsync(formData);
                return response; // Return the response to allow further handling
            } catch (error) {
                return null; // Return null in case of an error
            } finally {
                setIsLoading(false);
            }
        }
        return null; // Return null if there are validation errors
    };

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const response: IAuthResult = await handleSubmit(e);

        // Only call login if the response indicates success
        if (response && response.success) {
            login(response?.token ?? '');
        } else {
            // TODO:
            // Handle error case, e.g., show a toast message
            console.error('Login failed: Unauthorized or other error');
        }
    };

    return { formData, errors, isLoading, handleChange, handleSubmit, handleLoginSubmit };
};
