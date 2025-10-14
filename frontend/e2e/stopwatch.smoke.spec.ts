// E2E Smoke Test: Stopwatch UI
// This test validates the complete user workflow and must fail until implementation

import { test, expect } from '@playwright/test';

test.describe('Stopwatch UI E2E Smoke Tests', () => {
  test('should complete basic timer workflow', async ({ page }) => {
    // Navigate to stopwatch page
    await page.goto('/src/ui-stopwatch/index.html');
    
    // Verify page loads
    await expect(page.locator('.stopwatch-container')).toBeVisible();
    await expect(page.locator('.timer-display')).toBeVisible();
    await expect(page.locator('.timer-display')).toHaveText('00:00.00');
    
    // Verify initial button states
    await expect(page.locator('.start-btn')).toBeEnabled();
    await expect(page.locator('.stop-btn')).toBeDisabled();
    await expect(page.locator('.reset-btn')).toBeEnabled();
    await expect(page.locator('.export-btn')).toBeEnabled();
  });

  test('should start and stop timer', async ({ page }) => {
    await page.goto('/src/ui-stopwatch/index.html');
    
    // Start timer
    await page.click('.start-btn');
    
    // Verify button states change
    await expect(page.locator('.start-btn')).toBeDisabled();
    await expect(page.locator('.stop-btn')).toBeEnabled();
    
    // Wait for timer to count
    await page.waitForTimeout(1000);
    
    // Stop timer
    await page.click('.stop-btn');
    
    // Verify timer stops and lap is recorded
    await expect(page.locator('.start-btn')).toBeEnabled();
    await expect(page.locator('.stop-btn')).toBeDisabled();
    
    // Verify lap is displayed
    await expect(page.locator('.laps-display')).toContainText('Lap 1');
  });

  test('should reset timer and clear laps', async ({ page }) => {
    await page.goto('/src/ui-stopwatch/index.html');
    
    // Record a lap
    await page.click('.start-btn');
    await page.waitForTimeout(500);
    await page.click('.stop-btn');
    
    // Verify lap is recorded
    await expect(page.locator('.laps-display')).toContainText('Lap 1');
    
    // Reset timer
    await page.click('.reset-btn');
    
    // Verify reset
    await expect(page.locator('.timer-display')).toHaveText('00:00.00');
    await expect(page.locator('.laps-display')).not.toContainText('Lap 1');
    
    // Verify button states reset
    await expect(page.locator('.start-btn')).toBeEnabled();
    await expect(page.locator('.stop-btn')).toBeDisabled();
  });

  test('should export CSV with laps', async ({ page }) => {
    await page.goto('/src/ui-stopwatch/index.html');
    
    // Record multiple laps
    await page.click('.start-btn');
    await page.waitForTimeout(500);
    await page.click('.stop-btn');
    
    await page.click('.start-btn');
    await page.waitForTimeout(500);
    await page.click('.stop-btn');
    
    // Verify laps are recorded
    await expect(page.locator('.laps-display')).toContainText('Lap 1');
    await expect(page.locator('.laps-display')).toContainText('Lap 2');
    
    // Set up download handler
    const downloadPromise = page.waitForEvent('download');
    
    // Export CSV
    await page.click('.export-btn');
    
    // Verify download
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('stopwatch-laps.csv');
  });

  test('should export CSV with no laps', async ({ page }) => {
    await page.goto('/src/ui-stopwatch/index.html');
    
    // Verify no laps initially
    await expect(page.locator('.laps-display')).not.toContainText('Lap');
    
    // Set up download handler
    const downloadPromise = page.waitForEvent('download');
    
    // Export CSV
    await page.click('.export-btn');
    
    // Verify download
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('stopwatch-laps.csv');
  });

  test('should handle button state transitions correctly', async ({ page }) => {
    await page.goto('/src/ui-stopwatch/index.html');
    
    // Initial state
    await expect(page.locator('.start-btn')).toBeEnabled();
    await expect(page.locator('.stop-btn')).toBeDisabled();
    
    // Start timer
    await page.click('.start-btn');
    await expect(page.locator('.start-btn')).toBeDisabled();
    await expect(page.locator('.stop-btn')).toBeEnabled();
    
    // Stop timer
    await page.click('.stop-btn');
    await expect(page.locator('.start-btn')).toBeEnabled();
    await expect(page.locator('.stop-btn')).toBeDisabled();
    
    // Start again
    await page.click('.start-btn');
    await expect(page.locator('.start-btn')).toBeDisabled();
    await expect(page.locator('.stop-btn')).toBeEnabled();
    
    // Reset while running
    await page.click('.reset-btn');
    await expect(page.locator('.start-btn')).toBeEnabled();
    await expect(page.locator('.stop-btn')).toBeDisabled();
  });

  test('should display timer in correct format', async ({ page }) => {
    await page.goto('/src/ui-stopwatch/index.html');
    
    // Start timer
    await page.click('.start-btn');
    
    // Wait for timer to update
    await page.waitForTimeout(1000);
    
    // Verify format (MM:SS.hh)
    const timerText = await page.locator('.timer-display').textContent();
    expect(timerText).toMatch(/^\d{2}:\d{2}\.\d{2}$/);
    
    // Stop timer
    await page.click('.stop-btn');
    
    // Verify format is maintained
    const finalTimerText = await page.locator('.timer-display').textContent();
    expect(finalTimerText).toMatch(/^\d{2}:\d{2}\.\d{2}$/);
  });
});

// These tests will fail until the complete UI implementation is ready
// They serve as smoke tests for the complete user workflow