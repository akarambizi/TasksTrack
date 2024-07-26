import { IUserData } from '@/api';
import { ChangeEvent, useState } from 'react';


export const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
export const validatePassword = (password: string) => password.length >= 6;

export const validateForm = (formData: IUserData) => {
  const errors: IUserData = { email: '', password: '' };

  if (!validateEmail(formData.email)) {
    errors.email = 'Invalid email address';
  }

  if (formData?.password && !validatePassword(formData?.password)) {
    errors.password = 'Password must be at least 6 characters long';
  }

  return errors;
};

// Custom hook for form handling
export const useForm = (initialFormData: IUserData) => {
  const [formData, setFormData] = useState<IUserData>(initialFormData);
  const [errors, setErrors] = useState<IUserData>({ email: '', password: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    setErrors(newErrors);

    // If there are no errors, submit the form
    if (!newErrors.email && !newErrors.password) {
      console.log('Form is valid. Submitting...');
      // TODO: Submit the form
    }
  };

  return { formData, errors, handleChange, handleSubmit };
}
