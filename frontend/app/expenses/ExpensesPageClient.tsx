"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useQueryClient } from "@tanstack/react-query";
import { ExpensesHeader } from "./components/ExpensesHeader";
import { ExpensesVirtualList } from "./components/ExpensesVirtualList";
import { ExpensesEmptyState } from "./components/ExpensesEmptyState";
import { ExpensesSkeleton } from "./components/ExpensesSkeleton";
import { LoadError } from "./components/LoadError";
import { AddExpenseDrawer } from "./drawer/AddExpenseDrawer";
import { useExpensesQuery } from "@/lib/api/expenses";
import type { ExpenseRow } from "@/lib/api/expenses";
import {
  createExpensesTelemetry,
  type ExpensesTelemetry,
} from "@/lib/observability/expenses-telemetry";

export function ExpensesPageClient() {
  const telemetry = useMemo(() => createExpensesTelemetry(), []);
  const queryClient = useQueryClient();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const registerRetry = useCallback(async () => {
    let nextAttempt = 1;
    setRetryCount((previous) => {
      nextAttempt = previous + 1;
      return nextAttempt;
    });
    telemetry.recordRetry(nextAttempt);
    await queryClient.invalidateQueries({ queryKey: ["expenses"], exact: true });
  }, [queryClient, telemetry]);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <ErrorBoundary
      fallbackRender={({ resetErrorBoundary }) => (
        <section className="expenses-card">
          <LoadError
            message="The ledger encountered an unexpected issue."
            supportCode={telemetry.getCorrelationId()}
            retryCount={retryCount}
            onRetry={async () => {
              await registerRetry();
              resetErrorBoundary();
            }}
          />
        </section>
      )}
    >
      <ExpensesContent
        onOpenDrawer={openDrawer}
        telemetry={telemetry}
        retryCount={retryCount}
        onRegisterRetry={registerRetry}
      />
      <AddExpenseDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </ErrorBoundary>
  );
}

interface ExpensesContentProps {
  onOpenDrawer: () => void;
  telemetry: ExpensesTelemetry;
  retryCount: number;
  onRegisterRetry: () => Promise<void>;
}

function ExpensesContent({ onOpenDrawer, telemetry, retryCount, onRegisterRetry }: ExpensesContentProps) {
  const query = useExpensesQuery();
  const { status, data, error, fetchStatus } = query;

  // All hooks must be called before any conditional returns
  const expenses = data ?? [];
  const aggregates = useMemo(() => computeAggregates(expenses), [expenses]);

  useEffect(() => {
    if (status === "pending") {
      telemetry.recordStatus("loading");
    }
  }, [status, telemetry]);

  useEffect(() => {
    if (status === "success" && data) {
      const nextStatus = data.length === 0 ? "empty" : "success";
      telemetry.recordStatus(nextStatus, {
        count: data.length,
        fetchedAt: query.dataUpdatedAt,
      });
    }
  }, [data, query.dataUpdatedAt, status, telemetry]);

  useEffect(() => {
    if (status === "error" && error) {
      telemetry.recordError(error);
    }
  }, [error, status, telemetry]);

  if (status === "pending") {
    return <ExpensesSkeleton />;
  }

  if (status === "error" && fetchStatus === "fetching") {
    return <ExpensesSkeleton label="Retrying expenses request" />;
  }

  if (status === "error") {
    return (
      <section className="expenses-card">
        <LoadError
          message={error?.message ?? "Unable to reach the Chapter 5 API."}
          retryCount={retryCount}
          supportCode={telemetry.getCorrelationId()}
          onRetry={async () => {
            await onRegisterRetry();
            await query.refetch({ cancelRefetch: true });
          }}
        />
      </section>
    );
  }

  const handleRefresh = async () => {
    telemetry.recordManualRefresh();
    await query.refetch({ cancelRefetch: true });
  };

  return (
    <>
      <section className="expenses-card" aria-live="polite">
        <ExpensesHeader
          totalCount={expenses.length}
          lastUpdated={query.dataUpdatedAt}
          onRefresh={handleRefresh}
          isRefreshing={status === "success" && query.isFetching}
          onAddExpense={onOpenDrawer}
        />
        <div className="info-grid">
          <div className="info-tile">
            <span>Total amount</span>
            <strong>{aggregates.totalAmount}</strong>
          </div>
          <div className="info-tile">
            <span>Flagged items</span>
            <strong>{aggregates.flaggedCount}</strong>
          </div>
          <div className="info-tile">
            <span>Average ticket</span>
            <strong>{aggregates.averageAmount}</strong>
          </div>
        </div>
      </section>

      <section className="expenses-card">
        <header className="expenses-card__header">
          <div>
            <h2>Ledger</h2>
            <p className="muted">Virtualized list with live Chapter 5 data</p>
          </div>
          <span className="muted" aria-live="polite">
            {query.isFetching ? "Refreshing…" : "Up to date"}
          </span>
        </header>
        {query.isFetching && (
          <span className="sr-only" role="status" aria-live="polite">
            Refreshing expenses
          </span>
        )}
        {expenses.length === 0 ? (
          <ExpensesEmptyState onAddExpense={onOpenDrawer} />
        ) : (
          <ExpensesVirtualList expenses={expenses} />
        )}
      </section>
      <button type="button" className="fab btn btn-primary" onClick={onOpenDrawer} aria-label="Add expense">
        + Add expense
      </button>
    </>
  );
}

function computeAggregates(expenses: ExpenseRow[]) {
  if (expenses.length === 0) {
    return {
      totalAmount: "$0.00",
      flaggedCount: 0,
      averageAmount: "$0.00",
    };
  }

  const totalCents = expenses.reduce((sum, expense) => sum + expense.amount.value, 0);
  const currency = expenses[0].amount.currency;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  });

  const totalAmount = formatter.format(totalCents / 100);
  const flaggedCount = expenses.filter((expense) => expense.status === "FLAGGED").length;
  const averageAmount = formatter.format(totalCents / 100 / expenses.length);

  return { totalAmount, flaggedCount, averageAmount };
}
