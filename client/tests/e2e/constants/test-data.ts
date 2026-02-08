/**
 * Test constants and data
 */

// Test users
export const TEST_USERS = {
  STANDARD: {
    name: 'E2E Test User',
    email: 'e2etest@example.com',
    password: 'TestPassword123!',
  },
  PREMIUM: {
    name: 'Premium Test User',
    email: 'premium.e2e@example.com',
    password: 'PremiumPass123!',
  },
} as const;

// Test timeouts
export const TIMEOUTS = {
  SHORT: 2000,
  MEDIUM: 5000,
  LONG: 10000,
  NAVIGATION: 15000,
  SERVER_START: 120000,
} as const;

/** @lintignore */
export const SELECTORS = {
  // Common
  SUBMIT_BUTTON: '[data-testid="submit-button"]',
  LOADING_SPINNER: '[data-testid="loading-spinner"]',
  ERROR_MESSAGE: '[data-testid="error-message"]',
  SUCCESS_MESSAGE: '[data-testid="success-message"]',
  
  // Auth
  LOGIN_FORM: '[data-testid="login-form"]',
  SIGNUP_FORM: '[data-testid="signup-form"]',
  EMAIL_INPUT: '[data-testid="email-input"]',
  PASSWORD_INPUT: '[data-testid="password-input"]',
  USER_MENU_TRIGGER: '[data-testid="user-menu-trigger"]',
  LOGOUT_BUTTON: '[data-testid="logout-button"]',
  
  // Dashboard
  DASHBOARD: '[data-testid="dashboard"]',
  USER_MENU: '[data-testid="user-menu"]',
  
  // Habits
  ADD_HABIT_BUTTON: '[data-testid="add-habit-button"]',
  HABIT_CARD: '[data-testid="habit-card"]',
  LOG_HABIT_BUTTON: '[data-testid="log-habit-button"]',
  NOTES_INPUT: '[data-testid="notes-input"]',
  
  // Focus Timer
  FOCUS_TIMER: '[data-testid="focus-timer"]',
  START_BUTTON: '[data-testid="start-button"]',
  PAUSE_BUTTON: '[data-testid="pause-button"]',
  STOP_BUTTON: '[data-testid="stop-button"]',
} as const;

/** @lintignore */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
  },
  HABITS: {
    LIST: '/api/habits',
    CREATE: '/api/habits',
    UPDATE: (id: number) => `/api/habits/${id}`,
    DELETE: (id: number) => `/api/habits/${id}`,
  },
  FOCUS: {
    SESSIONS: '/api/focus-sessions',
    START: '/api/focus-sessions/start',
    STOP: '/api/focus-sessions/stop',
  },
} as const;

/** @lintignore */
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  EMAIL_REQUIRED: 'Email is required',
  PASSWORD_REQUIRED: 'Password is required',
} as const;

