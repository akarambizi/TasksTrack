import { z } from 'zod';

// Analytics response schema
export const analyticsResponseSchema = z.object({
  period: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  totalHabitsTracked: z.number(),
  totalSessions: z.number(),
  totalMinutes: z.number(),
  averageSessionDuration: z.number(),
  activeDays: z.number(),
  totalDays: z.number(),
  activityRate: z.number(),
  currentStreak: z.number(),
  longestStreak: z.number(),
  habitBreakdown: z.array(z.lazy(() => habitAnalyticsSchema)),
  categoryBreakdown: z.array(z.lazy(() => categoryAnalyticsSchema)),
  dailyProgress: z.array(z.lazy(() => dailyProgressSchema)),
  goalProgress: z.lazy(() => goalProgressSchema),
});

// Habit analytics schema
export const habitAnalyticsSchema = z.object({
  habitId: z.number(),
  name: z.string(),
  category: z.string(),
  sessionCount: z.number(),
  totalMinutes: z.number(),
  averageSessionDuration: z.number(),
  completionRate: z.number(),
  consistencyScore: z.number(),
  targetAchievementRate: z.number(),
  currentStreak: z.number(),
});

// Category analytics schema
export const categoryAnalyticsSchema = z.object({
  category: z.string(),
  sessionCount: z.number(),
  totalSessions: z.number(),
  totalMinutes: z.number(),
  averageSessionDuration: z.number(),
  habitCount: z.number(),
  completionRate: z.number(),
  targetAchievementRate: z.number(),
  consistencyScore: z.number(),
});

// Daily progress schema
export const dailyProgressSchema = z.object({
  date: z.string(),
  sessionCount: z.number(),
  totalMinutes: z.number(),
  completionRate: z.number(),
  averageSessionDuration: z.number(),
  activeHabits: z.number(),
  activityIntensity: z.number(),
  habitsCompleted: z.number(),
});

// Goal progress schema
export const goalProgressSchema = z.object({
  totalGoals: z.number(),
  achievedGoals: z.number(),
  achievementRate: z.number(),
  weeklyTargetsMet: z.number(),
  weeklyTargetsTotal: z.number(),
  monthlyTargetsMet: z.number(),
  monthlyTargetsTotal: z.number(),
  progressPercentage: z.number(),
  actualMinutes: z.number(),
  targetMinutesPerPeriod: z.number(),
  onTrack: z.boolean(),
  actualSessions: z.number(),
  targetSessionsPerPeriod: z.number(),
  requiredDailyAverage: z.number(),
  daysRemaining: z.number(),
});

// Export types
export type IAnalyticsResponse = z.infer<typeof analyticsResponseSchema>;
export type IHabitAnalytics = z.infer<typeof habitAnalyticsSchema>;
export type ICategoryAnalytics = z.infer<typeof categoryAnalyticsSchema>;
export type IDailyProgress = z.infer<typeof dailyProgressSchema>;

