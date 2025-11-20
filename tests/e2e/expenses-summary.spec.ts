import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

const BASE_URL = process.env.EXPENSES_E2E_BASE_URL ?? 'http://localhost:3000/expenses';

async function throttle(page: Page) {
  const client = await page.context().newCDPSession(page);
  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    latency: 150,
  });
}

test.describe('Expenses summary e2e', () => {
  test('retry summary surfaces request ID without touching list data', async ({ page }) => {
    await throttle(page);

    let listRequests = 0;
    let summaryRequests = 0;
    let servedSummaryError = false;

    await page.route('**/expenses/summary**', async (route) => {
      if (route.request().resourceType() === 'document') {
        await route.continue();
        return;
      }
      summaryRequests += 1;
      if (!servedSummaryError) {
        servedSummaryError = true;
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Summary offline', requestId: 'sum_500' }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          total: 0,
          count: 0,
          filters: { category: null, month: null },
          generatedAt: new Date().toISOString(),
        }),
      });
    });

    await page.route('**/expenses**', async (route) => {
      if (route.request().resourceType() === 'document') {
        await route.continue();
        return;
      }
      if (route.request().url().includes('/expenses/summary')) {
        await route.fallback();
        return;
      }
      listRequests += 1;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(buildListPayload()),
      });
    });

    await page.goto(BASE_URL);
    await expect(page.getByTestId('summary-error')).toContainText('sum_500');
    await page.getByRole('button', { name: 'Retry summary' }).click();
    await expect(page.getByTestId('summary-empty')).toBeVisible();
    expect(listRequests).toBe(1);
    expect(summaryRequests).toBe(2);
  });

  test('summary tiles respond to filters and show still-working indicator on refresh', async ({ page }) => {
    await throttle(page);

    let summaryCallCount = 0;

    await page.route('**/expenses/summary**', async (route) => {
      if (route.request().resourceType() === 'document') {
        await route.continue();
        return;
      }
      summaryCallCount += 1;
      if (summaryCallCount === 3) {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      const url = new URL(route.request().url());
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          total: url.searchParams.has('category') ? 812 : 420,
          count: url.searchParams.has('category') ? 8 : 4,
          filters: {
            category: url.searchParams.get('category'),
            month: url.searchParams.get('month'),
          },
          generatedAt: new Date(Date.now() + summaryCallCount * 1000).toISOString(),
        }),
      });
    });

    await page.route('**/expenses**', async (route) => {
      if (route.request().resourceType() === 'document') {
        await route.continue();
        return;
      }
      if (route.request().url().includes('/expenses/summary')) {
        await route.fallback();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(buildListPayload()),
      });
    });

    await page.goto(BASE_URL);
    await page.getByLabel('Filter by category').selectOption('travel');
    await page.getByLabel('Filter by month').fill('2025-11');
    await expect(page.getByTestId('chip-category')).toHaveText(/travel/i);
    await expect(page.getByTestId('chip-month')).toHaveText(/2025-11/);

    await page.getByRole('button', { name: 'Clear all filters' }).click();
    await expect(page.getByText('No active filters')).toBeVisible();

    await page.getByRole('button', { name: 'Refresh now' }).click();
    await expect(page.getByTestId('summary-refreshing')).toBeVisible();
    await expect(page.getByTestId('summary-success')).toBeVisible();
  });
});

function buildListPayload() {
  return {
    data: Array.from({ length: 5 }).map((_, index) => ({
      id: `exp_${index}`,
      amount: 50 + index,
      category: 'travel',
      date: '2025-11-18',
    })),
    pagination: {
      totalItems: 5,
      currentPage: 1,
      pageSize: 20,
      totalPages: 1,
    },
    requestId: 'req_summary_list',
  };
}
