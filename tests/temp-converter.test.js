import { describe, it, expect } from 'vitest';
// This will fail because the function doesn't exist yet
import { convertTemperature } from '../src/temp-converter/core.js';

describe('temperature converter logic', () => {
  it('should correctly convert Celsius to Fahrenheit', () => {
    // Test freezing point
    expect(convertTemperature(0, 'C', 'F')).toBe(32);
    // Test boiling point
    expect(convertTemperature(100, 'C', 'F')).toBe(212);
  });
  it('should throw an error for invalid or identical units', () => {
    // Test for an unknown unit like Kelvin
    expect(() => convertTemperature(100, 'C', 'K')).toThrow('Invalid units provided for conversion.');
  
    // Test for identical units
    expect(() => convertTemperature(100, 'F', 'F')).toThrow('Invalid units provided for conversion.');
  });
  it('should correctly convert Fahrenheit to Celsius', () => {
    // Test freezing point
    expect(convertTemperature(32, 'F', 'C')).toBe(0);
    // Test boiling point
    expect(convertTemperature(212, 'F', 'C')).toBe(100);
  });
});