/**
 * Temperature Conversion Service (T010)
 * 
 * Provides temperature conversion logic between Celsius and Fahrenheit.
 * Reuses conversion formulas per Constitutional Principle I (No Logic Duplication).
 * 
 * Source: src/temp-converter/core.js
 */

/**
 * Converts temperature between Celsius and Fahrenheit (T010)
 * 
 * @param value - Temperature value to convert
 * @param from - Source unit ('C' or 'F')
 * @param to - Target unit ('C' or 'F')
 * @returns Converted temperature value
 * 
 * Conversion Formulas:
 * - C→F: (C × 9/5) + 32
 * - F→C: (F - 32) × 5/9
 * - Identity (from === to): return value unchanged
 * 
 * Examples:
 * - convertTemperature(32, "F", "C") = 0
 * - convertTemperature(0, "C", "F") = 32
 * - convertTemperature(100, "C", "C") = 100
 * - convertTemperature(-40, "F", "C") = -40
 * - convertTemperature(98.6, "F", "C") = 37.0
 */
export function convertTemperature(
  value: number,
  from: 'C' | 'F',
  to: 'C' | 'F'
): number {
  // Handle identity conversion (same unit)
  if (from === to) {
    return value;
  }

  // Celsius to Fahrenheit: (C × 9/5) + 32
  if (from === 'C' && to === 'F') {
    return (value * 9) / 5 + 32;
  }

  // Fahrenheit to Celsius: (F - 32) × 5/9
  if (from === 'F' && to === 'C') {
    return (value - 32) * (5 / 9);
  }

  // This should never be reached due to type constraints
  throw new Error('Invalid units');
}

