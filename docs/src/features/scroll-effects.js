import { safeQuery } from '../utils/error-handler.js';

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

/**
 * Effects tied to scroll position, written as CSS custom properties once per frame:
 *  --out    on the hero, 0 → 1 as it scrolls away (it lifts and fades)
 *  --enter  on the stage and install card, 0 → 1 as they come up the viewport (tilt and scale settle)
 *  --depth  on the stage, its centre's offset from the viewport's, for parallax between layers
 * The stylesheet defaults every value to its resting state, so without this nothing moves.
 */
export function initScrollEffects() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = safeQuery('.hero');
  const stage = safeQuery('#stage');
  const install = safeQuery('#install');
  let queued = false;

  function frame() {
    queued = false;
    const vh = window.innerHeight;

    if (hero) {
      hero.style.setProperty('--out', clamp(window.scrollY / (hero.offsetHeight * 0.9)).toFixed(4));
    }

    if (stage) {
      const box = stage.getBoundingClientRect();
      // Flat once its top reaches a fifth of the way down the viewport.
      stage.style.setProperty('--enter', clamp((vh - box.top) / (vh * 0.8)).toFixed(4));
      stage.style.setProperty('--depth', clamp((box.top + box.height / 2 - vh / 2) / vh, -1, 1).toFixed(4));
    }

    if (install) {
      const box = install.getBoundingClientRect();
      install.style.setProperty('--enter', clamp((vh - box.top) / (vh * 0.6)).toFixed(4));
    }
  }

  const request = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(frame);
  };

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  frame();
}
