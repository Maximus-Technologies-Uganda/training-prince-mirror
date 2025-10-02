import { defaultQuotes, pickRandom, formatQuote } from '../../src/quote/core.js';

const quoteDisplay = document.getElementById('quote-display');
const authorFilter = document.getElementById('author-filter');

function renderInitialQuote() {
  if (!quoteDisplay) return;
  const quote = pickRandom(defaultQuotes);
  quoteDisplay.innerHTML = formatQuote(quote);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderInitialQuote);
} else {
  renderInitialQuote();
}

import './style.css';
import javascriptLogo from './javascript.svg';
import viteLogo from '/vite.svg';
import { setupCounter } from './counter.js';

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`;

setupCounter(document.querySelector('#counter'));
