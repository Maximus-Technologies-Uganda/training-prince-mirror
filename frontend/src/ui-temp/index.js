import { convert } from '../../../src/temp-converter/index.js';

function formatResult(value) {
  if (value === null || value === undefined) return '';
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded)
        .replace(/\.0+$/, '')
        .replace(/(\.[0-9]*?)0+$/, '$1');
}

export function initTempUI() {
  // Get all DOM elements first
  const tempValue = document.getElementById('temp-value');
  const tempFrom = document.getElementById('temp-from');
  const tempTo = document.getElementById('temp-to');
  const tempError = document.getElementById('temp-error');
  const tempResult = document.getElementById('temp-result');
  const tempResultDisplay = document.getElementById('temp-result-display');
  const convertBtn = document.getElementById('temp-convert');
  const clearBtn = document.getElementById('temp-clear');
  const historyContainer = document.getElementById('conversion-history');

  // Mark that initialization has started
  document.body.setAttribute('data-temp-ui-init', 'started');

  // Validate that required elements exist
  if (!tempValue || !tempFrom || !tempTo) {
    document.body.setAttribute('data-temp-ui-error', 'missing-elements');
    console.error('Temperature UI: Required DOM elements not found');
    return;
  }

  // Initialize history array - ensure it starts clean
  let history = [];

  // Define helper functions
  const clearState = () => {
    if (tempError) tempError.textContent = '';
    if (tempResult) tempResult.textContent = '';
    if (tempResultDisplay) tempResultDisplay.value = '';
  };

  const showError = (message) => {
    if (tempError) {
      tempError.textContent = message;
      tempError.style.display = 'block';
    }
    if (tempResult) tempResult.textContent = '';
    if (tempResultDisplay) tempResultDisplay.value = '';
  };

  const hideError = () => {
    if (tempError) {
      tempError.textContent = '';
      tempError.style.display = 'none';
    }
  };

  const updateHistory = () => {
    if (!historyContainer) return;

    if (history.length === 0) {
      historyContainer.innerHTML = '';
      historyContainer.style.display = 'none';
      return;
    }

    const historyHtml = history
      .slice(-5)
      .reverse()
      .map((item) => {
        return `<div class="history-item" data-testid="history-item">${item.from}${item.fromUnit} = ${item.to}${item.toUnit}</div>`;
      })
      .join('');

    historyContainer.innerHTML = `<div class="history-list" data-testid="conversion-history-list">${historyHtml}</div>`;
    historyContainer.style.display = 'block';
  };

  const performConversion = () => {
    const raw = tempValue.value.trim();
    const from = tempFrom.value;
    const to = tempTo.value;

    clearState();

    if (!raw) {
      return;
    }

    const num = Number(raw);
    if (Number.isNaN(num)) {
      showError('Value must be numeric');
      return;
    }

    if (from === to) {
      showError('From and To units cannot be the same');
      return;
    }

    try {
      const result = convert(num, from, to);
      hideError();
      const formatted = formatResult(result);
      console.log('Conversion result:', result, 'formatted:', formatted, 'tempResultDisplay exists:', !!tempResultDisplay);
      if (tempResult) tempResult.textContent = formatted;
      if (tempResultDisplay) {
        tempResultDisplay.value = formatted;
        console.log('Set tempResultDisplay.value to:', formatted);
      }

      history.push({
        from: num,
        fromUnit: from,
        to: result,
        toUnit: to,
      });
      updateHistory();
    } catch (e) {
      console.error('Conversion error:', e);
      showError('Conversion failed');
    }
  };

  const clearInputs = () => {
    tempValue.value = '';
    tempFrom.value = 'C';
    tempTo.value = 'F';
    clearState();
    if (tempResultDisplay) tempResultDisplay.value = '';
    history = [];
    updateHistory();
  };

  // Attach event listeners
  tempValue.addEventListener('input', performConversion);
  tempFrom.addEventListener('change', performConversion);
  tempTo.addEventListener('change', performConversion);
  if (convertBtn) {
    convertBtn.addEventListener('click', performConversion);
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', clearInputs);
  }

  // Mark successful initialization
  document.body.setAttribute('data-temp-ui-loaded', 'true');
}