import { test, expect } from '@playwright/test';

test.describe('Stopwatch UI Smoke Test', () => {
  test('should start timer and record lap', async ({ page }) => {
    // Navigate to stopwatch page
    await page.goto('/stopwatch');
    
    // Assert stopwatch UI loads (timer display visible)
    const timerDisplay = await page.locator('[data-testid="time-display"]');
    await expect(timerDisplay).toBeVisible();
    await expect(timerDisplay).toContainText('00:00');
    
    // Click start button
    const startButton = await page.locator('[data-testid="start-button"]');
    await expect(startButton).toBeVisible();
    await startButton.click();
    
    // Wait for timer to update (at least 0.5 seconds should elapse)
    await page.waitForTimeout(600);
    
    // Click lap button
    const lapButton = await page.locator('[data-testid="lap-button"]');
    await expect(lapButton).toBeVisible();
    await lapButton.click();
    
    // Verify lap list has at least one entry by checking for text "Lap" in the lap-list
    const lapList = await page.locator('[data-testid="lap-list"]');
    await expect(lapList).toBeVisible();
    // Wait a moment for DOM update
    await page.waitForTimeout(100);
    // Verify the lap list contains lap items (by checking for "Lap" text)
    const lapListText = await lapList.textContent();
    expect(lapListText).toContain('Lap');
    
    // Screenshot on success
    await page.screenshot({ path: 'test-results/stopwatch-success.png', fullPage: true });
  });
});
