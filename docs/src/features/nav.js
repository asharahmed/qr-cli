import { safeQuery } from '../utils/error-handler.js';

/**
 * Nav behavior: a blurred bar that gains a hairline border once the page scrolls.
 */
export function initNav() {
  const nav = safeQuery('#nav');
  if (!nav) return;

  const update = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', update, { passive: true });
  update();
}
