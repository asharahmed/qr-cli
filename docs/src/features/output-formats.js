import { safeQuery } from '../utils/error-handler.js';

const URL = 'https://qr-cli.dev';
const FORMATS = {
  text: `qr "${URL}"`,
  png: `qr "${URL}" -o code.png --size 512`,
  svg: `qr "${URL}" -o code.svg`,
  pipe: 'git remote get-url origin | qr -i',
};

/**
 * The "Output as" segmented control: a pill that springs between options and the
 * matching command below it. Arrow keys move between options.
 */
export function initOutputFormats() {
  const formats = safeQuery('#formats');
  const output = safeQuery('#copy-output');
  if (!formats || !output) return;

  const pill = formats.querySelector('.pill');
  const options = [...formats.querySelectorAll('button')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function choose(button, instant) {
    for (const option of options) option.setAttribute('aria-checked', String(option === button));
    if (instant) pill.style.transition = 'none';
    pill.style.width = `${button.offsetWidth}px`;
    pill.style.transform = `translateX(${button.offsetLeft}px)`;
    if (instant) requestAnimationFrame(() => (pill.style.transition = ''));
    output.textContent = FORMATS[button.dataset.format];
    if (!instant && !reduce.matches) {
      output.animate([{ opacity: 0, transform: 'translateY(4px)', filter: 'blur(2px)' }, { opacity: 1, transform: 'none', filter: 'none' }], { duration: 260, easing: 'ease-out' });
    }
  }

  const current = () => options.find(option => option.getAttribute('aria-checked') === 'true');

  options.forEach(button => button.addEventListener('click', () => choose(button, false)));
  formats.addEventListener('keydown', event => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    const index = options.indexOf(current());
    const next = options[(index + (event.key === 'ArrowRight' ? 1 : options.length - 1)) % options.length];
    choose(next, false);
    next.focus();
  });

  // Measure once fonts settle, and again whenever the layout changes width.
  choose(current(), true);
  document.fonts?.ready.then(() => choose(current(), true));
  addEventListener('resize', () => choose(current(), true));
}
