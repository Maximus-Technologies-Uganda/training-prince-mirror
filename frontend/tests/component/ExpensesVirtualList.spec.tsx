import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ExpensesVirtualList } from "@/components/ExpensesVirtualList";
import type { ExpenseRow } from "@/lib/api/expenses";

vi.mock("react-window", () => ({
  FixedSizeList: ({ itemData }: { itemData: ExpenseRow[] }) => (
    <div data-testid="virtual-list">
      {itemData.map((expense) => (
        <div key={expense.id} data-testid="virtual-row">
          <span>{expense.merchant}</span>
          <span>{expense.status}</span>
          <span>{expense.formattedAmount}</span>
          <span>{expense.formattedDate}</span>
        </div>
      ))}
    </div>
  ),
}));

const baseExpense: Pick<ExpenseRow, "category" | "memo"> = {
  category: "Software",
  memo: null,
};

describe("ExpensesVirtualList", () => {
  it("renders merchants sorted by most recent purchase date", () => {
    const expenses: ExpenseRow[] = [
      {
        ...baseExpense,
        id: "exp-old",
        merchant: "Legacy SaaS",
        purchaseDate: "2024-01-01T00:00:00.000Z",
        status: "APPROVED",
        amount: { currency: "USD", value: 10000 },
        formattedAmount: "$100.00",
        formattedDate: "Jan 1, 2024",
      },
      {
        ...baseExpense,
        id: "exp-new",
        merchant: "Modern SaaS",
        purchaseDate: "2025-05-01T00:00:00.000Z",
        status: "PENDING",
        amount: { currency: "USD", value: 2500 },
        formattedAmount: "$25.00",
        formattedDate: "May 1, 2025",
      },
    ];

    render(<ExpensesVirtualList expenses={expenses} />);

    const rows = screen.getAllByTestId("virtual-row");
    expect(rows[0]).toHaveTextContent("Modern SaaS");
    expect(rows[1]).toHaveTextContent("Legacy SaaS");
  });

  it("surfaces total count messaging", () => {
    const expenses: ExpenseRow[] = [
      {
        ...baseExpense,
        id: "exp-one",
        merchant: "Vendor",
        purchaseDate: "2025-01-01T00:00:00.000Z",
        status: "APPROVED",
        amount: { currency: "USD", value: 4300 },
        formattedAmount: "$43.00",
        formattedDate: "Jan 1, 2025",
      },
    ];

    render(<ExpensesVirtualList expenses={expenses} />);

    expect(screen.getByText(/showing 1 expense/i)).toBeInTheDocument();
  });
});
