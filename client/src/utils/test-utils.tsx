import React from 'react';
import { vi } from 'vitest';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import type { IHabit, IHabitLog, IFocusSession, IActivityGridResponse, IActivityStatisticsResponse } from '@/types';
import { FocusSessionStatus } from '@/types';

/**
 * Test Providers and Utilities
 * Following testing best practices: use real UI components, mock only external services
 */

// Create a fresh QueryClient for each test
export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
      staleTime: 0
    },
    mutations: { retry: false }
  }
});

// Test wrapper with all necessary providers
export const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = createTestQueryClient();
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </BrowserRouter>
  );
};

// Custom render function that includes all providers
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: TestWrapper, ...options });
};

/**
 * Test Data Factories
 * Create consistent mock data for testing scenarios
 */

export const mockHabit: IHabit = {
  id: 1,
  name: 'Test Habit',
  description: 'Test Description',
  metricType: 'count',
  isActive: true,
  createdDate: new Date().toISOString(),
  updatedDate: new Date().toISOString(),
  target: 10,
  unit: 'reps',
  createdBy: 'testuser',
  targetFrequency: 'daily',
  category: 'Health',
  updatedBy: null,
  color: '#3b82f6',
  icon: null
};

export const mockHabitLogs: IHabitLog[] = [
  {
    id: 1,
    habitId: 1,
    value: 35,
    date: '2024-01-23',
    notes: 'Great workout today!',
    createdDate: '2024-01-23T10:00:00Z',
    updatedDate: '2024-01-23T10:00:00Z',
    createdBy: 'user1',
    updatedBy: 'user1'
  },
  {
    id: 2,
    habitId: 1,
    value: 25,
    date: '2024-01-22',
    notes: 'Good progress',
    createdDate: '2024-01-22T10:00:00Z',
    updatedDate: '2024-01-22T10:00:00Z',
    createdBy: 'user1',
    updatedBy: 'user1'
  }
];

export const mockActivityGridData: IActivityGridResponse[] = [
  {
    date: '2024-01-01',
    activityCount: 2,
    totalValue: 20,
    intensityLevel: 2,
    habitsSummary: [
      { habitId: 1, habitName: 'Exercise', metricType: 'Count', value: 1, unit: null, color: null, icon: null },
      { habitId: 2, habitName: 'Reading', metricType: 'Duration', value: 30, unit: null, color: null, icon: null }
    ]
  },
  {
    date: '2024-01-02',
    activityCount: 3,
    totalValue: 45,
    intensityLevel: 3,
    habitsSummary: [
      { habitId: 1, habitName: 'Exercise', metricType: 'Count', value: 2, unit: null, color: null, icon: null },
      { habitId: 3, habitName: 'Meditation', metricType: 'Duration', value: 15, unit: null, color: null, icon: null }
    ]
  }
];

export const mockActivityStatistics: IActivityStatisticsResponse = {
  totalDaysTracked: 365,
  totalActiveDays: 150,
  totalActivities: 450,
  totalHabits: 5,
  activeHabits: 3,
  totalValue: 1200,
  averageValue: 8,
  completionRate: 0.85,
  currentOverallStreak: 7,
  longestOverallStreak: 21,
  mostActiveDayOfWeek: 1,
  mostActiveDayName: 'Monday',
  bestPerformingHabit: {
    habitId: 1,
    habitName: 'Exercise',
    totalValue: 100,
    activityCount: 30,
    completionRate: 0.9
  },
  monthlyStats: [
    {
      month: 1,
      year: 2024,
      monthName: 'January',
      activityCount: 25,
      totalValue: 150,
      activeDays: 20
    }
  ],
  weeklyStats: [
    {
      weekStartDate: '2024-01-01',
      weekEndDate: '2024-01-07',
      activityCount: 7,
      totalValue: 50,
      activeDays: 6
    }
  ]
};

export const mockFocusSessions: IFocusSession[] = [
  {
    id: 1,
    habitId: 1,
    status: FocusSessionStatus.Completed,
    plannedDurationMinutes: 25,
    startTime: '2026-01-31T10:00:00Z',
    createdBy: 'user1',
    createdDate: '2026-01-31T10:00:00Z',
    actualDurationSeconds: 1500,
    pausedDurationSeconds: 0
  }
];

export const mockActiveFocusSession: IFocusSession = {
  id: 1,
  habitId: 1,
  status: FocusSessionStatus.Active,
  plannedDurationMinutes: 25,
  startTime: '2026-01-31T10:00:00Z',
  createdBy: 'user1',
  createdDate: '2026-01-31T10:00:00Z',
  actualDurationSeconds: 0,
  pausedDurationSeconds: 0
};

