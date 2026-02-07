import { MetricType, TargetFrequency, Category, HabitColor, HabitIcon } from '@/types/constants';

export interface IHabit {
    id: number;
    name: string;
    description?: string;
    metricType: MetricType; // "duration", "count", "distance", etc.
    unit?: string; // Display unit like "minutes", "miles", "reps", "pages"
    target?: number; // Daily/weekly target value
    targetFrequency?: TargetFrequency; // "daily", "weekly", etc.
    category?: Category; // "Health", "Learning", "Creative", etc.
    isActive: boolean;
    createdDate: string;
    updatedDate?: string;
    createdBy: string;
    updatedBy?: string;
    color?: HabitColor; // Hex color code
    icon?: HabitIcon; // Icon identifier
}

export interface IHabitLog {
    id: number;
    habitId: number;
    value: number; // Amount logged (e.g., 30 minutes, 2 miles, 10 reps)
    date: string; // Date of the log entry
    notes?: string;
    createdDate: string;
    updatedDate?: string;
    createdBy: string;
    updatedBy?: string;
    habit?: IHabit; // Optional populated habit information
}

export interface IHabitCreateRequest {
    name: string;
    description?: string;
    metricType: MetricType;
    unit?: string;
    target?: number;
    targetFrequency?: TargetFrequency;
    category?: Category;
    color?: HabitColor;
    icon?: HabitIcon;
}

export interface IHabitLogCreateRequest {
    habitId: number;
    value: number;
    date: string;
    notes?: string;
    createdBy: string;
}

export interface IHabitLogUpdateRequest extends Partial<IHabitLogCreateRequest> {
    id: number;
}