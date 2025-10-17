import { describe, it, expect, beforeEach } from 'vitest';
import { initTempUI } from './index.js';

function setupDom() {
  document.body.innerHTML = `
    <section id="temp-app">
      <input id="temp-value" />
      <select id="temp-from">
        <option value="C">C</option>
        <option value="F">F</option>
      </select>
      <select id="temp-to">
        <option value="F">F</option>
        <option value="C">C</option>
      </select>
      <p id="temp-error" aria-live="assertive"></p>
      <p id="temp-result" aria-live="polite"></p>
    </section>
  `;
}

describe('UI Temp', () => {
  beforeEach(() => {
    setupDom();
    initTempUI();
  });

  it('C→F: 0 becomes 32', () => {
    document.getElementById('temp-value').value = '0';
    document.getElementById('temp-from').value = 'C';
    document.getElementById('temp-to').value = 'F';
    document.getElementById('temp-value').dispatchEvent(new Event('input'));
    expect(document.getElementById('temp-result').textContent).toBe('32');
  });

  it('F→C: 32 becomes 0', () => {
    document.getElementById('temp-value').value = '32';
    document.getElementById('temp-from').value = 'F';
    document.getElementById('temp-to').value = 'C';
    document.getElementById('temp-value').dispatchEvent(new Event('input'));
    expect(document.getElementById('temp-result').textContent).toBe('0');
  });

  it('identical units → error and result cleared', () => {
    document.getElementById('temp-value').value = '1';
    document.getElementById('temp-from').value = 'C';
    document.getElementById('temp-to').value = 'C';
    document.getElementById('temp-to').dispatchEvent(new Event('change'));
    expect(document.getElementById('temp-error').textContent).toMatch(/cannot be the same/i);
    expect(document.getElementById('temp-result').textContent).toBe('');
  });

  it('non-numeric input → error and result cleared', () => {
    document.getElementById('temp-value').value = 'abc';
    document.getElementById('temp-value').dispatchEvent(new Event('input'));
    expect(document.getElementById('temp-error').textContent).toMatch(/numeric/i);
    expect(document.getElementById('temp-result').textContent).toBe('');
  });

  it('inputs cleared → neutral state', () => {
    document.getElementById('temp-value').value = '';
    document.getElementById('temp-value').dispatchEvent(new Event('input'));
    expect(document.getElementById('temp-error').textContent).toBe('');
    expect(document.getElementById('temp-result').textContent).toBe('');
  });
});
