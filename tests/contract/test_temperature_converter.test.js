import { describe, it, expect } from 'vitest';
import { 
  convertTemperatureWithFormatting,
  validateNumericInput,
  formatTemperatureDisplay,
  handleConversionError,
} from '../../src/temp-converter/core.js';

// These tests will FAIL until we implement the enhanced temperature conversion logic
// Based on contracts/temperature-converter.md

describe('Temperature Converter Contract Tests', () => {
  describe('convertTemperature function', () => {
    it('should convert Celsius to Fahrenheit correctly', () => {
      const result = convertTemperatureWithFormatting(0, 'C', 'F');
      expect(result.value).toBe(32);
      expect(result.unit).toBe('F');
      expect(result.formatted).toBe('32.0°F');
    });

    it('should convert Fahrenheit to Celsius correctly', () => {
      const result = convertTemperatureWithFormatting(32, 'F', 'C');
      expect(result.value).toBe(0);
      expect(result.unit).toBe('C');
      expect(result.formatted).toBe('0.0°C');
    });

    it('should handle decimal temperatures', () => {
      const result = convertTemperatureWithFormatting(98.6, 'F', 'C');
      expect(result.value).toBeCloseTo(37, 1);
      expect(result.unit).toBe('C');
      expect(result.formatted).toBe('37.0°C');
    });

    it('should handle negative temperatures', () => {
      const result = convertTemperatureWithFormatting(-40, 'C', 'F');
      expect(result.value).toBe(-40);
      expect(result.unit).toBe('F');
      expect(result.formatted).toBe('-40.0°F');
    });

    it('should throw error for identical units', () => {
      expect(() => convertTemperatureWithFormatting(25, 'C', 'C')).toThrow('Cannot convert to same unit');
    });

    it('should round results to 1-2 decimal places', () => {
      const result = convertTemperatureWithFormatting(100, 'F', 'C');
      expect(result.formatted).toMatch(/^\d+\.\d°C$/);
    });
  });

  describe('validateTemperatureInput function', () => {
    it('should validate numeric input correctly', () => {
      expect(validateNumericInput('25.5')).toBe(true);
    });

    it('should validate negative decimal input', () => {
      expect(validateNumericInput('-32.5')).toBe(true);
    });

    it('should reject non-numeric input', () => {
      expect(validateNumericInput('abc')).toBe(false);
    });

    it('should reject mixed alphanumeric input', () => {
      expect(validateNumericInput('25abc')).toBe(false);
    });

    it('should handle empty input', () => {
      expect(validateNumericInput('')).toBe(true);
    });
  });

  describe('formatTemperature function', () => {
    it('should format temperature with unit symbol', () => {
      const result = formatTemperatureDisplay(32.567, 'F', 1);
      expect(result).toBe('32.6°F');
    });

    it('should format negative temperatures correctly', () => {
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
  });

  describe('handleConversionError function', () => {
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

    it('should handle unknown errors gracefully', () => {
      const error = new Error('Unknown error');
      const message = handleConversionError(error);
      expect(message).toBe('Conversion failed. Please try again.');
    });
  });
});
