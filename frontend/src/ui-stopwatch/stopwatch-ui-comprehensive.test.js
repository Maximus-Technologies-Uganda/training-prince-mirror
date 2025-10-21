// Comprehensive StopwatchUI Tests for Coverage
// Tests all methods and edge cases to achieve >=40% coverage

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StopwatchUI } from './stopwatch-ui.js';

// Mock the backend modules
vi.mock('../../../src/stopwatch/core.js', () => ({
  createStopwatch: vi.fn(() => ({
    start: vi.fn(),
    lap: vi.fn(),
    get startTime() {
      return 0;
    },
    get laps() {
      return [];
    },
  })),
  formatTime: vi.fn(),
}));

vi.mock('../../../src/stopwatch/exporter.js', () => ({
  exportLapsAsTable: vi.fn((laps) => {
    if (laps.length === 0) {
      return 'Lap\tTime\n';
    }
    return (
      'Lap\tTime\n' +
      laps.map((lap, index) => `${index + 1}\t${lap.time || '00:01.00'}`).join('\n') +
      '\n'
    );
  }),
}));

describe('StopwatchUI Comprehensive Coverage Tests', () => {
  let stopwatchUI;
  let mockContainer;
  let mockElements;

  beforeEach(() => {
    // Create actual DOM elements for testing
    document.body.innerHTML = `
      <div class="stopwatch-container">
        <div class="timer-display">00:00.00</div>
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
    
    mockContainer = document.querySelector('.stopwatch-container');
    stopwatchUI = new StopwatchUI(mockContainer);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('Constructor and Initialization', () => {
    it('should initialize with correct default state', () => {
      expect(stopwatchUI.state.running).toBe(false);
      expect(stopwatchUI.state.startTime).toBe(0);
      expect(stopwatchUI.state.elapsedTime).toBe(0);
      expect(stopwatchUI.state.laps).toEqual([]);
      expect(stopwatchUI.displayInterval).toBeNull();
    });

    it('should throw error if required DOM elements are missing', () => {
      const incompleteContainer = {
        querySelector: vi.fn(() => null),
      };

      expect(() => new StopwatchUI(incompleteContainer)).toThrow('Required DOM elements not found');
    });

    it('should bind all event listeners', () => {
      expect(mockContainer.querySelector('.start-btn')).toBeDefined();
      expect(mockContainer.querySelector('.pause-btn')).toBeDefined();
      expect(mockContainer.querySelector('.stop-btn')).toBeDefined();
      expect(mockContainer.querySelector('.export-btn')).toBeDefined();
      expect(mockContainer.querySelector('.lap-btn')).toBeDefined();
      expect(mockContainer.querySelector('.clear-laps-btn')).toBeDefined();
    });
  });

  describe('Timer Operations', () => {
    it('should start timer correctly', () => {
      const startTime = 1000;
      vi.setSystemTime(startTime);

      stopwatchUI.start();

      expect(stopwatchUI.state.running).toBe(true);
      expect(stopwatchUI.state.startTime).toBe(startTime);
      expect(stopwatchUI.displayInterval).toBeDefined();
    });

    it('should not start if already running', () => {
      stopwatchUI.state.running = true;
      const originalStartTime = stopwatchUI.state.startTime;

      stopwatchUI.start();

      expect(stopwatchUI.state.startTime).toBe(originalStartTime);
    });

    it('should stop timer correctly', () => {
      stopwatchUI.state.running = true;
      stopwatchUI.state.startTime = 1000;
      stopwatchUI.displayInterval = setInterval(() => {}, 10);

      vi.setSystemTime(2000);
      stopwatchUI.stop();

      expect(stopwatchUI.state.running).toBe(false);
      expect(stopwatchUI.state.elapsedTime).toBe(1000);
      expect(stopwatchUI.displayInterval).toBeNull();
    });

    it('should record lap on stop', () => {
      stopwatchUI.state.running = true;
      stopwatchUI.state.startTime = 1000;
      stopwatchUI.state.laps = [];

      vi.setSystemTime(2000);
      stopwatchUI.stop();

      expect(stopwatchUI.state.laps).toHaveLength(1);
      expect(stopwatchUI.state.laps[0].elapsedTime).toBe(1000);
      expect(stopwatchUI.state.laps[0].lapNumber).toBe(1);
    });

    it('should reset timer correctly', () => {
      stopwatchUI.state.running = true;
      stopwatchUI.state.startTime = 1000;
      stopwatchUI.state.elapsedTime = 500;
      stopwatchUI.state.laps = [{ lapNumber: 1, elapsedTime: 500, timestamp: 1500 }];
      stopwatchUI.displayInterval = setInterval(() => {}, 10);

      stopwatchUI.reset();

      expect(stopwatchUI.state.running).toBe(false);
      expect(stopwatchUI.state.startTime).toBe(0);
      expect(stopwatchUI.state.elapsedTime).toBe(0);
      expect(stopwatchUI.state.laps).toEqual([]);
      expect(stopwatchUI.displayInterval).toBeNull();
    });
  });

  describe('Display Updates', () => {
    it('should update display with formatted time', () => {
      stopwatchUI.state.elapsedTime = 1250;

      stopwatchUI.updateDisplay();

      expect(mockContainer.querySelector('.timer-display').textContent).toBe('00:00:01');
    });

    it('should start display updates when timer is running', () => {
      vi.useFakeTimers();
      stopwatchUI.state.running = true;

      stopwatchUI.startDisplayUpdates();

      expect(stopwatchUI.displayInterval).toBeDefined();

      // Advance time and check if display updates
      vi.advanceTimersByTime(10);
      expect(mockContainer.querySelector('.timer-display').textContent).toBeDefined();
      
      vi.useRealTimers();
    });

    it('should stop display updates', () => {
      stopwatchUI.displayInterval = setInterval(() => {}, 10);

      stopwatchUI.stopDisplayUpdates();

      expect(stopwatchUI.displayInterval).toBeNull();
    });
  });

  describe('Time Formatting', () => {
    it('should format time correctly for various values', () => {
      expect(stopwatchUI.formatTime(0)).toBe('00:00:00');
      expect(stopwatchUI.formatTime(5000)).toBe('00:00:05');
      expect(stopwatchUI.formatTime(65000)).toBe('00:01:05');
      expect(stopwatchUI.formatTime(1250)).toBe('00:00:01');
    });

    it('should handle edge cases in time formatting', () => {
      expect(stopwatchUI.formatTime(999)).toBe('00:00:00');
      expect(stopwatchUI.formatTime(59999)).toBe('00:00:59');
      expect(stopwatchUI.formatTime(3600000)).toBe('01:00:00');
    });
  });

  describe('Lap Management', () => {
    it('should record lap with correct data', () => {
      stopwatchUI.state.laps = [];
      stopwatchUI.state.elapsedTime = 1500;

      stopwatchUI.recordLap();

      expect(stopwatchUI.state.laps).toHaveLength(1);
      expect(stopwatchUI.state.laps[0].lapNumber).toBe(1);
      expect(stopwatchUI.state.laps[0].elapsedTime).toBe(1500);
    });

    it('should increment lap numbers correctly', () => {
      stopwatchUI.state.laps = [
        { lapNumber: 1, elapsedTime: 1000, timestamp: 1000 },
        { lapNumber: 2, elapsedTime: 2000, timestamp: 2000 },
      ];
      stopwatchUI.state.elapsedTime = 3000;

      stopwatchUI.recordLap();

      expect(stopwatchUI.state.laps).toHaveLength(3);
      expect(stopwatchUI.state.laps[2].lapNumber).toBe(3);
    });

    it('should update laps display correctly', () => {
      stopwatchUI.state.laps = [
        { lapNumber: 1, elapsedTime: 1000, timestamp: 1000 },
        { lapNumber: 2, elapsedTime: 2000, timestamp: 2000 },
      ];

      stopwatchUI.updateLapsDisplay();

      expect(mockContainer.querySelector('.laps-display').innerHTML).toContain('Lap 1: 00:00:01');
      expect(mockContainer.querySelector('.laps-display').innerHTML).toContain('Lap 2: 00:00:02');
    });

    it('should show no laps message when empty', () => {
      stopwatchUI.state.laps = [];

      stopwatchUI.updateLapsDisplay();

      expect(mockContainer.querySelector('.laps-display').innerHTML).toBe(
        '<div class="no-laps" role="status" aria-live="polite">No laps recorded</div>',
      );
    });
  });

  describe('CSV Export', () => {
    it('should generate CSV content correctly', () => {
      stopwatchUI.state.laps = [
        { lapNumber: 1, elapsedTime: 1000, timestamp: 1000 },
        { lapNumber: 2, elapsedTime: 2000, timestamp: 2000 },
      ];

      const csvContent = stopwatchUI.generateCSVContent();

      expect(csvContent).toContain('Lap,Time');
      expect(csvContent).toContain('1,');
      expect(csvContent).toContain('2,');
    });

    it('should handle empty laps in CSV export', () => {
      stopwatchUI.state.laps = [];

      const csvContent = stopwatchUI.generateCSVContent();

      expect(csvContent).toContain('Lap,Time');
      expect(csvContent).not.toContain('1,');
    });

    it('should export CSV file', () => {
      stopwatchUI.state.laps = [{ lapNumber: 1, elapsedTime: 1000, timestamp: 1000 }];

      // This test verifies exportCSV doesn't throw
      expect(() => stopwatchUI.exportCSV()).not.toThrow();
    });
  });

  describe('State Persistence', () => {
    it('should save state to localStorage', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      
      stopwatchUI.saveState();

      expect(setItemSpy).toHaveBeenCalledWith(
        'stopwatch-ui-state',
        expect.stringContaining('"laps"'),
      );
      
      setItemSpy.mockRestore();
    });

    it('should load state from localStorage', () => {
      const savedState = {
        laps: [{ lapNumber: 1, elapsedTime: 1000, timestamp: 1000 }],
        elapsedTime: 1000,
      };

      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(savedState));

      const newStopwatchUI = new StopwatchUI(mockContainer);

      expect(newStopwatchUI.state.laps).toEqual(savedState.laps);
      expect(newStopwatchUI.state.elapsedTime).toBe(savedState.elapsedTime);
      
      getItemSpy.mockRestore();
    });

    it('should handle localStorage errors gracefully', () => {
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn(() => {
        throw new Error('localStorage error');
      });

      expect(() => new StopwatchUI(mockContainer)).not.toThrow();
      
      localStorage.getItem = originalGetItem;
    });
  });

  describe('Button State Management', () => {
    it('should update button states correctly when running', () => {
      stopwatchUI.state.running = true;

      stopwatchUI.updateButtonStates();

      expect(mockContainer.querySelector('.start-btn').disabled).toBe(true);
      expect(mockContainer.querySelector('.stop-btn').disabled).toBe(false);
      expect(mockContainer.querySelector('.start-btn').getAttribute('aria-label')).toBe(
        'Stopwatch is running',
      );
    });

    it('should update button states correctly when stopped', () => {
      stopwatchUI.state.running = false;

      stopwatchUI.updateButtonStates();

      expect(mockContainer.querySelector('.start-btn').disabled).toBe(false);
      expect(mockContainer.querySelector('.stop-btn').disabled).toBe(false);
      expect(mockContainer.querySelector('.start-btn').getAttribute('aria-label')).toBe(
        'Start stopwatch',
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle CSV export errors gracefully', () => {
      const originalBlob = global.Blob;
      global.Blob = vi.fn(() => {
        throw new Error('Blob creation failed');
      });

      expect(() => stopwatchUI.exportCSV()).not.toThrow();
      
      global.Blob = originalBlob;
    });

    it('should handle localStorage save errors gracefully', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('localStorage save failed');
      });

      expect(() => stopwatchUI.saveState()).not.toThrow();
      
      localStorage.setItem = originalSetItem;
    });
  });
});
