import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormField, SelectField, TextareaField } from "@/components/ui";
import { useEffect, useState } from "react";
import { useHabitForm } from "./useHabitForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IHabit } from "@/types";
import { useActiveCategoriesQuery } from '@/queries/categories';
import { Badge } from "@/components/ui/badge";
import { type HabitFormData } from '@/types';
import {
  METRIC_TYPE_CONFIG,
  type MetricType,
  type HabitColor,
  TARGET_FREQUENCY,
  CATEGORIES,
  HABIT_COLORS,
  HABIT_ICONS,
  getUnitsForMetricType,
  getDefaultUnitForMetricType
} from '@/types/constants';

interface HabitFormDialogProps {
  mode: 'create' | 'edit';
  habit?: IHabit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: HabitFormData) => Promise<void>;
  isLoading: boolean;
  title: string;
  description: string;
  submitLabel: string;
  loadingLabel: string;
}

// Unified metric type options using standardized configuration
const METRIC_TYPE_OPTIONS = Object.entries(METRIC_TYPE_CONFIG).map(([value, config]) => ({
  value: value as MetricType,
  label: config.label,
  units: [...config.units], // Create copy since readonly
  examples: getExamplesForMetricType(value as MetricType)
}));

function getExamplesForMetricType(metricType: MetricType): string {
  const examples = {
    duration: 'Exercise, Reading, Meditation',
    count: 'Push-ups, Tasks completed, Items processed',
    distance: 'Running, Walking, Cycling',
    pages: 'Reading, Writing, Research',
    volume: 'Water intake, Meals, Supplements',
    weight: 'Weight lifting, Body weight, Equipment',
    binary: 'Daily check-in, Habit completion, Yes/No tasks',
    percentage: 'Performance rating, Quiz scores, Efficiency',
    currency: 'Savings, Spending, Budget tracking'
  };
  return examples[metricType];
}

const COLOR_OPTIONS = [
  { value: HABIT_COLORS.GREEN, label: 'Green', preview: HABIT_COLORS.GREEN },
  { value: HABIT_COLORS.BLUE, label: 'Blue', preview: HABIT_COLORS.BLUE },
  { value: HABIT_COLORS.PURPLE, label: 'Purple', preview: HABIT_COLORS.PURPLE },
  { value: HABIT_COLORS.YELLOW, label: 'Amber', preview: HABIT_COLORS.YELLOW },
  { value: HABIT_COLORS.RED, label: 'Red', preview: HABIT_COLORS.RED },
  { value: HABIT_COLORS.PINK, label: 'Pink', preview: HABIT_COLORS.PINK },
  { value: HABIT_COLORS.TEAL, label: 'Teal', preview: HABIT_COLORS.TEAL },
  { value: '#6b7280', label: 'Gray', preview: '#6b7280' }
];

const ICON_OPTIONS = [
  { value: HABIT_ICONS.HEART, label: '❤️ Heart' },
  { value: HABIT_ICONS.BOOK, label: '📖 Book' },
  { value: 'Palette', label: '🎨 Palette' },
  { value: 'Users', label: '👥 Users' },
  { value: 'Briefcase', label: '💼 Work' },
  { value: 'User', label: '👤 Personal' },
  { value: HABIT_ICONS.TARGET, label: '🎯 Target' },
  { value: HABIT_ICONS.STAR, label: '⭐ Star' },
  { value: HABIT_ICONS.TROPHY, label: '🏆 Trophy' },
  { value: HABIT_ICONS.FLAME, label: '⚡ Energy' },
  { value: HABIT_ICONS.CLOCK, label: '🕒 Time' },
  { value: 'Activity', label: '📊 Activity' }
];

const FREQUENCY_OPTIONS = [
  { value: TARGET_FREQUENCY.DAILY, label: 'Daily' },
  { value: TARGET_FREQUENCY.WEEKLY, label: 'Weekly' },
  { value: TARGET_FREQUENCY.MONTHLY, label: 'Monthly' },
  { value: TARGET_FREQUENCY.YEARLY, label: 'Yearly' }
];

