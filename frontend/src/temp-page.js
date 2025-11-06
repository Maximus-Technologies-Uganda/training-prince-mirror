import './style.css';
import { initTempUI } from './ui-temp/index.js';

try {
  document.body.setAttribute('data-temp-page-loaded', 'true');
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      try {
        initTempUI();
      } catch (e) {
        document.body.setAttribute('data-temp-ui-error', 'initTempUI-threw');
        console.error('Error calling initTempUI:', e);
      }
    });
  } else {
    initTempUI();
  }
} catch (e) {
  document.body.setAttribute('data-temp-page-error', 'true');
  console.error('Error in temp-page.js:', e);
}
