// useHabitForm.ts
import { useState } from "react";

interface HabitFormData {
  name: string;
  description: string;
  metricType: string;
  unit: string;
  target: number;
  targetFrequency: string;
  category: string;
  color: string;
  icon: string;
}

interface UseHabitFormReturn {
  formData: HabitFormData;
  setFormData: React.Dispatch<React.SetStateAction<HabitFormData>>;
  handleChange: (field: keyof HabitFormData) => (value: string | number) => void;
  resetForm: () => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export function useHabitForm(): UseHabitFormReturn {
  const [formData, setFormData] = useState<HabitFormData>({
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

  const handleChange = (field: keyof HabitFormData) => (value: string | number) => {
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
