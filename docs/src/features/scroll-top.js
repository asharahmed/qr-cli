import { safeQuery } from '../utils/error-handler.js';

/**
 * Initialize scroll-to-top button functionality
 */
export function initScrollTop() {
  const button = safeQuery('#scrollTop');
  if (!button) return;

  // Show/hide button based on scroll position
  let ticking = false;

  const updateButtonVisibility = () => {
    const scrollY = window.scrollY;
    const threshold = window.innerHeight * 0.5;

    if (scrollY > threshold) {
      button.classList.add('visible');
    } else {
      button.classList.remove('visible');
    }

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateButtonVisibility);
      ticking = true;
    }
  }, { passive: true });

  // Smooth scroll to top on click
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Initial check
  updateButtonVisibility();
}
