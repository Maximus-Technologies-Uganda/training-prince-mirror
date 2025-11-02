import { test, expect } from '@playwright/test';

test.describe('Temperature Converter UI Smoke Test', () => {
  test('should convert 100 Celsius to 212 Fahrenheit', async ({ page }) => {
    // Navigate to temperature converter
    await page.goto('/temp');
    
    // Assert converter UI loads (input fields visible)
    const celsiusInput = await page.locator('[data-testid="celsius-input"]');
    await expect(celsiusInput).toBeVisible();
    
    // Fill Celsius input field with "100"
    await celsiusInput.fill('100');
    
    // Verify the temperature "from" dropdown is set to Celsius (default)
    const tempFromSelect = await page.locator('#temp-from');
    const selectedFrom = await tempFromSelect.inputValue();
    expect(selectedFrom).toBe('C');
    
    // Verify the temperature "to" dropdown is set to Fahrenheit (default)
    const tempToSelect = await page.locator('#temp-to');
    const selectedTo = await tempToSelect.inputValue();
    expect(selectedTo).toBe('F');
    
    // Click Convert button
    const convertButton = await page.locator('[data-testid="convert-button"]');
    await expect(convertButton).toBeVisible();
    await convertButton.click();
    
    // Assert Fahrenheit output shows 212
    const fahrenheitInput = await page.locator('[data-testid="fahrenheit-input"]');
    await expect(fahrenheitInput).toHaveValue('212');
    
    // Screenshot on success
    await page.screenshot({ path: 'test-results/temperature-success.png', fullPage: true });
  });
});
