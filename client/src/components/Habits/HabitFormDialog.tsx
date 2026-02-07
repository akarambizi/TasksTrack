import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormField, SelectField, TextareaField } from "@/components/ui";
import { useEffect } from "react";
import { useHabitForm } from "./useHabitForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IHabit } from "@/api";
import { useActiveCategoriesQuery } from '@/queries/categories';
import { Badge } from "@/components/ui/badge";
import { METRIC_TYPE_CONFIG, type MetricType } from '@/utils/unitStandardization';

interface HabitFormDialogProps {
  mode: 'create' | 'edit';
  habit?: IHabit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: any) => Promise<void>;
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
  { value: '#22c55e', label: 'Green', preview: '#22c55e' },
  { value: '#3b82f6', label: 'Blue', preview: '#3b82f6' },
  { value: '#a855f7', label: 'Purple', preview: '#a855f7' },
  { value: '#f59e0b', label: 'Amber', preview: '#f59e0b' },
  { value: '#ef4444', label: 'Red', preview: '#ef4444' },
  { value: '#ec4899', label: 'Pink', preview: '#ec4899' },
  { value: '#14b8a6', label: 'Teal', preview: '#14b8a6' },
  { value: '#6b7280', label: 'Gray', preview: '#6b7280' }
];

const ICON_OPTIONS = [
  { value: 'Heart', label: '❤️ Heart' },
  { value: 'BookOpen', label: '📖 Book' },
  { value: 'Palette', label: '🎨 Palette' },
  { value: 'Users', label: '👥 Users' },
  { value: 'Briefcase', label: '💼 Work' },
  { value: 'User', label: '👤 Personal' },
  { value: 'Target', label: '🎯 Target' },
  { value: 'Star', label: '⭐ Star' },
  { value: 'Trophy', label: '🏆 Trophy' },
  { value: 'Zap', label: '⚡ Energy' },
  { value: 'Clock', label: '🕒 Time' },
  { value: 'Activity', label: '📊 Activity' }
];

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
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
  const { formData, handleChange, resetForm, error, setError, setFormData } = useHabitForm();
  const { data: categories = [] } = useActiveCategoriesQuery();

  // Populate form with habit data when editing
  useEffect(() => {
    if (mode === 'edit' && habit && open) {
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
  }, [mode, habit, open, setFormData]);

  // Get suggested units for selected metric type
  const selectedMetricType = METRIC_TYPE_OPTIONS.find(option => option.value === formData.metricType);
  const suggestedUnits = selectedMetricType?.units || [];

  // Auto-reset unit when metric type changes to ensure consistency
  useEffect(() => {
    if (formData.metricType && suggestedUnits.length > 0) {
      // If current unit is not valid for the selected metric type, reset to first option
      if (!formData.unit || !suggestedUnits.includes(formData.unit as any)) {
        handleChange('unit')(suggestedUnits[0]);
      }
    }
  }, [formData.metricType, suggestedUnits, formData.unit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name?.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.metricType) {
      setError("Metric type is required");
      return;
    }

    setError(null);

    try {
      await onSubmit(formData);
      if (mode === 'create') {
        resetForm();
      }
      onOpenChange(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : `Failed to ${mode} habit`);
    }
  };

  const handleClose = () => {
    if (mode === 'create') {
      resetForm();
    }
    setError(null);
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    } else {
      onOpenChange(open);
    }
  };

  const handleColorChange = (colorValue: string) => {
    handleChange('color')(colorValue);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} noValidate>
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
                id="name"
                name="name"
                label="Habit Name"
                placeholder="e.g., Read books, Exercise, Drink water"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name')(e.target.value)}
                required
              />
              
              <TextareaField
                id="description"
                label="Description (Optional)"
                placeholder="Describe your habit and why it's important to you..."
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('description')(e.target.value)}
                rows={3}
              />
            </div>

            {/* Measurement & Target */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Measurement & Target</h4>
              
              <div className="grid grid-cols-1 gap-4">
                <SelectField
                  id="metricType"
                  label="Metric Type"
                  placeholder="How do you want to measure this habit?"
                  value={formData.metricType}
                  onValueChange={handleChange('metricType')}
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
                    <p><strong>Examples:</strong> {selectedMetricType.examples}</p>
                    <p className="text-blue-600 dark:text-blue-400 mt-1">
                      <strong>💡 Analytics benefit:</strong> Using standardized units enables precise progress tracking and comparison across habits
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <SelectField
                    id="unit"
                    label="Unit"
                    placeholder="Select a unit"
                    value={formData.unit}
                    onValueChange={handleChange('unit')}
                    options={suggestedUnits.map(unit => ({
                      value: unit,
                      label: unit
                    }))}
                  />
                  
                  <FormField
                    id="target"
                    name="target"
                    type="number"
                    label="Target Amount"
                    placeholder="0"
                    value={formData.target?.toString() || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value ? parseInt(e.target.value, 10) : 0;
                      handleChange('target')(value);
                    }}
                  />
                </div>

                <SelectField
                  id="targetFrequency"
                  label="Target Frequency"
                  placeholder="How often do you want to achieve this target?"
                  value={formData.targetFrequency}
                  onValueChange={handleChange('targetFrequency')}
                  options={FREQUENCY_OPTIONS}
                />
              </div>
            </div>

            {/* Organization */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Organization</h4>
              
              <SelectField
                id="category"
                label="Category (Optional)"
                placeholder="Select a category to organize your habit"
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
                  id="icon"
                  label="Icon"
                  placeholder="Choose an icon for your habit"
                  value={formData.icon}
                  onValueChange={handleChange('icon')}
                  options={ICON_OPTIONS}
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