export function HabitFormDialog({
  mode,
  habit,
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  title,
  description,
  submitLabel,
  loadingLabel
}: HabitFormDialogProps) {
  const form = useHabitForm();
  const { control, watch, reset, handleSubmit, setValue } = form;
  const { data: categories = [] } = useActiveCategoriesQuery();

  // Watch specific values for reactive updates
  const selectedMetricType = watch('metricType');
  const formData = watch(); // For form preview

  // Populate form with habit data when editing
  useEffect(() => {
    if (mode === 'edit' && habit && open) {
      reset({
        name: habit.name,
        description: habit.description || '',
        metricType: habit.metricType,
        unit: habit.unit || getDefaultUnitForMetricType(habit.metricType as MetricType),
        target: habit.target || 0,
        targetFrequency: habit.targetFrequency || TARGET_FREQUENCY.DAILY,
        category: habit.category || CATEGORIES.HEALTH,
        color: habit.color || HABIT_COLORS.BLUE,
        icon: habit.icon || HABIT_ICONS.STAR,
      });
    }
  }, [mode, habit, open, reset]);

  // Get suggested units for selected metric type
  const suggestedUnits = getUnitsForMetricType(selectedMetricType as MetricType) || [];

  const [error, setError] = useState<string | null>(null);

  const onFormSubmit = async (data: HabitFormData) => {
    try {
      setError(null);
      await onSubmit(data);
      if (mode === 'create') {
        reset();
      }
      onOpenChange(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : `Failed to ${mode} habit`);
    }
  };

  const handleClose = () => {
    if (mode === 'create') {
      reset();
    }
    setError(null);
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      handleClose();
    } else {
      onOpenChange(newOpen);
    }
  };

  const handleColorChange = (colorValue: string) => {
    setValue('color', colorValue as HabitColor);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Basic Information</h4>

              <FormField
                name="name"
                control={control}
                label="Habit Name"
                placeholder="e.g., Read books, Exercise, Drink water"
                required
              />

              <TextareaField
                name="description"
                control={control}
                label="Description (Optional)"
                placeholder="Describe your habit and why it's important to you..."
                rows={3}
              />
            </div>

            {/* Measurement & Target */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Measurement & Target</h4>

              <div className="grid grid-cols-1 gap-4">
                <SelectField
                  name="metricType"
                  control={control}
                  label="Metric Type"
                  placeholder="How do you want to measure this habit?"
                  valueType="string"
                  required
                  options={METRIC_TYPE_OPTIONS.map(option => ({
                    value: option.value,
                    label: option.label,
                    description: option.examples
                  }))}
                />

                {selectedMetricType && (
                  <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
                    <p><strong>Available units:</strong> {suggestedUnits.join(', ')}</p>
                    <p className="text-blue-600 dark:text-blue-400 mt-1">
                      <strong>💡 Analytics benefit:</strong> Using standardized units enables precise progress tracking and comparison across habits
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <SelectField
                    name="unit"
                    control={control}
                    label="Unit"
                    placeholder="Select a unit"
                    valueType="string"
                    options={suggestedUnits.map(unit => ({
                      value: unit,
                      label: unit
                    }))}
                  />

                  <FormField
                    name="target"
                    control={control}
                    type="number"
                    label="Target Amount"
                    placeholder="0"
                  />
                </div>

                <SelectField
                  name="targetFrequency"
                  control={control}
                  label="Target Frequency"
                  placeholder="How often do you want to achieve this target?"
                  valueType="string"
                  options={FREQUENCY_OPTIONS}
                />
              </div>
            </div>

            {/* Organization */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Organization</h4>

              <SelectField
                name="category"
                control={control}
                label="Category (Optional)"
                placeholder="Select a category to organize your habit"
                valueType="string"
                options={[
                  { value: 'none', label: 'No Category' },
                  ...categories.map(cat => ({
                    value: cat.name,
                    label: cat.name
                  }))
                ]}
              />
            </div>

            {/* Appearance */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Appearance</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="color" className="text-sm font-medium">Color</label>
                  <div className="space-y-3">
                    {/* Visual Color Picker */}
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="colorPicker"
                        value={formData.color || '#3b82f6'}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-12 h-8 rounded border border-input bg-background"
                      />
                      <div className="flex-1 px-3 py-2 bg-muted/50 rounded-md text-sm font-mono">
                        {formData.color || '#3b82f6'}
                      </div>
                    </div>

                    {/* Preset Color Options */}
                    <div className="grid grid-cols-4 gap-2">
                      {COLOR_OPTIONS.map(colorOption => (
                        <button
                          key={colorOption.value}
                          type="button"
                          onClick={() => handleColorChange(colorOption.value)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            formData.color === colorOption.value
                              ? 'border-foreground scale-110'
                              : 'border-muted-foreground/20 hover:border-muted-foreground/50'
                          }`}
                          style={{ backgroundColor: colorOption.value }}
                          title={colorOption.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <SelectField
                  name="icon"
                  control={control}
                  label="Icon"
                  placeholder="Choose an icon for your habit"                  valueType="string"                  options={ICON_OPTIONS}
                />
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Preview</h4>
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ backgroundColor: formData.color || '#3b82f6' }}
                  >
                    {formData.icon?.charAt(0) || '⭐'}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">{formData.name || 'Your Habit Name'}</h5>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        Target: {formData.target || 0} {formData.unit || 'units'} {formData.targetFrequency || 'daily'}
                      </span>
                      {formData.category && (
                        <Badge variant="secondary" className="text-xs">
                          {formData.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? loadingLabel : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}