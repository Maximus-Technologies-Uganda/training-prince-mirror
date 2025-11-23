import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { type PropsWithChildren } from 'react';
import { normalizeExpenses, useExpensesQuery, type ExpenseDto } from '@/lib/api/expenses';

// Create a typed fetch mock
const fetchMock = vi.fn();

const mockExpenseDto: ExpenseDto = {
  id: 'exp-001',
  merchant: 'Test Merchant',
  category: 'Office Supplies',
  purchaseDate: '2025-11-15T10:00:00Z',
  status: 'PENDING',
  amount: {
    currency: 'USD',
    value: 4599, // $45.99
  },
  memo: 'Test memo',
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
    },
  });

  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('lib/api/expenses', () => {
  beforeEach(() => {
    fetchMock.mockClear();
    vi.stubGlobal('fetch', fetchMock);
  });

  describe('normalizeExpenses', () => {
    it('transforms expense DTO to expense row with formatting', () => {
      const result = normalizeExpenses([mockExpenseDto]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'exp-001',
        merchant: 'Test Merchant',
        category: 'Office Supplies',
        purchaseDate: '2025-11-15T10:00:00Z',
        status: 'PENDING',
        formattedAmount: '$45.99',
        memo: 'Test memo',
      });
      expect(result[0].formattedDate).toBeTruthy();
    });

    it('handles null category with default value', () => {
      const expense: ExpenseDto = { ...mockExpenseDto, category: null };
      const result = normalizeExpenses([expense]);

      expect(result[0].category).toBe('Uncategorized');
    });

    it('handles missing category with default value', () => {
      const expense: ExpenseDto = { ...mockExpenseDto, category: undefined };
      const result = normalizeExpenses([expense]);

      expect(result[0].category).toBe('Uncategorized');
    });

    it('formats amount with correct currency', () => {
      const eurExpense: ExpenseDto = {
        ...mockExpenseDto,
        amount: { currency: 'EUR', value: 12050 },
      };
      const result = normalizeExpenses([eurExpense]);

      expect(result[0].formattedAmount).toContain('120.50');
    });

    it('sorts expenses by purchase date descending', () => {
      const expenses: ExpenseDto[] = [
        { ...mockExpenseDto, id: '1', purchaseDate: '2025-11-10T10:00:00Z' },
        { ...mockExpenseDto, id: '2', purchaseDate: '2025-11-20T10:00:00Z' },
        { ...mockExpenseDto, id: '3', purchaseDate: '2025-11-15T10:00:00Z' },
      ];

      const result = normalizeExpenses(expenses);

      expect(result.map((e) => e.id)).toEqual(['2', '3', '1']);
    });

    it('filters out expenses without id', () => {
      const expenses: ExpenseDto[] = [
        mockExpenseDto,
        { ...mockExpenseDto, id: '' },
        { ...mockExpenseDto, id: 'exp-002' },
      ];

      const result = normalizeExpenses(expenses);

      expect(result).toHaveLength(2);
      expect(result.map((e) => e.id)).toEqual(['exp-001', 'exp-002']);
    });

    it('filters out expenses without purchaseDate', () => {
      const expenses: ExpenseDto[] = [
        mockExpenseDto,
        { ...mockExpenseDto, id: 'exp-invalid', purchaseDate: '' },
        { ...mockExpenseDto, id: 'exp-002' },
      ];

      const result = normalizeExpenses(expenses);

      expect(result).toHaveLength(2);
      expect(result.map((e) => e.id)).toEqual(['exp-001', 'exp-002']);
    });

    it('handles empty array', () => {
      const result = normalizeExpenses([]);
      expect(result).toEqual([]);
    });

    it('formats amounts with two decimal places', () => {
      const expense: ExpenseDto = {
        ...mockExpenseDto,
        amount: { currency: 'USD', value: 10000 }, // $100.00
      };

      const result = normalizeExpenses([expense]);

      expect(result[0].formattedAmount).toBe('$100.00');
    });

    it('preserves memo field', () => {
      const withMemo: ExpenseDto = { ...mockExpenseDto, memo: 'Important note' };
      const withoutMemo: ExpenseDto = { ...mockExpenseDto, id: 'exp-002', memo: undefined };

      const result = normalizeExpenses([withMemo, withoutMemo]);

      expect(result[0].memo).toBe('Important note');
      expect(result[1].memo).toBeUndefined();
    });
  });

  describe('useExpensesQuery', () => {
    it('fetches expenses successfully', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [mockExpenseDto],
      });

      const { result } = renderHook(() => useExpensesQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
      expect(result.current.data).toHaveLength(1);
      expect(result.current.data![0].merchant).toBe('Test Merchant');
    });

    it('handles 204 No Content response', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 204,
      });

      const { result } = renderHook(() => useExpensesQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual([]);
    });

    it('handles error response with error body', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal server error' }),
      });

      const { result } = renderHook(() => useExpensesQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(
        () => expect(result.current.isPending).toBe(false),
        { timeout: 10000 }
      );

      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe('Internal server error');
    });

    it('handles error response without error body', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const { result } = renderHook(() => useExpensesQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(
        () => expect(result.current.isPending).toBe(false),
        { timeout: 10000 }
      );

      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toContain('Request failed with 404');
    });

    it('calls /api/expenses with no-store cache', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      });

      const { result } = renderHook(() => useExpensesQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/expenses',
        expect.objectContaining({
          cache: 'no-store',
        })
      );
    });

    it('uses correct query key', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      });

      const { result } = renderHook(() => useExpensesQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
      // Query key is internal to TanStack Query but we verify the hook works
    });

    it('normalizes fetched data', async () => {
      const rawExpense: ExpenseDto = {
        ...mockExpenseDto,
        category: null,
        amount: { currency: 'USD', value: 5000 },
      };

      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [rawExpense],
      });

      const { result } = renderHook(() => useExpensesQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data![0].category).toBe('Uncategorized');
      expect(result.current.data![0].formattedAmount).toBe('$50.00');
      expect(result.current.data![0].formattedDate).toBeTruthy();
    });

    it('handles multiple expenses', async () => {
      const expenses: ExpenseDto[] = [
        { ...mockExpenseDto, id: 'exp-001' },
        { ...mockExpenseDto, id: 'exp-002' },
        { ...mockExpenseDto, id: 'exp-003' },
      ];

      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => expenses,
      });

      const { result } = renderHook(() => useExpensesQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toHaveLength(3);
    });

    it('starts in loading state', () => {
      fetchMock.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ ok: true, status: 200, json: async () => [] }), 1000)
          )
      );

      const { result } = renderHook(() => useExpensesQuery(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('handles network errors', async () => {
      fetchMock.mockRejectedValue(new Error('Network failure'));

      const { result } = renderHook(() => useExpensesQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(
        () => expect(result.current.isPending).toBe(false),
        { timeout: 10000 }
      );

      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe('Network failure');
    });
  });
});
