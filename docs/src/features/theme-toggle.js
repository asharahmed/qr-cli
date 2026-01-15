import { CONFIG } from '../config/constants.js';
import { safeQuery } from '../utils/error-handler.js';

/**
 * Initialize theme toggle functionality
 */
export function initThemeToggle() {
  const themeToggle = safeQuery('#themeToggle');
  const themeLabel = safeQuery('#themeLabel');

  if (!themeToggle) return;

  function applyTheme(theme) {
    const isLight = theme === 'light';
    document.body.classList.toggle('theme-light', isLight);
    themeToggle.setAttribute('aria-pressed', String(isLight));
    if (themeLabel) {
      themeLabel.textContent = isLight ? 'Light' : 'Dark';
    }
  }

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem(CONFIG.THEME_STORAGE_KEY);
  const prefersLight =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(savedTheme || (prefersLight ? 'light' : 'dark'));

  // Toggle theme on click
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('theme-light') ? 'dark' : 'light';
    applyTheme(nextTheme);
    localStorage.setItem(CONFIG.THEME_STORAGE_KEY, nextTheme);
  });
}
