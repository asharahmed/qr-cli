/**
 * QR-CLI Docs - Main Entry Point
 *
 * This file initializes all features and sets up the application.
 */

// Import CSS
import './styles/main.css';

// Import utilities
import { initErrorHandler } from './utils/error-handler.js';

// Import features
import { createParticles } from './features/particles.js';
import { initMobileMenu } from './features/mobile-menu.js';
import { initThemeToggle } from './features/theme-toggle.js';
import { generateHeroQR } from './features/hero-qr.js';
import { initDemoQR } from './features/demo/index.js';
import { initScrollAnimations } from './features/scroll-animations.js';
import { initActiveNavLink } from './features/active-nav.js';
import { initStatsCounter } from './features/stats-counter.js';
import { initDemoButtonFeedback } from './features/demo-feedback.js';
import { initVersionBadge } from './features/version-badge.js';
import { initScrollTop } from './features/scroll-top.js';

// Import global API
import { setupGlobalAPI } from './api/global-api.js';

// Initialize error handling first
initErrorHandler();

// Setup global API BEFORE DOMContentLoaded for onclick handlers
setupGlobalAPI();

// Initialize all features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    createParticles();
    initMobileMenu();
    initThemeToggle();
    generateHeroQR();
    initDemoQR();
    initScrollAnimations();
    initActiveNavLink();
    initStatsCounter();
    initDemoButtonFeedback();
    initVersionBadge();
    initScrollTop();
  } catch (err) {
    console.error('Initialization error:', err);
  }
});
