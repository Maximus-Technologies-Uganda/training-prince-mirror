# UI Temp — DOM & Interaction Contracts

## Elements (IDs and roles)
- #temp-value: <input type="number"> — numeric temperature value
- #temp-from: <select> — from-unit (options: C, F)
- #temp-to: <select> — to-unit (options: C, F)
- #temp-result: <output> or <p role="status" aria-live="polite"> — shows converted result
- #temp-error: <p role="alert" aria-live="assertive"> — inline error message

## Behaviors
- Auto-convert on change of `#temp-value`, `#temp-from`, or `#temp-to`.
- Identical units → show error in `#temp-error`; clear `#temp-result`.
- Non-numeric value → show error in `#temp-error`; clear `#temp-result`.
- Inputs cleared → clear `#temp-error` and `#temp-result` (neutral state).
- Rounding: result rounded to 2 dp; UI display trims trailing zeros.

## Accessibility
- Errors announced via aria-live="assertive" in `#temp-error`.
- Result announced via aria-live="polite" in `#temp-result`.
