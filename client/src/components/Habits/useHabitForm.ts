// useHabitForm.ts
import { useState, useCallback } from "react";
import { IHabitCreateRequest } from "@/api/habit.types";
import { DEFAULT_HABIT_FORM, getDefaultUnitForMetricType } from "@/types/constants";

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
    metricType: DEFAULT_HABIT_FORM.metricType,
    unit: getDefaultUnitForMetricType(DEFAULT_HABIT_FORM.metricType),
    target: DEFAULT_HABIT_FORM.target,
    targetFrequency: DEFAULT_HABIT_FORM.targetFrequency,
    category: DEFAULT_HABIT_FORM.category,
    color: DEFAULT_HABIT_FORM.color,
    icon: DEFAULT_HABIT_FORM.icon,
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((field: keyof IHabitCreateRequest) => (value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      metricType: DEFAULT_HABIT_FORM.metricType,
      unit: getDefaultUnitForMetricType(DEFAULT_HABIT_FORM.metricType),
      target: DEFAULT_HABIT_FORM.target,
      targetFrequency: DEFAULT_HABIT_FORM.targetFrequency,
      category: DEFAULT_HABIT_FORM.category,
      color: DEFAULT_HABIT_FORM.color,
      icon: DEFAULT_HABIT_FORM.icon,
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
