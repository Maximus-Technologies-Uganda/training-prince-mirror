import { describe, it, expect } from 'vitest';
import { convertTemperature } from '../src/temp-converter/core.js';

describe('temperature converter more cases', () => {
  it('C to F should handle negative temperatures', () => {
    expect(convertTemperature(-40, 'C', 'F')).toBe(-40);
  });

  it('F to C should handle decimals', () => {
    const r = convertTemperature(68, 'F', 'C');
    expect(Math.round(r)).toBe(20);
  });
});
