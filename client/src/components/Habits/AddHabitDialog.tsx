import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField, SelectField, TextareaField } from "@/components/ui";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useHabitForm } from "./useHabitForm";
import { useCreateHabitMutation } from "@/queries";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IHabit } from "@/api";
import { useAuthContext } from "@/context/useAuthContext";
import { useActiveCategoriesQuery } from '@/queries/categories';

export function AddHabitDialog() {
  const [open, setOpen] = useState(false);
  const { formData, handleChange, resetForm, error, setError } = useHabitForm();
  const createHabitMutation = useCreateHabitMutation();
  const { user } = useAuthContext();
  const { data: categories = [] } = useActiveCategoriesQuery();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name) {
      setError("Name is required");
      return;
    }

    if (!formData.metricType) {
      setError("Metric type is required");
      return;
    }

    setError(null);

    try {
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
      resetForm();
      setOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create habit");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus size={16} className="mr-2" />
          Add Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Add New Habit</DialogTitle>
            <DialogDescription>
              Create a new habit to track your progress.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <FormField
              id="name"
              name="name"
              label="Name"
              placeholder="Habit name (e.g., Read books, Exercise)"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name')(e.target.value)}
              required
            />
            <TextareaField
              id="description"
              label="Description"
              placeholder="Describe your habit (optional)"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('description')(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <SelectField
                id="metricType"
                label="Metric Type"
                placeholder="Select metric"
                value={formData.metricType}
                onValueChange={handleChange('metricType')}
                options={[
                  { value: "minutes", label: "Minutes" },
                  { value: "pages", label: "Pages" },
                  { value: "reps", label: "Repetitions" },
                  { value: "miles", label: "Miles" },
                  { value: "kilometers", label: "Kilometers" },
                  { value: "steps", label: "Steps" },
                  { value: "cups", label: "Cups" },
                  { value: "times", label: "Times" },
                  { value: "hours", label: "Hours" }
                ]}
                required
              />
              <FormField
                id="unit"
                name="unit"
                label="Unit"
                placeholder="min, pages, reps..."
                value={formData.unit}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('unit')(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                id="target"
                name="target"
                type="number"
                label="Daily Target"
                placeholder="0"
                value={formData.target?.toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('target')(parseInt(e.target.value) || 0)}
              />
              <SelectField
                id="category"
                label="Category"
                placeholder="Select category"
                value={formData.category}
                onValueChange={handleChange('category')}
                options={categories.map(category => ({
                  value: category.name,
                  label: category.name,
                  icon: category.icon,
                  color: category.color
                }))}
              />
            </div>
            <FormField
              id="color"
              name="color"
              type="color"
              label="Color"
              value={formData.color}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('color')(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createHabitMutation.isPending}>
              {createHabitMutation.isPending ? 'Creating...' : 'Create Habit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
