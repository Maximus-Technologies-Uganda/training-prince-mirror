import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const originalReadyState = Object.getOwnPropertyDescriptor(document, 'readyState');

function setupDom() {
  document.body.innerHTML = `
    <div id="app" class="quote-app">
      <header class="quote-app__header">
        <h1>Quote Explorer</h1>
        <p>Find inspiration and filter quotes by your favourite authors.</p>
      </header>
      <section class="quote-app__controls" aria-label="Quote controls">
        <label class="visually-hidden" for="author-filter">Filter quotes by author</label>
        <input
          type="text"
          id="author-filter"
          name="author-filter"
          placeholder="Filter by author…"
          autocomplete="off"
        />
        <button id="shuffle-quote" type="button">Show another quote</button>
      </section>
      <blockquote id="quote-display" class="quote-app__quote" cite="">
        <p id="quote-text">Loading…</p>
        <footer>— <cite id="quote-author">Unknown</cite></footer>
      </blockquote>
    </div>
  `;
}

async function loadQuoteUi() {
  await import('./main.js');
}

describe('Quote UI interactions', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.doMock('./style.css', () => ({}));
    vi.useFakeTimers();
    setupDom();

    Object.defineProperty(document, 'readyState', {
      configurable: true,
      get: () => 'complete',
    });
  });

  afterEach(() => {
    if (originalReadyState) {
      Object.defineProperty(document, 'readyState', originalReadyState);
    }
    document.body.innerHTML = '';
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders a random quote on load (seeded)', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    await loadQuoteUi();

    const quoteAuthor = document.getElementById('quote-author');
    const quoteText = document.getElementById('quote-text');

    expect(quoteAuthor.textContent).toBe('Franklin D. Roosevelt');
    expect(quoteText.textContent).toBe(
      'The only limit to our realization of tomorrow is our doubts of today.',
    );
  });

  it('displays a quote by the filtered author', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    await loadQuoteUi();

    const filterInput = document.getElementById('author-filter');
    const quoteAuthor = document.getElementById('quote-author');
    const quoteText = document.getElementById('quote-text');

    filterInput.value = 'jobs';
    filterInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Advance timers to allow debounced filter to execute (250ms debounce)
    vi.advanceTimersByTime(300);

    expect(quoteAuthor.textContent).toBe('Steve Jobs');
    expect(quoteText.textContent).toBe('Stay hungry, stay foolish.');
  });

  it('shows a not found message when author has no quotes', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    await loadQuoteUi();

    const filterInput = document.getElementById('author-filter');
    const quoteAuthor = document.getElementById('quote-author');
    const quoteText = document.getElementById('quote-text');
    const shuffleButton = document.getElementById('shuffle-quote');

    filterInput.value = 'unknown person';
    filterInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Advance timers to allow debounced filter to execute (250ms debounce)
    vi.advanceTimersByTime(300);

    expect(quoteText.textContent).toBe('No quotes found');
    expect(quoteAuthor.textContent).toBe('');
    expect(shuffleButton.disabled).toBe(true);
  });
});
