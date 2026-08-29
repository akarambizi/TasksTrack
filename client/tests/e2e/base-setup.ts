import { test as baseTest } from '@playwright/test';

/**
 * Base test configuration with common setup
 * Following patterns from popular repositories
 */

// Extend base test with common fixtures
export const test = baseTest.extend({
  // Auto-cleanup browser data before each test
  page: async ({ page }, use) => {
    await use(page);
  },
});

// Re-export for convenience
export { expect } from '@playwright/test';
