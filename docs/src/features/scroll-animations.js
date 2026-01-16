import { CONFIG } from '../config/constants.js';
import { safeQueryAll, safeQuery } from '../utils/error-handler.js';

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Initialize scroll-triggered animations with staggered reveals
 */
export function initScrollAnimations() {
  const reducedMotion = prefersReducedMotion();
  // Group elements by their parent section for coordinated staggering
  const animatableSelectors = [
    '.feature-card',
    '.example-block',
    '.comparison-row:not(.header)',
    '.stat',
    '.demo-option',
  ];

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px',
  };

  // Track which sections have been animated
  const animatedSections = new Set();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        const section = entry.target.closest('section');
        const sectionId = section?.id || 'default';

        // Get all siblings in this section that need animation
        if (!animatedSections.has(sectionId)) {
          animatedSections.add(sectionId);

          const siblings = section
            ? section.querySelectorAll(animatableSelectors.join(', '))
            : [entry.target];

          siblings.forEach((el, index) => {
            if (!el.dataset.animated) {
              el.dataset.animated = 'true';
              el.style.transitionDelay = `${index * 0.08}s`;
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }
          });
        } else {
          // Animate individual element if section already triggered
          entry.target.dataset.animated = 'true';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      }
    });
  }, observerOptions);

  const elements = safeQueryAll(animatableSelectors.join(', '));
  elements.forEach(el => {
    if (reducedMotion) {
      // For reduced motion: make elements visible immediately, no animation
      el.style.opacity = '1';
      el.style.transform = 'none';
    } else {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      observer.observe(el);
    }
  });

  // Initialize hero parallax (skip if reduced motion)
  if (!reducedMotion) {
    initHeroParallax();
  }
}

/**
 * Subtle parallax effect on the hero terminal
 */
function initHeroParallax() {
  const terminal = safeQuery('.terminal-wrapper');
  const hero = safeQuery('.hero');

  if (!terminal || !hero) return;

  let rafId = null;
  let mouseX = 0;
  let mouseY = 0;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    mouseY = (e.clientY - rect.top) / rect.height - 0.5;

    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        const rotateY = mouseX * 4;
        const rotateX = -mouseY * 3;

        terminal.style.transform = `perspective(1200px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        rafId = null;
      });
    }
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    terminal.style.transform = 'perspective(1200px) rotateY(-2deg) rotateX(1deg)';
  });
}
