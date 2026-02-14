import { test, expect } from './base-setup';

test.describe('Basic App Tests', () => {
  test('should be able to access login page', async ({ page }) => {
    // Navigate to the login page using baseURL configuration
    await page.goto('/login');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check if basic elements exist
    await expect(page.locator('h1:has-text("Login")')).toBeVisible({ timeout: 10000 });
  });
});