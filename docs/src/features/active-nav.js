import { safeQueryAll } from '../utils/error-handler.js';

/**
 * Initialize active nav link highlighting on scroll
 */
export function initActiveNavLink() {
  const sections = safeQueryAll('section[id]');
  const navLinks = safeQueryAll('.nav-links a');
  let ticking = false;

  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateActiveLink);
      ticking = true;
    }
  });
}
