// Error handling utilities for UI components
export function createErrorHandler() {
  return {
    showError: (element, message, options = {}) => {
      if (!element) return;
      
      element.textContent = message;
      element.style.display = 'block';
      
      // Set accessibility attributes
      element.setAttribute('role', 'alert');
      element.setAttribute('aria-live', options.polite ? 'polite' : 'assertive');
      
      // Add CSS classes if provided
      if (options.className) {
        element.classList.add(options.className);
      }
      
      // Focus element if requested
      if (options.focus && element.focus) {
        element.focus();
      }
    },
    
    hideError: (element) => {
      if (!element) return;
      
      element.style.display = 'none';
      element.textContent = '';
      element.removeAttribute('role');
      element.removeAttribute('aria-live');
    },
    
    clearError: (element) => {
      if (!element) return;
      
      element.textContent = '';
      element.style.display = 'none';
    },
  };
}

export function createLoadingHandler() {
  return {
    showLoading: (element, message = 'Loading...') => {
      if (!element) return;
      
      element.textContent = message;
      element.style.display = 'block';
      element.setAttribute('aria-live', 'polite');
    },
    
    hideLoading: (element) => {
      if (!element) return;
      
      element.style.display = 'none';
      element.textContent = '';
    },
  };
}

export function createStateManager(initialState = {}) {
  let state = { ...initialState };
  const listeners = [];
  
  return {
    getState: () => ({ ...state }),
    
    setState: (newState) => {
      const prevState = { ...state };
      state = { ...state, ...newState };
      
      // Notify listeners
      listeners.forEach(listener => {
        listener(state, prevState);
      });
    },
    
    subscribe: (listener) => {
      listeners.push(listener);
      
      // Return unsubscribe function
      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    },
  };
}

export function createDebounceHandler() {
  return {
    debounce: (func, delay = 250) => {
      let timeoutId = null;
      
      return function debouncedFunction(...args) {
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }
        
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          timeoutId = null;
        }, delay);
      };
    },
    
    throttle: (func, delay = 250) => {
      let lastCall = 0;
      
      return function throttledFunction(...args) {
        const now = Date.now();
        
        if (now - lastCall >= delay) {
          lastCall = now;
          func.apply(this, args);
        }
      };
    },
  };
}

export function createValidationHandler() {
  return {
    validateInput: (input, rules = {}) => {
      if (!input || typeof input !== 'string') {
        return { isValid: false, error: 'Invalid input' };
      }
      
      const trimmed = input.trim();
      
      // Required validation
      if (rules.required && trimmed === '') {
        return { isValid: false, error: 'This field is required' };
      }
      
      // Min length validation
      if (rules.minLength && trimmed.length < rules.minLength) {
        return { isValid: false, error: `Minimum length is ${rules.minLength} characters` };
      }
      
      // Max length validation
      if (rules.maxLength && trimmed.length > rules.maxLength) {
        return { isValid: false, error: `Maximum length is ${rules.maxLength} characters` };
      }
      
      // Pattern validation
      if (rules.pattern && !rules.pattern.test(trimmed)) {
        return { isValid: false, error: rules.patternError || 'Invalid format' };
      }
      
      return { isValid: true, error: null };
    },
    
    validateNumeric: (input) => {
      if (!input || typeof input !== 'string') {
        return true; // Empty input is valid
      }
      
      const trimmed = input.trim();
      if (trimmed === '') {
        return true; // Empty string is valid
      }
      
      // Check if it's a valid number (including decimals and negatives)
      const numberRegex = /^-?\d*\.?\d+$/;
      return numberRegex.test(trimmed);
    },
  };
}
