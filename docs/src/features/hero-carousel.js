import { safeQuery } from '../utils/error-handler.js';

/**
 * Initialize the hero carousel with smooth width transitions.
 * Measures each item's natural width and schedules width changes
 * in sync with the CSS scroll animation.
 */
export function initHeroCarousel() {
  const wrapper = safeQuery('.carousel-wrapper');
  const carousel = safeQuery('.carousel');
  if (!wrapper || !carousel) return;

  const items = carousel.querySelectorAll('.carousel-item:not([aria-hidden])');
  if (items.length === 0) return;

  // Measure each item's natural text width
  const widths = Array.from(items).map(item => {
    // Temporarily make item visible at natural width to measure
    const prevPosition = item.style.position;
    const prevVisibility = item.style.visibility;
    item.style.position = 'absolute';
    item.style.visibility = 'hidden';
    const width = item.scrollWidth;
    item.style.position = prevPosition;
    item.style.visibility = prevVisibility;
    return width;
  });

  // Set initial width
  wrapper.style.width = `${widths[0]}px`;

  // Animation duration must match CSS (12s)
  const duration = 12000;

  // Schedule width changes at each transition midpoint (matching CSS keyframes).
  // CSS keyframes: 0%→15% (item 0), 18%→32% (item 1), 35%→49% (item 2),
  //               52%→66% (item 3), 69%→83% (item 4), 86%→100% (duplicate 0)
  const schedule = [
    { time: 0, index: 0 },
    { time: 0.165, index: 1 },
    { time: 0.335, index: 2 },
    { time: 0.505, index: 3 },
    { time: 0.675, index: 4 },
    { time: 0.845, index: 0 },
  ];

  function runCycle() {
    schedule.forEach(({ time, index }) => {
      setTimeout(() => {
        wrapper.style.width = `${widths[index]}px`;
      }, time * duration);
    });
  }

  runCycle();
  setInterval(runCycle, duration);
}
