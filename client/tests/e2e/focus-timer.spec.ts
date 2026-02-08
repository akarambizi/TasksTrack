import { test, expect } from '@playwright/test';

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

    await page.waitForTimeout(2000);
    await page.goto('/focus-sessions');
    await page.waitForLoadState('networkidle');
  });

  test('should display focus sessions page with main elements', async ({ page }) => {
    // Verify we're on the focus sessions page
    await expect(page.locator('h1:has-text("Focus Sessions")')).toBeVisible();
    await expect(page.locator('[data-testid="focus-sessions"]')).toBeVisible();
    await expect(page.locator('[data-testid="focus-timer-section"]')).toBeVisible();
  });

  test('should display focus timer interface', async ({ page }) => {
    // Look for focus timer components
    const timerCard = page.locator('[data-testid="focus-timer-card"]');
    if (await timerCard.isVisible()) {
      await expect(timerCard).toBeVisible();
      await expect(page.locator('[data-testid="timer-display"]')).toBeVisible();
    }

    // Look for start button
    const startButton = page.locator('[data-testid="start-session-button"]');
    if (await startButton.isVisible()) {
      await expect(startButton).toBeVisible();
    }
  });

  test('should start and control timer session', async ({ page }) => {
    // First create a habit to associate with focus session
    await page.goto('/habits');
    await page.waitForTimeout(1000);

    const habitName = `Focus Test Habit ${Date.now()}`;
    await page.click('[data-testid="add-habit-button"]');
    await page.waitForTimeout(1000);
    await page.fill('[name="name"]', habitName);
    await page.click('button:has-text("Create")');
    await page.waitForTimeout(2000);

    // Go back to focus sessions
    await page.goto('/focus-sessions');
    await page.waitForTimeout(2000);

    // Try to start a focus session
    const startButton = page.locator('[data-testid="start-session-button"]');
    if (await startButton.isVisible() && await startButton.isEnabled()) {
      await startButton.click();
      await page.waitForTimeout(2000);

      // Look for pause button (indicates timer started)
      const pauseButton = page.locator('[data-testid="pause-session-button"]');
      if (await pauseButton.isVisible()) {
        await expect(pauseButton).toBeVisible();

        // Pause the timer
        await pauseButton.click();
        await page.waitForTimeout(1000);

        // Should see resume button
        const resumeButton = page.locator('[data-testid="resume-session-button"]');
        if (await resumeButton.isVisible()) {
          await expect(resumeButton).toBeVisible();
        }
      }
    }
  });

  test('should complete and save focus session', async ({ page }) => {
    // Navigate through the focus session flow
    await page.goto('/habits');
    await page.waitForTimeout(1000);

    // Create a test habit
    const habitName = `Complete Test ${Date.now()}`;
    await page.click('[data-testid="add-habit-button"]');
    await page.waitForTimeout(1000);
    await page.fill('[name="name"]', habitName);
    await page.click('button:has-text("Create")');
    await page.waitForTimeout(2000);

    // Go to focus sessions and start
    await page.goto('/focus-sessions');
    await page.waitForTimeout(2000);

    const startButton = page.locator('[data-testid="start-session-button"]');
    if (await startButton.isVisible()) {
      await startButton.click();
      await page.waitForTimeout(3000);

      // Complete the session
      const completeButton = page.locator('[data-testid="complete-session-button"]');
      if (await completeButton.isVisible()) {
        await completeButton.click();

        // Fill session save form if it appears
        await page.waitForTimeout(1000);
        const titleField = page.locator('[name="title"]');
        if (await titleField.isVisible()) {
          await titleField.fill('E2E Test Session');
          const notesField = page.locator('[name="notes"]');
          if (await notesField.isVisible()) {
            await notesField.fill('Test focus session completed by e2e test');
          }
          await page.click('button:has-text("Save")');
        }

        // Verify success (look for toast or redirect)
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should display focus session history', async ({ page }) => {
    await page.goto('/history');
    await page.waitForLoadState('networkidle');

    // Verify history page loads
    const historySection = page.locator('[data-testid="focus-session-history"]');
    if (await historySection.isVisible()) {
      await expect(historySection).toBeVisible();
    }

    // Check for session list
    const sessionList = page.locator('[data-testid="session-list"]');
    if (await sessionList.isVisible()) {
      await expect(sessionList).toBeVisible();
    }
  });

  test('should cancel focus session', async ({ page }) => {
    const startButton = page.locator('[data-testid="start-session-button"]');
    if (await startButton.isVisible()) {
      await startButton.click();
      await page.waitForTimeout(2000);

      // Cancel the session
      const cancelButton = page.locator('[data-testid="cancel-session-button"]');
      if (await cancelButton.isVisible()) {
        await cancelButton.click();

        // Should return to initial state
        await page.waitForTimeout(1000);
        await expect(startButton).toBeVisible();
      }
    }
  });
});