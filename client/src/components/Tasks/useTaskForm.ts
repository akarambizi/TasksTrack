// useTaskForm.ts
import { useState } from "react";
import { IToDoTask } from "@/api";
import { createTask } from "@/api/toDoTask";

interface TaskFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

interface UseTaskFormReturn {
  formData: TaskFormData;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
  handleChange: (field: keyof TaskFormData) => (value: string) => void;
  handleSubmit: () => Promise<IToDoTask | null>;
  isSubmitting: boolean;
  error: string | null;
}

export function useTaskForm(): UseTaskFormReturn {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'low',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof TaskFormData) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (): Promise<IToDoTask | null> => {
    // Validate form
    if (!formData.title) {
      setError("Title is required");
      return null;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // Call the API to create a new task
      const newTask = await createTask({
        title: formData.title,
        description: formData.description,
        completed: false,
        priority: formData.priority
      });

      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        priority: 'low',
      });

      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
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
