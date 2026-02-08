import { test, expect } from '@playwright/test';

test.describe('Basic App Tests', () => {
  test('should be able to access login page', async ({ page }) => {
    // Navigate directly to the login page without using webServer
    await page.goto('http://localhost:3000/login');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check if basic elements exist
    await expect(page.locator('h1:has-text("Login")')).toBeVisible({ timeout: 10000 });
  });
});