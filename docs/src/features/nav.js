import { safeQuery } from '../utils/error-handler.js';

/**
 * Nav behavior: difference-blended over the page at the top; slides away on
 * scroll down; returns as a solid paper bar (blend off) on scroll up.
 */
export function initNav() {
  const nav = safeQuery('#siteNav');
  if (!nav) return;

  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    const delta = y - lastY;

    if (y < 80) {
      nav.classList.remove('nav-hidden', 'nav-solid');
    } else if (delta > 4) {
      nav.classList.add('nav-hidden');
      nav.classList.remove('nav-solid');
    } else if (delta < -4) {
      nav.classList.remove('nav-hidden');
      nav.classList.add('nav-solid');
    }

    lastY = y;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
}
