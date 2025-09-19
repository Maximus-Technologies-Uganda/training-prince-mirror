import { describe, it, expect } from 'vitest';
// Import both functions from core.js
import { formatTime, createStopwatch } from '../src/stopwatch/core.js';
describe('createStopwatch', () => {
    it('should initialize with default values', () => {
      const stopwatch = createStopwatch();
      expect(stopwatch.startTime).toBe(0);
      expect(stopwatch.laps).toEqual([]);
    });
    it('should throw an error if lap() is called before start()', () => {
      const stopwatch = createStopwatch();
    
      // We wrap the function call in an arrow function () => ...
      // to test that it throws an error.
      expect(() => stopwatch.lap()).toThrow('Stopwatch has not been started.');
    });
    it('should record lap times', () => {
      const stopwatch = createStopwatch();
      stopwatch.start();
      stopwatch.lap();
      stopwatch.lap();
      expect(stopwatch.laps.length).toBe(2);
    });
  });
describe('formatTime function', () => {
  it('should format a given number of milliseconds into mm:ss.ms format', () => {
    // 65123 milliseconds = 1 minute, 5 seconds, 123 milliseconds
    const milliseconds = 65123;
    const expectedFormat = '01:05.123';

    expect(formatTime(milliseconds)).toBe(expectedFormat);
  });
});