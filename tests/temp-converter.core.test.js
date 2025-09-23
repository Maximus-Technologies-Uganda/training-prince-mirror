import { describe, it, expect } from 'vitest';
import { convertTemperature } from '../src/temp-converter/core.js';

describe('Temperature Converter Core Function', () => {
  describe('Celsius to Fahrenheit conversions', () => {
    const testCases = [
      { input: 0, expected: 32 },
      { input: 100, expected: 212 },
      { input: 37, expected: 98.6 },
      { input: -40, expected: -40 },
      { input: 25, expected: 77 }
    ];

    testCases.forEach(({ input, expected }) => {
      it(`converts ${input}°C to ${expected}°F`, () => {
        const result = convertTemperature(input, 'C', 'F');
        expect(result).toBeCloseTo(expected, 1);
      });
    });
  });

  describe('Fahrenheit to Celsius conversions', () => {
    const testCases = [
      { input: 32, expected: 0 },
      { input: 212, expected: 100 },
      { input: 98.6, expected: 37 },
      { input: -40, expected: -40 },
      { input: 77, expected: 25 }
    ];

    testCases.forEach(({ input, expected }) => {
      it(`converts ${input}°F to ${expected}°C`, () => {
        const result = convertTemperature(input, 'F', 'C');
        expect(result).toBeCloseTo(expected, 1);
      });
    });
  });

  describe('Edge cases and validation', () => {
    it('handles decimal temperatures', () => {
      const result = convertTemperature(36.5, 'C', 'F');
      expect(result).toBeCloseTo(97.7, 1);
    });

    it('handles negative temperatures', () => {
      const result = convertTemperature(-20, 'C', 'F');
      expect(result).toBeCloseTo(-4, 1);
    });

    it('handles very small temperatures', () => {
      const result = convertTemperature(0.1, 'C', 'F');
      expect(result).toBeCloseTo(32.18, 2);
    });

    it('handles very large temperatures', () => {
      const result = convertTemperature(1000, 'C', 'F');
      expect(result).toBeCloseTo(1832, 1);
    });
  });

  describe('Error cases', () => {
    it('throws error for identical units', () => {
      expect(() => convertTemperature(100, 'C', 'C')).toThrow('Cannot convert from C to C (identical units)');
      expect(() => convertTemperature(100, 'F', 'F')).toThrow('Cannot convert from F to F (identical units)');
    });

    it('throws error for invalid units', () => {
      expect(() => convertTemperature(100, 'X', 'F')).toThrow('Invalid units. Must be C or F, got: X and F');
      expect(() => convertTemperature(100, 'C', 'Y')).toThrow('Invalid units. Must be C or F, got: C and Y');
      expect(() => convertTemperature(100, 'K', 'R')).toThrow('Invalid units. Must be C or F, got: K and R');
    });

    it('throws error for non-numeric temperature', () => {
      expect(() => convertTemperature(NaN, 'C', 'F')).toThrow('Temperature must be a valid number.');
      expect(() => convertTemperature(Infinity, 'C', 'F')).toThrow('Temperature must be a valid number.');
      expect(() => convertTemperature(-Infinity, 'C', 'F')).toThrow('Temperature must be a valid number.');
    });

    it('throws error for null/undefined temperature', () => {
      expect(() => convertTemperature(null, 'C', 'F')).toThrow('Temperature must be a valid number.');
      expect(() => convertTemperature(undefined, 'C', 'F')).toThrow('Temperature must be a valid number.');
    });
  });

  describe('Rounding precision', () => {
    it('maintains precision for calculations', () => {
      // Test that calculations maintain sufficient precision
      const result1 = convertTemperature(33.8, 'C', 'F');
      expect(result1).toBeCloseTo(92.84, 2);
      
      const result2 = convertTemperature(92.84, 'F', 'C');
      expect(result2).toBeCloseTo(33.8, 1);
    });
  });
});
