import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useCreateHabitMutation } from "@/queries";
import { IHabit } from "@/types";
import { HabitFormDialog } from "./HabitFormDialog";

interface IAddHabitDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
  showButton?: boolean;
}

export function AddHabitDialog({ isOpen, onClose, showButton = true }: IAddHabitDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const createHabitMutation = useCreateHabitMutation();

  // Use external state if provided, otherwise use internal state
  const open = isOpen !== undefined ? isOpen : internalOpen;

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
      isActive: true
      // createdBy is now handled automatically by backend
    };

    await createHabitMutation.mutateAsync(habitObject);
  };

  return (
    <>
      {showButton && (
        <Button
          onClick={() => isOpen !== undefined ? onClose?.() : setInternalOpen(true)}
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          data-testid="add-habit-button"
        >
          <Plus className="h-4 w-4" />
          Add Habit
        </Button>
      )}

      <HabitFormDialog
        mode="create"
        open={open}
        onOpenChange={(newOpen) => {
          if (isOpen !== undefined) {
            // External control
            if (!newOpen) onClose?.();
          } else {
            // Internal control
            setInternalOpen(newOpen);
          }
        }}
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
