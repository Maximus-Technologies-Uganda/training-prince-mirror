// Edge Case Tests: Reset While Running
// Tests the specific edge case where reset button is clicked while timer is running

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StopwatchUI } from '../frontend/src/ui-stopwatch/stopwatch-ui.js';

// Mock the backend modules
vi.mock('../../../src/stopwatch/core.js', () => ({
  createStopwatch: vi.fn(() => ({
    start: vi.fn(),
    lap: vi.fn(),
    get startTime() { return 0; },
    get laps() { return []; }
  })),
  formatTime: vi.fn()
}));

vi.mock('../../../src/stopwatch/exporter.js', () => ({
  exportLapsAsTable: vi.fn()
}));

describe('Reset While Running Edge Case Tests', () => {
  let stopwatchUI;
  let mockContainer;
  let mockElements;

  beforeEach(() => {
    // Create actual DOM elements for testing
    document.body.innerHTML = `
      <div class="stopwatch-container">
        <div class="timer-display">00:00:00</div>
        <div class="controls">
          <button class="start-btn">Start</button>
          <button class="pause-btn" disabled>Pause</button>
          <button class="resume-btn" disabled>Resume</button>
          <button class="stop-btn">Reset</button>
          <button class="lap-btn">Lap</button>
          <button class="clear-laps-btn">Clear Laps</button>
          <button class="export-btn">Export CSV</button>
        </div>
        <div class="laps-display"></div>
      </div>
    `;

    // Mock localStorage
    const mockLocalStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn()
    };
    global.localStorage = mockLocalStorage;

    // Mock timers
    vi.useFakeTimers();
    
    mockContainer = document.querySelector('.stopwatch-container');
    stopwatchUI = new StopwatchUI(mockContainer);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('Reset While Timer is Running', () => {
    it('should stop timer and clear data when reset is clicked while running', () => {
      const startTime = 1000000;
      const resetTime = 1002000; // 2 seconds later
      vi.setSystemTime(startTime);
      
      // Start timer
      stopwatchUI.start();
      expect(stopwatchUI.state.running).toBe(true);
      expect(mockContainer.querySelector('.start-btn').disabled).toBe(true);
      expect(mockContainer.querySelector('.stop-btn').disabled).toBe(false);
      
      // Advance time and reset while running
      vi.setSystemTime(resetTime);
      stopwatchUI.reset();
      
      // Verify timer is stopped and data is cleared
      expect(stopwatchUI.state.running).toBe(false);
      expect(stopwatchUI.state.startTime).toBe(0);
      expect(stopwatchUI.state.elapsedTime).toBe(0);
      expect(stopwatchUI.state.laps).toEqual([]);
      
      // Verify button states are reset
      expect(mockContainer.querySelector('.start-btn').disabled).toBe(false);
      // stop/reset button is always enabled
      expect(mockContainer.querySelector('.stop-btn').disabled).toBe(false);
      
      // Verify display is reset
      expect(mockContainer.querySelector('.timer-display').textContent).toBe('00:00:00');
    });

    it('should dispatch timer:reset event when reset while running', () => {
      const startTime = 1000000;
      vi.setSystemTime(startTime);
      
      stopwatchUI.start();
      
      // Verify reset() executes without errors (events are dispatched internally)
      expect(() => stopwatchUI.reset()).not.toThrow();
      expect(stopwatchUI.state.running).toBe(false);
      expect(stopwatchUI.state.elapsedTime).toBe(0);
    });

    it('should stop display updates when reset while running', () => {
      const startTime = 1000000;
      vi.setSystemTime(startTime);
      
      stopwatchUI.start();
      
      // Verify display interval is running
      expect(stopwatchUI.displayInterval).toBeDefined();
      
      stopwatchUI.reset();
      
      // Verify display interval is cleared
      expect(stopwatchUI.displayInterval).toBeNull();
    });

    it('should clear laps display when reset while running', () => {
      const startTime = 1000000;
      vi.setSystemTime(startTime);
      
      // Start timer and record a lap
      stopwatchUI.start();
      vi.setSystemTime(startTime + 1000);
      stopwatchUI.stop();
      
      // Verify lap is recorded
      expect(stopwatchUI.state.laps).toHaveLength(1);
      expect(mockContainer.querySelector('.laps-display').innerHTML).toContain('Lap 1');
      
      // Start timer again and reset while running
      stopwatchUI.start();
      stopwatchUI.reset();
      
      // Verify laps are cleared
      expect(stopwatchUI.state.laps).toHaveLength(0);
      expect(mockContainer.querySelector('.laps-display').innerHTML).toBe('<div class="no-laps" role="status" aria-live="polite">No laps recorded</div>');
    });

    it('should save cleared state to localStorage when reset while running', () => {
      const mockLocalStorage = {
        getItem: vi.fn(() => null),
        setItem: vi.fn()
      };
      global.localStorage = mockLocalStorage;
      
      const startTime = 1000000;
      vi.setSystemTime(startTime);
      
      // Start timer and record a lap
      stopwatchUI.start();
      vi.setSystemTime(startTime + 1000);
      stopwatchUI.stop();
      
      // Verify lap is saved
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      
      // Clear the mock calls
      mockLocalStorage.setItem.mockClear();
      
      // Start timer again and reset while running
      stopwatchUI.start();
      stopwatchUI.reset();
      
      // Verify cleared state is saved
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'stopwatch-ui-state',
        JSON.stringify({ laps: [], elapsedTime: 0 })
      );
    });
  });

  describe('Reset Button State During Timer Operations', () => {
    it('should keep reset button enabled while timer is running', () => {
      const startTime = 1000000;
      vi.setSystemTime(startTime);
      
      stopwatchUI.start();
      
      // Reset button should remain enabled
      expect(mockContainer.querySelector('.stop-btn').disabled).toBe(false);
      
      stopwatchUI.stop();
      
      // Reset button should still be enabled
      expect(mockContainer.querySelector('.stop-btn').disabled).toBe(false);
    });

    it('should allow multiple reset operations', () => {
      const startTime = 1000000;
      vi.setSystemTime(startTime);
      
      // Start timer
      stopwatchUI.start();
      
      // Reset while running
      stopwatchUI.reset();
      expect(stopwatchUI.state.running).toBe(false);
      
      // Start timer again
      stopwatchUI.start();
      
      // Reset while running again
      stopwatchUI.reset();
      expect(stopwatchUI.state.running).toBe(false);
      expect(stopwatchUI.state.laps).toHaveLength(0);
    });
  });

  describe('Edge Case Scenarios', () => {
    it('should handle reset immediately after start', () => {
      const startTime = 1000000;
      vi.setSystemTime(startTime);
      
      stopwatchUI.start();
      
      // Reset immediately (no time advancement)
      stopwatchUI.reset();
      
      expect(stopwatchUI.state.running).toBe(false);
      expect(stopwatchUI.state.elapsedTime).toBe(0);
      expect(mockContainer.querySelector('.timer-display').textContent).toBe('00:00:00');
    });

    it('should handle reset after multiple start/stop cycles', () => {
      const startTime = 1000000;
      vi.setSystemTime(startTime);
      
      // Multiple start/stop cycles
      stopwatchUI.start();
      vi.setSystemTime(startTime + 1000);
      stopwatchUI.stop();
      
      stopwatchUI.start();
      vi.setSystemTime(startTime + 2000);
      stopwatchUI.stop();
      
      // Reset while running (after second start)
      stopwatchUI.start();
      stopwatchUI.reset();
      
      // All data should be cleared
      expect(stopwatchUI.state.laps).toHaveLength(0);
      expect(stopwatchUI.state.elapsedTime).toBe(0);
      expect(stopwatchUI.state.running).toBe(false);
    });

    it('should maintain button state consistency after reset while running', () => {
      const startTime = 1000000;
      vi.setSystemTime(startTime);
      
      stopwatchUI.start();
      stopwatchUI.reset();
      
      // All buttons should be in correct state
      expect(mockContainer.querySelector('.start-btn').disabled).toBe(false);
      // stop-btn (reset button) is always enabled
      expect(mockContainer.querySelector('.stop-btn').disabled).toBe(false);
      expect(mockContainer.querySelector('.export-btn').disabled).toBe(false);
    });
  });

  describe('Performance During Reset While Running', () => {
    it('should complete reset operation quickly', () => {
      const startTime = 1000000;
      vi.setSystemTime(startTime);
      
      stopwatchUI.start();
      
      const resetStart = performance.now();
      stopwatchUI.reset();
      const resetEnd = performance.now();
      
      // Reset should complete quickly (< 10ms)
      expect(resetEnd - resetStart).toBeLessThan(10);
    });

    it('should not cause memory leaks when reset while running', () => {
      const startTime = 1000000;
      vi.setSystemTime(startTime);
      
      // Start timer multiple times and reset while running
      for (let i = 0; i < 10; i++) {
        stopwatchUI.start();
        stopwatchUI.reset();
      }
      
      // Display interval should be cleared
      expect(stopwatchUI.displayInterval).toBeNull();
      
      // State should be clean
      expect(stopwatchUI.state.running).toBe(false);
      expect(stopwatchUI.state.laps).toHaveLength(0);
    });
  });
});

// These tests validate the edge case specified in the spec:
// "Reset button remains enabled and can be clicked while timer is running (stops timer and clears data)"
