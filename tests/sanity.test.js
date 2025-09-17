import { describe, it, expect } from 'vitest';
// We import the specific function we want to test
import { formatGreeting } from '../src/hello/index.js';

describe('formatGreeting function', () => {
  // Test case 1: The default greeting
  it('should return a greeting for "World" when no name is given', () => {
    expect(formatGreeting()).toBe('Hello, World!');
  });

  // Test case 2: Greeting a specific name
  it('should return a greeting for the provided name', () => {
    expect(formatGreeting('Prince')).toBe('Hello, Prince!');
  });

  // Test case 3: The --shout flag
  it('should return an uppercase greeting when shout is true', () => {
    expect(formatGreeting('Prince', true)).toBe('HELLO, PRINCE!');
  });
});
