import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormField, SelectField, TextareaField } from "@/components/ui";
import { useEffect } from "react";
import { useHabitForm } from "./useHabitForm";
import { useUpdateHabitMutation } from "@/queries";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IHabit } from "@/api";
import { useActiveCategoriesQuery } from '@/queries/categories';

interface EditHabitDialogProps {
  habit: IHabit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditHabitDialog({ habit, open, onOpenChange }: EditHabitDialogProps) {
  const { formData, handleChange, resetForm, error, setError, setFormData } = useHabitForm();
  const updateHabitMutation = useUpdateHabitMutation();
  const { data: categories = [] } = useActiveCategoriesQuery();

  // Populate form with habit data when dialog opens
  useEffect(() => {
    if (habit && open) {
      setFormData({
        name: habit.name,
        description: habit.description || '',
        metricType: habit.metricType,
        unit: habit.unit || '',
        target: habit.target || 0,
        targetFrequency: habit.targetFrequency || 'daily',
        category: habit.category || '',
        color: habit.color || '#3b82f6',
        icon: habit.icon || 'Star'
      });
    }
  }, [habit, open, setFormData]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!habit) return;

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
      onOpenChange(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update habit");
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
            <DialogDescription>
              Update your habit details.
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
                placeholder="Select metric type"
                value={formData.metricType}
                onValueChange={handleChange('metricType')}
                required
                options={[
                  { value: 'count', label: 'Count' },
                  { value: 'duration', label: 'Duration' },
                  { value: 'distance', label: 'Distance' },
                  { value: 'weight', label: 'Weight' },
                  { value: 'binary', label: 'Yes/No' }
                ]}
              />
              <FormField
                id="unit"
                name="unit"
                label="Unit"
                placeholder="e.g., pages, minutes, km"
                value={formData.unit}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('unit')(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                id="target"
                name="target"
                type="number"
                label="Target"
                placeholder="Target value"
                value={formData.target?.toString() || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value ? parseInt(e.target.value, 10) : 0;
                  handleChange('target')(value);
                }}
              />
              <SelectField
                id="targetFrequency"
                label="Frequency"
                placeholder="Select frequency"
                value={formData.targetFrequency}
                onValueChange={handleChange('targetFrequency')}
                options={[
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' }
                ]}
              />
            </div>
            <SelectField
              id="category"
              label="Category"
              placeholder="Select category (optional)"
              value={formData.category || 'none'}
              onValueChange={(value) => {
                const actualValue = value === 'none' ? '' : value;
                handleChange('category')(actualValue);
              }}
              options={[
                { value: 'none', label: 'No Category' },
                ...categories.map(cat => ({
                  value: cat.name,
                  label: cat.name
                }))
              ]}
            />
            <div className="grid grid-cols-2 gap-4">
              <SelectField
                id="color"
                label="Color"
                placeholder="Select color"
                value={formData.color}
                onValueChange={handleChange('color')}
                options={[
                  { value: '#22c55e', label: 'Green', preview: '#22c55e' },
                  { value: '#3b82f6', label: 'Blue', preview: '#3b82f6' },
                  { value: '#a855f7', label: 'Purple', preview: '#a855f7' },
                  { value: '#f59e0b', label: 'Amber', preview: '#f59e0b' },
                  { value: '#ef4444', label: 'Red', preview: '#ef4444' },
                  { value: '#ec4899', label: 'Pink', preview: '#ec4899' }
                ]}
              />
              <SelectField
                id="icon"
                label="Icon"
                placeholder="Select icon"
                value={formData.icon}
                onValueChange={handleChange('icon')}
                options={[
                  { value: 'Heart', label: 'Heart' },
                  { value: 'BookOpen', label: 'Book Open' },
                  { value: 'Palette', label: 'Palette' },
                  { value: 'Users', label: 'Users' },
                  { value: 'Briefcase', label: 'Briefcase' },
                  { value: 'User', label: 'User' },
                  { value: 'Target', label: 'Target' },
                  { value: 'Star', label: 'Star' },
                  { value: 'Trophy', label: 'Trophy' },
                  { value: 'Zap', label: 'Zap' }
                ]}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateHabitMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {updateHabitMutation.isPending ? 'Updating...' : 'Update Habit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
