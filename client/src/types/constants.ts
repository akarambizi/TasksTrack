/**
 * Centralized constants and enums for the TasksTrack application
 * This prevents magic strings and ensures consistency across the app
 */

import { METRIC_TYPE_CONFIG, type MetricType } from '@/utils/unitStandardization';

// Target Frequency enum
export const TARGET_FREQUENCY = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly'
} as const;

export type TargetFrequency = typeof TARGET_FREQUENCY[keyof typeof TARGET_FREQUENCY];

// Default categories
export const CATEGORIES = {
  HEALTH: 'Health',
  FITNESS: 'Fitness',
  LEARNING: 'Learning',
  WORK: 'Work',
  PERSONAL: 'Personal',
  SOCIAL: 'Social',
  CREATIVE: 'Creative',
  FINANCE: 'Finance'
} as const;

export type Category = typeof CATEGORIES[keyof typeof CATEGORIES];

// Default colors for habits
export const HABIT_COLORS = {
  BLUE: '#3b82f6',
  GREEN: '#22c55e',
  PURPLE: '#a855f7',
  RED: '#ef4444',
  YELLOW: '#f59e0b',
  INDIGO: '#6366f1',
  PINK: '#ec4899',
  TEAL: '#14b8a6'
} as const;

export type HabitColor = typeof HABIT_COLORS[keyof typeof HABIT_COLORS];

// Default icons for habits
export const HABIT_ICONS = {
  TARGET: 'target',
  CLOCK: 'clock',
  BOOK: 'BookOpen',
  DUMBBELL: 'dumbbell',
  HEART: 'Heart',
  BRAIN: 'brain',
  STAR: 'Star',
  FLAME: 'Zap',
  TROPHY: 'Trophy',
  CALENDAR: 'calendar'
} as const;

export type HabitIcon = typeof HABIT_ICONS[keyof typeof HABIT_ICONS];

// Default form values
export const DEFAULT_HABIT_FORM = {
  metricType: 'duration' as MetricType,
  unit: 'minutes',
  target: 0,
  targetFrequency: TARGET_FREQUENCY.DAILY,
  category: CATEGORIES.HEALTH,
  color: HABIT_COLORS.BLUE,
  icon: HABIT_ICONS.TARGET
} as const;

// Unit mappings for each metric type (extracted from METRIC_TYPE_CONFIG for easy access)
export const getUnitsForMetricType = (metricType: MetricType): readonly string[] => {
  return METRIC_TYPE_CONFIG[metricType]?.units || [];
};

export const getDefaultUnitForMetricType = (metricType: MetricType): string => {
  const config = METRIC_TYPE_CONFIG[metricType];
  return config?.baseUnit || '';
};

// Re-export for convenience
export { METRIC_TYPE_CONFIG, type MetricType };