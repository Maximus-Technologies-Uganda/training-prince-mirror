console.log('main.js script started');
import { defaultQuotes, pickRandom, formatQuote } from '../../src/quote/core.js';
console.log('Functions imported successfully');

const quoteDisplay = document.getElementById('quote-display');
console.log('Quote display element:', quoteDisplay);
const authorFilter = document.getElementById('author-filter');

function renderInitialQuote() {
  if (!quoteDisplay) return;
  const randomQuote = pickRandom(defaultQuotes);
  console.log('Random quote picked:', randomQuote);
  console.log('Attempting to update HTML...');
  quoteDisplay.innerHTML = formatQuote(randomQuote);
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
