# Data Model: Tuesday: Spec-First Polishing for Quote and Temp UIs

**Date**: 2025-01-27  
**Feature**: UI Polishing for Quote and Temperature Converter UIs

## Entities

### Quote
**Purpose**: Represents a quote with author and text content for filtering and display

**Fields**:
- `id`: string - Unique identifier for the quote
- `text`: string - The quote content
- `author`: string - The author name (used for filtering)

**Relationships**:
- Belongs to Quote collection (array of quotes)

**Validation Rules**:
- `text` must be non-empty string
- `author` must be non-empty string
- `id` must be unique within collection

**State Transitions**:
- Static data - no state transitions

### Temperature
**Purpose**: Represents a numeric value with associated unit for conversion operations

**Fields**:
- `value`: number - The temperature value (can be decimal or negative)
- `unit`: string - The temperature unit ('C' for Celsius, 'F' for Fahrenheit)

**Relationships**:
- Input temperature → Output temperature (conversion relationship)

**Validation Rules**:
- `value` must be a valid number (including decimals and negatives)
- `unit` must be either 'C' or 'F'
- No specific range limits (rely on browser/JavaScript limits)

**State Transitions**:
- Input temperature → Converted temperature (via conversion function)

### FilterState
**Purpose**: Represents the current search criteria and results for quote filtering

**Fields**:
- `query`: string - The current filter text (case-insensitive)
- `results`: Quote[] - Array of quotes matching the filter
- `isLoading`: boolean - Whether filter operation is in progress
- `error`: string | null - Error message if filter fails

**Relationships**:
- Contains filtered Quote entities
- References original Quote collection

**Validation Rules**:
- `query` can be empty (shows all quotes)
- `query` can contain whitespace (treated as empty)
- `results` must be subset of original quotes

**State Transitions**:
- Empty query → Show all quotes
- Non-empty query → Filter quotes (debounced)
- Filter error → Show error message

### ConversionResult
**Purpose**: Represents the output of temperature conversion with formatted value and unit

**Fields**:
- `value`: number - The converted temperature value
- `unit`: string - The output unit ('C' or 'F')
- `formatted`: string - The formatted display string (e.g., "32.5°F")
- `precision`: number - Decimal places (1-2 as specified)

**Relationships**:
- Result of Temperature conversion operation

**Validation Rules**:
- `value` must be valid number
- `unit` must be 'C' or 'F'
- `formatted` must include unit symbol (°C, °F)
- `precision` must be 1 or 2 decimal places

**State Transitions**:
- Input temperature + target unit → Conversion result

## Data Flow

### Quote Filtering Flow
1. User types in filter input
2. Input debounced (250ms)
3. Query processed (trimmed, case-insensitive)
4. Quotes filtered based on author match
5. Results displayed or error shown

### Temperature Conversion Flow
1. User enters temperature value
2. Input validated (numeric only)
3. Source and target units selected
4. Conversion performed (if units differ)
5. Result formatted and displayed

## Constraints

- Quote filtering: Case-insensitive, debounced, handles empty/whitespace
- Temperature input: Numeric only (including decimals and negatives)
- Temperature conversion: Error if identical units selected
- Display formatting: Consistent precision (1-2 decimal places)
- Error handling: User-friendly messages with clear recovery actions
