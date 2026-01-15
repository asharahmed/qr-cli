import { CONFIG } from '../config/constants.js';
import { safeQuery } from '../utils/error-handler.js';

/**
 * Create floating particle effects
 */
export function createParticles() {
  const container = safeQuery('#particles');
  if (!container) return;

  const particleCount = CONFIG.PARTICLE_COUNT;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.width = Math.random() * 4 + 2 + 'px';
    particle.style.height = particle.style.width;
    particle.style.animationDuration = Math.random() * 20 + 15 + 's';
    particle.style.animationDelay = Math.random() * 20 + 's';
    container.appendChild(particle);
  }
}
