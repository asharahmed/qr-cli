/**
 * Springs shared with the Screenshotr site: the damped harmonic oscillator SwiftUI uses,
 * described by `response` in seconds and `dampingFraction`, solved into CSS linear() curves.
 * Each one is published as --spring-<name> and --spring-<name>-duration so stylesheets and
 * script animations move the same way.
 */
function spring(response, damping) {
  const omega = (2 * Math.PI) / response;
  const position = t => {
    if (damping >= 1) return 1 - Math.exp(-omega * t) * (1 + omega * t);
    const damped = omega * Math.sqrt(1 - damping * damping);
    const decay = Math.exp(-damping * omega * t);
    return 1 - decay * (Math.cos(damped * t) + ((damping * omega) / damped) * Math.sin(damped * t));
  };
  // Run until the motion stays within 0.1% of rest.
  let settle = 0.1;
  for (let t = 0; t < 2.5; t += 0.004) if (Math.abs(1 - position(t)) > 0.001) settle = t;
  const steps = 60;
  const points = [];
  for (let i = 0; i <= steps; i += 1) points.push(i === steps ? 1 : +position((settle * i) / steps).toFixed(4));
  return { easing: `linear(${points.join(', ')})`, duration: Math.round(settle * 1000) };
}

export const springs = {
  // Controls: quick, no visible overshoot.
  snappy: spring(0.3, 0.88),
  // Navigation and layout: unhurried and settled.
  smooth: spring(0.42, 1),
  // Things that arrive or confirm: a little life.
  bouncy: spring(0.4, 0.66),
  // Larger moments, like a section revealing.
  gentle: spring(0.62, 0.86),
};

export function initMotion() {
  // Browsers without linear() keep the ease-out fallbacks in the stylesheet.
  if (!CSS.supports('transition-timing-function', 'linear(0, 1)')) return;
  const root = document.documentElement.style;
  for (const [name, curve] of Object.entries(springs)) {
    root.setProperty(`--spring-${name}`, curve.easing);
    root.setProperty(`--spring-${name}-duration`, `${curve.duration}ms`);
  }
}
