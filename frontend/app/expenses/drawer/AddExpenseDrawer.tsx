"use client";

import React, { useEffect, useRef } from "react";

interface AddExpenseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement | null) {
  if (!container) return [] as HTMLElement[];
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

export function AddExpenseDrawer({ isOpen, onClose }: AddExpenseDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.removeProperty("overflow");
      return;
    }

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    document.body.style.setProperty("overflow", "hidden");

    const focusFirstElement = () => {
      const [first] = getFocusableElements(drawerRef.current);
      if (first) {
        first.focus();
      } else if (drawerRef.current) {
        drawerRef.current.focus();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = getFocusableElements(drawerRef.current);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    focusFirstElement();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.removeProperty("overflow");
      previouslyFocusedRef.current?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <div className={`drawer-shell ${isOpen ? "drawer-shell--visible" : ""}`} aria-hidden={!isOpen}>
      <button
        type="button"
        className="drawer__backdrop"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
      />
      <aside
        className={`drawer ${isOpen ? "drawer--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-expense-title"
        aria-describedby="add-expense-description"
        ref={drawerRef}
      >
        <header className="drawer__header">
          <p className="muted">Workflow preview</p>
          <h2 id="add-expense-title">Add expense (unlocking Day 3)</h2>
          <p className="muted" id="add-expense-description">
            Capture merchant, amount, and receipts without leaving the ledger. For Day 2 this drawer
            showcases the approved interaction pattern and holds space for the full form.
          </p>
        </header>

        <div className="drawer__body">
          <form className="drawer__form" aria-live="polite">
            <label>
              <span>Merchant</span>
              <input type="text" placeholder="Northwind" disabled aria-disabled="true" />
            </label>
            <label>
              <span>Amount</span>
              <input type="text" placeholder="$0.00" disabled aria-disabled="true" />
            </label>
            <label>
              <span>Status</span>
              <select disabled aria-disabled="true">
                <option>Pending</option>
              </select>
            </label>
            <label>
              <span>Notes</span>
              <textarea rows={3} placeholder="Add memo" disabled aria-disabled="true" />
            </label>
            <button className="btn btn-primary" type="button" disabled aria-disabled="true">
              Save expense
            </button>
          </form>
        </div>

        <footer className="drawer__footer">
          <p className="muted">Expense creation becomes interactive on Day 3. Stay tuned!</p>
          <button className="btn btn-muted" type="button" onClick={onClose}>
            Close drawer
          </button>
        </footer>
      </aside>
    </div>
  );
}
