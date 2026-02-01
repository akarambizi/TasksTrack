import { useState } from 'react';
import { IHabitLogCreateRequest } from '@/api/habit.types';
import { useAuthContext } from '@/context/useAuthContext';

interface IUseHabitLogFormReturn {
    formData: IHabitLogCreateRequest;
    setFormData: React.Dispatch<React.SetStateAction<IHabitLogCreateRequest>>;
    handleChange: (field: keyof IHabitLogCreateRequest) => (value: string | number) => void;
    resetForm: () => void;
    error: string | null;
    setError: (error: string | null) => void;
}

export function useHabitLogForm(habitId?: number): IUseHabitLogFormReturn {
    const { user } = useAuthContext();

    const getInitialFormData = () => ({
        habitId: habitId || 0,
        value: 0,
        date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        notes: '',
        createdBy: user?.id || 'unknown'
    });

    const [formData, setFormData] = useState<IHabitLogCreateRequest>(getInitialFormData());

    const [error, setError] = useState<string | null>(null);

    const handleChange = (field: keyof IHabitLogCreateRequest) => (value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const resetForm = () => {
        setFormData(getInitialFormData());
        setError(null);
    };

    return {
        formData,
        setFormData,
        handleChange,
        resetForm,
        error,
        setError
    };
}