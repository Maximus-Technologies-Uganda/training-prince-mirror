import './style.css';
import { defaultQuotes, pickRandom, filterByAuthor } from '../../src/quote/core.js';
import { initEnhancedQuoteUI } from './quote-ui/quote-ui.js';
import { createExpenseUi } from './ui-expense/index.js';
import { initTodoUI } from './ui-todo/index.js';
import { initTempUI } from './ui-temp/index.js';
import './ui-stopwatch/index.js';

// Client-side routing helper
function getCurrentPath() {
  return window.location.pathname;
}

function shouldShowSection(sectionId, currentPath) {
  const pathMap = {
    '/': 'quote-app',
    '/quote': 'quote-app',
    '/expense': 'expense-app',
    '/temp': 'temp-app',
    '/todo': 'todo-app',
    '/stopwatch': 'stopwatch-app',
  };
  
  const requiredSection = pathMap[currentPath] || 'quote-app';
  return sectionId === requiredSection;
}

function initRouting() {
  const currentPath = getCurrentPath();
  const sections = document.querySelectorAll('[id$="-app"]');
  
  sections.forEach((section) => {
    if (shouldShowSection(section.id, currentPath)) {
      section.style.display = '';
      section.setAttribute('aria-hidden', 'false');
    } else {
      section.style.display = 'none';
      section.setAttribute('aria-hidden', 'true');
    }
  });
}

// Initialize routing on navigation
window.addEventListener('popstate', () => {
  initRouting();
});

const state = {
  quotes: defaultQuotes,
  filteredQuotes: defaultQuotes,
  lastQuoteId: null,
};

function getElements() {
  return {
    app: document.getElementById('app'),
    quoteText: document.getElementById('quote-text'),
    quoteAuthor: document.getElementById('quote-author'),
    quoteBlock: document.getElementById('quote-display'),
    authorFilter: document.getElementById('author-filter'),
    shuffleButton: document.getElementById('shuffle-quote'),
  };
}

function renderQuote(elements, quote) {
  let targetQuote = quote ?? null;

  if (!targetQuote && state.filteredQuotes.length > 0) {
    targetQuote = pickRandom(state.filteredQuotes);
  }

  if (!targetQuote) {
    elements.quoteText.textContent = 'No quotes found';
    elements.quoteAuthor.textContent = '';
    elements.quoteBlock?.setAttribute('cite', '');
    elements.shuffleButton.disabled = true;
    return;
  }

  elements.shuffleButton.disabled = state.filteredQuotes.length <= 1;

  elements.quoteText.textContent = targetQuote.text;
  elements.quoteAuthor.textContent = targetQuote.author || 'Unknown';
  if (elements.quoteBlock) {
    elements.quoteBlock.setAttribute('cite', targetQuote.author || '');
  }

  state.lastQuoteId = `${targetQuote.text}-${targetQuote.author}`;
}

function applyFilter(elements, value) {
  const term = value.trim();
  state.filteredQuotes = filterByAuthor(state.quotes, term);

  if (!state.filteredQuotes.length) {
    renderQuote(elements, null);
    return;
  }

  renderQuote(elements);
}

function initQuoteUI() {
  const app = document.getElementById('app');
  if (!app) return;
  
  // Initialize enhanced quote UI with debounced filtering and error handling
  try {
    initEnhancedQuoteUI(defaultQuotes);
  } catch (error) {
    console.error('Failed to initialize enhanced quote UI:', error);
    // Fallback to basic functionality if enhanced UI fails
    initBasicQuoteUI();
  }
}

function initBasicQuoteUI() {
  // Fallback implementation for basic functionality
  const elements = getElements();
  if (!elements.app) return;

  renderQuote(elements);

  elements.authorFilter?.addEventListener('input', (event) => {
    applyFilter(elements, event.target.value);
  });

  elements.shuffleButton?.addEventListener('click', () => {
    if (state.filteredQuotes.length === 0) return;

    let nextQuote = pickRandom(state.filteredQuotes);

    if (state.filteredQuotes.length > 1) {
      let attempts = 0;
      while (`${nextQuote.text}-${nextQuote.author}` === state.lastQuoteId && attempts < 5) {
        nextQuote = pickRandom(state.filteredQuotes);
        attempts += 1;
      }
    }

    renderQuote(elements, nextQuote);
  });
}

function initExpenseUI() {
  const mount = document.getElementById('expense-app');
  if (!mount) return;
  createExpenseUi(mount);
}

function initUIs() {
  initRouting();
  initQuoteUI();
  initExpenseUI();
  initTodoUI();
  initTempUI();
  // Stopwatch UI initializes itself via DOMContentLoaded listener
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUIs);
} else {
  initUIs();
}
