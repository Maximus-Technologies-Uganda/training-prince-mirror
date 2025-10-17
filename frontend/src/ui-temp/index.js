import { convert } from '../../../src/temp-converter/index.js';

function formatResult(value) {
  if (value === null || value === undefined) return '';
  const rounded = Math.round(value * 100) / 100;
  // Trim trailing zeros for display
  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded)
        .replace(/\.0+$/, '')
        .replace(/(\.[0-9]*?)0+$/, '$1');
}

function getElements() {
  return {
    value: document.getElementById('temp-value'),
    from: document.getElementById('temp-from'),
    to: document.getElementById('temp-to'),
    error: document.getElementById('temp-error'),
    result: document.getElementById('temp-result'),
  };
}

function clearState(els) {
  if (els.error) els.error.textContent = '';
  if (els.result) els.result.textContent = '';
}

function showError(els, message) {
  if (els.error) {
    els.error.textContent = message;
    els.error.focus?.();
  }
  if (els.result) {
    els.result.textContent = '';
  }
}

function update(els) {
  const raw = els.value?.value ?? '';
  const from = els.from?.value;
  const to = els.to?.value;

  if (!raw) {
    clearState(els);
    return;
  }

  const num = Number(raw);
  if (Number.isNaN(num)) {
    showError(els, 'Value must be numeric');
    return;
  }

  if (from === to) {
    showError(els, 'From and To units cannot be the same');
    return;
  }

  try {
    const value = convert(num, from, to);
    if (els.error) els.error.textContent = '';
    if (els.result) els.result.textContent = formatResult(value);
  } catch (e) {
    showError(els, 'Conversion failed');
  }
}

export function initTempUI() {
  const els = getElements();
  // Defaults C -> F set in HTML
  const handler = () => update(els);
  els.value?.addEventListener('input', handler);
  els.from?.addEventListener('change', handler);
  els.to?.addEventListener('change', handler);
}
