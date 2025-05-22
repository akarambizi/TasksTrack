// useTaskForm.ts
import { useState } from "react";
import { IToDoTask } from "@/api";

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
      // This would be replaced with an actual API call
      const newTask: IToDoTask = {
        id: Math.floor(Math.random() * 10000), // temporary ID for demonstration
        title: formData.title,
        description: formData.description,
        completed: false,
        createdDate: new Date().toISOString(),
        createBy: "CurrentUser", //TODO: add user info
        priority: formData.priority,
      };

      // TODO: call API to save the task
      // const response = await createTask(newTask);

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
