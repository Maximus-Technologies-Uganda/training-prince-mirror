import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// These tests will FAIL until we implement the enhanced quote UI functionality
// Based on quickstart.md scenarios

describe('Quote UI Integration Tests', () => {
  let mockQuotes;

  beforeEach(() => {
    mockQuotes = [
      { id: '1', text: 'Hello world', author: 'John Doe' },
      { id: '2', text: 'Good morning', author: 'Jane Smith' },
      { id: '3', text: 'Another quote', author: 'John Smith' },
    ];

    // Setup DOM
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
        <div id="quote-error" class="error-message" style="display: none;"></div>
      </div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllTimers();
  });

  describe('Enhanced Filter Experience', () => {
    it('should implement case-insensitive author filtering with debounce', async () => {
      // This will fail until we implement the enhanced filtering
      const filterInput = document.getElementById('author-filter');
      const quoteText = document.getElementById('quote-text');
      const quoteAuthor = document.getElementById('quote-author');

      // Initialize quote UI with enhanced filtering
      await initEnhancedQuoteUI(mockQuotes);

      // Type "john" - should find both John Doe and John Smith
      filterInput.value = 'john';
      filterInput.dispatchEvent(new Event('input'));

      // Wait for debounce delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Should show a quote by John (case-insensitive)
      expect(quoteAuthor.textContent).toMatch(/John/i);
    });

    it('should show all quotes when filter is cleared', async () => {
      const filterInput = document.getElementById('author-filter');
      const quoteText = document.getElementById('quote-text');

      await initEnhancedQuoteUI(mockQuotes);

      // First filter to John
      filterInput.value = 'john';
      filterInput.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 300));

      // Then clear filter
      filterInput.value = '';
      filterInput.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 300));

      // Should show any quote (not restricted to John)
      expect(quoteText.textContent).not.toBe('No quotes found');
    });

    it('should handle whitespace-only input as empty', async () => {
      const filterInput = document.getElementById('author-filter');
      const quoteText = document.getElementById('quote-text');

      await initEnhancedQuoteUI(mockQuotes);

      // Type only spaces
      filterInput.value = '   ';
      filterInput.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 300));

      // Should show quotes (treated as empty)
      expect(quoteText.textContent).not.toBe('No quotes found');
    });
  });

  describe('Error State Handling', () => {
    it('should display friendly error message for non-existent author', async () => {
      const filterInput = document.getElementById('author-filter');
      const errorDiv = document.getElementById('quote-error');

      await initEnhancedQuoteUI(mockQuotes);

      // Search for non-existent author
      filterInput.value = 'nonexistent';
      filterInput.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 300));

      // Should show friendly error message
      expect(errorDiv.style.display).not.toBe('none');
      expect(errorDiv.textContent).toContain('No quotes found for');
    });

    it('should clear error when valid filter is applied', async () => {
      const filterInput = document.getElementById('author-filter');
      const errorDiv = document.getElementById('quote-error');

      await initEnhancedQuoteUI(mockQuotes);

      // First show error
      filterInput.value = 'nonexistent';
      filterInput.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 300));

      // Then apply valid filter
      filterInput.value = 'john';
      filterInput.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 300));

      // Error should be cleared
      expect(errorDiv.style.display).toBe('none');
    });
  });

  describe('Debounce Performance', () => {
    it('should prevent excessive filtering operations during rapid typing', async () => {
      const filterInput = document.getElementById('author-filter');
      const filterSpy = vi.fn();

      await initEnhancedQuoteUI(mockQuotes, filterSpy);

      // Rapid typing simulation
      const rapidInputs = ['a', 'ab', 'abc', 'abcd', 'abcde'];
      rapidInputs.forEach(value => {
        filterInput.value = value;
        filterInput.dispatchEvent(new Event('input'));
      });

      // Should not call filter function immediately
      expect(filterSpy).not.toHaveBeenCalled();

      // Should call filter function only once after delay
      await new Promise(resolve => setTimeout(resolve, 300));
      expect(filterSpy).toHaveBeenCalledTimes(1);
      expect(filterSpy).toHaveBeenCalledWith('abcde');
    });
  });

  describe('Random Quote Selection', () => {
    it('should support deterministic quote selection for testing', async () => {
      const seededRNG = () => 0.5; // Always returns 0.5
      const quoteText = document.getElementById('quote-text');

      await initEnhancedQuoteUI(mockQuotes, null, seededRNG);

      // Should always select the same quote (deterministic)
      expect(quoteText.textContent).toBe('Good morning'); // Second quote (index 1)
    });
  });
});

// These functions will be implemented in the next phase
// For now, they will cause the tests to fail as expected in TDD

async function initEnhancedQuoteUI(quotes, filterSpy, rng) {
  throw new Error('initEnhancedQuoteUI not implemented yet');
}
