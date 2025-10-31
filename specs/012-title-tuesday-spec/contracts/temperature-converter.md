# API Contracts: Temperature Converter

**Date**: 2025-01-27  
**Feature**: Temperature Converter Enhancement

## Temperature Conversion

**Endpoint**: `convertTemperature(value: number, fromUnit: string, toUnit: string): ConversionResult`

**Purpose**: Convert temperature between Celsius and Fahrenheit

**Parameters**:
- `value`: number - Temperature value (can be decimal or negative)
- `fromUnit`: string - Source unit ('C' or 'F')
- `toUnit`: string - Target unit ('C' or 'F')

**Returns**: ConversionResult - Object with converted value and formatted string

**Behavior**:
- Throws error if fromUnit equals toUnit
- Converts between Celsius and Fahrenheit
- Rounds result to 1-2 decimal places
- Returns formatted string with unit symbol

**Example**:
```javascript
convertTemperature(32, 'F', 'C'); // Returns { value: 0, unit: 'C', formatted: '0.0°C' }
convertTemperature(0, 'C', 'F'); // Returns { value: 32, unit: 'F', formatted: '32.0°F' }
convertTemperature(32, 'F', 'F'); // Throws error: "Cannot convert to same unit"
```

## Input Validation

**Endpoint**: `validateTemperatureInput(input: HTMLInputElement): boolean`

**Purpose**: Validate temperature input field for numeric values

**Parameters**:
- `input`: HTMLInputElement - The temperature input element

**Returns**: boolean - True if input is valid

**Behavior**:
- Allows numeric characters, decimal points, and negative signs
- Prevents non-numeric input
- Handles edge cases (multiple decimals, etc.)

**Example**:
```javascript
const input = document.getElementById('temp-input');
const isValid = validateTemperatureInput(input);
if (!isValid) {
  showError('Please enter a valid number');
}
```

## Format Temperature

**Endpoint**: `formatTemperature(value: number, unit: string, precision: number): string`

**Purpose**: Format temperature value with unit symbol and precision

**Parameters**:
- `value`: number - Temperature value
- `unit`: string - Unit ('C' or 'F')
- `precision`: number - Decimal places (1 or 2)

**Returns**: string - Formatted temperature string

**Behavior**:
- Rounds value to specified precision
- Adds appropriate unit symbol (°C or °F)
- Handles negative values correctly

**Example**:
```javascript
formatTemperature(32.567, 'F', 1); // Returns '32.6°F'
formatTemperature(-10.25, 'C', 2); // Returns '-10.25°C'
formatTemperature(0, 'F', 1); // Returns '0.0°F'
```

## Error Handling

**Endpoint**: `handleConversionError(error: Error): string`

**Purpose**: Convert technical errors to user-friendly messages

**Parameters**:
- `error`: Error - The error object

**Returns**: string - User-friendly error message

**Behavior**:
- Maps technical errors to clear user messages
- Provides recovery suggestions
- Handles different error types appropriately

**Example**:
```javascript
try {
  const result = convertTemperature(32, 'F', 'F');
} catch (error) {
  const message = handleConversionError(error);
  // message: "Please select different units for conversion"
}
```
