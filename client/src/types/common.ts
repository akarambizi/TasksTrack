import { z } from 'zod';
import {
  TARGET_FREQUENCY,
  CATEGORIES,
  HABIT_COLORS,
  HABIT_ICONS,
  METRIC_TYPE_CONFIG,
  type TargetFrequency,
  type Category,
  type HabitColor,
  type HabitIcon,
} from './constants';

// Utility schemas used across multiple domains
export const metricTypeSchema = z.enum(Object.keys(METRIC_TYPE_CONFIG) as [keyof typeof METRIC_TYPE_CONFIG, ...Array<keyof typeof METRIC_TYPE_CONFIG>]);
export const targetFrequencySchema = z.enum(Object.values(TARGET_FREQUENCY) as [TargetFrequency, ...TargetFrequency[]]);
export const categorySchema = z.enum(Object.values(CATEGORIES) as [Category, ...Category[]]);
export const habitColorSchema = z.enum(Object.values(HABIT_COLORS) as [HabitColor, ...HabitColor[]]);
export const habitIconSchema = z.enum(Object.values(HABIT_ICONS) as [HabitIcon, ...HabitIcon[]]);
