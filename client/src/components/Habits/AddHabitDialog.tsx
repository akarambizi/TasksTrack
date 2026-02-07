import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useCreateHabitMutation } from "@/queries";
import { IHabit } from "@/api";
import { useAuthContext } from "@/context/useAuthContext";
import { HabitFormDialog } from "./HabitFormDialog";

export function AddHabitDialog() {
  const [open, setOpen] = useState(false);
  const createHabitMutation = useCreateHabitMutation();
  const { user } = useAuthContext();

  const handleSubmit = async (formData: any) => {
    // Create a habit object as expected by the backend
    const habitObject: Partial<IHabit> = {
      name: formData.name,
      description: formData.description || undefined,
      metricType: formData.metricType,
      unit: formData.unit || undefined,
      target: formData.target && formData.target > 0 ? formData.target : undefined,
      targetFrequency: formData.targetFrequency || undefined,
      category: formData.category || undefined,
      color: formData.color || undefined,
      icon: formData.icon || undefined,
      isActive: true,
      createdBy: user?.id || 'unknown'
    };

    await createHabitMutation.mutateAsync(habitObject);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
        <Plus className="h-4 w-4" />
        Add Habit
      </Button>

      <HabitFormDialog
        mode="create"
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        isLoading={createHabitMutation.isPending}
        title="Add New Habit"
        description="Create a new habit to track your progress."
        submitLabel="Create Habit"
        loadingLabel="Creating..."
      />
    </>
  );
}
