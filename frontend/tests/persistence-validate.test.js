import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('T017 - persistState() Validation', () => {
  let persistState;
  
  beforeEach(async () => {
    localStorage.clear();
    vi.clearAllMocks();
    
    // Import from persistence module
    try {
      const module = await import('../src/ui-stopwatch/persistence.js');
      persistState = module.persistState;
    } catch (err) {
      console.error('Failed to import persistState:', err);
    }
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('persistState() Contract Validation', () => {
    
    it('should exist as an exported function', () => {
      expect(persistState).toBeDefined();
      expect(typeof persistState).toBe('function');
    });

    it('should serialize state to JSON and write to localStorage with key "stopwatchState"', () => {
      const testState = {
        startTime: 1234567890,
        isRunning: true,
        laps: [1234567900, 1234567910]
      };

      const result = persistState(testState);
      
      expect(result.success).toBe(true);
      const savedStr = localStorage.getItem('stopwatchState');
      expect(savedStr).toBeTruthy();
      
      const saved = JSON.parse(savedStr);
      expect(saved).toEqual(testState);
    });

    it('should handle null startTime', () => {
      const testState = {
        startTime: null,
        isRunning: false,
        laps: []
      };

      const result = persistState(testState);
      
      expect(result.success).toBe(true);
      const saved = JSON.parse(localStorage.getItem('stopwatchState'));
      expect(saved.startTime).toBeNull();
      expect(saved.isRunning).toBe(false);
    });

    it('should handle multiple laps', () => {
      const testState = {
        startTime: 1000000,
        isRunning: false,
        laps: [1000060, 1000120, 1000180, 1000240]
      };

      const result = persistState(testState);
      
      expect(result.success).toBe(true);
      const saved = JSON.parse(localStorage.getItem('stopwatchState'));
      expect(saved.laps.length).toBe(4);
    });

    it('should return {success: true} when successful', () => {
      const testState = {
        startTime: Date.now(),
        isRunning: true,
        laps: []
      };

      const result = persistState(testState);
      
      expect(result).toHaveProperty('success');
      expect(result.success).toBe(true);
    });

    it('should wrap in try-catch and handle errors gracefully', () => {
      const testState = {
        startTime: 1234567890,
        isRunning: true,
        laps: []
      };

      // Spy on localStorage.setItem to ensure try-catch protection
      const setItemSpy = vi.spyOn(localStorage, 'setItem');
      
      const result = persistState(testState);
      
      expect(setItemSpy).toHaveBeenCalled();
      expect(result.success).toBe(true);
      
      setItemSpy.mockRestore();
    });

    it('should handle SecurityError (private browsing mode)', () => {
      // Mock localStorage to throw SecurityError
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        const error = new Error('localStorage is not available');
        error.name = 'SecurityError';
        throw error;
      });

      const testState = {
        startTime: 1234567890,
        isRunning: true,
        laps: []
      };

      const result = persistState(testState);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('SecurityError');

      localStorage.setItem = originalSetItem;
    });

    it('should persist empty laps array', () => {
      const testState = {
        startTime: 1234567890,
        isRunning: true,
        laps: []
      };

      const result = persistState(testState);
      
      expect(result.success).toBe(true);
      const saved = JSON.parse(localStorage.getItem('stopwatchState'));
      expect(Array.isArray(saved.laps)).toBe(true);
      expect(saved.laps.length).toBe(0);
    });

    it('should work with large lap arrays', () => {
      // Create a state with many laps
      const laps = [];
      for (let i = 0; i < 100; i++) {
        laps.push(1000000 + i * 1000);
      }

      const testState = {
        startTime: 1000000,
        isRunning: false,
        laps
      };

      const result = persistState(testState);
      
      expect(result.success).toBe(true);
      const saved = JSON.parse(localStorage.getItem('stopwatchState'));
      expect(saved.laps.length).toBe(100);
    });

    it('should preserve boolean values correctly', () => {
      const testState1 = {
        startTime: 1000000,
        isRunning: true,
        laps: []
      };

      persistState(testState1);
      let saved = JSON.parse(localStorage.getItem('stopwatchState'));
      expect(saved.isRunning).toBe(true);

      const testState2 = {
        startTime: 1000000,
        isRunning: false,
        laps: []
      };

      persistState(testState2);
      saved = JSON.parse(localStorage.getItem('stopwatchState'));
      expect(saved.isRunning).toBe(false);
    });

    it('should preserve numeric timestamps', () => {
      const startTime = 1729792800123;
      const testState = {
        startTime,
        isRunning: true,
        laps: [1729792860123, 1729792950456]
      };

      persistState(testState);
      const saved = JSON.parse(localStorage.getItem('stopwatchState'));
      
      expect(saved.startTime).toBe(startTime);
      expect(saved.laps[0]).toBe(1729792860123);
      expect(saved.laps[1]).toBe(1729792950456);
    });

    it('should have status indicator capability', () => {
      // Verify persistState can call showPersistenceStatus (indirectly by checking no errors)
      const testState = {
        startTime: 1000000,
        isRunning: true,
        laps: []
      };

      // Should not throw even if status element doesn't exist
      const result = persistState(testState);
      expect(result.success).toBe(true);
    });
  });
});
