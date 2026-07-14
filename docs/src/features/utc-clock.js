import { safeQuery } from '../utils/error-handler.js';

/**
 * Live UTC readout in the hero kicker. A real timestamp, not decoration.
 */
export function initUtcClock() {
  const el = safeQuery('#utcClock');
  if (!el) return;

  const tick = () => {
    el.textContent = new Date().toISOString().slice(11, 19);
  };

  tick();
  setInterval(tick, 1000);
}
