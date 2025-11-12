/**
 * Unit Tests: Converter Service (T017)
 * 
 * Purpose: Test temperature conversion logic in isolation using Vitest
 * Validates all conversion formulas and edge cases
 */

import { describe, it, expect } from 'vitest';
import { convertTemperature } from '../../src/services/converter.js';

describe('convertTemperature - Unit Tests (T017)', () => {
  describe('Basic Conversions', () => {
    /**
     * Test: Convert 32°F to 0°C
     */
    it('converts 32F to 0C', () => {
      expect(convertTemperature(32, 'F', 'C')).toBe(0);
    });

    /**
     * Test: Convert 0°C to 32°F
     */
    it('converts 0C to 32F', () => {
      expect(convertTemperature(0, 'C', 'F')).toBe(32);
    });

    /**
     * Test: Convert 100°C to 212°F
     */
    it('converts 100C to 212F', () => {
      expect(convertTemperature(100, 'C', 'F')).toBe(212);
    });

    /**
     * Test: Convert 212°F to 100°C
     */
    it('converts 212F to 100C', () => {
      expect(convertTemperature(212, 'F', 'C')).toBe(100);
    });
  });

  describe('Identity Conversions', () => {
    /**
     * Test: Identity conversion C→C returns same value
     */
    it('returns same value for identity conversion (C→C)', () => {
      expect(convertTemperature(100, 'C', 'C')).toBe(100);
    });

    /**
     * Test: Identity conversion F→F returns same value
     */
    it('returns same value for identity conversion (F→F)', () => {
      expect(convertTemperature(100, 'F', 'F')).toBe(100);
    });

    /**
     * Test: Identity conversion with negative value
     */
    it('handles identity conversion with negative value', () => {
      expect(convertTemperature(-40, 'C', 'C')).toBe(-40);
    });
  });

  describe('Negative Values & Special Points', () => {
    /**
     * Test: -40°F = -40°C (special point)
     */
    it('converts -40F to -40C (special point)', () => {
      expect(convertTemperature(-40, 'F', 'C')).toBe(-40);
    });

    /**
     * Test: Convert negative Celsius
     */
    it('converts negative Celsius to Fahrenheit', () => {
      expect(convertTemperature(-273.15, 'C', 'F')).toBeCloseTo(-459.67, 2);
    });

    /**
     * Test: Convert negative Fahrenheit
     */
    it('converts negative Fahrenheit to Celsius', () => {
      expect(convertTemperature(-459.67, 'F', 'C')).toBeCloseTo(-273.15, 2);
    });
  });

  describe('Decimal Values', () => {
    /**
     * Test: Convert 98.6°F (body temperature)
     */
    it('converts 98.6F to ~37C', () => {
      expect(convertTemperature(98.6, 'F', 'C')).toBeCloseTo(37, 1);
    });

    /**
     * Test: Convert decimal Celsius
     */
    it('converts decimal Celsius to Fahrenheit', () => {
      expect(convertTemperature(36.5, 'C', 'F')).toBeCloseTo(97.7, 1);
    });

    /**
     * Test: Very small decimal values
     */
    it('handles very small decimal values', () => {
      const result = convertTemperature(0.1, 'C', 'F');
      expect(result).toBeCloseTo(32.18, 2);
    });

    /**
     * Test: Very large values
     */
    it('handles very large temperature values', () => {
      const result = convertTemperature(1000, 'C', 'F');
      expect(result).toBeCloseTo(1832, 0);
    });
  });

  describe('Zero Point', () => {
    /**
     * Test: Convert 0°C to Fahrenheit
     */
    it('converts 0C to 32F', () => {
      expect(convertTemperature(0, 'C', 'F')).toBe(32);
    });

    /**
     * Test: Convert 0°F to Celsius
     */
    it('converts 0F to ~-17.78C', () => {
      expect(convertTemperature(0, 'F', 'C')).toBeCloseTo(-17.78, 2);
    });
  });
});

