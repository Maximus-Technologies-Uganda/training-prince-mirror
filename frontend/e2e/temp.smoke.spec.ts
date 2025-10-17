import { test, expect } from '@playwright/test';

test.describe('Temperature Converter Smoke Test', () => {
  test('should convert temperature between Celsius and Fahrenheit', async ({ page }) => {
    // Navigate to temperature converter application
    await page.goto('/temp');

    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Temperature Converter');

    // Verify input elements are present
    const celsiusInput = page.locator('[data-testid="celsius-input"]');
    const fahrenheitInput = page.locator('[data-testid="fahrenheit-input"]');
    const convertButton = page.locator('[data-testid="convert-button"]');

    await expect(celsiusInput).toBeVisible();
    await expect(fahrenheitInput).toBeVisible();
    await expect(convertButton).toBeVisible();

    // Test Celsius to Fahrenheit conversion
    await celsiusInput.fill('0');
    await convertButton.click();

    // Verify conversion result
    const fahrenheitValue = await fahrenheitInput.inputValue();
    expect(fahrenheitValue).toBe('32');

    // Test Fahrenheit to Celsius conversion
    await fahrenheitInput.fill('212');
    await convertButton.click();

    // Verify conversion result
    const celsiusValue = await celsiusInput.inputValue();
    expect(celsiusValue).toBe('100');

    // Test room temperature conversion
    await celsiusInput.fill('25');
    await convertButton.click();

    const roomTempFahrenheit = await fahrenheitInput.inputValue();
    expect(roomTempFahrenheit).toBe('77');
  });

  test('should handle invalid input gracefully', async ({ page }) => {
    await page.goto('/temp');

    // Test invalid input
    const celsiusInput = page.locator('[data-testid="celsius-input"]');
    const convertButton = page.locator('[data-testid="convert-button"]');

    await celsiusInput.fill('invalid');
    await convertButton.click();

    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();

    // Test empty input
    await celsiusInput.fill('');
    await convertButton.click();

    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('should clear inputs', async ({ page }) => {
    await page.goto('/temp');

    // Fill in some values
    await page.locator('[data-testid="celsius-input"]').fill('30');
    await page.locator('[data-testid="fahrenheit-input"]').fill('86');

    // Clear inputs
    const clearButton = page.locator('[data-testid="clear-button"]');
    await expect(clearButton).toBeVisible();
    await clearButton.click();

    // Verify inputs are cleared
    const celsiusValue = await page.locator('[data-testid="celsius-input"]').inputValue();
    const fahrenheitValue = await page.locator('[data-testid="fahrenheit-input"]').inputValue();

    expect(celsiusValue).toBe('');
    expect(fahrenheitValue).toBe('');
  });

  test('should show conversion history', async ({ page }) => {
    await page.goto('/temp');

    // Perform a few conversions
    await page.locator('[data-testid="celsius-input"]').fill('0');
    await page.locator('[data-testid="convert-button"]').click();

    await page.locator('[data-testid="celsius-input"]').fill('100');
    await page.locator('[data-testid="convert-button"]').click();

    // Verify history is displayed
    const historySection = page.locator('[data-testid="conversion-history"]');
    await expect(historySection).toBeVisible();

    const historyItems = page.locator('[data-testid="history-item"]');
    await expect(historyItems).toHaveCount(2);
  });
});
