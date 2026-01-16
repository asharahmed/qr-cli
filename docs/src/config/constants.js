/**
 * Application configuration constants
 */
export const CONFIG = {
  PARTICLE_COUNT: 30,
  TOAST_DURATION: 2000,
  LIVE_PREVIEW_DELAY: 300,
  THEME_STORAGE_KEY: 'qrcli-theme',
  ANIMATION_DELAY_STEP: 0.05,
};

/**
 * QR code capacity limits by error correction level (bytes)
 * These are approximate limits for binary/byte mode
 */
export const QR_CAPACITY = {
  L: 2953,  // 7% error correction
  M: 2331,  // 15% error correction
  Q: 1663,  // 25% error correction
  H: 1273,  // 30% error correction
};

/**
 * Capacity warning thresholds (percentages)
 */
export const CAPACITY_THRESHOLDS = {
  WARNING: 70,   // Show warning at 70%
  CRITICAL: 90,  // Show critical warning at 90%
};

/**
 * Reusable SVG icons
 */
export const ICONS = {
  checkmark:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
  cross:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
  qrGrid:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>',
  spinner:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 0.8s linear infinite;"><circle cx="12" cy="12" r="10" stroke-dasharray="40" stroke-dashoffset="10"></circle></svg>',
};
