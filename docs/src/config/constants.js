/**
 * Application configuration constants
 */
export const CONFIG = {
  TOAST_DURATION: 2000,
  LIVE_PREVIEW_DELAY: 300,
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
