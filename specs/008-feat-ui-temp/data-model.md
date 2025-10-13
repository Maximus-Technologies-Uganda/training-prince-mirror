# Data Model — UI Temperature Converter

## Entities

### ConversionRequest
- value: number
- fromUnit: "C" | "F"
- toUnit: "C" | "F"

Validation rules
- value MUST be numeric (NaN not allowed).
- fromUnit and toUnit MUST be one of {C, F}.
- fromUnit MUST NOT equal toUnit (identical units → error state).

### ConversionResult
- value: number | null  
  (rounded to 2 dp; UI display trims trailing zeros)
- error: string | null  
  (non-null when invalid input or identical units)

Invariants
- When error is non-null, value MUST be null and UI MUST show no result.
- When inputs are cleared, error MUST be null and value MUST be null (neutral state).

