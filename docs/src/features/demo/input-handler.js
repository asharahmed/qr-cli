import { CONFIG } from '../../config/constants.js';
import { debounce } from '../../utils/debounce.js';
import { demoState } from './state.js';
import { updateCommandPreview } from './command-preview.js';

/**
 * Initialize input handlers
 * @param {Function} generateFn - Generate QR function
 */
export function initInputHandlers(generateFn) {
  const { demoInput, demoHint, errorLevel, liveCheck } = demoState;

  if (!demoInput) return;

  // Debounced generate for live preview
  const debouncedGenerate = debounce(generateFn, CONFIG.LIVE_PREVIEW_DELAY);

  // Generate on Enter key
  demoInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      generateFn();
    }
  });

  // Live preview updates with debouncing
  demoInput.addEventListener('input', () => {
    const text = demoInput.value || 'https://qr-cli.dev';

    // Update hint
    if (demoHint) {
      const level = errorLevel?.value || 'M';
      demoHint.textContent = `${demoInput.value ? 'Ready' : 'Using default'} - ${text.length} chars - Error correction ${level}`;
    }

    // Update command preview
    updateCommandPreview(text);

    // Live generate if enabled
    if (liveCheck?.checked) {
      debouncedGenerate();
    }
  });
}
