// useHabitForm.ts
import { useState } from "react";
import { IHabitCreateRequest } from "@/api/habit.types";

interface UseHabitFormReturn {
  formData: IHabitCreateRequest;
  setFormData: React.Dispatch<React.SetStateAction<IHabitCreateRequest>>;
  handleChange: (field: keyof IHabitCreateRequest) => (value: string | number) => void;
  resetForm: () => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export function useHabitForm(): UseHabitFormReturn {
  const [formData, setFormData] = useState<IHabitCreateRequest>({
    name: '',
    description: '',
    metricType: 'minutes',
    unit: 'min',
    target: 0,
    targetFrequency: 'daily',
    category: 'Health',
    color: '#3b82f6',
    icon: 'target',
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof IHabitCreateRequest) => (value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      metricType: 'minutes',
      unit: 'min',
      target: 0,
      targetFrequency: 'daily',
      category: 'Health',
      color: '#3b82f6',
      icon: 'target',
    });
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
