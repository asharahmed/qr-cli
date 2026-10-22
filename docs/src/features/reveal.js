import { safeQueryAll } from '../utils/error-handler.js';

/**
 * Reveal on scroll: each .reveal rises into place once, on the gentle spring. In a .stagger
 * list the items follow one another; each gets its index as --i for the transition delay.
 * The stylesheet shows everything under reduced motion.
 */
export function initReveals() {
  const elements = safeQueryAll('.reveal, .stagger');
  if (!elements.length) return;

  safeQueryAll('.stagger').forEach(list => {
    [...list.children].forEach((child, index) => child.style.setProperty('--i', index));
  });

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
