import { mkdir } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";

const screenshotPath = path.join(process.cwd(), "test-results", "screenshots", "expenses-empty.png");

test.describe("Empty ledger experience", () => {
  test("captures screenshot and validates drawer focus", async ({ page }) => {
    let requestCount = 0;
    
    // Set up route interception BEFORE navigation
    await page.route("**/api/expenses", async (route) => {
      requestCount++;
      console.log(`Intercepted request #${requestCount} to ${route.request().url()}`);
      
      // Return empty array with 200 status to simulate successful empty result
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });

    // Add console log listener to see client-side logs
    page.on('console', msg => console.log('BROWSER:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

    console.log("Navigating to /expenses...");
    await page.goto("/expenses", { waitUntil: "networkidle" });
    console.log("Navigation complete");

    // Wait longer for React to render
    await page.waitForTimeout(3000);
    
    // Debug: Take a screenshot to see what we have
    await mkdir(path.dirname(screenshotPath), { recursive: true });
    await page.screenshot({ path: path.join(path.dirname(screenshotPath), "debug-before-assert.png"), fullPage: true });
    
    // Try to find ANY heading on the page
    const allHeadings = await page.locator('h1, h2, h3').allTextContents();
    console.log("All headings on page:", allHeadings);
    
    const emptyHeading = page.getByRole("heading", { name: /no expenses found/i });
    await expect(emptyHeading).toBeVisible({ timeout: 15000 });

    await page.screenshot({ path: screenshotPath, fullPage: true });

  await page.getByTestId("empty-ledger-cta").click();
    await expect(page.getByRole("dialog", { name: /add expense/i })).toBeVisible();

    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: /close drawer/i })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: /add expense/i })).not.toBeVisible();
  });
});
