import { safeQuery } from '../utils/error-handler.js';

/**
 * Animate a value from start to end
 * @param {HTMLElement} element - Element to update
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {number} duration - Animation duration in ms
 * @param {string} suffix - Optional suffix to append
 */
function animateValue(element, start, end, duration, suffix = '') {
  let startTimestamp = null;

  const step = timestamp => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
    element.textContent = Math.floor(easeProgress * (end - start) + start) + suffix;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
}

/**
 * Initialize stats counter animations
 */
export function initStatsCounter() {
  const statsObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stats = entry.target.querySelectorAll('.stat-value');
          stats.forEach(stat => {
            const target = stat.dataset.target;
            if (target && !stat.dataset.animated) {
              stat.dataset.animated = 'true';
              if (target === '1') {
                animateValue(stat, 0, 1, 1200, 's');
                setTimeout(() => {
                  stat.textContent = '<1s';
                }, 1400);
              } else {
                animateValue(stat, 0, parseInt(target), 1200);
              }
            }
          });
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  const usageStats = safeQuery('.usage-stats');
  if (usageStats) {
    statsObserver.observe(usageStats);
  }
}
