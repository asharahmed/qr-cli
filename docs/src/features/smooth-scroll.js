import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/**
 * Inertial scrolling. Lenis eases the page toward each wheel or trackpad target, so a flick
 * glides and settles instead of stopping dead. Anchor links glide too, honouring the
 * stylesheet's scroll-padding-top. Lenis leaves the page native under Reduce Motion.
 */
export function initSmoothScroll() {
  const lenis = new Lenis({
    autoRaf: true,
    // Lower is slower and heavier; 0.1 is Lenis's default.
    lerp: 0.085,
    wheelMultiplier: 0.9,
    anchors: true,
  });
  return lenis;
}
