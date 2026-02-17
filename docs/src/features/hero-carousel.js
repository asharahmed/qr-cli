import { safeQuery } from '../utils/error-handler.js';

/**
 * Initialize the hero carousel.
 * Fully JS-driven so it handles variable item heights (text wrapping)
 * with smooth transitions for scroll position, wrapper size, underline,
 * and a glow pulse on each word change.
 */
export function initHeroCarousel() {
  const wrapper = safeQuery('.carousel-wrapper');
  const carousel = safeQuery('.carousel');
  if (!wrapper || !carousel) return;

  const allItems = carousel.querySelectorAll('.carousel-item');
  const items = carousel.querySelectorAll('.carousel-item:not([aria-hidden])');
  if (items.length === 0) return;

  const ITEM_COUNT = items.length;   // 5 unique items
  const HOLD = 2000;                 // ms each word is displayed
  const TRANSITION = 350;            // ms for the scroll transition
  const CYCLE = (HOLD + TRANSITION) * ITEM_COUNT;

  // Measure every item (including the duplicate) at the current viewport width.
  function measureItems() {
    const parentWidth = wrapper.parentElement ? wrapper.parentElement.clientWidth : Infinity;
    return Array.from(allItems).map(item => {
      // Temporarily position absolute to measure natural size
      const prev = {
        position: item.style.position,
        visibility: item.style.visibility,
        width: item.style.width,
      };
      item.style.position = 'absolute';
      item.style.visibility = 'hidden';
      item.style.width = `${parentWidth}px`;
      const width = Math.min(item.scrollWidth, parentWidth);
      const height = item.offsetHeight;
      item.style.position = prev.position;
      item.style.visibility = prev.visibility;
      item.style.width = prev.width;
      return { width, height };
    });
  }

  // Compute the Y offset for each item (sum of preceding heights).
  function computeOffsets(sizes) {
    const offsets = [0];
    for (let i = 1; i < sizes.length; i++) {
      offsets.push(offsets[i - 1] + sizes[i - 1].height);
    }
    return offsets;
  }

  let sizes = measureItems();
  let offsets = computeOffsets(sizes);
  let currentIndex = 0;
  let intervalId = null;

  function applyItem(index, animate) {
    currentIndex = index;
    const itemIndex = index % allItems.length;

    // Scroll position
    if (!animate) {
      carousel.style.transition = 'none';
      carousel.offsetHeight; // force reflow
    } else {
      carousel.style.transition = '';
    }
    carousel.style.transform = `translateY(-${offsets[itemIndex]}px)`;

    // Wrapper dimensions (use the unique item index for sizing)
    const sizeIndex = index < ITEM_COUNT ? index : 0;
    wrapper.style.width = `${sizes[sizeIndex].width}px`;
    wrapper.style.height = `${sizes[sizeIndex].height}px`;

    // Underline: hide during transition, show after it settles
    wrapper.classList.remove('underline-visible');
    if (animate) {
      setTimeout(() => wrapper.classList.add('underline-visible'), TRANSITION);
    } else {
      wrapper.classList.add('underline-visible');
    }

    // Glow pulse on the visible unique item
    if (animate && items[sizeIndex]) {
      items[sizeIndex].classList.add('glow');
      setTimeout(() => items[sizeIndex].classList.remove('glow'), 400);
    }
  }

  function advance() {
    // Hide underline before transitioning
    wrapper.classList.remove('underline-visible');

    setTimeout(() => {
      const nextIndex = currentIndex + 1;

      if (nextIndex >= allItems.length) {
        // We've reached the duplicate — snap back to the real first item
        applyItem(0, false);
      } else {
        applyItem(nextIndex, true);

        // If we just landed on the duplicate (last item), schedule a
        // snap-back after the hold period instead of a normal advance
        if (nextIndex === allItems.length - 1) {
          // This item is the duplicate; it will be snapped back on next advance()
        }
      }
    }, 100); // brief pause after underline hides
  }

  // Initial state
  applyItem(0, false);

  // Start the cycle
  intervalId = setInterval(advance, HOLD + TRANSITION);

  // Re-measure on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      sizes = measureItems();
      offsets = computeOffsets(sizes);
      applyItem(currentIndex, false);
    }, 150);
  });
}
