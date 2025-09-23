import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { run, formatGreeting } from '../src/hello/index.js';

describe('Hello CLI Unit Tests', () => {
  let consoleSpy, consoleErrorSpy;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    vi.restoreAllMocks();
  });

  describe('formatGreeting core function', () => {
    it('formats greeting with default name', () => {
      const result = formatGreeting();
      expect(result).toBe('Hello, World!');
    });

    it('formats greeting with custom name', () => {
      const result = formatGreeting('Alice');
      expect(result).toBe('Hello, Alice!');
    });

    it('formats greeting with shout flag', () => {
      const result = formatGreeting('Bob', true);
      expect(result).toBe('HELLO, BOB!');
    });

    it('formats greeting with name and shout', () => {
      const result = formatGreeting('Charlie', true);
      expect(result).toBe('HELLO, CHARLIE!');
    });
  });

  describe('run function - basic cases', () => {
    it('runs with default greeting', () => {
      const result = run([]);
      expect(result).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith('Hello, World!');
    });

    it('runs with custom name', () => {
      const result = run(['Alice']);
      expect(result).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith('Hello, Alice!');
    });

    it('runs with shout flag', () => {
      const result = run(['Bob', '--shout']);
      expect(result).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith('HELLO, BOB!');
    });

    it('runs with version flag', () => {
      const result = run(['--version']);
      expect(result).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith('Hello CLI v1.0.0');
    });
  });

  describe('run function - validation and error cases', () => {
    it('errors when --shout is used without name', () => {
      const result = run(['--shout']);
      expect(result).toBe(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: --shout requires a name.');
    });

    it('errors with unknown flag', () => {
      const result = run(['--unknown']);
      expect(result).toBe(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Unknown flag(s): --unknown');
    });

    it('errors with multiple unknown flags', () => {
      const result = run(['--unknown1', '--unknown2']);
      expect(result).toBe(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Unknown flag(s): --unknown1, --unknown2');
    });

    it('errors with unknown flag and valid flag', () => {
      const result = run(['--unknown', '--version']);
      expect(result).toBe(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Unknown flag(s): --unknown');
    });
  });

  describe('run function - table-driven tests', () => {
    const testCases = [
      {
        name: 'default greeting',
        args: [],
        expectedOutput: 'Hello, World!',
        expectedReturn: 0
      },
      {
        name: 'greeting with name',
        args: ['Alice'],
        expectedOutput: 'Hello, Alice!',
        expectedReturn: 0
      },
      {
        name: 'greeting with shout',
        args: ['Bob', '--shout'],
        expectedOutput: 'HELLO, BOB!',
        expectedReturn: 0
      },
      {
        name: 'version flag',
        args: ['--version'],
        expectedOutput: 'Hello CLI v1.0.0',
        expectedReturn: 0
      },
      {
        name: 'version with name',
        args: ['Alice', '--version'],
        expectedOutput: 'Hello CLI v1.0.0',
        expectedReturn: 0
      },
      {
        name: 'shout without name (error)',
        args: ['--shout'],
        expectedError: 'Error: --shout requires a name.',
        expectedReturn: 1
      },
      {
        name: 'unknown flag (error)',
        args: ['--invalid'],
        expectedError: 'Error: Unknown flag(s): --invalid',
        expectedReturn: 1
      }
    ];

    testCases.forEach(({ name, args, expectedOutput, expectedError, expectedReturn }) => {
      it(`handles ${name}`, () => {
        const result = run(args);
        expect(result).toBe(expectedReturn);
        
        if (expectedOutput) {
          expect(consoleSpy).toHaveBeenCalledWith(expectedOutput);
        }
        
        if (expectedError) {
          expect(consoleErrorSpy).toHaveBeenCalledWith(expectedError);
        }
      });
    });
  });

  describe('run function - edge cases', () => {
    it('handles whitespace in name', () => {
      const result = run(['  Alice  ']);
      expect(result).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith('Hello,   Alice  !');
    });

    it('handles empty string name', () => {
      const result = run(['']);
      expect(result).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith('Hello, !');
    });

    it('handles multiple names (takes first)', () => {
      const result = run(['Alice', 'Bob']);
      expect(result).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith('Hello, Alice!');
    });
  });
});
