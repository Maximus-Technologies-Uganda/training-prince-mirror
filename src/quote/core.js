export const defaultQuotes = [
  { text: 'The only limit to our realization of tomorrow is our doubts of today.', author: 'Franklin D. Roosevelt' },
  { text: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
  { text: 'Programs must be written for people to read, and only incidentally for machines to execute.', author: 'Harold Abelson' }
];

export function pickRandom(quotes = defaultQuotes) {
  if (!Array.isArray(quotes) || quotes.length === 0) {
    throw new Error('No quotes available.');
  }
  const idx = Math.floor(Math.random() * quotes.length);
  return quotes[idx];
}

export function filterByAuthor(quotes, author) {
  if (!author) return quotes;
  const a = author.toLowerCase();
  return quotes.filter(q => (q.author || '').toLowerCase().includes(a));
}

// Enhanced filtering functions for UI polishing
export function filterQuotesByAuthor(quotes, query) {
  if (!Array.isArray(quotes)) {
    throw new Error('Quotes must be an array');
  }
  
  const normalizedQuery = validateFilterQuery(query);
  
  if (!normalizedQuery) {
    return quotes;
  }
  
  const lowerQuery = normalizedQuery.toLowerCase();
  return quotes.filter(quote => 
    (quote.author || '').toLowerCase().includes(lowerQuery)
  );
}

export function validateFilterQuery(query) {
  if (!query || typeof query !== 'string') {
    return '';
  }
  
  const trimmed = query.trim();
  return trimmed === '' ? '' : trimmed;
}

export function selectRandomQuoteWithSeed(quotes, rng = Math.random) {
  if (!Array.isArray(quotes) || quotes.length === 0) {
    throw new Error('No quotes available');
  }
  
  const randomValue = rng();
  const idx = Math.floor(randomValue * quotes.length);
  return quotes[idx];
}

export function formatQuote(quote) {
  return `"${quote.text}" — ${quote.author}`;
}