export const mockFocusSessionAnalytics = {
  totalSessions: 10,
  completedSessions: 8,
  totalMinutes: 200,
  averageSessionMinutes: 25,
  longestSessionMinutes: 45,
  currentStreak: 3,
  longestStreak: 5,
  completionRate: 0.8
};

export const mockStartedFocusSession: IFocusSession = {
  id: 1,
  habitId: 1,
  status: FocusSessionStatus.Active,
  plannedDurationMinutes: 25,
  startTime: '2026-01-31T10:00:00Z',
  createdBy: 'user1',
  createdDate: '2026-01-31T10:00:00Z',
  actualDurationSeconds: 0,
  pausedDurationSeconds: 0
};

export const mockPausedFocusSession: IFocusSession = {
  id: 1,
  habitId: 1,
  status: FocusSessionStatus.Paused,
  plannedDurationMinutes: 25,
  startTime: '2026-01-31T10:00:00Z',
  pauseTime: '2026-01-31T10:10:00Z',
  createdBy: 'user1',
  createdDate: '2026-01-31T10:00:00Z',
  actualDurationSeconds: 600,
  pausedDurationSeconds: 0
};

export const mockResumedFocusSession: IFocusSession = {
  id: 1,
  habitId: 1,
  status: FocusSessionStatus.Active,
  plannedDurationMinutes: 25,
  startTime: '2026-01-31T10:00:00Z',
  resumeTime: '2026-01-31T10:15:00Z',
  createdBy: 'user1',
  createdDate: '2026-01-31T10:00:00Z',
  actualDurationSeconds: 900,
  pausedDurationSeconds: 300
};

export const mockCompletedFocusSession: IFocusSession = {
  id: 1,
  habitId: 1,
  status: FocusSessionStatus.Completed,
  plannedDurationMinutes: 25,
  actualDurationSeconds: 1500,
  startTime: '2026-01-31T10:00:00Z',
  endTime: '2026-01-31T10:25:00Z',
  createdBy: 'user1',
  createdDate: '2026-01-31T10:00:00Z',
  pausedDurationSeconds: 0
};

export const mockCancelledFocusSession: IFocusSession = {
  id: 1,
  habitId: 1,
  status: FocusSessionStatus.Interrupted,
  plannedDurationMinutes: 25,
  startTime: '2026-01-31T10:00:00Z',
  endTime: '2026-01-31T10:10:00Z',
  createdBy: 'user1',
  createdDate: '2026-01-31T10:00:00Z',
  actualDurationSeconds: 600,
  pausedDurationSeconds: 0
};


// Mock TanStack Query hooks
export const createMockQuery = <T,>(data: T, options: any = {}) => ({
  data,
  error: null,
  isLoading: false,
  isError: false,
  isSuccess: true,
  refetch: vi.fn(),
  ...options
});

export const createMockMutation = (options: any = {}) => ({
  mutate: vi.fn(),
  mutateAsync: vi.fn(),
  isLoading: false,
  isError: false,
  isSuccess: false,
  error: null,
  data: undefined,
  reset: vi.fn(),
  ...options
});

// Mock form utilities
export const createMockUseForm = (options: any = {}) => ({
  register: vi.fn(),
  handleSubmit: vi.fn((fn) => (e?: any) => {
    e?.preventDefault?.();
    fn?.({});
  }),
  formState: { errors: {}, isSubmitting: false, isValid: true, isDirty: false },
  setValue: vi.fn(),
  getValues: vi.fn(() => ({})),
  watch: vi.fn(),
  control: {
    _subjects: {
      array: new Map(),
      values: { next: vi.fn(), subscribe: vi.fn() }
    },
    _names: {
      array: new Set(),
      mount: new Set(),
      unMount: new Set(),
      watch: new Set()
    },
    _fields: {},
    _defaultValues: {},
    _formValues: {},
    _stateFlags: {
      mount: false,
      action: false,
      watch: false
    },
    _options: {
      shouldUnregister: true,
      mode: 'onChange',
      resolver: undefined,
      context: undefined
    },
    register: vi.fn(),
    unregister: vi.fn(),
    _getWatch: vi.fn(),
    _updateFieldArray: vi.fn(),
    _removeUnmounted: vi.fn(),
    _getDirty: vi.fn(),
    _getFieldArrayValue: vi.fn(),
    _reset: vi.fn(),
    _subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })),
    _setDisabledField: vi.fn()
  },
  reset: vi.fn(),
  ...options
});

