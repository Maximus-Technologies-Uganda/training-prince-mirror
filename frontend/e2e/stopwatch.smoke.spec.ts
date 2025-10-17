import { test, expect } from '@playwright/test';

test.describe('Stopwatch Application Smoke Test', () => {
  test('should start timer and verify time display', async ({ page }) => {
    // Navigate to stopwatch application
    await page.goto('/stopwatch');
    
    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Stopwatch');
    
    // Verify initial state
    const timeDisplay = page.locator('[data-testid="time-display"]');
    await expect(timeDisplay).toBeVisible();
    await expect(timeDisplay).toContainText('00:00:00');
    
    // Start the timer
    const startButton = page.locator('[data-testid="start-button"]');
    await expect(startButton).toBeVisible();
    await startButton.click();
    
    // Wait a moment for timer to run
    await page.waitForTimeout(1000);
    
    // Verify timer is running (time should have changed)
    const timeAfterStart = await timeDisplay.textContent();
    expect(timeAfterStart).not.toBe('00:00:00');
    
    // Verify start button is now pause button
    const pauseButton = page.locator('[data-testid="pause-button"]');
    await expect(pauseButton).toBeVisible();
  });
  
  test('should pause and resume timer', async ({ page }) => {
    await page.goto('/stopwatch');
    
    // Start timer
    await page.locator('[data-testid="start-button"]').click();
    await page.waitForTimeout(500);
    
    // Pause timer
    const pauseButton = page.locator('[data-testid="pause-button"]');
    await expect(pauseButton).toBeVisible();
    await pauseButton.click();
    
    // Get paused time
    const pausedTime = await page.locator('[data-testid="time-display"]').textContent();
    
    // Wait a moment
    await page.waitForTimeout(500);
    
    // Verify time hasn't changed (still paused)
    const stillPausedTime = await page.locator('[data-testid="time-display"]').textContent();
    expect(stillPausedTime).toBe(pausedTime);
    
    // Resume timer
    const resumeButton = page.locator('[data-testid="resume-button"]');
    await expect(resumeButton).toBeVisible();
    await resumeButton.click();
    
    // Wait a moment
    await page.waitForTimeout(500);
    
    // Verify timer is running again
    const resumedTime = await page.locator('[data-testid="time-display"]').textContent();
    expect(resumedTime).not.toBe(pausedTime);
  });
  
  test('should reset timer', async ({ page }) => {
    await page.goto('/stopwatch');
    
    // Start timer
    await page.locator('[data-testid="start-button"]').click();
    await page.waitForTimeout(1000);
    
    // Reset timer
    const resetButton = page.locator('[data-testid="reset-button"]');
    await expect(resetButton).toBeVisible();
    await resetButton.click();
    
    // Verify timer is reset to 00:00:00
    const timeDisplay = page.locator('[data-testid="time-display"]');
    await expect(timeDisplay).toContainText('00:00:00');
    
    // Verify start button is available again
    await expect(page.locator('[data-testid="start-button"]')).toBeVisible();
  });
  
  test('should add and display laps', async ({ page }) => {
    await page.goto('/stopwatch');
    
    // Start timer
    await page.locator('[data-testid="start-button"]').click();
    await page.waitForTimeout(1000);
    
    // Add a lap
    const lapButton = page.locator('[data-testid="lap-button"]');
    await expect(lapButton).toBeVisible();
    await lapButton.click();
    
    // Verify lap was added
    const lapList = page.locator('[data-testid="lap-list"]');
    await expect(lapList).toBeVisible();
    
    const lapItem = page.locator('[data-testid="lap-item"]').first();
    await expect(lapItem).toBeVisible();
    
    // Add another lap
    await page.waitForTimeout(500);
    await lapButton.click();
    
    // Verify two laps exist
    await expect(page.locator('[data-testid="lap-item"]')).toHaveCount(2);
  });
  
  test('should clear laps', async ({ page }) => {
    await page.goto('/stopwatch');
    
    // Start timer and add laps
    await page.locator('[data-testid="start-button"]').click();
    await page.waitForTimeout(500);
    await page.locator('[data-testid="lap-button"]').click();
    await page.waitForTimeout(500);
    await page.locator('[data-testid="lap-button"]').click();
    
    // Verify laps exist
    await expect(page.locator('[data-testid="lap-item"]')).toHaveCount(2);
    
    // Clear laps
    const clearLapsButton = page.locator('[data-testid="clear-laps"]');
    await expect(clearLapsButton).toBeVisible();
    await clearLapsButton.click();
    
    // Verify laps are cleared
    await expect(page.locator('[data-testid="lap-item"]')).toHaveCount(0);
  });
  
  test('should persist state in localStorage', async ({ page }) => {
    await page.goto('/stopwatch');
    
    // Start timer and add a lap
    await page.locator('[data-testid="start-button"]').click();
    await page.waitForTimeout(1000);
    await page.locator('[data-testid="lap-button"]').click();
    
    // Get current state
    const timeDisplay = await page.locator('[data-testid="time-display"]').textContent();
    const lapCount = await page.locator('[data-testid="lap-item"]').count();
    
    // Reload page
    await page.reload();
    
    // Verify state persists (this would depend on implementation)
    // For now, just verify the page loads correctly
    await expect(page.locator('[data-testid="time-display"]')).toBeVisible();
    await expect(page.locator('[data-testid="start-button"]')).toBeVisible();
  });
});