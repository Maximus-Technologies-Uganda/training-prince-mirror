import { 
  filterQuotesByAuthor, 
  validateFilterQuery, 
  selectRandomQuoteWithSeed 
} from '../../../src/quote/core.js';

// Enhanced quote UI with debounced filtering and error handling
export function createDebouncedFilter(callback, delay = 250) {
  let timeoutId = null;
  
  return function debouncedFunction(...args) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      callback.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

export function createFilterState(quotes) {
  return {
    query: '',
    results: quotes || [],
    isLoading: false,
    error: null,
  };
}

export function updateFilterState(state, query) {
  const normalizedQuery = validateFilterQuery(query);
  const results = filterQuotesByAuthor(state.results, normalizedQuery);
  
  return {
    ...state,
    query: normalizedQuery,
    results: results,
    isLoading: false,
    error: results.length === 0 && normalizedQuery ? 'No quotes found for the specified author.' : null,
  };
}

export function setFilterLoading(state, isLoading) {
  return {
    ...state,
    isLoading: isLoading,
  };
}

export function setFilterError(state, error) {
  return {
    ...state,
    error: error,
    isLoading: false,
  };
}

export function initEnhancedQuoteUI(quotes, filterSpy, rng) {
  const state = createFilterState(quotes);
  
  // Get DOM elements
  const filterInput = document.getElementById('author-filter');
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');
  const errorDiv = document.getElementById('quote-error');
  const shuffleButton = document.getElementById('shuffle-quote');
  
  if (!filterInput || !quoteText || !quoteAuthor) {
    throw new Error('Required DOM elements not found');
  }
  
  // Create debounced filter function
  const debouncedFilter = createDebouncedFilter((query) => {
    const newState = updateFilterState(state, query);
    Object.assign(state, newState);
    
    if (filterSpy) {
      filterSpy(query);
    }
    
    renderQuote(state, quoteText, quoteAuthor, errorDiv, shuffleButton, rng);
  });
  
  // Set up event listeners
  filterInput.addEventListener('input', (event) => {
    debouncedFilter(event.target.value);
  });
  
  if (shuffleButton) {
    shuffleButton.addEventListener('click', () => {
      if (state.results.length === 0) return;
      
      const randomQuote = selectRandomQuoteWithSeed(state.results, rng);
      renderSingleQuote(randomQuote, quoteText, quoteAuthor);
    });
  }
  
  // Initial render
  renderQuote(state, quoteText, quoteAuthor, errorDiv, shuffleButton, rng);
  
  return state;
}

function renderQuote(state, quoteText, quoteAuthor, errorDiv, shuffleButton, rng) {
  if (state.error) {
    showError(errorDiv, state.error);
    quoteText.textContent = 'No quotes found';
    quoteAuthor.textContent = '';
    if (shuffleButton) shuffleButton.disabled = true;
    return;
  }
  
  hideError(errorDiv);
  
  if (state.results.length === 0) {
    quoteText.textContent = 'No quotes found';
    quoteAuthor.textContent = '';
    if (shuffleButton) shuffleButton.disabled = true;
    return;
  }
  
  const randomQuote = selectRandomQuoteWithSeed(state.results, rng);
  renderSingleQuote(randomQuote, quoteText, quoteAuthor);
  
  if (shuffleButton) {
    shuffleButton.disabled = state.results.length <= 1;
  }
}

function renderSingleQuote(quote, quoteText, quoteAuthor) {
  quoteText.textContent = quote.text;
  quoteAuthor.textContent = quote.author || 'Unknown';
}

function showError(errorDiv, message) {
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.setAttribute('aria-live', 'polite');
  }
}

function hideError(errorDiv) {
  if (errorDiv) {
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
  }
}
