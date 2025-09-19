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
  
    // Add validation to check for invalid or identical units
    if (!validUnits.includes(fromUnit) || !validUnits.includes(toUnit) || fromUnit === toUnit) {
      throw new Error('Invalid units provided for conversion.');
    }
  
    if (fromUnit === 'C' && toUnit === 'F') {
      // Celsius to Fahrenheit
      return (temp * 9/5) + 32;
    } else if (fromUnit === 'F' && toUnit === 'C') {
      // Fahrenheit to Celsius
      return (temp - 32) * 5/9;
    }
  }