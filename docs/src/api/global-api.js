import { copyToClipboard } from '../utils/clipboard.js';
import { getDemoActions } from '../features/demo/index.js';

/**
 * Setup global API for inline onclick handlers
 * Must be called before DOMContentLoaded
 */
export function setupGlobalAPI() {
  // Always-available utility
  window.copyToClipboard = copyToClipboard;

  // Demo actions will be set up after demo initializes
  // For now, create placeholder functions that will work once demo is ready
  const demoActions = getDemoActions();

  window.downloadQR = demoActions.downloadQR;
  window.copyAsciiQR = demoActions.copyAsciiQR;
  window.copyCommandPreview = demoActions.copyCommandPreview;
  window.clearDemo = demoActions.clearDemo;
  // Note: generateDemoQR is set in demo/index.js during initDemoQR
}
