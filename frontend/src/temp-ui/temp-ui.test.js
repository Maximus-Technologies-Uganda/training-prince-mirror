import { describe, it, expect } from 'vitest';
import { 
  convertTemperatureWithFormatting,
  validateNumericInput,
  formatTemperatureDisplay,
  handleConversionError,
  createConversionResult,
  validateUnitSelection,
} from '../../../src/temp-converter/core.js';
import { 
  createTemperatureState,
  updateTemperatureValue,
} from './temp-ui.js';

// These tests will FAIL until we implement the enhanced temperature converter logic
// Based on data-model.md and research.md

describe('Temperature Converter Logic Unit Tests', () => {
  describe('convertTemperatureWithFormatting', () => {
    it('should convert Celsius to Fahrenheit with proper formatting', () => {
      // This will fail until we implement the enhanced conversion
      const result = convertTemperatureWithFormatting(0, 'C', 'F');
      expect(result.value).toBe(32);
      expect(result.unit).toBe('F');
      expect(result.formatted).toBe('32.0°F');
      expect(result.precision).toBe(1);
    });

    it('should convert Fahrenheit to Celsius with proper formatting', () => {
      const result = convertTemperatureWithFormatting(32, 'F', 'C');
      expect(result.value).toBe(0);
      expect(result.unit).toBe('C');
      expect(result.formatted).toBe('0.0°C');
      expect(result.precision).toBe(1);
    });

    it('should handle decimal temperatures', () => {
      const result = convertTemperatureWithFormatting(98.6, 'F', 'C');
      expect(result.value).toBeCloseTo(37, 1);
      expect(result.formatted).toBe('37.0°C');
    });

    it('should handle negative temperatures', () => {
      const result = convertTemperatureWithFormatting(-40, 'C', 'F');
      expect(result.value).toBe(-40);
      expect(result.formatted).toBe('-40.0°F');
    });

    it('should throw error for identical units', () => {
      expect(() => convertTemperatureWithFormatting(25, 'C', 'C')).toThrow('Cannot convert to same unit');
    });

    it('should respect precision parameter', () => {
      const result1 = convertTemperatureWithFormatting(100, 'F', 'C', 1);
      const result2 = convertTemperatureWithFormatting(100, 'F', 'C', 2);
      
      expect(result1.precision).toBe(1);
      expect(result2.precision).toBe(2);
      expect(result1.formatted).toMatch(/^\d+\.\d°C$/);
      expect(result2.formatted).toMatch(/^\d+\.\d{2}°C$/);
    });
  });

  describe('validateNumericInput', () => {
    it('should validate numeric input correctly', () => {
      expect(validateNumericInput('25')).toBe(true);
      expect(validateNumericInput('25.5')).toBe(true);
      expect(validateNumericInput('-32.5')).toBe(true);
      expect(validateNumericInput('0')).toBe(true);
    });

    it('should reject non-numeric input', () => {
      expect(validateNumericInput('abc')).toBe(false);
      expect(validateNumericInput('25abc')).toBe(false);
      expect(validateNumericInput('abc25')).toBe(false);
      expect(validateNumericInput('25.5.5')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validateNumericInput('')).toBe(true); // Empty is valid (no input)
      expect(validateNumericInput('   ')).toBe(false); // Whitespace only
      expect(validateNumericInput('+25')).toBe(true); // Positive sign
      expect(validateNumericInput('25.')).toBe(false); // Trailing decimal
      expect(validateNumericInput('.25')).toBe(true); // Leading decimal
    });

    it('should handle extreme values', () => {
      expect(validateNumericInput('999999')).toBe(true);
      expect(validateNumericInput('-999999')).toBe(true);
      expect(validateNumericInput('999999.99')).toBe(true);
    });
  });

  describe('formatTemperatureDisplay', () => {
    it('should format positive temperatures', () => {
      const result = formatTemperatureDisplay(32.567, 'F', 1);
      expect(result).toBe('32.6°F');
    });

    it('should format negative temperatures', () => {
      const result = formatTemperatureDisplay(-10.25, 'C', 2);
      expect(result).toBe('-10.25°C');
    });

    it('should handle zero temperature', () => {
      const result = formatTemperatureDisplay(0, 'F', 1);
      expect(result).toBe('0.0°F');
    });

    it('should respect precision parameter', () => {
      const result1 = formatTemperatureDisplay(32.567, 'F', 1);
      const result2 = formatTemperatureDisplay(32.567, 'F', 2);
      
      expect(result1).toBe('32.6°F');
      expect(result2).toBe('32.57°F');
    });

    it('should handle integer results', () => {
      const result = formatTemperatureDisplay(32, 'F', 1);
      expect(result).toBe('32.0°F');
    });
  });

  describe('handleConversionError', () => {
    it('should convert identical unit error to user-friendly message', () => {
      const error = new Error('Cannot convert to same unit');
      const message = handleConversionError(error);
      expect(message).toBe('Please select different units for conversion');
    });

    it('should handle invalid number error', () => {
      const error = new Error('Temperature must be a valid number');
      const message = handleConversionError(error);
      expect(message).toBe('Please enter a valid number');
    });

    it('should handle invalid unit error', () => {
      const error = new Error('Invalid units. Must be C or F');
      const message = handleConversionError(error);
      expect(message).toBe('Please select valid temperature units');
    });

    it('should handle unknown errors gracefully', () => {
      const error = new Error('Unknown error');
      const message = handleConversionError(error);
      expect(message).toBe('Conversion failed. Please try again.');
    });
  });

  describe('createConversionResult', () => {
    it('should create conversion result object', () => {
      const result = createConversionResult(32.5, 'F', 1);
      expect(result.value).toBe(32.5);
      expect(result.unit).toBe('F');
      expect(result.formatted).toBe('32.5°F');
      expect(result.precision).toBe(1);
    });

    it('should handle different precision values', () => {
      const result1 = createConversionResult(32.567, 'F', 1);
      const result2 = createConversionResult(32.567, 'F', 2);
      
      expect(result1.formatted).toBe('32.6°F');
      expect(result2.formatted).toBe('32.57°F');
    });
  });

  describe('validateUnitSelection', () => {
    it('should validate different unit selections', () => {
      expect(validateUnitSelection('C', 'F')).toBe(true);
      expect(validateUnitSelection('F', 'C')).toBe(true);
    });

    it('should reject identical unit selections', () => {
      expect(validateUnitSelection('C', 'C')).toBe(false);
      expect(validateUnitSelection('F', 'F')).toBe(false);
    });

    it('should reject invalid units', () => {
      expect(validateUnitSelection('K', 'C')).toBe(false);
      expect(validateUnitSelection('C', 'K')).toBe(false);
    });
  });

  describe('createTemperatureState', () => {
    it('should create initial temperature state', () => {
      const state = createTemperatureState();
      expect(state.value).toBe('');
      expect(state.fromUnit).toBe('C');
      expect(state.toUnit).toBe('F');
      expect(state.result).toBeNull();
      expect(state.error).toBeNull();
      expect(state.isValid).toBe(true);
    });

    it('should update state with new value', () => {
      const state = createTemperatureState();
      const newState = updateTemperatureValue(state, '25');
      
      expect(newState.value).toBe('25');
      expect(newState.isValid).toBe(true);
    });

    it('should handle invalid input', () => {
      const state = createTemperatureState();
      const newState = updateTemperatureValue(state, 'abc');
      
      expect(newState.value).toBe('abc');
      expect(newState.isValid).toBe(false);
    });
  });
});
