import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ExpensesPageClient } from '@/app/expenses/ExpensesPageClient';

// Create a typed fetch mock
const fetchMock = vi.fn();

// Mock child components
vi.mock('@/app/expenses/components/ExpensesHeader', () => ({
  ExpensesHeader: () => <div data-testid="expenses-header">Expenses Header</div>,
}));

vi.mock('@/app/expenses/components/ExpensesVirtualList', () => ({
  ExpensesVirtualList: ({ expenses }: any) => (
    <div data-testid="expenses-list">List with {expenses.length} items</div>
  ),
}));

vi.mock('@/app/expenses/components/EmptyState', () => ({
  EmptyState: ({ onAddExpense }: any) => (
    <button data-testid="empty-state" onClick={onAddExpense}>
      Empty State
    </button>
  ),
}));

vi.mock('@/app/expenses/components/PageSkeleton', () => ({
  PageSkeleton: () => <div data-testid="page-skeleton">Loading...</div>,
}));

vi.mock('@/app/expenses/components/LoadError', () => ({
  LoadError: ({ error, onRetry }: any) => (
    <div data-testid="load-error">
      Error: {error.message}
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));

vi.mock('@/app/expenses/drawer/AddExpenseDrawer', () => ({
  AddExpenseDrawer: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="drawer">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: any) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('app/expenses/ExpensesPageClient', () => {
  beforeEach(() => {
    fetchMock.mockClear();
    vi.stubGlobal('fetch', fetchMock);
  });

  it('renders loading skeleton initially', () => {
    fetchMock.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<ExpensesPageClient />, { wrapper: createWrapper() });

    expect(screen.getByTestId('expenses-skeleton')).toBeInTheDocument();
  });

  it.skip('renders expenses list on successful fetch', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [
        {
          id: 'exp-001',
          merchant: 'Test Merchant',
          category: 'Office',
          purchaseDate: '2025-11-15T10:00:00Z',
          status: 'PENDING',
          amount: { currency: 'USD', value: 5000 },
        },
      ],
    });

    render(<ExpensesPageClient />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('expenses-header')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId('expenses-list')).toBeInTheDocument();
    });
  });

  it.skip('renders empty state when no expenses', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 204,
    });

    render(<ExpensesPageClient />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  it.skip('renders error state on fetch failure', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ message: 'Server error' }),
    });

    render(<ExpensesPageClient />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('load-error')).toBeInTheDocument();
    });
  });
});
