import { useState, ChangeEvent } from 'react';

export interface IFormData {
  email: string;
  password: string;
}

export const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
export const validatePassword = (password: string) => password.length >= 6;

export const validateForm = (formData: IFormData) => {
  const errors: IFormData = { email: '', password: '' };

  if (!validateEmail(formData.email)) {
    errors.email = 'Invalid email address';
  }

  if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters long';
  }

  return errors;
};

// Custom hook for form handling
export const useForm = (initialFormData: IFormData) => {
  const [formData, setFormData] = useState<IFormData>(initialFormData);
  const [errors, setErrors] = useState<IFormData>({ email: '', password: '' });

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
