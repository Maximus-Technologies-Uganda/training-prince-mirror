import type { PropsWithChildren } from "react";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { ExpenseFiltersProvider } from "@/context/ExpenseFiltersProvider";
import "./styles.css";

export default function ExpensesLayout({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <ExpenseFiltersProvider>
        <div className="expenses-shell">
          {children}
        </div>
      </ExpenseFiltersProvider>
    </QueryProvider>
  );
}
