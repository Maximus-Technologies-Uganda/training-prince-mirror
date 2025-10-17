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

// Enhanced temperature conversion functions for UI polishing
export function convertTemperatureWithFormatting(value, fromUnit, toUnit, precision = 1) {
  const validUnits = ['C', 'F'];
  
  // Validate input temperature
  if (!Number.isFinite(value)) {
    throw new Error('Temperature must be a valid number.');
  }
  
  // Validate units
  if (!validUnits.includes(fromUnit) || !validUnits.includes(toUnit)) {
    throw new Error(`Invalid units. Must be C or F, got: ${fromUnit} and ${toUnit}`);
  }
  
  // Check for identical units
  if (fromUnit === toUnit) {
    throw new Error('Cannot convert to same unit');
  }
  
  let convertedValue;
  if (fromUnit === 'C' && toUnit === 'F') {
    convertedValue = (value * 9/5) + 32;
  } else if (fromUnit === 'F' && toUnit === 'C') {
    convertedValue = (value - 32) * 5/9;
  } else {
    throw new Error('Unexpected conversion case');
  }
  
  return {
    value: convertedValue,
    unit: toUnit,
    formatted: formatTemperatureDisplay(convertedValue, toUnit, precision),
    precision: precision,
  };
}

export function validateNumericInput(input) {
  if (!input || typeof input !== 'string') {
    return true; // Empty input is valid
  }
  
  // Empty string is valid (no input)
  if (input === '') {
    return true;
  }
  
  const trimmed = input.trim();
  if (trimmed === '') {
    return false; // Whitespace-only input is invalid
  }
  
  // Check if it's a valid number (including decimals and negatives)
  const numberRegex = /^[+-]?\d*\.?\d+$/;
  return numberRegex.test(trimmed);
}

export function formatTemperatureDisplay(value, unit, precision) {
  const rounded = value.toFixed(precision);
  return `${rounded}°${unit}`;
}

export function handleConversionError(error) {
  const message = error.message;
  
  if (message.includes('Cannot convert to same unit')) {
    return 'Please select different units for conversion';
  }
  
  if (message.includes('Temperature must be a valid number')) {
    return 'Please enter a valid number';
  }
  
  if (message.includes('Invalid units')) {
    return 'Please select valid temperature units';
  }
  
  return 'Conversion failed. Please try again.';
}

export function createConversionResult(value, unit, precision) {
  return {
    value: value,
    unit: unit,
    formatted: formatTemperatureDisplay(value, unit, precision),
    precision: precision,
  };
}

export function validateUnitSelection(fromUnit, toUnit) {
  const validUnits = ['C', 'F'];
  
  if (!validUnits.includes(fromUnit) || !validUnits.includes(toUnit)) {
    return false;
  }
  
  return fromUnit !== toUnit;
}