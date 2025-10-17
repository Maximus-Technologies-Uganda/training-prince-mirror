// Unit Tests: Timer Logic
// Tests the StopwatchUI timer functionality

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
  CSVExporter: {
    exportLaps: vi.fn(() => 'Lap Number,Elapsed Time\n1,00:01.00\n')
  }
}));

describe('StopwatchUI Timer Logic Unit Tests', () => {
  let stopwatchUI;
  let mockContainer;
  let mockElements;

  beforeEach(() => {
    // Mock DOM elements
    mockElements = {
      '.timer-display': { textContent: '00:00.00' },
      '.start-btn': { disabled: false, addEventListener: vi.fn(), setAttribute: vi.fn() },
      '.stop-btn': { disabled: true, addEventListener: vi.fn(), setAttribute: vi.fn() },
      '.reset-btn': { disabled: false, addEventListener: vi.fn(), setAttribute: vi.fn() },
      '.export-btn': { disabled: false, addEventListener: vi.fn(), setAttribute: vi.fn() },
      '.laps-display': { innerHTML: '' }
    };

    mockContainer = {
      querySelector: vi.fn((selector) => mockElements[selector] || null),
      querySelectorAll: vi.fn(() => []),
      dispatchEvent: vi.fn()
    };

    // Mock localStorage
    const mockLocalStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn()
    };
    global.localStorage = mockLocalStorage;

    // Mock timers
    vi.useFakeTimers();
    
    stopwatchUI = new StopwatchUI(mockContainer);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('Timer State Management', () => {
    it('should initialize with correct default state', () => {
      expect(stopwatchUI.state.running).toBe(false);
      expect(stopwatchUI.state.startTime).toBe(0);
      expect(stopwatchUI.state.elapsedTime).toBe(0);
      expect(stopwatchUI.state.laps).toEqual([]);
    });

    it('should start timer correctly', () => {
      const startTime = 1000000;
      vi.setSystemTime(startTime);
      
      stopwatchUI.start();
      
      expect(stopwatchUI.state.running).toBe(true);
      expect(stopwatchUI.state.startTime).toBe(startTime);
      expect(mockElements['.start-btn'].disabled).toBe(true);
      expect(mockElements['.stop-btn'].disabled).toBe(false);
    });

    it('should stop timer correctly', () => {
      const startTime = 1000000;
      const stopTime = 1002000; // 2 seconds later
      vi.setSystemTime(startTime);
      
      stopwatchUI.start();
      vi.setSystemTime(stopTime);
      stopwatchUI.stop();
      
      expect(stopwatchUI.state.running).toBe(false);
      expect(stopwatchUI.state.elapsedTime).toBe(2000);
      expect(mockElements['.start-btn'].disabled).toBe(false);
      expect(mockElements['.stop-btn'].disabled).toBe(true);
    });

    it('should reset timer correctly', () => {
      stopwatchUI.start();
      stopwatchUI.stop();
      stopwatchUI.reset();
      
      expect(stopwatchUI.state.running).toBe(false);
      expect(stopwatchUI.state.startTime).toBe(0);
      expect(stopwatchUI.state.elapsedTime).toBe(0);
      expect(stopwatchUI.state.laps).toEqual([]);
    });
  });

  describe('Time Formatting', () => {
    it('should format time correctly', () => {
      expect(stopwatchUI.formatTime(0)).toBe('00:00.00');
      expect(stopwatchUI.formatTime(1000)).toBe('00:01.00');
      expect(stopwatchUI.formatTime(61000)).toBe('01:01.00');
      expect(stopwatchUI.formatTime(123456)).toBe('02:03.45');
    });

    it('should handle edge cases', () => {
      expect(stopwatchUI.formatTime(999)).toBe('00:00.99');
      expect(stopwatchUI.formatTime(59999)).toBe('00:59.99');
      expect(stopwatchUI.formatTime(3600000)).toBe('60:00.00');
    });
  });

  describe('Lap Recording', () => {
    it('should record lap on stop', () => {
      const startTime = 1000000;
      const stopTime = 1002000;
      vi.setSystemTime(startTime);
      
      stopwatchUI.start();
      vi.setSystemTime(stopTime);
      stopwatchUI.stop();
      
      expect(stopwatchUI.state.laps).toHaveLength(1);
      expect(stopwatchUI.state.laps[0]).toEqual({
        lapNumber: 1,
        elapsedTime: 2000,
        timestamp: stopTime
      });
    });

    it('should record multiple laps sequentially', () => {
      vi.setSystemTime(1000000);
      stopwatchUI.start();
      vi.setSystemTime(1001000);
      stopwatchUI.stop();
      
      stopwatchUI.start();
      vi.setSystemTime(1002000);
      stopwatchUI.stop();
      
      expect(stopwatchUI.state.laps).toHaveLength(2);
      expect(stopwatchUI.state.laps[0].lapNumber).toBe(1);
      expect(stopwatchUI.state.laps[1].lapNumber).toBe(2);
    });

    it('should clear laps on reset', () => {
      stopwatchUI.start();
      stopwatchUI.stop();
      stopwatchUI.start();
      stopwatchUI.stop();
      
      expect(stopwatchUI.state.laps).toHaveLength(2);
      
      stopwatchUI.reset();
      expect(stopwatchUI.state.laps).toHaveLength(0);
    });
  });

  describe('Display Updates', () => {
    it('should update display during timer run', () => {
      const startTime = 1000000;
      vi.setSystemTime(startTime);
      
      stopwatchUI.start();
      
      // Advance time by 1 second
      vi.setSystemTime(startTime + 1000);
      stopwatchUI.updateDisplay();
      
      expect(mockElements['.timer-display'].textContent).toBe('00:01.00');
    });

    it('should show final time after stop', () => {
      const startTime = 1000000;
      const stopTime = 1002500; // 2.5 seconds
      vi.setSystemTime(startTime);
      
      stopwatchUI.start();
      vi.setSystemTime(stopTime);
      stopwatchUI.stop();
      
      // The display should show the elapsed time
      expect(mockElements['.timer-display'].textContent).toBe('00:02.50');
    });
  });

  describe('Button State Management', () => {
    it('should disable start button when running', () => {
      stopwatchUI.start();
      expect(mockElements['.start-btn'].disabled).toBe(true);
      expect(mockElements['.stop-btn'].disabled).toBe(false);
    });

    it('should disable stop button when stopped', () => {
      stopwatchUI.stop();
      expect(mockElements['.start-btn'].disabled).toBe(false);
      expect(mockElements['.stop-btn'].disabled).toBe(true);
    });

    it('should keep reset and export buttons enabled', () => {
      stopwatchUI.start();
      expect(mockElements['.reset-btn'].disabled).toBe(false);
      expect(mockElements['.export-btn'].disabled).toBe(false);
      
      stopwatchUI.stop();
      expect(mockElements['.reset-btn'].disabled).toBe(false);
      expect(mockElements['.export-btn'].disabled).toBe(false);
    });
  });

  describe('Event Dispatching', () => {
    it('should dispatch timer:start event', () => {
      stopwatchUI.start();
      expect(mockContainer.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'timer:start' })
      );
    });

    it('should dispatch timer:stop event', () => {
      stopwatchUI.start();
      stopwatchUI.stop();
      expect(mockContainer.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'timer:stop' })
      );
    });

    it('should dispatch lap:recorded event', () => {
      stopwatchUI.start();
      stopwatchUI.stop();
      expect(mockContainer.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({ 
          type: 'lap:recorded',
          detail: expect.objectContaining({
            lapNumber: 1,
            elapsedTime: expect.any(Number),
            timestamp: expect.any(Number)
          })
        })
      );
    });
  });
});
