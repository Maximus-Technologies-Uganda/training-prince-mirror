# Data Model — UI Expense

## Entities

### ExpenseItem
- month: integer (1–12)
- category: string
- amount: number

## Derived Collections
- CategoryOptions: unique categories from current expense data, sorted ASC; include "All" at position 0.
