/**
 * QR-CLI Docs - Main Entry Point
 *
 * This file initializes all features and sets up the application.
 * Styling follows the Screenshotr site: see styles.css.
 */

// Import utilities
import { initErrorHandler } from './utils/error-handler.js';

// Import features
import { initMotion } from './features/motion.js';
import { initNav } from './features/nav.js';
import { initStage } from './features/stage.js';
import { initOutputFormats } from './features/output-formats.js';
import { initDemoQR } from './features/demo/index.js';
import { initReveals } from './features/reveal.js';
import { initInstallCopy } from './features/install-copy.js';
import { initVersionBadge } from './features/version-badge.js';

// Import global API
import { setupGlobalAPI } from './api/global-api.js';

// Reveal styles only apply when JS is running (no-JS users see everything)
document.documentElement.classList.add('js');

// Initialize error handling first
initErrorHandler();

// Springs go on :root before anything transitions
initMotion();

// Setup global API BEFORE DOMContentLoaded for onclick handlers
setupGlobalAPI();

// Initialize all features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    initNav();
    initStage();
    initOutputFormats();
    initDemoQR();
    initReveals();
    initInstallCopy();
    initVersionBadge();
  } catch (err) {
    console.error('Initialization error:', err);
  }
});
