import { CONFIG, QR_CAPACITY, CAPACITY_THRESHOLDS } from '../../config/constants.js';
import { debounce } from '../../utils/debounce.js';
import { demoState } from './state.js';
import { updateCommandPreview } from './command-preview.js';

/**
 * Calculate capacity percentage for given text and error level
 * @param {string} text - Input text
 * @param {string} level - Error correction level (L, M, Q, H)
 * @returns {{ percentage: number, status: 'ok' | 'warning' | 'critical' | 'exceeded' }}
 */
function getCapacityInfo(text, level) {
  const maxCapacity = QR_CAPACITY[level] || QR_CAPACITY.M;
  const byteLength = new TextEncoder().encode(text).length;
  const percentage = Math.round((byteLength / maxCapacity) * 100);

  let status = 'ok';
  if (percentage >= 100) {
    status = 'exceeded';
  } else if (percentage >= CAPACITY_THRESHOLDS.CRITICAL) {
    status = 'critical';
  } else if (percentage >= CAPACITY_THRESHOLDS.WARNING) {
    status = 'warning';
  }

  return { percentage, status, byteLength, maxCapacity };
}

/**
 * Format capacity hint text
 * @param {object} capacityInfo - Capacity information
 * @param {string} level - Error correction level
 * @param {boolean} hasInput - Whether user has entered text
 * @returns {string}
 */
function formatCapacityHint(capacityInfo, level, hasInput) {
  const { percentage, status, byteLength } = capacityInfo;
  const baseText = hasInput ? 'Ready' : 'Using default';

  if (status === 'exceeded') {
    return `⚠ Text too long! ${byteLength} bytes exceeds limit - Try shorter text or lower error correction`;
  }
  if (status === 'critical') {
    return `⚠ ${percentage}% capacity - ${byteLength} bytes - Error correction ${level}`;
  }
  if (status === 'warning') {
    return `${baseText} - ${percentage}% capacity - ${byteLength} bytes - Error correction ${level}`;
  }
  return `${baseText} - ${byteLength} bytes - Error correction ${level}`;
}

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
    const level = errorLevel?.value || 'M';

    // Calculate capacity and update hint
    if (demoHint) {
      const capacityInfo = getCapacityInfo(text, level);
      demoHint.textContent = formatCapacityHint(capacityInfo, level, !!demoInput.value);

      // Update hint styling based on capacity status
      demoHint.classList.remove('capacity-warning', 'capacity-critical');
      if (capacityInfo.status === 'warning') {
        demoHint.classList.add('capacity-warning');
      } else if (capacityInfo.status === 'critical' || capacityInfo.status === 'exceeded') {
        demoHint.classList.add('capacity-critical');
      }
    }

    // Update command preview
    updateCommandPreview(text);

    // Live generate if enabled
    if (liveCheck?.checked) {
      debouncedGenerate();
    }
  });
}
