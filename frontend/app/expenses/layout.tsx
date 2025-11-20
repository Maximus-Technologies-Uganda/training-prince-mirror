import type { PropsWithChildren } from "react";
import { Suspense } from "react";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { ExpenseFiltersProvider } from "@/context/ExpenseFiltersProvider";
import "./styles.css";

export default function ExpensesLayout({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <Suspense fallback={<div>Loading filters...</div>}>
        <ExpenseFiltersProvider>
          <div className="expenses-shell">
            {children}
          </div>
        </ExpenseFiltersProvider>
      </Suspense>
    </QueryProvider>
  );
}
