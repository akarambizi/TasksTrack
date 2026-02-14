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
