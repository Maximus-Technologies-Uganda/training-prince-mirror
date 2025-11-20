'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ExpenseFiltersBar } from '@/components/ExpenseFiltersBar';
import { ExpensesList } from '@/components/ExpensesList';
import { ExpenseSummaryPanel } from '@/components/ExpenseSummaryPanel';
import { FilterChips } from '@/components/FilterChips';
import { AddExpenseDrawer } from '@/components/AddExpenseDrawer';
import { useExpensesQuery } from '@/hooks/useExpensesQuery';
import { useExpenseSummaryQuery } from '@/hooks/useExpenseSummaryQuery';
import { resetStaleTimer, type StaleTimerHandle } from '@/utils/staleTimers';
import { formatGeneratedAt } from '@/models/summary';

export default function ExpensesPage() {
  const expensesQuery = useExpensesQuery();
  const summaryQuery = useExpenseSummaryQuery();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerDirty, setIsDrawerDirty] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const staleTimerRef = useRef<StaleTimerHandle>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!summaryQuery.data?.generatedAt) return;
    setIsStale(false);
    staleTimerRef.current = resetStaleTimer(staleTimerRef.current, () => setIsStale(true));
    return () => {
      if (staleTimerRef.current) {
        clearTimeout(staleTimerRef.current);
      }
    };
  }, [summaryQuery.data?.generatedAt]);

  const openDrawer = useCallback(() => {
    if (typeof document !== 'undefined') {
      lastFocusRef.current = document.activeElement as HTMLElement;
    }
    setIsDrawerOpen(true);
  }, []);
  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setIsDrawerDirty(false);
    if (lastFocusRef.current) {
      const target = lastFocusRef.current;
      if (typeof window !== 'undefined') {
        window.requestAnimationFrame(() => target?.focus({ preventScroll: true }));
      } else {
        target.focus({ preventScroll: true });
      }
    }
  }, []);

  const requestCloseDrawer = useCallback(() => {
    if (isDrawerDirty && typeof window !== 'undefined') {
      const shouldClose = window.confirm('Discard unsaved expense?');
      if (!shouldClose) {
        return;
      }
    }
    closeDrawer();
  }, [closeDrawer, isDrawerDirty]);

  const refreshAll = useCallback(async () => {
    await Promise.all([expensesQuery.refresh('manual'), summaryQuery.refresh('manual')]);
  }, [expensesQuery, summaryQuery]);

  const handleDrawerSuccess = useCallback(() => {
    setIsDrawerDirty(false);
    setIsStale(false);
  }, []);

  return (
    <>
      <header className="expenses-header">
        <div>
          <p className="expenses-header__subtitle">Chapter 6 · Day 1</p>
          <h1 className="expenses-header__title">Expenses control center</h1>
          <p className="expenses-header__subtitle">
            Shared filters, telemetry, and drawer workflows instrumented for FR-004 thru FR-010.
          </p>
        </div>
        <button className="btn primary" onClick={openDrawer} aria-label="Add expense from page header">
          Add expense
        </button>
      </header>
      {isStale && (
        <div className="stale-banner" role="status">
          <span>
            Data last refreshed {summaryQuery.data?.generatedAt ? formatGeneratedAt(summaryQuery.data.generatedAt) : 'over 5 minutes ago'}.
          </span>
          <button className="btn secondary" onClick={refreshAll}>
            Refresh now
          </button>
        </div>
      )}
      <ExpenseFiltersBar
        onAddExpense={openDrawer}
        onRefresh={refreshAll}
        isRefreshing={expensesQuery.isFetching || summaryQuery.isFetching}
      />
      <div className="expenses-grid">
        <div>
          <ExpensesList
            query={expensesQuery}
            onRetry={() => expensesQuery.refresh('manual')}
            onAddExpense={openDrawer}
            onPageChange={expensesQuery.setPage}
            onPageSizeChange={expensesQuery.setPageSize}
            page={expensesQuery.page}
            pageSize={expensesQuery.pageSize}
          />
        </div>
        <div className="right-rail">
          <ExpenseSummaryPanel
            query={summaryQuery}
            onRetry={() => summaryQuery.refresh('manual')}
            onAddExpense={openDrawer}
          />
          <FilterChips />
        </div>
      </div>
      {isDrawerOpen && (
        <div className="drawer-backdrop" onClick={requestCloseDrawer} aria-hidden="true" />
      )}
      <AddExpenseDrawer
        isOpen={isDrawerOpen}
        onClose={requestCloseDrawer}
        onSuccess={handleDrawerSuccess}
        onDirtyChange={setIsDrawerDirty}
      />
    </>
  );
}
