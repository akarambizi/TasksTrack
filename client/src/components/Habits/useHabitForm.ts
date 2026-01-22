// useHabitForm.ts
import { useState } from "react";
import { IHabit, createHabitDirect } from "@/api";
import { useAuthContext } from "@/context/useAuthContext";

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
  handleSubmit: () => Promise<IHabit | null>;
  isSubmitting: boolean;
  error: string | null;
}

export function useHabitForm(): UseHabitFormReturn {
  const { user } = useAuthContext();
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof HabitFormData) => (value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (): Promise<IHabit | null> => {
    // Validate form
    if (!formData.name) {
      setError("Name is required");
      return null;
    }

    if (!formData.metricType) {
      setError("Metric type is required");
      return null;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // Create a habit object as expected by the backend
      const habitObject: Partial<IHabit> = {
        name: formData.name,
        description: formData.description || undefined,
        metricType: formData.metricType,
        unit: formData.unit || undefined,
        target: formData.target > 0 ? formData.target : undefined,
        targetFrequency: formData.targetFrequency || undefined,
        category: formData.category || undefined,
        color: formData.color || undefined,
        icon: formData.icon || undefined,
        isActive: true,
        createdBy: user?.email || 'unknown'
      };

      const newHabit = await createHabitDirect(habitObject);

      // Reset form after successful submission
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

      return newHabit;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create habit");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    isSubmitting,
    error
  };
}
