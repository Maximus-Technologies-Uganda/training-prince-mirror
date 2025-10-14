// Main entry point for Stopwatch UI
// Wires up HTML elements to JavaScript functionality

import { StopwatchUI } from './stopwatch-ui.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.stopwatch-container');
  
  if (!container) {
    console.error('Stopwatch container not found');
    return;
  }
  
  try {
    const stopwatchUI = new StopwatchUI(container);
    console.log('Stopwatch UI initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Stopwatch UI:', error);
  }
});