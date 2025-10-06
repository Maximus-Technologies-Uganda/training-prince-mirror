# UI Interactions Contract: To‑Do

## Add Item
- Input: text (required), dueDate (optional), priority (optional; default normal)
- Guards:
  - text must be non‑empty after trim
  - duplicateKey (trim → collapse spaces → lowerCase) must be unique
  - invalid dueDate blocks add, inline error shown, preserve input
- Output: item appended to list; view respects active filter

## Toggle Item
- Input: id
- Guards:
  - id must refer to an existing item
- Effect: completed flips; state is updated; view respects active filter

## Remove Item
- Input: id
- Guards:
  - id must refer to an existing item
- Effect: item removed; current filter remains applied

## Filters
- due‑today: derived via clock.today() in Africa/Kampala (UTC+3)
- high‑priority: items where priority == high
