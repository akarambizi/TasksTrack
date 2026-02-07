import { z } from 'zod';

// Habit log entity schema (complete database model)
export const habitLogEntitySchema = z.object({
  id: z.number(),
  habitId: z.number().min(1),
  value: z.number().min(0.01).max(999999),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().max(1000).optional().or(z.literal('')),
  createdDate: z.string(),
  updatedDate: z.string().optional(),
  createdBy: z.string(),
  updatedBy: z.string().optional(),
});

// Habit log form schema (for creating habit logs)
export const habitLogFormSchema = habitLogEntitySchema.pick({
  habitId: true,
  value: true,
  date: true,
  notes: true,
  createdBy: true,
}).extend({
  // Add extra validation for date field in forms
  date: z.string()
    .min(1, 'Date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((dateStr) => {
      const date = new Date(dateStr);
      const now = new Date();
      const maxDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
      const minDate = new Date(2020, 0, 1); // Reasonable minimum date

      return date >= minDate && date <= maxDate;
    }, 'Date must be between January 1, 2020 and one year from today'),
});

// Habit log request schemas for API operations
export const habitLogCreateRequestSchema = habitLogFormSchema;
export const habitLogUpdateRequestSchema = habitLogFormSchema.extend({
  id: z.number(),
}).partial().extend({
  id: z.number(), // id is always required for updates
});

// Export types
export type IHabitLog = z.infer<typeof habitLogEntitySchema>;
export type HabitLogFormData = z.infer<typeof habitLogFormSchema>;
export type IHabitLogCreateRequest = z.infer<typeof habitLogCreateRequestSchema>;
export type IHabitLogUpdateRequest = z.infer<typeof habitLogUpdateRequestSchema>;
