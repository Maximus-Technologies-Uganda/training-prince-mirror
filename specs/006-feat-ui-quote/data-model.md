# Data Model: UI Quote

## Entities
- Quote
  - text: string (required)
  - author: string (may be empty → display as "Unknown")

## UI State
- quotes: Quote[] (source = defaultQuotes from src/quote/core.js)
- filteredQuotes: Quote[] (result of filterByAuthor)
- lastQuoteId: string | null (text-author composite for shuffle repeat avoidance)

## Validation Rules
- If author missing, display "Unknown" in UI footer
- Filter is case-insensitive and trims leading/trailing spaces

## State Transitions
- On input change → filteredQuotes updated → if empty: empty state; else pickRandom and render
- On shuffle click → pickRandom(filteredQuotes), avoid immediate repeat when >1
