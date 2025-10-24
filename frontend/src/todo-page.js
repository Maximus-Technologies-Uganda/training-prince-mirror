import './style.css';
import { initTodoUI } from './ui-todo/index.js';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTodoUI);
} else {
  initTodoUI();
}
