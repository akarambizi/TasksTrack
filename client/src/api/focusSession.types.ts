import type { IHabit } from './habit.types';

export interface IFocusSession {
    id: number;
    habitId: number;
    startTime: string;
    endTime?: string;
    plannedDurationMinutes: number;
    notes?: string;
    createdBy: string;
    pauseTime?: string;
    resumeTime?: string;
    status: string; // Server sends as string, not enum
    actualDurationSeconds?: number; // Optional in server response
    pausedDurationSeconds?: number; // Optional in server response
    createdDate: string;
    habitName?: string; // Server sends habitName field
    habit?: IHabit; // Nested habit object from server
}

export interface IFocusSessionLog {
    id: number;
    habitId: number;
    startTime: string;
    endTime?: string;
    status: FocusSessionStatus;
    actualDurationSeconds?: number;
    plannedDurationMinutes: number;
    notes?: string;
    habit?: IHabit;
}

export enum FocusSessionStatus {
    Active = "active",
    Paused = "paused",
    Completed = "completed",
    Interrupted = "interrupted"
}

export interface IFocusSessionCreateRequest {
    habitId: number;
    plannedDurationMinutes?: number; // Optional, defaults to 25 (Pomodoro)
    notes?: string;
}

export interface IFocusSessionUpdateRequest {
    notes?: string;
}

export interface IFocusSessionAnalytics {
    totalSessions: number;
    completedSessions: number;
    completionRate: number;
    totalMinutes: number;
    averageSessionMinutes: number;
    longestSessionMinutes: number;
    currentStreak: number;
    longestStreak: number;
}