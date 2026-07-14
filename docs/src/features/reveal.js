import { safeQueryAll } from '../utils/error-handler.js';

/**
 * Reveal on scroll: elements fade + rise 1.4rem over 0.7s, staggered ~90ms
 * within each viewport batch. Static fallback under reduced motion.
 */
export function initReveals() {
  const elements = safeQueryAll('[data-reveal]');
  if (!elements.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      const batch = entries.filter(entry => entry.isIntersecting);
      batch.forEach((entry, index) => {
        entry.target.style.transitionDelay = `${index * 90}ms`;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}
