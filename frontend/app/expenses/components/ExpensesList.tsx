"use client";

import classNames from "classnames";
import { FixedSizeList, type ListChildComponentProps } from "react-window";
import type { PaginatedExpenseResponse } from "@/models/paginatedResponse";
import type { Expense } from "@/models/expense";
import type { UseQueryResult } from "@tanstack/react-query";

interface ExpensesListProps {
  query: UseQueryResult<PaginatedExpenseResponse, Error> & { isEmpty?: boolean };
  onRetry: () => void;
  onAddExpense: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  page: number;
  pageSize: number;
}

export function ExpensesList({
  query,
  onRetry,
  onAddExpense,
  onPageChange,
  onPageSizeChange,
  page,
  pageSize,
}: ExpensesListProps) {
  if (query.isLoading) {
    return (
      <section className="panel" aria-live="polite" data-testid="expenses-loading">
        <h2>Expenses</h2>
        <SkeletonList />
      </section>
    );
  }

  if (query.error) {
    const requestId = (query.error as Error & { requestId?: string }).requestId;
    return (
      <section className="panel" aria-live="assertive" data-testid="expenses-error">
        <h2>Expenses</h2>
        <div className="alert error">
          <div>
            <p className="alert-title">Failed to load expenses</p>
            <p className="alert-body">
              {query.error.message}
              {requestId ? ` · Request ID: ${requestId}` : ""}
            </p>
          </div>
          <button className="btn secondary" onClick={onRetry}>
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (query.isEmpty) {
    return (
      <section className="panel empty-state" aria-live="polite" data-testid="expenses-empty">
        <h2>No expenses found</h2>
        <p>Add your first expense to see it here.</p>
        <button className="btn primary" onClick={onAddExpense}>
          Add expense
        </button>
      </section>
    );
  }

  const data = query.data;
  if (!data) return null;

  const totalItems = data.pagination.totalItems;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  const listHeight = Math.min(480, Math.max(56 * data.data.length, 280));

  return (
  <section className="panel" aria-live="polite" data-testid="expenses-success">
      <header className="panel-header">
        <div>
          <h2>Expenses list</h2>
          <p className="muted">Showing {start}-{end} of {totalItems}</p>
        </div>
        <span className="muted" aria-live="polite">
          {query.isFetching ? "Refreshing…" : "Up to date"}
        </span>
      </header>
      <div role="list" aria-label="Expenses list">
        <FixedSizeList
          height={listHeight}
          itemCount={data.data.length}
          itemSize={56}
          width="100%"
          overscanCount={5}
          itemData={data.data}
        >
          {Row}
        </FixedSizeList>
      </div>
      <Footer
        page={page}
        pageSize={pageSize}
        totalPages={data.pagination.totalPages}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
      <div className="sr-only" aria-live="polite">
        Expenses updated, showing {end - start + 1} of {totalItems}
      </div>
    </section>
  );
}

function Row({ index, style, data }: ListChildComponentProps<Expense[]>) {
  const expense = data[index];
  const isEven = index % 2 === 0;
  return (
    <button
      type="button"
      style={style}
      className={classNames("expense-row", { "expense-row--alt": isEven })}
      role="listitem"
    >
      <span className="expense-amount">{expense.formattedAmount}</span>
      <span>{expense.category}</span>
      <span>{expense.formattedDate}</span>
    </button>
  );
}

function SkeletonList() {
  return (
    <ul className="skeleton-list" data-testid="expenses-skeleton">
      {Array.from({ length: 20 }).map((_, index) => (
        <li key={index} className="skeleton-row">
          <span />
          <span />
          <span />
        </li>
      ))}
    </ul>
  );
}

type FooterProps = {
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (next: number) => void;
  onPageSizeChange: (size: number) => void;
};

function Footer({
  page,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: FooterProps) {
  return (
    <div className="list-footer">
      <div className="pagination">
        <button
          className="btn ghost"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="btn ghost"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
      <label className="form-field">
        <span>Rows per page</span>
        <select value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))}>
          {[20, 50, 100].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
