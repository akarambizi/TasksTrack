import { IUserData } from '@/api';
import { ChangeEvent, useState } from 'react';
import { useLoginUser, useRegisterUser, useResetPassword } from './userAuth';

// Email regex: Validates format like example@domain.com
export const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Password regex: Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
export const validatePassword = (password: string) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateForm = (formData: IUserData) => {
  const errors: IUserData = { email: '', password: '' };

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
export const useForm = (initialFormData: IUserData, formType: FormType) => {
  const [formData, setFormData] = useState<IUserData>(initialFormData);
  const [errors, setErrors] = useState<IUserData>({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const mutations = {
    [FormType.Login]: useLoginUser(),
    [FormType.Register]: useRegisterUser(),
    [FormType.ResetPassword]: useResetPassword(),
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      console.log('Form is valid. Submitting...');
      setIsLoading(true);

      try {
        await mutations[formType].mutateAsync(formData);
        console.log(`${formType} successful`);
      } catch (error) {
        console.error('Error during form submission:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return { formData, errors, isLoading, handleChange, handleSubmit };
};
