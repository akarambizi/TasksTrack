import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useHabitForm } from "./useHabitForm";
import { useCreateHabitMutation } from "@/queries";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IHabit } from "@/api";
import { useAuthContext } from "@/context/useAuthContext";

export function AddHabitDialog() {
  const [open, setOpen] = useState(false);
  const { formData, handleChange, resetForm, error, setError } = useHabitForm();
  const createHabitMutation = useCreateHabitMutation();
  const { user } = useAuthContext();

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
        <form onSubmit={onSubmit}>
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
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Habit name (e.g., Read books, Exercise)"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name')(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your habit (optional)"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('description')(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="metricType">Metric Type</Label>
                <Select
                  value={formData.metricType}
                  onValueChange={handleChange('metricType')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="pages">Pages</SelectItem>
                    <SelectItem value="reps">Repetitions</SelectItem>
                    <SelectItem value="miles">Miles</SelectItem>
                    <SelectItem value="kilometers">Kilometers</SelectItem>
                    <SelectItem value="steps">Steps</SelectItem>
                    <SelectItem value="cups">Cups</SelectItem>
                    <SelectItem value="times">Times</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  placeholder="min, pages, reps..."
                  value={formData.unit}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('unit')(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="target">Daily Target</Label>
                <Input
                  id="target"
                  type="number"
                  placeholder="0"
                  value={formData.target}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('target')(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={handleChange('category')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Learning">Learning</SelectItem>
                    <SelectItem value="Creative">Creative</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('color')(e.target.value)}
              />
            </div>
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
