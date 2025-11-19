import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const BASE_URL = process.env.EXPENSES_E2E_BASE_URL ?? 'http://localhost:3000/expenses';

test.describe('Expenses dashboard accessibility', () => {
  test('meets WCAG AA rules via axe-core scan', async ({ page }) => {
    await page.route('**/expenses/summary**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          total: 512,
          count: 8,
          filters: { category: null, month: null },
          generatedAt: new Date().toISOString(),
        }),
      });
    });

    await page.route('**/expenses**', async (route) => {
      if (route.request().url().includes('/expenses/summary')) {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(buildListPayload()),
      });
    });

    await page.goto(BASE_URL);

    const scan = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalViolations = scan.violations.filter((violation: { impact?: string | null }) =>
      ['critical', 'serious'].includes(violation.impact ?? ''),
    );

    expect(criticalViolations).toEqual([]);
  });
});

function buildListPayload() {
  return {
    data: Array.from({ length: 5 }).map((_, index) => ({
      id: `a11y_${index}`,
      amount: 35 + index,
      category: index % 2 === 0 ? 'travel' : 'food',
      date: '2025-11-18',
    })),
    pagination: {
      totalItems: 5,
      currentPage: 1,
      pageSize: 20,
      totalPages: 1,
    },
    requestId: 'req_a11y',
  };
}
