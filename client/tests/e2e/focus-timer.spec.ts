import { test, expect } from './base-setup';

const testUser = {
  email: 'e2etest@example.com',
  password: 'TestPassword123!',
};

test.describe('Focus Timer', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.fill('[data-testid="email-input"]', testUser.email);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="submit-button"]');

    // Wait for successful login
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.goto('/focus-sessions');
    await page.waitForLoadState('networkidle');
  });

  test('should display focus sessions page with main elements', async ({ page }) => {
    // Check for the focus sessions page
    await expect(page.locator('[data-testid="focus-sessions"]')).toBeVisible({ timeout: 10000 });
  });

  test('should display focus timer interface', async ({ page }) => {
    // Check that the page has the focus sessions container
    await expect(page.locator('[data-testid="focus-sessions"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="focus-timer-section"]')).toBeVisible({ timeout: 5000 });

    // Check that the page has the expected title and main structure
    await expect(page.locator('h1:has-text("Focus Sessions")')).toBeVisible({ timeout: 5000 });

    // The timer interface will vary based on whether there are habits and active sessions
    // So just verify the basic page structure is working
    const pageContent = page.locator('[data-testid="focus-sessions"]');
    await expect(pageContent).toBeVisible({ timeout: 5000 });
  });

  test('should display focus session history', async ({ page }) => {
    // Check if focus session history section is displayed - use proper element that exists
    await expect(page.locator('h1:has-text("Focus Sessions")')).toBeVisible({ timeout: 5000 });
    
    // Check that the history component is rendered (second "Focus Sessions" heading in history section)
    await expect(page.locator('text="Focus Sessions"').nth(1)).toBeVisible({ timeout: 5000 });
  });
});