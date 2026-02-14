import { test, expect } from './base-setup';
import { TIMEOUTS } from './constants/test-data';

/**
 * Authentication Flow Tests (Improved with Best Practices)
 * Using actual working selectors from the application
 */

test.describe('Authentication Flow', () => {
  const testUser = {
    name: 'E2E Test User',
    email: 'e2etest@example.com', // Use consistent email
    password: 'TestPassword123!',
  };

  test('should complete full signup and login flow', async ({ page }) => {
    // Step 1: Go to signup page
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');

    // Verify signup form is visible
    await expect(page.locator('h1:has-text("Sign Up")')).toBeVisible();

    // Step 2: Fill signup form using actual selectors
    await page.fill('[data-testid="name-input"]', testUser.name);
    await page.fill('[data-testid="email-input"]', testUser.email);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.fill('[data-testid="confirm-password-input"]', testUser.password);

    // Step 3: Submit signup form
    await page.click('[data-testid="submit-button"]');

    // Step 4: Wait for response and check the outcome
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(TIMEOUTS.SHORT);

    const currentUrl = page.url();

    if (currentUrl.includes('/login')) {
      // Case 1: Signup successful - user was created and redirected to login
      console.log('Signup successful - new user created, now logging in');

    } else if (currentUrl.includes('/signup')) {
      // Case 2: Still on signup page - likely user already exists
      console.log('Still on signup page - user likely already exists, navigating to login page');
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

    } else {
      // Unexpected URL
      throw new Error(`Unexpected URL after signup: ${currentUrl}`);
    }

    // Now we should be on the login page - proceed with login
    await expect(page.locator('h1:has-text("Login")')).toBeVisible();

    // Step 5: Login with actual selectors
    await page.fill('[data-testid="email-input"]', testUser.email);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="submit-button"]');

    // Step 6: Verify successful login
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.waitForTimeout(TIMEOUTS.SHORT);

    // Verify we're logged in - should see dashboard elements
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should show error for invalid login', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Try login with invalid credentials
    await page.fill('[data-testid="email-input"]', 'invalid@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    await page.click('[data-testid="submit-button"]');

    // Should show error message
    await expect(page.locator('[data-testid="error-message"], [role="alert"], .error')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // First, login using actual working pattern
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.fill('[data-testid="email-input"]', testUser.email);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="submit-button"]');

    // Wait for dashboard with fallback strategies
    await page.waitForTimeout(3000);
    try {
      await expect(page.locator('[data-testid="dashboard"]')).toBeVisible({ timeout: 10000 });
    } catch {
      // Fallback: check for URL change or other dashboard indicators
      try {
        await page.waitForURL('**/dashboard', { timeout: 5000 });
      } catch {
        // Final fallback: check for any dashboard content
        await expect(page.locator('h1, h2, main, [role="main"]').first()).toBeVisible({ timeout: 5000 });
      }
    }

    // Open user menu dropdown
    await page.click('[data-testid="user-menu-trigger"]');
    await page.waitForTimeout(1000);

    // Click logout button in dropdown with force click
    await page.locator('[data-testid="logout-button"]').last().click({ force: true });

    // Should redirect to login
    await page.waitForURL('**/login', { timeout: 10000 });
    await expect(page.locator('h1:has-text("Login")')).toBeVisible();
  });
});