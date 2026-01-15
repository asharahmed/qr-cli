import { demoState } from './state.js';
import { updateCommandPreview } from './command-preview.js';

/**
 * Create option toggle handler
 * @param {HTMLElement} option - Option container element
 * @param {HTMLInputElement} checkbox - Associated checkbox
 * @param {Function} generateFn - Generate QR function
 * @param {boolean} triggerLivePreview - Whether to trigger live preview
 */
export function createOptionToggle(option, checkbox, generateFn, triggerLivePreview = true) {
  if (!option || !checkbox) return;

  option.addEventListener('click', () => {
    checkbox.checked = !checkbox.checked;
    option.classList.toggle('active', checkbox.checked);

    if (triggerLivePreview && demoState.liveCheck?.checked) {
      generateFn();
    } else {
      updateCommandPreview(demoState.demoInput?.value || 'https://qr-cli.dev');
    }
  });
}

/**
 * Initialize all option toggles
 * @param {Function} generateFn - Generate QR function
 */
export function initOptions(generateFn) {
  const { optionInvert, invertCheck, optionLarge, largeCheck, optionLive, liveCheck } = demoState;

  // Set up toggles
  createOptionToggle(optionInvert, invertCheck, generateFn);
  createOptionToggle(optionLarge, largeCheck, generateFn);
  createOptionToggle(optionLive, liveCheck, generateFn, false);

  // Special handling for live check - generate immediately when enabled
  if (optionLive) {
    optionLive.addEventListener('click', () => {
      if (liveCheck?.checked) {
        generateFn();
      }
    });
  }

  // Initialize visual states
  if (optionInvert) optionInvert.classList.toggle('active', invertCheck?.checked);
  if (optionLarge) optionLarge.classList.toggle('active', largeCheck?.checked);
  if (optionLive) optionLive.classList.toggle('active', liveCheck?.checked);
}
