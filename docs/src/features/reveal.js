import { safeQueryAll } from '../utils/error-handler.js';

/**
 * Reveal on scroll: each .reveal rises into place once, on the gentle spring.
 * The stylesheet shows everything under reduced motion.
 */
export function initReveals() {
  const elements = safeQueryAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px' }
  );

  elements.forEach(el => observer.observe(el));
}
