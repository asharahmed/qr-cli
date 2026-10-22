import { safeQueryAll } from '../utils/error-handler.js';

/**
 * Copy buttons in the install card: each names the code element it copies.
 * The label itself confirms, so there's no toast over the dark card.
 */
export function initInstallCopy() {
  safeQueryAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      const source = document.getElementById(button.dataset.copy);
      try {
        await navigator.clipboard.writeText(source.textContent);
        button.textContent = 'Copied';
      } catch {
        button.textContent = 'Select and copy';
      }
      setTimeout(() => (button.textContent = 'Copy'), 1800);
    });
  });
}
