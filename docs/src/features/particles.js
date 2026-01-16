import { CONFIG } from '../config/constants.js';
import { safeQuery } from '../utils/error-handler.js';

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if device is low-end or mobile
 * Reduces particle count for better performance
 */
function isLowEndDevice() {
  // Check for mobile viewport
  const isMobile = window.innerWidth < 768;

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 2;
  const isLowSpec = cores <= 4;

  return isMobile || isLowSpec;
}

/**
 * Create QR-inspired floating particle effects
 * Uses square shapes of varying sizes to evoke QR code modules
 */
export function createParticles() {
  const container = safeQuery('#particles');
  if (!container) return;

  // Skip particles entirely if user prefers reduced motion
  if (prefersReducedMotion()) {
    container.style.display = 'none';
    return;
  }

  // Reduce particles on mobile/low-end devices for better performance
  const particleCount = isLowEndDevice()
    ? Math.floor(CONFIG.PARTICLE_COUNT / 2)
    : CONFIG.PARTICLE_COUNT;

  // QR-inspired size variations (modules are square)
  const sizes = [3, 4, 5, 6, 8];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random horizontal position
    particle.style.left = Math.random() * 100 + '%';

    // QR-inspired square sizes
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';

    // Varied animation timing for organic feel
    particle.style.animationDuration = Math.random() * 25 + 20 + 's';
    particle.style.animationDelay = Math.random() * 25 + 's';

    // Some particles drift slightly horizontally
    if (Math.random() > 0.7) {
      particle.style.setProperty('--drift', (Math.random() - 0.5) * 100 + 'px');
    }

    container.appendChild(particle);
  }
}
