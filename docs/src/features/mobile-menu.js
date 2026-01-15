import { safeQuery, safeQueryAll } from '../utils/error-handler.js';

/**
 * Initialize mobile menu functionality
 */
export function initMobileMenu() {
  const mobileMenuBtn = safeQuery('#mobileMenuBtn');
  const mobileMenu = safeQuery('#mobileMenu');

  if (!mobileMenuBtn || !mobileMenu) return;

  mobileMenuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu when clicking a link
  safeQueryAll('a', mobileMenu).forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}
