import { useUpdateHabitMutation } from "@/queries";
import { IHabit } from "@/api";
import { HabitFormDialog } from "./HabitFormDialog";

interface EditHabitDialogProps {
  habit: IHabit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditHabitDialog({ habit, open, onOpenChange }: EditHabitDialogProps) {
  const updateHabitMutation = useUpdateHabitMutation();

  const handleSubmit = async (formData: any) => {
    if (!habit) return;

    // Create a habit object as expected by the backend
    const updatedHabit: IHabit = {
      ...habit,
      name: formData.name,
      description: formData.description || undefined,
      metricType: formData.metricType,
      unit: formData.unit || undefined,
      target: formData.target && formData.target > 0 ? formData.target : undefined,
      targetFrequency: formData.targetFrequency || undefined,
      category: formData.category || undefined,
      color: formData.color || undefined,
      icon: formData.icon || undefined
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
