// Re-export API functions
export * from './habit';
export * from './focusSession';
export * from './activity';
export * from './analytics';
export * from './userAuth';
export * from './categories';
export * from './utils';
export * from './apiClient';

// Re-export types from centralized location for backward compatibility
export type {
  ICategory,
  IHabit,
  IHabitLog,
  CategoryFormData,
  HabitFormData,
  HabitLogFormData,
  LoginFormData,
  RegisterFormData,
  ResetPasswordFormData,
  ICategoryCreateRequest,
  ICategoryUpdateRequest,
  IHabitLogCreateRequest,
  IHabitLogUpdateRequest,
  IFocusSession,
  IFocusSessionCreateRequest,
  IFocusSessionUpdateRequest,
  IFocusSessionAnalytics,
  IActivityGridResponse,
  IActivityStatisticsResponse,
  IAuthResult
} from '@/types';

// Re-export the FocusSessionStatus constant object for value usage
export { FocusSessionStatus } from '@/types';
