export interface IHabit {
    id: number;
    name: string;
    description?: string;
    metricType: string; // "minutes", "miles", "reps", "pages", etc.
    unit?: string; // Display unit like "min", "mi", "reps", "pages"
    target?: number; // Daily/weekly target value
    targetFrequency?: string; // "daily", "weekly"
    category?: string; // "Health", "Learning", "Creative", etc.
    isActive: boolean;
    createdDate: string;
    updatedDate?: string;
    createdBy: string;
    updatedBy?: string;
    color?: string; // Hex color code
    icon?: string; // Icon identifier
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
    metricType: string;
    unit?: string;
    target?: number;
    targetFrequency?: string;
    category?: string;
    color?: string;
    icon?: string;
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