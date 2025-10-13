# Research — UI Expense

Decisions
- Month input: numeric 1–12; normalize to zero‑padded when calling core.
- Category options: derived from existing expense data (unique, sorted) + “All”.
- Empty state: show “No expenses found” and total 0.
- Table columns: Date, Category, Amount.

Rationale
- Matches existing `src/expense/core.js` filter semantics; avoids duplication.
- Keeps UI deterministic and testable with table‑driven cases.

Alternatives considered
- Hardcoded categories (rejected: drift risk).
- Free‑text category (rejected: case/typo errors).
