import { useUpdateHabitMutation } from "@/queries";
import { HabitFormData, IHabit } from "@/types";
import { HabitFormDialog } from "./HabitFormDialog";

interface EditHabitDialogProps {
  habit: IHabit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditHabitDialog({ habit, open, onOpenChange }: EditHabitDialogProps) {
  const updateHabitMutation = useUpdateHabitMutation();

  const handleSubmit = async (formData: HabitFormData) => {
    if (!habit) return;

    // Create a habit object as expected by the backend
    const updatedHabit: IHabit = {
      ...habit,
      name: formData.name,
      description: formData.description || null,
      metricType: formData.metricType,
      unit: formData.unit || null,
      target: formData.target && formData.target > 0 ? formData.target : null,
      targetFrequency: formData.targetFrequency || null,
      category: formData.category || null,
      color: formData.color || null,
      icon: formData.icon || null
    };

    await updateHabitMutation.mutateAsync(updatedHabit);
  };

  return (
    <HabitFormDialog
      mode="edit"
      habit={habit}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      isLoading={updateHabitMutation.isPending}
      title="Edit Habit"
      description="Update your habit details."
      submitLabel="Update Habit"
      loadingLabel="Updating..."
    />
  );
}
