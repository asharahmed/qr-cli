import { safeQuery } from '../../utils/error-handler.js';

/**
 * Demo state container - holds references to all demo elements
 */
export const demoState = {
  demoInput: null,
  demoQR: null,
  demoCanvas: null,
  demoHint: null,
  demoMeta: null,
  demoCommandText: null,
  invertCheck: null,
  largeCheck: null,
  liveCheck: null,
  errorLevel: null,
  cellSize: null,
  cellSizeDisplay: null,
  optionInvert: null,
  optionLarge: null,
  optionLive: null,
};

/**
 * Initialize demo state by querying DOM elements
 * @returns {boolean} True if all required elements found
 */
export function initDemoState() {
  demoState.demoInput = safeQuery('#demoInput');
  demoState.demoQR = safeQuery('#demoQR');
  demoState.demoCanvas = safeQuery('#demoCanvas');
  demoState.demoHint = safeQuery('#demoHint');
  demoState.demoMeta = safeQuery('#demoMeta');
  demoState.demoCommandText = safeQuery('#demoCommandText');
  demoState.invertCheck = safeQuery('#invertCheck');
  demoState.largeCheck = safeQuery('#largeCheck');
  demoState.liveCheck = safeQuery('#liveCheck');
  demoState.errorLevel = safeQuery('#errorLevel');
  demoState.cellSize = safeQuery('#cellSize');
  demoState.cellSizeDisplay = safeQuery('#cellSizeValue');
  demoState.optionInvert = safeQuery('#optionInvert');
  demoState.optionLarge = safeQuery('#optionLarge');
  demoState.optionLive = safeQuery('#optionLive');

  // Check required elements
  return !!(demoState.demoInput && demoState.demoQR && demoState.demoCanvas);
}
