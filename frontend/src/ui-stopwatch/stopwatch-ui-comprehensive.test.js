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
    // Mock DOM elements with all required methods
    mockElements = {
      '.timer-display': { textContent: '00:00.00' },
      '.start-btn': {
        disabled: false,
        addEventListener: vi.fn(),
        setAttribute: vi.fn(),
        focus: vi.fn(),
      },
      '.stop-btn': {
        disabled: true,
        addEventListener: vi.fn(),
        setAttribute: vi.fn(),
        focus: vi.fn(),
      },
      '.reset-btn': {
        disabled: false,
        addEventListener: vi.fn(),
        setAttribute: vi.fn(),
        focus: vi.fn(),
      },
      '.export-btn': {
        disabled: false,
        addEventListener: vi.fn(),
        setAttribute: vi.fn(),
        focus: vi.fn(),
      },
      '.laps-display': {
        innerHTML: '',
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      },
    };

    mockContainer = {
      querySelector: vi.fn((selector) => mockElements[selector] || null),
      querySelectorAll: vi.fn(() => []),
      dispatchEvent: vi.fn(),
    };

    // Mock localStorage
    const mockLocalStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
    };
    global.localStorage = mockLocalStorage;

    // Mock DOM APIs for CSV export
    global.Blob = vi.fn();
    global.URL = {
      createObjectURL: vi.fn(() => 'blob:mock-url'),
      revokeObjectURL: vi.fn(),
    };

    const mockAnchor = {
      href: '',
      download: '',
      click: vi.fn(),
    };

    global.document.createElement = vi.fn((tag) => {
      if (tag === 'a') return mockAnchor;
      return mockContainer;
    });

    // Mock document.body
    Object.defineProperty(global.document, 'body', {
      value: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      },
      writable: true,
    });

    // Mock timers
    vi.useFakeTimers();

    stopwatchUI = new StopwatchUI(mockContainer);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
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
      expect(mockElements['.start-btn'].addEventListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
      );
      expect(mockElements['.stop-btn'].addEventListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
      );
      expect(mockElements['.reset-btn'].addEventListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
      );
      expect(mockElements['.export-btn'].addEventListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
      );
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

      expect(mockElements['.timer-display'].textContent).toBe('00:01.25');
    });

    it('should start display updates when timer is running', () => {
      stopwatchUI.state.running = true;

      stopwatchUI.startDisplayUpdates();

      expect(stopwatchUI.displayInterval).toBeDefined();

      // Advance time and check if display updates
      vi.advanceTimersByTime(10);
      expect(mockElements['.timer-display'].textContent).toBeDefined();
    });

    it('should stop display updates', () => {
      stopwatchUI.displayInterval = setInterval(() => {}, 10);

      stopwatchUI.stopDisplayUpdates();

      expect(stopwatchUI.displayInterval).toBeNull();
    });
  });

  describe('Time Formatting', () => {
    it('should format time correctly for various values', () => {
      expect(stopwatchUI.formatTime(0)).toBe('00:00.00');
      expect(stopwatchUI.formatTime(1000)).toBe('00:01.00');
      expect(stopwatchUI.formatTime(65000)).toBe('01:05.00');
      expect(stopwatchUI.formatTime(1250)).toBe('00:01.25');
    });

    it('should handle edge cases in time formatting', () => {
      expect(stopwatchUI.formatTime(999)).toBe('00:00.99');
      expect(stopwatchUI.formatTime(59999)).toBe('00:59.99');
      expect(stopwatchUI.formatTime(3600000)).toBe('60:00.00');
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

      expect(mockElements['.laps-display'].innerHTML).toContain('Lap 1: 00:01.00');
      expect(mockElements['.laps-display'].innerHTML).toContain('Lap 2: 00:02.00');
    });

    it('should show no laps message when empty', () => {
      stopwatchUI.state.laps = [];

      stopwatchUI.updateLapsDisplay();

      expect(mockElements['.laps-display'].innerHTML).toBe(
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

      stopwatchUI.exportCSV();

      expect(global.Blob).toHaveBeenCalled();
      expect(global.document.createElement).toHaveBeenCalledWith('a');
    });
  });

  describe('State Persistence', () => {
    it('should save state to localStorage', () => {
      stopwatchUI.state.laps = [{ lapNumber: 1, elapsedTime: 1000, timestamp: 1000 }];
      stopwatchUI.state.elapsedTime = 1000;

      stopwatchUI.saveState();

      expect(global.localStorage.setItem).toHaveBeenCalledWith(
        'stopwatch-ui-state',
        expect.stringContaining('"laps"'),
      );
    });

    it('should load state from localStorage', () => {
      const savedState = {
        laps: [{ lapNumber: 1, elapsedTime: 1000, timestamp: 1000 }],
        elapsedTime: 1000,
      };

      global.localStorage.getItem.mockReturnValue(JSON.stringify(savedState));

      const newStopwatchUI = new StopwatchUI(mockContainer);

      expect(newStopwatchUI.state.laps).toEqual(savedState.laps);
      expect(newStopwatchUI.state.elapsedTime).toBe(savedState.elapsedTime);
    });

    it('should handle localStorage errors gracefully', () => {
      global.localStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => new StopwatchUI(mockContainer)).not.toThrow();
    });
  });

  describe('Button State Management', () => {
    it('should update button states correctly when running', () => {
      stopwatchUI.state.running = true;

      stopwatchUI.updateButtonStates();

      expect(mockElements['.start-btn'].disabled).toBe(true);
      expect(mockElements['.stop-btn'].disabled).toBe(false);
      expect(mockElements['.start-btn'].setAttribute).toHaveBeenCalledWith(
        'aria-label',
        'Stopwatch is running',
      );
    });

    it('should update button states correctly when stopped', () => {
      stopwatchUI.state.running = false;

      stopwatchUI.updateButtonStates();

      expect(mockElements['.start-btn'].disabled).toBe(false);
      expect(mockElements['.stop-btn'].disabled).toBe(true);
      expect(mockElements['.start-btn'].setAttribute).toHaveBeenCalledWith(
        'aria-label',
        'Start stopwatch',
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle CSV export errors gracefully', () => {
      global.Blob.mockImplementation(() => {
        throw new Error('Blob creation failed');
      });

      expect(() => stopwatchUI.exportCSV()).not.toThrow();
    });

    it('should handle localStorage save errors gracefully', () => {
      global.localStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage save failed');
      });

      expect(() => stopwatchUI.saveState()).not.toThrow();
    });
  });
});
