import { z } from 'zod';
import { habitEntitySchema } from './habit';

// Focus session status enum schema
export const focusSessionStatusSchema = z.enum(['active', 'paused', 'completed', 'interrupted']);

// Focus session entity schema - matches FocusSessionResponse from backend
export const focusSessionEntitySchema = z.object({
  id: z.number(),
  habitId: z.number(),
  startTime: z.string(), // DateTimeOffset serialized as string
  endTime: z.string().optional(), // DateTimeOffset? serialized as string or null
  plannedDurationMinutes: z.number(),
  notes: z.string().optional(),
  createdBy: z.string().optional(), // nullable in response
  pauseTime: z.string().optional(), // DateTimeOffset? serialized as string or null
  resumeTime: z.string().optional(), // DateTimeOffset? serialized as string or null
  status: z.string(), // Server sends as string
  actualDurationSeconds: z.number(), // Non-nullable in response (defaults to 0)
  pausedDurationSeconds: z.number(), // Non-nullable in response (defaults to 0)
  createdDate: z.string(), // DateTimeOffset serialized as string
  habit: habitEntitySchema.optional(), // Nested Habit object (nullable)
});

// Focus session create schema
export const focusSessionCreateSchema = focusSessionEntitySchema.pick({
  habitId: true,
  plannedDurationMinutes: true,
  notes: true,
}).partial({
  plannedDurationMinutes: true,
  notes: true,
});

// Focus session update schema
export const focusSessionUpdateSchema = focusSessionEntitySchema.pick({
  endTime: true,
  notes: true,
  status: true,
  actualDurationSeconds: true,
  pausedDurationSeconds: true,
}).partial();

// Focus session analytics schema - matches FocusSessionAnalytics from backend
export const focusSessionAnalyticsSchema = z.object({
  totalSessions: z.number(),
  totalMinutes: z.number(),
  completedSessions: z.number(),
  averageSessionMinutes: z.number(),
  longestSessionMinutes: z.number(),
  currentStreak: z.number(),
  longestStreak: z.number(),
  completionRate: z.number(),
});

// Export types
export type IFocusSession = z.infer<typeof focusSessionEntitySchema>;
export type IFocusSessionCreateRequest = z.infer<typeof focusSessionCreateSchema>;
export type IFocusSessionUpdateRequest = z.infer<typeof focusSessionUpdateSchema>;
export type IFocusSessionAnalytics = z.infer<typeof focusSessionAnalyticsSchema>;
export type FocusSessionStatus = z.infer<typeof focusSessionStatusSchema>;

// Export enum for use in switch statements and value comparisons
export const FocusSessionStatus = {
  Active: 'active',
  Paused: 'paused',
  Completed: 'completed',
  Interrupted: 'interrupted'
} as const;
