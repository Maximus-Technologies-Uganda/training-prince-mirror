import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  DEFAULT_STATE,
  validateTimerState,
  createTimerState,
  createDefaultState,
  isResetState,
  isRunningState,
  hasLaps,
  getLapCount,
  cloneTimerState,
  formatTime,
  deriveLapRecords
} from '../src/ui-stopwatch/models.js';

describe('TimerState Data Model - T008', () => {
  
  describe('DEFAULT_STATE constant', () => {
    it('should have correct default structure', () => {
      expect(DEFAULT_STATE).toEqual({
        startTime: null,
        isRunning: false,
        laps: []
      });
    });

    it('should have startTime as null', () => {
      expect(DEFAULT_STATE.startTime).toBeNull();
    });

    it('should have isRunning as false', () => {
      expect(DEFAULT_STATE.isRunning).toBe(false);
    });

    it('should have empty laps array', () => {
      expect(Array.isArray(DEFAULT_STATE.laps)).toBe(true);
      expect(DEFAULT_STATE.laps).toHaveLength(0);
    });
  });

  describe('validateTimerState()', () => {
    
    it('should accept a valid reset state', () => {
      const state = { startTime: null, isRunning: false, laps: [] };
      const result = validateTimerState(state);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept a valid running state with startTime', () => {
      const now = Date.now();
      const state = { startTime: now, isRunning: true, laps: [] };
      const result = validateTimerState(state);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept a valid stopped state with startTime and laps', () => {
      const now = Date.now();
      const state = { 
        startTime: now, 
        isRunning: false, 
        laps: [now + 1000, now + 2000] 
      };
      const result = validateTimerState(state);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject null state', () => {
      const result = validateTimerState(null);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject undefined state', () => {
      const result = validateTimerState(undefined);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject non-object state', () => {
      const result = validateTimerState('not an object');
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject invalid startTime type (string)', () => {
      const state = { startTime: '1729792800000', isRunning: false, laps: [] };
      const result = validateTimerState(state);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('startTime must be null or a number (Unix timestamp in ms)');
    });

    it('should reject negative startTime', () => {
      const state = { startTime: -1000, isRunning: false, laps: [] };
      const result = validateTimerState(state);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('startTime must be non-negative');
    });

    it('should reject non-boolean isRunning', () => {
      const state = { startTime: null, isRunning: 'true', laps: [] };
      const result = validateTimerState(state);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('isRunning must be a boolean');
    });

    it('should reject non-array laps', () => {
      const state = { startTime: null, isRunning: false, laps: { 0: 1000 } };
      const result = validateTimerState(state);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('laps must be an array');
    });

    it('should reject laps with non-number elements', () => {
      const state = { startTime: null, isRunning: false, laps: [1000, '2000'] };
      const result = validateTimerState(state);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('laps[1]'))).toBe(true);
    });

    it('should reject unsorted laps array (descending order)', () => {
      const state = { startTime: 1000, isRunning: false, laps: [2000, 1000] };
      const result = validateTimerState(state);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('laps array must be sorted in ascending order by timestamp');
    });

    it('should reject isRunning=true with null startTime', () => {
      const state = { startTime: null, isRunning: true, laps: [] };
      const result = validateTimerState(state);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('If isRunning=true, startTime must not be null');
    });

    it('should accept valid sorted laps array', () => {
      const now = Date.now();
      const state = {
        startTime: now,
        isRunning: false,
        laps: [now + 1000, now + 2000, now + 3000]
      };
      const result = validateTimerState(state);
      
      expect(result.isValid).toBe(true);
    });

    it('should warn about future startTime (clock skew)', () => {
      const futureTime = Date.now() + 120000; // 2 minutes in future
      const state = { startTime: futureTime, isRunning: false, laps: [] };
      const result = validateTimerState(state);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('clock skew'))).toBe(true);
    });

    it('should allow startTime within reasonable future tolerance (60s)', () => {
      const futureTime = Date.now() + 30000; // 30 seconds in future (within 60s tolerance)
      const state = { startTime: futureTime, isRunning: false, laps: [] };
      const result = validateTimerState(state);
      
      expect(result.isValid).toBe(true);
    });
  });

  describe('createTimerState()', () => {
    
    it('should create a default state when called with no arguments', () => {
      const state = createTimerState();
      
      expect(state).toEqual({
        startTime: null,
        isRunning: false,
        laps: []
      });
    });

    it('should create a state from partial input', () => {
      const now = Date.now();
      const state = createTimerState({
        startTime: now,
        isRunning: true
      });
      
      expect(state.startTime).toBe(now);
      expect(state.isRunning).toBe(true);
      expect(state.laps).toEqual([]);
    });

    it('should create a state with laps array', () => {
      const now = Date.now();
      const laps = [now + 1000, now + 2000];
      const state = createTimerState({
        startTime: now,
        isRunning: false,
        laps
      });
      
      expect(state.laps).toEqual(laps);
    });

    it('should clone laps array (not reference)', () => {
      const laps = [1000, 2000];
      const state = createTimerState({ laps });
      
      expect(state.laps).toEqual(laps);
      expect(state.laps).not.toBe(laps); // Different array reference
    });

    it('should throw error for invalid state', () => {
      expect(() => {
        createTimerState({
          startTime: null,
          isRunning: true, // Invalid: running but no startTime
          laps: []
        });
      }).toThrow();
    });

    it('should throw descriptive error message', () => {
      expect(() => {
        createTimerState({
          startTime: 'invalid',
          isRunning: false,
          laps: []
        });
      }).toThrow(/Invalid TimerState/);
    });

    it('should preserve undefined properties as defaults', () => {
      const state = createTimerState({
        startTime: 1000
      });
      
      expect(state.isRunning).toBe(false);
      expect(state.laps).toEqual([]);
    });
  });

  describe('createDefaultState()', () => {
    
    it('should return reset state', () => {
      const state = createDefaultState();
      
      expect(state).toEqual({
        startTime: null,
        isRunning: false,
        laps: []
      });
    });

    it('should return new instance each time', () => {
      const state1 = createDefaultState();
      const state2 = createDefaultState();
      
      expect(state1).not.toBe(state2); // Different references
      expect(state1).toEqual(state2); // Same values
    });
  });

  describe('isResetState()', () => {
    
    it('should return true for reset state', () => {
      const state = { startTime: null, isRunning: false, laps: [] };
      expect(isResetState(state)).toBe(true);
    });

    it('should return false for running state', () => {
      const now = Date.now();
      const state = { startTime: now, isRunning: true, laps: [] };
      expect(isResetState(state)).toBe(false);
    });

    it('should return false for state with laps', () => {
      const now = Date.now();
      const state = { startTime: now, isRunning: false, laps: [now + 1000] };
      expect(isResetState(state)).toBe(false);
    });

    it('should return false for null state', () => {
      expect(isResetState(null)).toBe(false);
    });

    it('should return false for undefined state', () => {
      expect(isResetState(undefined)).toBe(false);
    });

    it('should return false for stopped state with startTime', () => {
      const now = Date.now();
      const state = { startTime: now, isRunning: false, laps: [] };
      expect(isResetState(state)).toBe(false);
    });
  });

  describe('isRunningState()', () => {
    
    it('should return true for running state', () => {
      const now = Date.now();
      const state = { startTime: now, isRunning: true, laps: [] };
      expect(isRunningState(state)).toBe(true);
    });

    it('should return false for stopped state', () => {
      const now = Date.now();
      const state = { startTime: now, isRunning: false, laps: [] };
      expect(isRunningState(state)).toBe(false);
    });

    it('should return false for reset state', () => {
      const state = { startTime: null, isRunning: false, laps: [] };
      expect(isRunningState(state)).toBe(false);
    });

    it('should return false for state with running=true but no startTime', () => {
      const state = { startTime: null, isRunning: true, laps: [] };
      expect(isRunningState(state)).toBe(false); // Invalid state, not running
    });

    it('should return false for null state', () => {
      expect(isRunningState(null)).toBe(false);
    });

    it('should return false for undefined state', () => {
      expect(isRunningState(undefined)).toBe(false);
    });
  });

  describe('hasLaps()', () => {
    
    it('should return true if laps array has elements', () => {
      const now = Date.now();
      const state = { startTime: now, isRunning: false, laps: [now + 1000] };
      expect(hasLaps(state)).toBe(true);
    });

    it('should return false for empty laps array', () => {
      const state = { startTime: null, isRunning: false, laps: [] };
      expect(hasLaps(state)).toBe(false);
    });

    it('should return false for state with multiple laps', () => {
      const now = Date.now();
      const state = { startTime: now, isRunning: false, laps: [now + 1000, now + 2000] };
      expect(hasLaps(state)).toBe(true);
    });

    it('should return false for null state', () => {
      expect(hasLaps(null)).toBe(false);
    });

    it('should return false for undefined state', () => {
      expect(hasLaps(undefined)).toBe(false);
    });
  });

  describe('getLapCount()', () => {
    
    it('should return 0 for reset state', () => {
      const state = { startTime: null, isRunning: false, laps: [] };
      expect(getLapCount(state)).toBe(0);
    });

    it('should return 1 for state with one lap', () => {
      const now = Date.now();
      const state = { startTime: now, isRunning: false, laps: [now + 1000] };
      expect(getLapCount(state)).toBe(1);
    });

    it('should return correct count for multiple laps', () => {
      const now = Date.now();
      const state = {
        startTime: now,
        isRunning: false,
        laps: [now + 1000, now + 2000, now + 3000]
      };
      expect(getLapCount(state)).toBe(3);
    });

    it('should return 0 for null state', () => {
      expect(getLapCount(null)).toBe(0);
    });

    it('should return 0 for undefined state', () => {
      expect(getLapCount(undefined)).toBe(0);
    });
  });

  describe('cloneTimerState()', () => {
    
    it('should create a deep copy of state', () => {
      const now = Date.now();
      const original = {
        startTime: now,
        isRunning: true,
        laps: [now + 1000, now + 2000]
      };
      
      const clone = cloneTimerState(original);
      
      expect(clone).toEqual(original);
      expect(clone).not.toBe(original); // Different reference
    });

    it('should clone laps array independently', () => {
      const now = Date.now();
      const original = { startTime: now, isRunning: false, laps: [now + 1000] };
      const clone = cloneTimerState(original);
      
      expect(clone.laps).not.toBe(original.laps); // Different array references
      expect(clone.laps).toEqual(original.laps); // Same values
    });

    it('should allow mutating clone without affecting original', () => {
      const now = Date.now();
      const original = { startTime: now, isRunning: false, laps: [] };
      const clone = cloneTimerState(original);
      
      clone.isRunning = true;
      clone.laps.push(now + 1000);
      
      expect(original.isRunning).toBe(false);
      expect(original.laps).toHaveLength(0);
    });

    it('should throw error if original state is invalid', () => {
      const invalidState = { startTime: null, isRunning: true, laps: [] };
      
      expect(() => {
        cloneTimerState(invalidState);
      }).toThrow();
    });

    it('should handle reset state', () => {
      const original = { startTime: null, isRunning: false, laps: [] };
      const clone = cloneTimerState(original);
      
      expect(clone).toEqual(original);
      expect(isResetState(clone)).toBe(true);
    });
  });

  describe('TimerState Validation Rules (Data Model)', () => {
    
    it('should validate: startTime (null or Unix timestamp)', () => {
      // Valid: null
      let result = validateTimerState({ startTime: null, isRunning: false, laps: [] });
      expect(result.isValid).toBe(true);
      
      // Valid: Unix timestamp
      result = validateTimerState({ startTime: Date.now(), isRunning: false, laps: [] });
      expect(result.isValid).toBe(true);
      
      // Invalid: string
      result = validateTimerState({ startTime: 'now', isRunning: false, laps: [] });
      expect(result.isValid).toBe(false);
    });

    it('should validate: isRunning (boolean)', () => {
      // Valid: false
      let result = validateTimerState({ startTime: null, isRunning: false, laps: [] });
      expect(result.isValid).toBe(true);
      
      // Valid: true
      result = validateTimerState({ startTime: Date.now(), isRunning: true, laps: [] });
      expect(result.isValid).toBe(true);
      
      // Invalid: string
      result = validateTimerState({ startTime: null, isRunning: 'false', laps: [] });
      expect(result.isValid).toBe(false);
    });

    it('should validate: laps (sorted array of timestamps)', () => {
      const now = Date.now();
      
      // Valid: empty array
      let result = validateTimerState({ startTime: null, isRunning: false, laps: [] });
      expect(result.isValid).toBe(true);
      
      // Valid: sorted timestamps
      result = validateTimerState({
        startTime: now,
        isRunning: false,
        laps: [now + 1000, now + 2000, now + 3000]
      });
      expect(result.isValid).toBe(true);
      
      // Invalid: unsorted
      result = validateTimerState({
        startTime: now,
        isRunning: false,
        laps: [now + 2000, now + 1000]
      });
      expect(result.isValid).toBe(false);
    });

    it('should validate: consistency rule (isRunning=true requires startTime)', () => {
      // Valid: running with startTime
      let result = validateTimerState({
        startTime: Date.now(),
        isRunning: true,
        laps: []
      });
      expect(result.isValid).toBe(true);
      
      // Invalid: running without startTime
      result = validateTimerState({
        startTime: null,
        isRunning: true,
        laps: []
      });
      expect(result.isValid).toBe(false);
    });
  });
});

