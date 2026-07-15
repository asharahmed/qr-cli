import { safeQuery } from '../utils/error-handler.js';

/**
 * Initialize the hero carousel.
 * Fully JS-driven to handle variable item heights (text wrapping on
 * narrow viewports) with smooth transitions for position, size,
 * and the hairline underline accent.
 */
export function initHeroCarousel() {
  const wrapper = safeQuery('.carousel-wrapper');
  const carousel = safeQuery('.carousel');
  if (!wrapper || !carousel) return;

  const allItems = carousel.querySelectorAll('.carousel-item');
  const items = carousel.querySelectorAll('.carousel-item:not([aria-hidden])');
  if (items.length === 0) return;

  // Respect prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReduced.matches) {
    wrapper.style.width = 'auto';
    wrapper.style.height = 'auto';
    return;
  }

  const ITEM_COUNT = items.length;
  const HOLD = 2000;
  const SCROLL_MS = 350;

  // ── Measurement ──────────────────────────────────────────────

  function measureItems() {
    const parentWidth = wrapper.parentElement
      ? wrapper.parentElement.clientWidth
      : Infinity;

    return Array.from(allItems).map(item => {
      const prev = {
        position: item.style.position,
        visibility: item.style.visibility,
        width: item.style.width,
      };
      item.style.position = 'absolute';
      item.style.visibility = 'hidden';
      item.style.width = `${parentWidth}px`;

      const width = Math.min(item.scrollWidth, parentWidth);
      // Fractional height: offsetHeight rounds to integers, and the rounding
      // error accumulates across offsets, exposing neighbor descenders.
      const height = item.getBoundingClientRect().height;

      item.style.position = prev.position;
      item.style.visibility = prev.visibility;
      item.style.width = prev.width;
      return { width, height };
    });
  }

  function computeOffsets(s) {
    const o = [0];
    for (let i = 1; i < s.length; i++) o.push(o[i - 1] + s[i - 1].height);
    return o;
  }

  let sizes = measureItems();
  let offsets = computeOffsets(sizes);
  let current = 0;
  const running = true;

  // ── Rendering ────────────────────────────────────────────────

  function scrollTo(index, animate) {
    if (animate) {
      carousel.style.transition = '';
    } else {
      carousel.style.transition = 'none';
      carousel.offsetHeight; // force reflow
    }
    carousel.style.transform = `translateY(-${offsets[index]}px)`;
  }

  function resizeWrapper(index) {
    const i = index < ITEM_COUNT ? index : 0;
    wrapper.style.width = `${sizes[i].width}px`;
    wrapper.style.height = `${sizes[i].height}px`;
  }

  function showUnderline() {
    // Grow from left
    wrapper.style.setProperty('--underline-origin', 'left');
    wrapper.classList.add('underline-visible');
  }

  function hideUnderline() {
    // Collapse to right
    wrapper.style.setProperty('--underline-origin', 'right');
    wrapper.classList.remove('underline-visible');
  }

  // Instrument Serif ink overshoots its line box, so at rest a neighbor's
  // descenders can peek into the clip window. Paint only the resting word;
  // pass null to show everything while a slide is in motion.
  function setItemVisibility(restingIndex) {
    allItems.forEach((item, i) => {
      item.style.visibility =
        restingIndex === null || i === restingIndex ? '' : 'hidden';
    });
  }

  // ── Cycle logic (setTimeout chain, no drift) ─────────────────

  function showItem(index, animate) {
    current = index;

    if (animate) {
      setItemVisibility(null);
      scrollTo(index, true);
      resizeWrapper(index);
      setTimeout(() => {
        setItemVisibility(index);
        showUnderline();
      }, SCROLL_MS);
    } else {
      scrollTo(index, false);
      resizeWrapper(index);
      setItemVisibility(index);
      showUnderline();
    }
  }

  function scheduleNext() {
    if (!running) return;

    setTimeout(() => {
      // 1. Collapse underline
      hideUnderline();

      // 2. After underline collapses, scroll to next
      setTimeout(() => {
        const next = current + 1;

        if (next === allItems.length - 1) {
          // Animate to the duplicate (last item)
          showItem(next, true);

          // After it settles + holds, snap invisibly back to first
          setTimeout(() => {
            hideUnderline();
            setTimeout(() => {
              scrollTo(0, false);
              resizeWrapper(0);
              current = 0;
              setItemVisibility(0);
              showUnderline();
              scheduleNext();
            }, 300);
          }, HOLD);
          return;

        } else if (next >= allItems.length) {
          // Safety: shouldn't hit this, but reset if we do
          scrollTo(0, false);
          resizeWrapper(0);
          current = 0;
          setItemVisibility(0);
          showUnderline();
          scheduleNext();
          return;
        }

        showItem(next, true);
        scheduleNext();
      }, 300); // wait for underline collapse transition
    }, HOLD);
  }

  // ── Init ─────────────────────────────────────────────────────

  showItem(0, false);
  scheduleNext();

  function remeasure() {
    sizes = measureItems();
    offsets = computeOffsets(sizes);
    scrollTo(current, false);
    resizeWrapper(current);
  }

  // Re-measure on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(remeasure, 150);
  });

  // Initial measurement may have used fallback-font metrics; correct it
  // once the webfonts finish loading.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(remeasure);
  }
}
