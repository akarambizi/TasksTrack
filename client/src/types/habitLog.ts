import { z } from 'zod';
import { parseISO, isAfter, isBefore, addYears, startOfDay } from 'date-fns';

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
}).extend({
  // More flexible validation for value field to allow empty inputs during editing
  value: z.union([
    z.number().min(0.01, "Value must be at least 0.01").max(999999),
    z.string().transform((val, ctx) => {
      if (val === '' || val === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Value is required",
        });
        return z.NEVER;
      }
      const parsed = parseFloat(val);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Value must be a valid number",
        });
        return z.NEVER;
      }
      if (parsed < 0.01) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Value must be at least 0.01",
        });
        return z.NEVER;
      }
      if (parsed > 999999) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Value cannot exceed 999,999",
        });
        return z.NEVER;
      }
      return parsed;
    })
  ]),
  // Add extra validation for date field in forms
  date: z.string()
    .min(1, 'Date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((dateStr) => {
      try {
        const date = parseISO(dateStr);
        const now = startOfDay(new Date());
        const maxDate = addYears(now, 1);
        const minDate = parseISO('2020-01-01');

        return !isBefore(date, minDate) && !isAfter(date, maxDate);
      } catch {
        return false;
      }
    }, 'Date must be between January 1, 2020 and one year from today'),
});

// Habit log request schemas for API operations
export const habitLogUpdateRequestSchema = habitLogFormSchema.extend({
  id: z.number(),
}).partial().extend({
  id: z.number(), // id is always required for updates
});

// Export types
export type IHabitLog = z.infer<typeof habitLogEntitySchema>;
export type HabitLogFormData = z.infer<typeof habitLogFormSchema>;
export type IHabitLogCreateRequest = z.infer<typeof habitLogFormSchema>;
export type IHabitLogUpdateRequest = z.infer<typeof habitLogUpdateRequestSchema>;
