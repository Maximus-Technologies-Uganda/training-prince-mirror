import { test, expect } from '@playwright/test';

// These tests will FAIL until we implement the enhanced temperature converter UI
// Based on quickstart.md scenarios

test.describe('Temperature Converter Enhanced UI E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the temperature converter page
    await page.goto('/');
    
    // Wait for the temperature converter to load
    await page.waitForSelector('#temp-converter');
  });

  test('should restrict input to numeric characters only', async ({ page }) => {
    // This will fail until we implement the enhanced input validation
    const tempInput = page.locator('#temp-value');

    // Try to type letters
    await tempInput.fill('abc');

    // Should prevent non-numeric input
    await expect(tempInput).toHaveValue('');
  });

  test('should allow decimal points and negative signs', async ({ page }) => {
    const tempInput = page.locator('#temp-value');
    const resultDiv = page.locator('#temp-result');

    // Type negative decimal
    await tempInput.fill('-32.5');

    // Should accept the input and show conversion
    await expect(tempInput).toHaveValue('-32.5');
    await expect(resultDiv).toContainText(/-?\d+\.?\d*°[CF]/);
  });

  test('should display clear error message for identical units', async ({ page }) => {
    const tempInput = page.locator('#temp-value');
    const fromSelect = page.locator('#temp-from');
    const toSelect = page.locator('#temp-to');
    const errorDiv = page.locator('#temp-error');

    // Set both units to Celsius
    await fromSelect.selectOption('C');
    await toSelect.selectOption('C');
    await tempInput.fill('25');

    // Should show error message
    await expect(errorDiv).toBeVisible();
    await expect(errorDiv).toContainText('Please select different units');
  });

  test('should clear error when different units are selected', async ({ page }) => {
    const tempInput = page.locator('#temp-value');
    const fromSelect = page.locator('#temp-from');
    const toSelect = page.locator('#temp-to');
    const errorDiv = page.locator('#temp-error');

    // First show error
    await fromSelect.selectOption('C');
    await toSelect.selectOption('C');
    await tempInput.fill('25');

    // Then fix by changing units
    await toSelect.selectOption('F');

    // Error should be cleared
    await expect(errorDiv).toBeHidden();
  });

  test('should display proper unit labels with symbols', async ({ page }) => {
    const tempInput = page.locator('#temp-value');
    const fromSelect = page.locator('#temp-from');
    const toSelect = page.locator('#temp-to');
    const resultDiv = page.locator('#temp-result');

    // Convert 32°F to °C
    await fromSelect.selectOption('F');
    await toSelect.selectOption('C');
    await tempInput.fill('32');

    // Should show result with proper unit symbol
    await expect(resultDiv).toContainText(/0\.0°C/);
  });

  test('should format results with consistent precision', async ({ page }) => {
    const tempInput = page.locator('#temp-value');
    const fromSelect = page.locator('#temp-from');
    const toSelect = page.locator('#temp-to');
    const resultDiv = page.locator('#temp-result');

    // Convert 98.6°F to °C
    await fromSelect.selectOption('F');
    await toSelect.selectOption('C');
    await tempInput.fill('98.6');

    // Should show result with 1 decimal place
    await expect(resultDiv).toContainText(/37\.0°C/);
  });

  test('should handle negative temperatures correctly', async ({ page }) => {
    const tempInput = page.locator('#temp-value');
    const fromSelect = page.locator('#temp-from');
    const toSelect = page.locator('#temp-to');
    const resultDiv = page.locator('#temp-result');

    // Convert -40°C to °F
    await fromSelect.selectOption('C');
    await toSelect.selectOption('F');
    await tempInput.fill('-40');

    // Should show negative result
    await expect(resultDiv).toContainText(/-40\.0°F/);
  });

  test('should update output immediately on input change', async ({ page }) => {
    const tempInput = page.locator('#temp-value');
    const resultDiv = page.locator('#temp-result');

    // Type temperature
    await tempInput.fill('0');

    // Should show conversion immediately
    await expect(resultDiv).toContainText(/32\.0°F/);
  });

  test('should update output when units change', async ({ page }) => {
    const tempInput = page.locator('#temp-value');
    const fromSelect = page.locator('#temp-from');
    const toSelect = page.locator('#temp-to');
    const resultDiv = page.locator('#temp-result');

    // Set initial conversion
    await tempInput.fill('100');

    // Change units
    await fromSelect.selectOption('F');
    await toSelect.selectOption('C');

    // Should update result
    await expect(resultDiv).toContainText(/\d+\.\d°C/);
  });

  test('should handle empty input gracefully', async ({ page }) => {
    const tempInput = page.locator('#temp-value');
    const resultDiv = page.locator('#temp-result');

    // Clear input
    await tempInput.fill('');

    // Should clear result
    await expect(resultDiv).toHaveText('');
  });

  test('should recover from identical unit error by changing units', async ({ page }) => {
    const tempInput = page.locator('#temp-value');
    const fromSelect = page.locator('#temp-from');
    const toSelect = page.locator('#temp-to');
    const errorDiv = page.locator('#temp-error');
    const resultDiv = page.locator('#temp-result');

    // Create error
    await fromSelect.selectOption('C');
    await toSelect.selectOption('C');
    await tempInput.fill('25');

    // Fix by changing units
    await toSelect.selectOption('F');

    // Should show conversion result
    await expect(errorDiv).toBeHidden();
    await expect(resultDiv).toContainText(/\d+\.\d°F/);
  });

  test('should provide accessible error messages', async ({ page }) => {
    const tempInput = page.locator('#temp-value');
    const fromSelect = page.locator('#temp-from');
    const toSelect = page.locator('#temp-to');
    const errorDiv = page.locator('#temp-error');

    // Create error state
    await fromSelect.selectOption('C');
    await toSelect.selectOption('C');
    await tempInput.fill('25');

    // Check accessibility
    await expect(errorDiv).toBeVisible();
    await expect(errorDiv).toHaveAttribute('role', 'alert');
    await expect(errorDiv).toHaveAttribute('aria-live', 'polite');
  });

  test('should handle extreme temperature values', async ({ page }) => {
    const tempInput = page.locator('#temp-value');
    const fromSelect = page.locator('#temp-from');
    const toSelect = page.locator('#temp-to');
    const resultDiv = page.locator('#temp-result');

    // Test extreme positive value
    await tempInput.fill('999999');
    await expect(resultDiv).toContainText(/\d+\.\d°[CF]/);

    // Test extreme negative value
    await tempInput.fill('-999999');
    await expect(resultDiv).toContainText(/-?\d+\.\d°[CF]/);
  });

  test('should maintain state during unit changes', async ({ page }) => {
    const tempInput = page.locator('#temp-value');
    const fromSelect = page.locator('#temp-from');
    const toSelect = page.locator('#temp-to');
    const resultDiv = page.locator('#temp-result');

    // Set temperature
    await tempInput.fill('25');

    // Change units multiple times
    await fromSelect.selectOption('F');
    await toSelect.selectOption('C');
    await fromSelect.selectOption('C');
    await toSelect.selectOption('F');

    // Should maintain temperature value
    await expect(tempInput).toHaveValue('25');
    await expect(resultDiv).toContainText(/\d+\.\d°F/);
  });
});
