# API Contracts: Quote UI Filtering

**Date**: 2025-01-27  
**Feature**: Quote UI Filtering Enhancement

## Filter Quotes

**Endpoint**: `filterQuotes(query: string, quotes: Quote[]): Quote[]`

**Purpose**: Filter quotes by author name with case-insensitive matching

**Parameters**:
- `query`: string - Filter text (case-insensitive, trimmed)
- `quotes`: Quote[] - Array of quotes to filter

**Returns**: Quote[] - Array of matching quotes

**Behavior**:
- Empty or whitespace-only query returns all quotes
- Case-insensitive matching against author field
- Returns empty array if no matches found

**Example**:
```javascript
const quotes = [
  { id: '1', text: 'Hello world', author: 'John Doe' },
  { id: '2', text: 'Good morning', author: 'Jane Smith' }
];

filterQuotes('john', quotes); // Returns quote with id '1'
filterQuotes('', quotes); // Returns all quotes
filterQuotes('   ', quotes); // Returns all quotes
```

## Debounced Filter

**Endpoint**: `debouncedFilter(input: HTMLInputElement, callback: Function, delay: number): void`

**Purpose**: Implement debounced filtering to prevent excessive re-rendering

**Parameters**:
- `input`: HTMLInputElement - The filter input element
- `callback`: Function - Function to call after debounce delay
- `delay`: number - Debounce delay in milliseconds (250ms)

**Behavior**:
- Cancels previous timer on new input
- Calls callback after delay with current input value
- Handles rapid typing by resetting timer

**Example**:
```javascript
const input = document.getElementById('filter-input');
debouncedFilter(input, (value) => {
  const filtered = filterQuotes(value, allQuotes);
  displayQuotes(filtered);
}, 250);
```

## Random Quote Selection

**Endpoint**: `selectRandomQuote(quotes: Quote[], rng?: Function): Quote`

**Purpose**: Select a random quote with optional seeded RNG for testing

**Parameters**:
- `quotes`: Quote[] - Array of quotes to select from
- `rng`: Function (optional) - Random number generator function

**Returns**: Quote - Randomly selected quote

**Behavior**:
- Uses provided RNG or Math.random() as fallback
- Returns single quote from array
- Deterministic when seeded RNG provided (for testing)

**Example**:
```javascript
// Production use
const quote = selectRandomQuote(quotes);

// Testing use
const seededRNG = () => 0.5; // Always returns 0.5
const quote = selectRandomQuote(quotes, seededRNG);
```
