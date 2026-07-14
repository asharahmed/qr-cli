/**
 * QR-CLI Docs - Main Entry Point
 *
 * This file initializes all features and sets up the application.
 * Styling: see /DESIGN.md (Ink & Paper editorial system).
 */

// Import utilities
import { initErrorHandler } from './utils/error-handler.js';

// Import features
import { initMobileMenu } from './features/mobile-menu.js';
import { generateHeroQR } from './features/hero-qr.js';
import { initHeroCarousel } from './features/hero-carousel.js';
import { initDemoQR } from './features/demo/index.js';
import { initReveals } from './features/reveal.js';
import { initParallax } from './features/parallax.js';
import { initNav } from './features/nav.js';
import { initActiveNavLink } from './features/active-nav.js';
import { initStatsCounter } from './features/stats-counter.js';
import { initVersionBadge } from './features/version-badge.js';
import { initUtcClock } from './features/utc-clock.js';

// Import global API
import { setupGlobalAPI } from './api/global-api.js';

// Reveal styles only apply when JS is running (no-JS users see everything)
document.documentElement.classList.add('js');

// Initialize error handling first
initErrorHandler();

// Setup global API BEFORE DOMContentLoaded for onclick handlers
setupGlobalAPI();

// Initialize all features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    initNav();
    initMobileMenu();
    generateHeroQR();
    initHeroCarousel();
    initDemoQR();
    initReveals();
    initParallax();
    initActiveNavLink();
    initStatsCounter();
    initVersionBadge();
    initUtcClock();
  } catch (err) {
    console.error('Initialization error:', err);
  }
});
