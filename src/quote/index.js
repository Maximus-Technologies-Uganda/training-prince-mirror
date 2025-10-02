#!/usr/bin/env node
import { defaultQuotes, pickRandom, filterByAuthor, formatQuote } from './core.js';

function run(argv = process.argv.slice(2)) {
  const args = argv;
  
  // Check for version flag first
  if (args.includes('--version')) {
    console.log('Quote CLI v1.0.0');
    return 0;
  }
  
  const byIndex = args.indexOf('--by');
  const authorArg = byIndex !== -1 ? args[byIndex + 1] : null;

  let pool = defaultQuotes;
  if (authorArg) {
    const filtered = filterByAuthor(pool, authorArg);
    if (filtered.length === 0) {
      console.error('Error: No quotes found for the specified author.');
      return 1;
    }
    pool = filtered;
  }
  const code = run();
  process.exit(code); // This line uses that return code to exit
  try {
    const q = pickRandom(pool);
    console.log(formatQuote(q));
    return 0;
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const code = run();
  // Only the thin CLI calls process.exit
  process.exit(code);
}

export { run };
