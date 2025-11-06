import './style.css';
import { createExpenseUi } from './ui-expense/index.js';

function initExpenseUI() {
  const mount = document.getElementById('expense-app');
  if (!mount) return;
  createExpenseUi(mount);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initExpenseUI);
} else {
  initExpenseUI();
}
