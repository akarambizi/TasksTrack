import { z } from 'zod';
import { getUnitsForMetricType } from './constants';
import { type MetricType } from '@/utils/unitStandardization';

// Habit entity schema (complete database model) - matches Habit.cs exactly
export const habitEntitySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  metricType: z.string(),
  unit: z.string().nullable(),
  target: z.number().nullable(), // decimal? in C# becomes number | null
  targetFrequency: z.string().nullable(),
  category: z.string().nullable(),
  isActive: z.boolean(),
  createdDate: z.string(), // DateTimeOffset serialized as string
  updatedDate: z.string().nullable(), // DateTimeOffset? serialized as string or null
  createdBy: z.string(),
  updatedBy: z.string().nullable(),
  color: z.string().nullable(), // Hex color code
  icon: z.string().nullable(), // Icon name for UI
});

// Habit form schema (for creating/editing habits)
export const habitFormSchema = habitEntitySchema.pick({
  name: true,
  description: true,
  metricType: true,
  unit: true,
  target: true,
  targetFrequency: true,
  category: true,
  color: true,
  icon: true,
}).superRefine((data, ctx) => {
  // Custom validation: if unit is provided, validate it against the metric type
  if (data.unit && data.unit.length > 0) {
    try {
      const validUnits = getUnitsForMetricType(data.metricType as MetricType);
      if (validUnits.length > 0 && !validUnits.includes(data.unit)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Unit "${data.unit}" is not valid for metric type "${data.metricType}". Valid units are: ${validUnits.join(', ')}`,
          path: ['unit']
        });
      }
    } catch (error) {
      // If metricType is not a valid MetricType, skip unit validation
      // This allows for flexibility with backend data that might have different metric types
    }
  }

  // Custom validation: if target is provided and > 0, targetFrequency should be provided
  if (data.target && data.target > 0 && !data.targetFrequency) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Target frequency is required when target is set',
      path: ['targetFrequency']
    });
  }
});

// Export types
export type IHabit = z.infer<typeof habitEntitySchema>;
export type HabitFormData = z.infer<typeof habitFormSchema>;

// Request/Response types for API operations
export interface IHabitCreateRequest {
  name: string;
  description?: string;
  metricType: string;
  unit?: string;
  target?: number;
  targetFrequency?: string;
  category?: string;
  color?: string;
  icon?: string;
}

export interface IHabitUpdateRequest {
  name?: string;
  description?: string;
  metricType?: string;
  unit?: string;
  target?: number;
  targetFrequency?: string;
  category?: string;
  color?: string;
  icon?: string;
}
