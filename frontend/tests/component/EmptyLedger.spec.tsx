import React, { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ExpensesEmptyState } from "@/components/ExpensesEmptyState";
import { AddExpenseDrawer } from "@/app/expenses/drawer/AddExpenseDrawer";

function DrawerHarness() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ExpensesEmptyState onAddExpense={() => setIsOpen(true)} />
      <AddExpenseDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

describe("Empty ledger UX", () => {
  it("renders illustration and CTA", () => {
    const handleAdd = vi.fn();
    render(<ExpensesEmptyState onAddExpense={handleAdd} />);

    expect(
      screen.getByRole("img", { name: /illustration of an empty ledger/i })
    ).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /add expense/i });
    fireEvent.click(button);

    expect(handleAdd).toHaveBeenCalledTimes(1);
  });

  it("moves focus into drawer and traps tab navigation", () => {
    render(<DrawerHarness />);

    fireEvent.click(screen.getByRole("button", { name: /add expense/i }));

    const closeButton = screen.getByRole("button", { name: /close drawer/i });
    const dialog = screen.getByRole("dialog", { name: /add expense/i });
    expect(closeButton).toHaveFocus();

    fireEvent.keyDown(document, { key: "Tab" });
    expect(closeButton).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });

    const hiddenDialog = screen.getByRole("dialog", { name: /add expense/i, hidden: true });
    expect(hiddenDialog.parentElement).toHaveAttribute("aria-hidden", "true");
  });
});
