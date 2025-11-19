import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ExpenseSummaryPanel } from '../../frontend/app/expenses/components/ExpenseSummaryPanel';
import { FilterChips } from '../../frontend/app/expenses/components/FilterChips';
import type { ExpenseSummary } from '../../frontend/app/expenses/models/summary';
import { useExpenseFilters } from '../../frontend/app/expenses/hooks/useExpenseFilters';
import type { ExpenseFiltersContextValue } from '../../frontend/app/expenses/context/ExpenseFiltersProvider';

vi.mock('../../frontend/app/expenses/hooks/useExpenseFilters', () => ({
  useExpenseFilters: vi.fn(),
}));

const mockUseExpenseFilters = vi.mocked(useExpenseFilters);

describe('Expense summary panel contract', () => {
  const baseSummary: ExpenseSummary = {
    total: 4200,
    count: 42,
    filters: { category: null, month: null },
    generatedAt: '2025-11-18T12:00:00.000Z',
  };

  it('renders loading shimmer with aria announcement', () => {
    const query = buildQuery({ isLoading: true, data: undefined });
    render(
      <ExpenseSummaryPanel
        query={query}
        onRetry={vi.fn()}
        onAddExpense={vi.fn()}
      />,
    );

    expect(screen.getByTestId('summary-loading')).toBeInTheDocument();
    expect(screen.getByText('Updating summary')).toBeInTheDocument();
  });

  it('shows error card with request id and retry handler', async () => {
    const error = Object.assign(new Error('Server down'), { requestId: 'req_summary_500' });
    const onRetry = vi.fn();
    const query = buildQuery({ error });

    render(
      <ExpenseSummaryPanel
        query={query}
        onRetry={onRetry}
        onAddExpense={vi.fn()}
      />,
    );

    expect(screen.getByTestId('summary-error')).toHaveTextContent('req_summary_500');
    await userEvent.setup().click(screen.getByRole('button', { name: 'Retry summary' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders empty state with CTA referencing current filters', async () => {
    const onAddExpense = vi.fn();
    const summary: ExpenseSummary = {
      ...baseSummary,
      total: 0,
      count: 0,
      filters: { category: 'travel', month: '2025-11' },
    };
    const query = buildQuery({ data: summary, isEmpty: true });

    render(
      <ExpenseSummaryPanel
        query={query}
        onRetry={vi.fn()}
        onAddExpense={onAddExpense}
      />,
    );

    const emptyPanel = screen.getByTestId('summary-empty');
    expect(within(emptyPanel).getByText(/travel/i)).toBeVisible();
    await userEvent.setup().click(screen.getByRole('button', { name: 'Add an expense' }));
    expect(onAddExpense).toHaveBeenCalledTimes(1);
  });

  it('renders success tiles and exposes still-working helper during refetch', () => {
    const summary = {
      ...baseSummary,
      filters: { category: 'office', month: '2025-10' },
    } satisfies ExpenseSummary;
    const query = buildQuery({
      data: summary,
      fetchStatus: 'fetching',
      isFetching: true,
    });

    render(
      <ExpenseSummaryPanel
        query={query}
        onRetry={vi.fn()}
        onAddExpense={vi.fn()}
      />,
    );

    expect(screen.getByTestId('summary-success')).toBeVisible();
  expect(screen.getByText('Still working on the latest totals…')).toBeVisible();
  expect(screen.getByText(/office · Oct 2025/i)).toBeVisible();
    expect(screen.getByText('42 expenses')).toBeVisible();
  });
});

describe('Filter chips contract', () => {
  const baseFilters: ExpenseFiltersContextValue = {
    filters: { category: null, month: null },
    urlSearchParams: '',
    queryKey: ['expenses', null, null] as const,
    lastChangedAt: '2025-11-18T12:00:00.000Z',
    clearFilters: vi.fn(),
    setCategory: vi.fn(),
    setMonth: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('announces when no filters are active', () => {
    mockUseExpenseFilters.mockReturnValue(baseFilters);
    render(<FilterChips />);

    expect(screen.getByText('No active filters', { selector: 'p' })).toBeVisible();
    expect(screen.getByTestId('chips-announcement').textContent).toContain('No active filters');
  });

  it('renders chips, clear-all button, and handlers for each filter', async () => {
    const setCategory = vi.fn();
    const setMonth = vi.fn();
    const clearFilters = vi.fn();
    mockUseExpenseFilters.mockReturnValue({
      ...baseFilters,
      filters: { category: 'travel', month: '2025-11' },
      setCategory,
      setMonth,
      clearFilters,
    });

    render(<FilterChips />);

    expect(screen.getByTestId('chip-category')).toHaveTextContent('travel');
    expect(screen.getByTestId('chip-month')).toHaveTextContent('2025-11');

    const user = userEvent.setup();
  await user.click(screen.getByTestId('chip-category'));
  await user.click(screen.getByTestId('chip-month'));
  await user.click(screen.getByTestId('clear-all-filters'));

    expect(setCategory).toHaveBeenCalledWith(null);
    expect(setMonth).toHaveBeenCalledWith(null);
    expect(clearFilters).toHaveBeenCalledTimes(1);
  });
});

type SummaryQueryProp = Parameters<typeof ExpenseSummaryPanel>[0]['query'];

function buildQuery(overrides: Partial<SummaryQueryProp> = {}) {
  const fallback: ExpenseSummary = {
    total: 100,
    count: 5,
    filters: { category: null, month: null },
    generatedAt: '2025-11-18T12:00:00.000Z',
  };

  return {
    data: fallback,
    error: null,
    isLoading: false,
    isFetching: false,
    fetchStatus: 'idle',
    isEmpty: false,
    refetch: vi.fn(),
    ...overrides,
  } as SummaryQueryProp;
}
