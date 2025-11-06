import {
  convertTemperatureWithFormatting,
  validateNumericInput,
  handleConversionError,
  validateUnitSelection,
} from '../../../src/temp-converter/core.js';

// Enhanced temperature UI with input validation and error handling
export function createTemperatureState() {
  return {
    value: '',
    fromUnit: 'C',
    toUnit: 'F',
    result: null,
    error: null,
    isValid: true,
  };
}

export function updateTemperatureValue(state, value) {
  const isValid = validateNumericInput(value);
  
  return {
    ...state,
    value: value,
    isValid: isValid,
    error: isValid ? null : 'Please enter a valid number',
  };
}

export function updateTemperatureUnits(state, fromUnit, toUnit) {
  const isValidSelection = validateUnitSelection(fromUnit, toUnit);
  
  return {
    ...state,
    fromUnit: fromUnit,
    toUnit: toUnit,
    error: isValidSelection ? null : 'Please select different units for conversion',
  };
}

export function performTemperatureConversion(state) {
  if (!state.isValid || !state.value.trim()) {
    return {
      ...state,
      result: null,
      error: null,
    };
  }
  
  if (!validateUnitSelection(state.fromUnit, state.toUnit)) {
    return {
      ...state,
      result: null,
      error: 'Please select different units for conversion',
    };
  }
  
  try {
    const numericValue = parseFloat(state.value);
    const conversionResult = convertTemperatureWithFormatting(
      numericValue,
      state.fromUnit,
      state.toUnit,
      2,
    );
    
    return {
      ...state,
      result: conversionResult,
      error: null,
    };
  } catch (error) {
    return {
      ...state,
      result: null,
      error: handleConversionError(error),
    };
  }
}

export function initEnhancedTempUI() {
  const state = createTemperatureState();
  
  // Get DOM elements
  const tempInput = document.getElementById('temp-value');
  const fromSelect = document.getElementById('temp-from');
  const toSelect = document.getElementById('temp-to');
  const resultDiv = document.getElementById('temp-result');
  const errorDiv = document.getElementById('temp-error');
  
  if (!tempInput || !fromSelect || !toSelect || !resultDiv) {
    throw new Error('Required DOM elements not found');
  }
  
  // Set up input validation
  tempInput.addEventListener('input', (event) => {
    const value = event.target.value;
    
    // Restrict input to numeric characters only
    if (!validateNumericInput(value)) {
      event.target.value = '';
      // Show error for non-numeric input
      const newState = {
        ...state,
        error: 'Please enter a valid number',
      };
      Object.assign(state, newState);
      renderTemperatureUI(state, resultDiv, errorDiv);
      return;
    }
    
    const newState = updateTemperatureValue(state, value);
    Object.assign(state, newState);
    
    const finalState = performTemperatureConversion(state);
    Object.assign(state, finalState);
    
    renderTemperatureUI(state, resultDiv, errorDiv);
  });
  
  // Set up unit change handlers
  fromSelect.addEventListener('change', (event) => {
    const newState = updateTemperatureUnits(state, event.target.value, state.toUnit);
    Object.assign(state, newState);
    
    const finalState = performTemperatureConversion(state);
    Object.assign(state, finalState);
    
    renderTemperatureUI(state, resultDiv, errorDiv);
  });
  
  toSelect.addEventListener('change', (event) => {
    const newState = updateTemperatureUnits(state, state.fromUnit, event.target.value);
    Object.assign(state, newState);
    
    const finalState = performTemperatureConversion(state);
    Object.assign(state, finalState);
    
    renderTemperatureUI(state, resultDiv, errorDiv);
  });
  
  // Initial render
  renderTemperatureUI(state, resultDiv, errorDiv);
  
  return state;
}

function renderTemperatureUI(state, resultDiv, errorDiv) {
  if (state.error) {
    showError(errorDiv, state.error);
    resultDiv.textContent = '';
    return;
  }
  
  hideError(errorDiv);
  
  if (state.result) {
    resultDiv.textContent = state.result.formatted;
  } else {
    resultDiv.textContent = '';
  }
}

function showError(errorDiv, message) {
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.setAttribute('aria-live', 'polite');
    errorDiv.setAttribute('aria-atomic', 'true');
    
    // Add focus management for screen readers
    if (errorDiv.focus) {
      errorDiv.focus();
    }
  }
}

function hideError(errorDiv) {
  if (errorDiv) {
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    errorDiv.removeAttribute('role');
    errorDiv.removeAttribute('aria-live');
    errorDiv.removeAttribute('aria-atomic');
  }
}
