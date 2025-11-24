import { mkdir } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";

const screenshotDir = path.join(process.cwd(), "test-results", "screenshots");
const loadingScreenshot = path.join(screenshotDir, "expenses-loading.png");
const errorScreenshot = path.join(screenshotDir, "expenses-error.png");

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
};

function createDeferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

test.describe("Ledger resiliency states", () => {
  test("captures loading + error screenshots and recovers on retry", async ({ page }) => {
    await mkdir(screenshotDir, { recursive: true });

    const loadingGate = createDeferred<void>();
    let requestCount = 0;

    await page.route("**/api/expenses", async (route) => {
      requestCount += 1;

      // Fail the first TWO requests (initial + automatic retry from TanStack Query)
      if (requestCount <= 2) {
        if (requestCount === 1) {
          // Wait before first response to capture loading state
          await loadingGate.promise;
        }
        await route.fulfill({
          status: 502,
          contentType: "application/json",
          body: JSON.stringify({ message: "Upstream timeout" }),
        });
        return;
      }

      // Third request (manual retry) succeeds
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "exp-e2e",
            merchant: "Playwright QA",
            category: "QA",
            purchaseDate: "2025-11-20T12:00:00.000Z",
            status: "APPROVED",
            amount: { currency: "USD", value: 12345 },
            memo: "Captured via smoke suite",
          },
        ]),
      });
    });

    await page.goto("/expenses");

    const skeleton = page.getByTestId("expenses-skeleton");
    await expect(skeleton).toBeVisible();

    await page.screenshot({ path: loadingScreenshot, fullPage: true });
    loadingGate.resolve();

    // Wait for both the initial request AND the automatic retry to fail
    const loadError = page.getByTestId("load-error");
    await expect(loadError).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: errorScreenshot, fullPage: true });

    await page.getByRole("button", { name: /retry fetch/i }).click();

    await expect(page.getByRole("table", { name: /expenses ledger/i })).toBeVisible();
  });
});
