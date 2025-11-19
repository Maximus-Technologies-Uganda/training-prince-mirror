import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { ExpensesList } from '../../frontend/app/expenses/components/ExpensesList';
import {
  mapPaginatedExpenseResponse,
  type PaginatedExpenseResponse,
} from '../../frontend/app/expenses/models/paginatedResponse';
import { expensesSuccess, expensesEmpty, expensesOverPageSize } from '../fixtures/expenses-list.fixtures';

type QueryStub = {
  data?: PaginatedExpenseResponse;
  error: Error | null;
  isEmpty?: boolean;
  isFetching: boolean;
  isLoading: boolean;
};

function renderComponent(state: Partial<QueryStub> = {}) {
  const query: QueryStub = { ...baseQuery(), ...state };
  render(
    <ExpensesList
      query={query as any}
      onRetry={vi.fn()}
      onAddExpense={vi.fn()}
      onPageChange={vi.fn()}
      onPageSizeChange={vi.fn()}
      page={1}
      pageSize={20}
    />,
  );
}

function baseQuery(): QueryStub {
  return {
    data: undefined,
    error: null,
    isEmpty: false,
    isFetching: false,
    isLoading: false,
  };
}

describe('Expenses list contract', () => {
  it('renders loading skeleton for pending state', () => {
    renderComponent({ isLoading: true });
    expect(screen.getByTestId('expenses-loading')).toBeVisible();
    expect(screen.getByTestId('expenses-skeleton').children.length).toBe(20);
  });

  it('renders empty state when API returns zero rows', () => {
    const response = mapPaginatedExpenseResponse(expensesEmpty);
    renderComponent({ data: response, isEmpty: true });
    const empty = screen.getByTestId('expenses-empty');
    expect(within(empty).getByText('No expenses found')).toBeVisible();
  });

  it('renders error banner with request ID', () => {
    const error = Object.assign(new Error('Failed to load expenses'), { requestId: 'req_error' });
    renderComponent({ error });
    expect(screen.getByTestId('expenses-error')).toHaveTextContent('req_error');
  });

  it('renders success state with formatted currency + date', () => {
    const response = mapPaginatedExpenseResponse(expensesSuccess);
    renderComponent({ data: response });
    const list = screen.getByTestId('expenses-success');
    expect(within(list).getByText('$125.75')).toBeVisible();
    expect(within(list).getByText('Nov 18, 2025')).toBeVisible();
  });

  it('warns when API returns pageSize > 100 per FR-012', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mapPaginatedExpenseResponse(expensesOverPageSize);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('pageSize greater than 100'));
    warnSpy.mockRestore();
  });
});
