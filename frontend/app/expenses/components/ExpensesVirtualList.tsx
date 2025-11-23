"use client";

import React from "react";
import { FixedSizeList, type ListChildComponentProps } from "react-window";
import { ExpensesRow } from "./ExpensesRow";
import type { ExpenseRow as ExpenseRowModel } from "@/lib/api/expenses";

const ROW_HEIGHT = 64;

interface ExpensesVirtualListProps {
  expenses: ExpenseRowModel[];
}

export function ExpensesVirtualList({ expenses }: ExpensesVirtualListProps) {
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime(),
  );
  const listHeight = Math.min(Math.max(sortedExpenses.length * ROW_HEIGHT, ROW_HEIGHT * 4), 560);

  return (
    <div role="table" aria-label="Expenses ledger">
      <div className="table-head" role="row">
        <span>Merchant</span>
        <span>Category</span>
        <span>Purchase date</span>
        <span>Status</span>
        <span className="amount">Amount</span>
      </div>
      <div className="scroll-shell" role="rowgroup">
        <FixedSizeList
          height={listHeight}
          width="100%"
          itemSize={ROW_HEIGHT}
          itemCount={sortedExpenses.length}
          itemData={sortedExpenses}
          overscanCount={8}
        >
          {ExpensesRow as (props: ListChildComponentProps<ExpenseRowModel[]>) => JSX.Element}
        </FixedSizeList>
      </div>
      <p className="muted" aria-live="polite">
        Showing {sortedExpenses.length.toLocaleString()} expense
        {sortedExpenses.length === 1 ? "" : "s"}.
      </p>
    </div>
  );
}
