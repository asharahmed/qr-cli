import { safeQueryAll } from '../utils/error-handler.js';

/**
 * Elements carry data-px="0.02-0.14"; a scroll listener drives the CSS
 * `translate` property (so it composes with transform-based hover/reveal)
 * at that fraction of scroll delta. Headline lines splay at different rates.
 */
export function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = Array.from(safeQueryAll('[data-px]'))
    .map(el => ({ el, factor: parseFloat(el.dataset.px) || 0 }))
    .filter(t => t.factor !== 0);
  if (!targets.length) return;

  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    targets.forEach(({ el, factor }) => {
      el.style.translate = `0 ${(y * factor).toFixed(1)}px`;
    });
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  update();
}
