import { generateQRCode } from './qr-generator.js';
import { springs } from './motion.js';
import { safeQuery } from '../utils/error-handler.js';

const COMMAND = 'qr "https://qr-cli.dev"';

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function play(node, keyframes, options) {
  return node.animate(keyframes, { fill: 'forwards', ...options }).finished.catch(() => {});
}

/**
 * The hero demo: the command types into Terminal, the code prints row by row, and a phone
 * rises to scan it. Plays while on screen; a click replays it.
 */
export function initStage() {
  const stage = safeQuery('#stage');
  const qr = safeQuery('#heroQR');
  if (!stage || !qr) return;

  const typed = safeQuery('#stageTyped');
  const cursor = safeQuery('#stageCursor');
  const after = stage.querySelector('.term-after');
  const phone = stage.querySelector('.phone');
  const keys = stage.querySelector('.keys');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  const text = generateQRCode('https://qr-cli.dev');
  qr.textContent = text;
  const phoneQR = safeQuery('#phoneQR');
  if (phoneQR) phoneQR.textContent = text;
  const rows = text.split('\n').length;

  let run = 0;
  let visible = false;

  function reset() {
    phone.classList.remove('locked', 'done');
    for (const node of [qr, after, phone, keys]) node.getAnimations().forEach(animation => animation.cancel());
    typed.textContent = '';
    cursor.hidden = false;
  }

  function finalFrame() {
    reset();
    typed.textContent = COMMAND;
    cursor.hidden = true;
    qr.animate([{ clipPath: 'inset(0 0 0 0)' }], { fill: 'forwards', duration: 0 });
    after.animate([{ opacity: 1 }], { fill: 'forwards', duration: 0 });
    phone.animate([{ opacity: 1, transform: 'none' }], { fill: 'forwards', duration: 0 });
    phone.classList.add('locked', 'done');
  }

  async function demo() {
    const id = ++run;
    const alive = () => id === run;
    reset();
    if (reduce.matches) return finalFrame();

    // Type the command, a little unevenly, like a person.
    cursor.classList.add('busy');
    await wait(500);
    for (const char of COMMAND) {
      if (!alive()) return;
      typed.textContent += char;
      await wait(char === ' ' ? 90 : 38 + Math.random() * 50);
    }
    cursor.classList.remove('busy');
    await wait(260);
    if (!alive()) return;

    // Return.
    play(keys, [{ opacity: 0, transform: 'translateX(-50%) translateY(10px)' }, { opacity: 1, transform: 'translateX(-50%)' }], { duration: 220, easing: 'ease-out' });
    play(keys, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, delay: 700 });
    await wait(240);
    if (!alive()) return;

    // The code prints top to bottom, one row per frame or so.
    cursor.hidden = true;
    await play(qr, [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: rows * 28, easing: `steps(${rows}, end)` });
    play(after, [{ opacity: 0 }, { opacity: 1 }], { duration: 1 });
    await wait(500);
    if (!alive()) return;

    // A phone comes up to scan it.
    const rise = springs.smooth;
    await play(phone, [{ opacity: 0, transform: 'translateY(46cqw) rotate(4deg)' }, { opacity: 1, transform: 'none' }], { duration: rise.duration + 200, easing: rise.easing });
    await wait(250);
    if (!alive()) return;
    phone.classList.add('locked');
    await wait(550);
    if (!alive()) return;
    phone.classList.add('done');
    await wait(3000);
    if (!alive()) return;

    await play(phone, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(10cqw)' }], { duration: 300, easing: 'cubic-bezier(0.4, 0, 1, 1)' });
    await wait(1200);
    if (alive() && visible) demo();
  }

  new IntersectionObserver(
    ([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (visible && !wasVisible) demo();
    },
    { threshold: 0.4 }
  ).observe(stage);

  stage.addEventListener('click', demo);

  const clock = safeQuery('#clock');
  if (clock) clock.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}
