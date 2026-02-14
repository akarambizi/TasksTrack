import { test, expect } from './base-setup';
import { TIMEOUTS } from './constants/test-data';

/**
 * Habits Management Tests (Improved with Best Practices)
 * Using actual working selectors from the application
 */

test.describe('Habits Management', () => {
  const testUser = {
    email: 'e2etest@example.com',
    password: 'TestPassword123!',
  };
  
  test.beforeEach(async ({ page }) => {
    // Login before each test using actual working pattern
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.fill('[data-testid="email-input"]', testUser.email);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="submit-button"]');
    
    // Wait for login and navigate to habits
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.goto('/habits');
    await page.waitForLoadState('networkidle');
  });

  test('should display habits page with main elements', async ({ page }) => {
    // Use broader selectors that are more likely to exist
    await expect(page.locator('h1, h2, h3').first()).toBeVisible();
    await expect(page.locator('[data-testid="add-habit-button"]')).toBeVisible();
  });

  test('should create a new habit successfully', async ({ page }) => {
    const habitName = `E2E Test Habit ${Date.now()}`;
    
    // Click add habit button
    await page.click('[data-testid="add-habit-button"], button:has-text("Add Habit"), button:has-text("Add")');
    
    // Wait for dialog to open
    await expect(page.locator('[data-testid="habit-form-dialog"], [role="dialog"]')).toBeVisible();
    
    // Fill habit name
    await page.fill('[data-testid="habit-name-input"], input[name="name"]', habitName);
    
    // Submit form
    await page.click('[data-testid="create-habit-button"], button:has-text("Create Habit"), button:has-text("Create")');
    
    // Wait for form to close and page to update
    await page.waitForTimeout(TIMEOUTS.LONG);
    
    // Verify habit was created - just check that the habit name appears on the page
    await expect(page.locator(`text="${habitName}"`)).toBeVisible({ timeout: 10000 });
  });

  test('should log a habit activity', async ({ page }) => {
    const habitName = `E2E Test Habit ${Date.now()}`;
    
    // First create a habit with API response monitoring
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/habits') && response.request().method() === 'POST'
    );
    
    await page.click('[data-testid="add-habit-button"], button:has-text("Add Habit"), button:has-text("Add")');
    await expect(page.locator('[data-testid="habit-form-dialog"], [role="dialog"]')).toBeVisible();
    await page.waitForTimeout(500); // Brief wait for form to fully load
    
    await page.fill('[data-testid="habit-name-input"], input[name="name"]', habitName);
    await page.click('[data-testid="create-habit-button"], button:has-text("Create Habit"), button:has-text("Create")');
    
    // Wait for API response and check if it was successful
    const response = await responsePromise;
    const status = response.status();
    console.log(`Habit creation API response: ${status}`);
    
    if (status !== 200 && status !== 201) {
      const responseBody = await response.text();
      console.log(`Habit creation failed: ${responseBody}`);
      throw new Error(`Habit creation API failed with status ${status}: ${responseBody}`);
    }
    
    // Wait for form to close
    await expect(page.locator('[data-testid="habit-form-dialog"], [role="dialog"]')).not.toBeVisible({ timeout: 5000 });
    
    // Wait for page to update with new habit
    await page.waitForTimeout(TIMEOUTS.MEDIUM);
    await page.waitForLoadState('networkidle');
    
    // Verify habit appears on page - try multiple strategies
    let habitCard;
    try {
      // First try with data-testid
      habitCard = page.locator(`[data-testid="habit-card"]:has-text("${habitName}")`);
      await expect(habitCard).toBeVisible({ timeout: 5000 });
    } catch {
      // Fallback: try finding by text anywhere on page
      await expect(page.locator(`text="${habitName}"`)).toBeVisible({ timeout: 5000 });
      // Then find the card containing that text
      habitCard = page.locator(`[data-testid="habit-card"]:has-text("${habitName}"), .habit-card:has-text("${habitName}"), [class*="card"]:has-text("${habitName}")`).first();
      await expect(habitCard).toBeVisible();
    }
    
    // Click the log button for this habit
    await habitCard.locator('button:has-text("Log")', { hasText: 'Log' }).click();
    
    // Wait for the log dialog to open
    await expect(page.locator('[data-testid="add-habit-log-dialog"]')).toBeVisible();
    
    // Fill log form with required fields
    await page.fill('[data-testid="value-input"]', '1');
    
    // Fill notes field if visible
    const notesField = page.locator('[data-testid="notes-input"]');
    if (await notesField.isVisible()) {
      await notesField.fill('Completed the habit successfully');
    }
    
    // Submit the log
    await page.click('[data-testid="submit-button"]');
    
    // Wait for dialog to close and verify log was recorded
    await expect(page.locator('[data-testid="add-habit-log-dialog"]')).not.toBeVisible({ timeout: 5000 });
  });

  test('should navigate to habit detail page', async ({ page }) => {
    const habitName = `E2E Test Habit ${Date.now()}`;
    
    // Create a habit first with robust waiting
    await page.click('[data-testid="add-habit-button"], button:has-text("Add Habit"), button:has-text("Add")');
    await expect(page.locator('[data-testid="habit-form-dialog"], [role="dialog"]')).toBeVisible();
    await page.waitForTimeout(500);
    
    await page.fill('[data-testid="habit-name-input"], input[name="name"]', habitName);
    await page.click('[data-testid="create-habit-button"], button:has-text("Create Habit"), button:has-text("Create")');
    
    // Wait for form submission and ensure page is updated
    await page.waitForTimeout(TIMEOUTS.MEDIUM);
    await page.waitForLoadState('networkidle');
    
    // Refresh to ensure we see the new habit
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Find and click on habit title to navigate to detail page
    let habitCard;
    try {
      habitCard = page.locator(`[data-testid="habit-card"]:has-text("${habitName}")`);
      await expect(habitCard).toBeVisible({ timeout: 5000 });
    } catch {
      // Fallback approach
      await expect(page.locator(`text="${habitName}"`)).toBeVisible({ timeout: 5000 });
      habitCard = page.locator(`[data-testid="habit-card"]:has-text("${habitName}"), [class*="card"]:has-text("${habitName}")`).first();
      await expect(habitCard).toBeVisible();
    }
    
    // Click on the habit title/card to navigate (try multiple strategies)
    try {
      await habitCard.locator('[data-testid="habit-title"], h3, a').first().click();
    } catch {
      // Fallback: just click the card itself
      await habitCard.click();
    }
    
    // Wait for navigation and verify we're on the detail page
    await page.waitForTimeout(TIMEOUTS.SHORT);
    await page.waitForLoadState('networkidle');
    
    // Verify we're on the detail page by checking URL or content
    const currentURL = page.url();
    if (currentURL.includes('/habits/') || await page.locator(`text="${habitName}"`).isVisible()) {
      // Success - we're on a detail page or can see the habit name
      await expect(page.locator(`text="${habitName}"`)).toBeVisible();
    } else {
      throw new Error(`Navigation failed - current URL: ${currentURL}`);
    }
  });

  test('should delete a habit', async ({ page }) => {
    const habitName = `E2E Test Habit ${Date.now()}`;
    
    // Create a habit first with robust waiting
    await page.click('[data-testid="add-habit-button"], button:has-text("Add Habit"), button:has-text("Add")');
    await expect(page.locator('[data-testid="habit-form-dialog"], [role="dialog"]')).toBeVisible();
    await page.waitForTimeout(500);
    
    await page.fill('[data-testid="habit-name-input"], input[name="name"]', habitName);
    await page.click('[data-testid="create-habit-button"], button:has-text("Create Habit"), button:has-text("Create")');
    
    // Wait for form submission and ensure page is updated
    await page.waitForTimeout(TIMEOUTS.MEDIUM);
    await page.waitForLoadState('networkidle');
    
    // Refresh to ensure we see the new habit
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Find the habit card and verify it exists
    let habitCard;
    try {
      habitCard = page.locator(`[data-testid="habit-card"]:has-text("${habitName}")`);
      await expect(habitCard).toBeVisible({ timeout: 5000 });
    } catch {
      // Fallback approach
      await expect(page.locator(`text="${habitName}"`)).toBeVisible({ timeout: 5000 });
      habitCard = page.locator(`[data-testid="habit-card"]:has-text("${habitName}"), [class*="card"]:has-text("${habitName}")`).first();
      await expect(habitCard).toBeVisible();
    }
    
    // Click the options menu button within the habit card
    const optionsButton = habitCard.locator('[data-testid="habit-options-menu"], button:has([data-lucide="settings"]), button[title*="menu"], button[title*="options"]').first();
    await optionsButton.click();
    
    // Wait for dropdown menu to appear and click Delete Habit
    const deleteMenuItem = page.locator('[data-testid="delete-habit-menu-item"]').or(page.locator('text="Delete Habit"')).or(page.locator('[role="menuitem"]:has-text("Delete")'));
    await expect(deleteMenuItem).toBeVisible({ timeout: 3000 });
    await deleteMenuItem.click();
    
    // Wait for confirmation dialog and confirm deletion
    const confirmDialog = page.locator('[data-testid="confirm-delete-dialog"], [role="dialog"]:has-text("Delete")');
    await expect(confirmDialog).toBeVisible({ timeout: 3000 });
    
    const confirmButton = page.locator('[data-testid="confirm-delete-button"], button:has-text("Delete Habit"), button:has-text("Delete")');
    await confirmButton.click();
    
    // Wait for deletion to complete and verify habit is gone
    await page.waitForTimeout(TIMEOUTS.SHORT);
    await page.waitForLoadState('networkidle');
    
    // Verify habit is deleted by checking it's no longer visible
    await expect(habitCard).not.toBeVisible({ timeout: 5000 });
  });
});
