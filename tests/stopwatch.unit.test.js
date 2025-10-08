import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { run } from '../src/stopwatch/index.js';
import fs from 'node:fs';
import path from 'node:path';

const STATE_FILE = 'data/.stopwatch-state.json';

describe('Stopwatch CLI Unit Tests', () => {
  let consoleSpy, consoleErrorSpy;

  beforeEach(() => {
    // Clean up any existing state file
    if (fs.existsSync(STATE_FILE)) {
      fs.unlinkSync(STATE_FILE);
    }
    
    // Mock console
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Clean up
    if (fs.existsSync(STATE_FILE)) {
      fs.unlinkSync(STATE_FILE);
    }
    vi.restoreAllMocks();
  });

  describe('start command', () => {
    it('starts the stopwatch', () => {
      run(['start']);
      
      expect(consoleSpy).toHaveBeenCalledWith('Stopwatch started.');
      
      // Verify state file was created
      expect(fs.existsSync(STATE_FILE)).toBe(true);
      const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      expect(state.startTime).toBeGreaterThan(0);
      expect(state.laps).toEqual([]);
    });
  });

  describe('lap command', () => {
    it('records a lap when stopwatch is started', () => {
      // Mock Date.now to return consistent values
      const mockNow = vi.spyOn(Date, 'now');
      mockNow.mockReturnValueOnce(1000); // start time
      mockNow.mockReturnValueOnce(2000); // lap time
      
      // Start the stopwatch first
      run(['start']);
      
      run(['lap']);
      
      expect(consoleSpy).toHaveBeenCalledWith('Lap 1: 00:01.000');
      
      // Verify state was updated
      const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      expect(state.laps).toHaveLength(1);
      expect(state.laps[0]).toBe(1000);
      
      mockNow.mockRestore();
    });

    it('records multiple laps', () => {
      // Mock Date.now for consistent testing
      const mockNow = vi.spyOn(Date, 'now');
      mockNow.mockReturnValueOnce(1000); // start time
      mockNow.mockReturnValueOnce(2000); // first lap
      mockNow.mockReturnValueOnce(3000); // second lap
      
      // Start the stopwatch
      run(['start']);
      
      run(['lap']);
      run(['lap']);
      
      expect(consoleSpy).toHaveBeenCalledWith('Lap 1: 00:01.000');
      expect(consoleSpy).toHaveBeenCalledWith('Lap 2: 00:01.000');
      
      // Verify state has 2 laps
      const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      expect(state.laps).toHaveLength(2);
      
      mockNow.mockRestore();
    });

    it('errors when lap is called without starting', () => {
      run(['lap']);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Stopwatch has not been started.');
    });

    it('errors when lap is called after reset', () => {
      run(['start']);
      run(['reset']);
      run(['lap']);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Stopwatch has not been started.');
    });
  });

  describe('reset command', () => {
    it('resets the stopwatch', () => {
      // Start and add some laps
      run(['start']);
      run(['lap']);
      
      // Reset
      run(['reset']);
      
      expect(consoleSpy).toHaveBeenCalledWith('Stopwatch reset.');
      
      // Verify state is reset
      const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      expect(state.startTime).toBe(0);
      expect(state.laps).toEqual([]);
    });

    it('resets even when not started', () => {
      run(['reset']);
      
      expect(consoleSpy).toHaveBeenCalledWith('Stopwatch reset.');
    });
  });

  describe('help and error cases', () => {
    it('shows help when no command provided', () => {
      run([]);
      
      expect(consoleSpy).toHaveBeenCalledWith('--- Stopwatch CLI ---');
      expect(consoleSpy).toHaveBeenCalledWith('Usage:');
    });

    it('shows help for unknown command', () => {
      run(['unknown']);
      
      expect(consoleSpy).toHaveBeenCalledWith('--- Stopwatch CLI ---');
      expect(consoleSpy).toHaveBeenCalledWith('Usage:');
    });
  });

  describe('negative test cases', () => {
    it('handles double start (should not error)', () => {
      run(['start']);
      run(['start']); // Second start should not error
      
      expect(consoleSpy).toHaveBeenCalledWith('Stopwatch started.');
      expect(consoleSpy).toHaveBeenCalledTimes(2);
    });

    it('handles lap before start with proper error', () => {
      run(['lap']);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Stopwatch has not been started.');
    });

    it('handles reset before start (should not error)', () => {
      run(['reset']);
      
      expect(consoleSpy).toHaveBeenCalledWith('Stopwatch reset.');
    });

    it('handles corrupted state file gracefully', () => {
      // Create corrupted state file
      fs.writeFileSync(STATE_FILE, 'invalid json');
      
      // Should handle gracefully and start fresh
      run(['start']);
      
      expect(consoleSpy).toHaveBeenCalledWith('Stopwatch started.');
    });

    it('handles missing data directory', () => {
      // Remove data directory if it exists
      if (fs.existsSync('data')) {
        fs.rmSync('data', { recursive: true });
      }
      
      // Should create directory and work
      run(['start']);
      
      expect(consoleSpy).toHaveBeenCalledWith('Stopwatch started.');
      expect(fs.existsSync(STATE_FILE)).toBe(true);
    });
  });

  describe('state persistence', () => {
    it('persists state between commands', () => {
      // Start stopwatch
      run(['start']);
      
      // Verify state file exists
      expect(fs.existsSync(STATE_FILE)).toBe(true);
      
      // Add a lap
      run(['lap']);
      
      // Verify state was updated
      const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      expect(state.laps).toHaveLength(1);
    });

    it('reads existing state on startup', () => {
      // Create a state file manually
      const initialState = { startTime: 1000, laps: [500] };
      fs.writeFileSync(STATE_FILE, JSON.stringify(initialState));
      
      // Add another lap
      run(['lap']);
      
      // Verify state was updated correctly
      const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      expect(state.laps).toHaveLength(2);
      expect(state.laps[0]).toBe(500); // original lap
    });
  });
});
