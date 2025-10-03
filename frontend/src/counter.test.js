import { describe, it, expect } from 'vitest';
import { setupCounter } from './counter.js';

describe('setupCounter', () => {
  it('initializes element with count 0 and increments on click', () => {
    const element = document.createElement('button');
    setupCounter(element);
    expect(element.innerHTML).toContain('count is 0');

    element.click();
    expect(element.innerHTML).toContain('count is 1');
  });
});


