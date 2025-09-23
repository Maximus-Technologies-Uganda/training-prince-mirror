/**
 * Converts a temperature from one scale to another.
 * @param {number} temp - The temperature value to convert.
 * @param {string} fromUnit - The starting unit ('C' or 'F').
 * @param {string} toUnit - The target unit to convert to ('C' or 'F').
 * @returns {number} The converted temperature.
 * @throws {Error} If the units are invalid or identical.
 */
export function convertTemperature(temp, fromUnit, toUnit) {
    const validUnits = ['C', 'F'];
  
    // Validate input temperature
    if (!Number.isFinite(temp)) {
      throw new Error('Temperature must be a valid number.');
    }
  
    // Validate units
    if (!validUnits.includes(fromUnit) || !validUnits.includes(toUnit)) {
      throw new Error(`Invalid units. Must be C or F, got: ${fromUnit} and ${toUnit}`);
    }
    
    // Check for identical units
    if (fromUnit === toUnit) {
      throw new Error(`Cannot convert from ${fromUnit} to ${toUnit} (identical units)`);
    }
  
    if (fromUnit === 'C' && toUnit === 'F') {
      // Celsius to Fahrenheit: (C × 9/5) + 32
      return (temp * 9/5) + 32;
    } else if (fromUnit === 'F' && toUnit === 'C') {
      // Fahrenheit to Celsius: (F - 32) × 5/9
      return (temp - 32) * 5/9;
    }
    
    // This should never be reached due to validation above
    throw new Error('Unexpected conversion case');
  }