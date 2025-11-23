"use client";

import type { ListChildComponentProps } from "react-window";
import classNames from "classnames";
import type { ExpenseRow } from "@/lib/api/expenses";

export function ExpensesRow({ index, style, data }: ListChildComponentProps<ExpenseRow[]>) {
  const expense = data[index];

  return (
    <div
      className={classNames("virtual-row", { "virtual-row--alt": index % 2 === 1 })}
      style={style}
      role="row"
      data-testid="expenses-row"
    >
      <span>{expense.merchant}</span>
      <span>{expense.category}</span>
      <span>{expense.formattedDate}</span>
      <span>
        <span className="status-pill" data-status={expense.status}>
          {expense.status.toLowerCase()}
        </span>
      </span>
      <span className="amount">{expense.formattedAmount}</span>
    </div>
  );
}
