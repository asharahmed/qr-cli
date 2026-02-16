import { safeQuery } from '../utils/error-handler.js';

/**
 * Initialize the hero carousel with smooth width transitions
 * and a glow pulse on each word change.
 */
export function initHeroCarousel() {
  const wrapper = safeQuery('.carousel-wrapper');
  const carousel = safeQuery('.carousel');
  if (!wrapper || !carousel) return;

  const items = carousel.querySelectorAll('.carousel-item:not([aria-hidden])');
  if (items.length === 0) return;

  // Measure each item's natural text width
  const widths = Array.from(items).map(item => {
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

  // Transition midpoints matching CSS keyframes
  const schedule = [
    { time: 0, index: 0 },
    { time: 0.165, index: 1 },
    { time: 0.335, index: 2 },
    { time: 0.505, index: 3 },
    { time: 0.675, index: 4 },
    { time: 0.845, index: 0 },
  ];

  let timeouts = [];

  function runCycle() {
    // Clear any pending timeouts from a previous cycle
    timeouts.forEach(id => clearTimeout(id));
    timeouts = [];

    schedule.forEach(({ time, index }) => {
      const id = setTimeout(() => {
        wrapper.style.width = `${widths[index]}px`;

        // Brief glow pulse on the active item
        const active = items[index];
        if (active) {
          active.classList.add('glow');
          setTimeout(() => active.classList.remove('glow'), 400);
        }
      }, time * duration);
      timeouts.push(id);
    });
  }

  // Start first cycle
  runCycle();

  // Re-sync on each animation loop to prevent timer drift
  carousel.addEventListener('animationiteration', () => {
    runCycle();
  });

  // Fallback interval in case animationiteration doesn't fire reliably
  setInterval(runCycle, duration);
}
