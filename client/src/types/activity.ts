import { z } from 'zod';

// Habit Activity Summary schema - matches HabitActivitySummary.cs
export const habitActivitySummarySchema = z.object({
  habitId: z.number(),
  habitName: z.string(),
  metricType: z.string(),
  unit: z.string().nullable(),
  value: z.number(), // decimal in C# becomes number
  color: z.string().nullable(),
  icon: z.string().nullable(),
});

// Activity Grid Day schema - matches ActivityGridResponse.cs exactly
export const activityGridDaySchema = z.object({
  date: z.string(), // DateOnly serialized as string
  activityCount: z.number(),
  totalValue: z.number(), // decimal in C# becomes number
  intensityLevel: z.number(), // 0-4 for GitHub-style colors
  habitsSummary: z.array(habitActivitySummarySchema), // Required array
});

// Habit Performance schema - matches HabitPerformance.cs
export const habitPerformanceSchema = z.object({
  habitId: z.number(),
  habitName: z.string(),
  totalValue: z.number(), // decimal in C# becomes number
  activityCount: z.number(),
  completionRate: z.number(), // double in C# becomes number
});

// Monthly Statistics schema - matches MonthlyStatistics.cs
export const monthlyStatisticsSchema = z.object({
  year: z.number(),
  month: z.number(), // 1-12
  monthName: z.string(),
  activityCount: z.number(),
  totalValue: z.number(), // decimal in C# becomes number
  activeDays: z.number(),
});

// Weekly Statistics schema - matches WeeklyStatistics.cs
export const weeklyStatisticsSchema = z.object({
  weekStartDate: z.string(), // DateOnly serialized as string
  weekEndDate: z.string(), // DateOnly serialized as string
  activityCount: z.number(),
  totalValue: z.number(), // decimal in C# becomes number
  activeDays: z.number(), // 0-7
});

// Activity Grid Response schema (array of days)
export const activityGridResponseSchema = z.array(activityGridDaySchema);

// Activity Statistics Response schema - matches ActivityStatisticsResponse.cs exactly
export const activityStatisticsResponseSchema = z.object({
  totalDaysTracked: z.number(),
  totalActiveDays: z.number(),
  totalActivities: z.number(),
  totalHabits: z.number(),
  activeHabits: z.number(),
  totalValue: z.number(), // decimal in C# becomes number
  averageValue: z.number(), // decimal in C# becomes number
  completionRate: z.number(), // double in C# becomes number
  currentOverallStreak: z.number(),
  longestOverallStreak: z.number(),
  mostActiveDayOfWeek: z.number(), // 0=Sunday, 6=Saturday
  mostActiveDayName: z.string().nullable(),
  bestPerformingHabit: habitPerformanceSchema.nullable(),
  monthlyStats: z.array(monthlyStatisticsSchema),
  weeklyStats: z.array(weeklyStatisticsSchema),
});

// Export types
export type IActivityGridResponse = z.infer<typeof activityGridDaySchema>;
export type ActivityGridResponse = z.infer<typeof activityGridResponseSchema>;
export type IActivityStatisticsResponse = z.infer<typeof activityStatisticsResponseSchema>;