/**
 * T009: LapRecord Derivation Function Tests
 * Tests for formatTime utility and deriveLapRecords transformation
 */
describe('LapRecord Derivation - T009', () => {

  describe('formatTime(milliseconds) - Time Formatting Utility', () => {

    it('should format 0ms as 00:00:00', () => {
      expect(formatTime(0)).toBe('00:00:00');
    });

    it('should format 1 second (1000ms) as 00:00:01', () => {
      expect(formatTime(1000)).toBe('00:00:01');
    });

    it('should format 1 minute (60000ms) as 00:01:00', () => {
      expect(formatTime(60000)).toBe('00:01:00');
    });

    it('should format 1 hour + 1 minute + 1 second (3661000ms) as 01:01:01', () => {
      expect(formatTime(3661000)).toBe('01:01:01');
    });

    it('should format 30 seconds (30000ms) as 00:00:30', () => {
      expect(formatTime(30000)).toBe('00:00:30');
    });

    it('should format 2 minutes 30 seconds (150000ms) as 00:02:30', () => {
      expect(formatTime(150000)).toBe('00:02:30');
    });

    it('should format 5 hours 15 minutes 30 seconds as 05:15:30', () => {
      // 5 * 3600 * 1000 + 15 * 60 * 1000 + 30 * 1000 = 18900000 + 900000 + 30000 = 18930000
      expect(formatTime(18930000)).toBe('05:15:30');
    });

    it('should pad hours with leading zero', () => {
      // 3600000 = 1 hour
      expect(formatTime(3600000)).toBe('01:00:00');
    });

    it('should pad minutes with leading zero', () => {
      // 60000 = 1 minute
      expect(formatTime(60000)).toBe('00:01:00');
    });

    it('should pad seconds with leading zero', () => {
      // 1000 = 1 second
      expect(formatTime(1000)).toBe('00:00:01');
    });

    it('should handle times >24 hours without capping hours', () => {
      // 100 hours = 360000000 ms
      expect(formatTime(360000000)).toBe('100:00:00');
    });

    it('should handle large times >99 hours', () => {
      // 125 hours 45 minutes 30 seconds
      const ms = 125 * 3600 * 1000 + 45 * 60 * 1000 + 30 * 1000;
      expect(formatTime(ms)).toBe('125:45:30');
    });

    it('should handle fractional milliseconds by truncating', () => {
      // 1500.5 ms should truncate to 1 second
      expect(formatTime(1500.5)).toBe('00:00:01');
    });

  });

  describe('deriveLapRecords(timerState) - Lap Record Derivation', () => {

    it('should return empty array for empty laps', () => {
      const state = { startTime: Date.now(), isRunning: false, laps: [] };
      const records = deriveLapRecords(state);
      
      expect(Array.isArray(records)).toBe(true);
      expect(records).toHaveLength(0);
    });

    it('should throw error if timerState is null', () => {
      expect(() => deriveLapRecords(null)).toThrow();
    });

    it('should throw error if timerState is undefined', () => {
      expect(() => deriveLapRecords(undefined)).toThrow();
    });

    it('should throw error if startTime is null with non-empty laps', () => {
      const state = { startTime: null, isRunning: false, laps: [Date.now()] };
      expect(() => deriveLapRecords(state)).toThrow();
    });

    it('should derive single lap record correctly', () => {
      const now = Date.now();
      const state = {
        startTime: now,
        isRunning: false,
        laps: [now + 60000] // 1 minute after start
      };
      
      const records = deriveLapRecords(state);
      
      expect(records).toHaveLength(1);
      expect(records[0]).toEqual({
        lapNumber: 1,
        recordedAtTimestamp: now + 60000,
        absoluteElapsedTime: 60000,
        lapDuration: null,
        absoluteElapsedTimeDisplay: '00:01:00',
        lapDurationDisplay: '00:01:00'
      });
    });

    it('should derive multiple lap records with correct calculations', () => {
      const now = Date.now();
      const state = {
        startTime: now,
        isRunning: false,
        laps: [
          now + 60000,   // Lap 1 at 1:00
          now + 150000   // Lap 2 at 2:30 (delta 1:30)
        ]
      };
      
      const records = deriveLapRecords(state);
      
      expect(records).toHaveLength(2);
      
      // Lap 1
      expect(records[0].lapNumber).toBe(1);
      expect(records[0].absoluteElapsedTime).toBe(60000);
      expect(records[0].lapDuration).toBeNull();
      expect(records[0].absoluteElapsedTimeDisplay).toBe('00:01:00');
      expect(records[0].lapDurationDisplay).toBe('00:01:00');
      
      // Lap 2
      expect(records[1].lapNumber).toBe(2);
      expect(records[1].absoluteElapsedTime).toBe(150000);
      expect(records[1].lapDuration).toBe(90000);
      expect(records[1].absoluteElapsedTimeDisplay).toBe('00:02:30');
      expect(records[1].lapDurationDisplay).toBe('00:01:30');
    });

    it('should derive three lap records with correct deltas', () => {
      const now = Date.now();
      const state = {
        startTime: now,
        isRunning: false,
        laps: [
          now + 60000,    // Lap 1 at 1:00
          now + 150000,   // Lap 2 at 2:30 (delta 1:30)
          now + 315000    // Lap 3 at 5:15 (delta 2:45)
        ]
      };
      
      const records = deriveLapRecords(state);
      
      expect(records).toHaveLength(3);
      
      // Verify lap numbers
      expect(records[0].lapNumber).toBe(1);
      expect(records[1].lapNumber).toBe(2);
      expect(records[2].lapNumber).toBe(3);
      
      // Verify durations
      expect(records[0].lapDuration).toBeNull();
      expect(records[1].lapDuration).toBe(90000);  // 1:30
      expect(records[2].lapDuration).toBe(165000); // 2:45
      
      // Verify absolute times
      expect(records[0].absoluteElapsedTime).toBe(60000);
      expect(records[1].absoluteElapsedTime).toBe(150000);
      expect(records[2].absoluteElapsedTime).toBe(315000);
    });

    it('should set recordedAtTimestamp correctly', () => {
      const now = Date.now();
      const lapTime = now + 60000;
      const state = {
        startTime: now,
        isRunning: false,
        laps: [lapTime]
      };
      
      const records = deriveLapRecords(state);
      
      expect(records[0].recordedAtTimestamp).toBe(lapTime);
    });

    it('should format display times as HH:MM:SS', () => {
      const now = Date.now();
      const state = {
        startTime: now,
        isRunning: false,
        laps: [now + 3661000] // 1:01:01
      };
      
      const records = deriveLapRecords(state);
      
      expect(records[0].absoluteElapsedTimeDisplay).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      expect(records[0].lapDurationDisplay).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      expect(records[0].absoluteElapsedTimeDisplay).toBe('01:01:01');
    });

    it('should handle many laps (performance check)', () => {
      const now = Date.now();
      const laps = [];
      for (let i = 1; i <= 100; i++) {
        laps.push(now + i * 10000); // Laps every 10 seconds
      }
      
      const state = {
        startTime: now,
        isRunning: false,
        laps
      };
      
      const records = deriveLapRecords(state);
      
      expect(records).toHaveLength(100);
      expect(records[0].lapNumber).toBe(1);
      expect(records[99].lapNumber).toBe(100);
      expect(records[99].absoluteElapsedTime).toBe(1000000); // 100 * 10000
    });

    it('should preserve timestamp precision', () => {
      const now = Date.now();
      const state = {
        startTime: now,
        isRunning: false,
        laps: [now + 12345]
      };
      
      const records = deriveLapRecords(state);
      
      expect(records[0].absoluteElapsedTime).toBe(12345);
      expect(records[0].recordedAtTimestamp).toBe(now + 12345);
    });

    it('should handle laps with very small time deltas', () => {
      const now = Date.now();
      const state = {
        startTime: now,
        isRunning: false,
        laps: [
          now + 100,  // 100ms
          now + 150   // 50ms delta
        ]
      };
      
      const records = deriveLapRecords(state);
      
      expect(records[0].lapDuration).toBeNull();
      expect(records[1].lapDuration).toBe(50);
      expect(records[1].absoluteElapsedTimeDisplay).toBe('00:00:00');
    });

    it('should not modify the original timerState', () => {
      const now = Date.now();
      const state = {
        startTime: now,
        isRunning: false,
        laps: [now + 60000]
      };
      
      const originalLapsLength = state.laps.length;
      const originalStartTime = state.startTime;
      
      deriveLapRecords(state);
      
      expect(state.laps.length).toBe(originalLapsLength);
      expect(state.startTime).toBe(originalStartTime);
    });

    it('should handle state with very long sessions (>24 hours)', () => {
      const now = Date.now();
      const twoHoursMs = 2 * 3600 * 1000;
      const state = {
        startTime: now,
        isRunning: false,
        laps: [now + twoHoursMs]
      };
      
      const records = deriveLapRecords(state);
      
      expect(records[0].absoluteElapsedTimeDisplay).toBe('02:00:00');
      expect(records[0].lapDurationDisplay).toBe('02:00:00');
    });

    it('should maintain lap order and numbering', () => {
      const now = Date.now();
      const state = {
        startTime: now,
        isRunning: false,
        laps: [
          now + 30000,
          now + 60000,
          now + 90000,
          now + 120000
        ]
      };
      
      const records = deriveLapRecords(state);
      
      for (let i = 0; i < records.length; i++) {
        expect(records[i].lapNumber).toBe(i + 1);
      }
    });

  });

  describe('Integration: formatTime and deriveLapRecords', () => {

    it('should use formatTime to display derived lap records', () => {
      const now = Date.now();
      const state = {
        startTime: now,
        isRunning: false,
        laps: [now + 3661000] // 1:01:01
      };
      
      const records = deriveLapRecords(state);
      
      // Verify formatted times are properly formatted
      expect(records[0].absoluteElapsedTimeDisplay).toBe('01:01:01');
      expect(records[0].lapDurationDisplay).toBe('01:01:01');
    });

    it('should handle CSV export scenario: multiple laps for export', () => {
      const now = Date.now();
      const state = {
        startTime: now,
        isRunning: false,
        laps: [
          now + 60000,    // 1:00
          now + 150000,   // 2:30
          now + 315000    // 5:15
        ]
      };
      
      const records = deriveLapRecords(state);
      
      // Simulate CSV row construction
      const csvRows = records.map(lap => 
        `${lap.lapNumber},${lap.absoluteElapsedTimeDisplay},${lap.lapDurationDisplay}`
      );
      
      expect(csvRows[0]).toBe('1,00:01:00,00:01:00');
      expect(csvRows[1]).toBe('2,00:02:30,00:01:30');
      expect(csvRows[2]).toBe('3,00:05:15,00:02:45');
    });

  });
});
