# UI Contracts: Quote

## DOM Contracts
- Input: #author-filter (label "Author")
- Button: #shuffle-quote (disabled when no results)
- Display: #quote-display contains #quote-text and #quote-author

## Events
- input (author-filter): live filter
- click (shuffle-quote): show another quote, avoid immediate repeat

## States
- Default: random quote on load
- Filtered: show random from filtered list
- Empty: "No quotes found" text; author empty; shuffle disabled
