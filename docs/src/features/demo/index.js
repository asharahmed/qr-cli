import { showToast } from '../../utils/toast.js';
import { QR_CAPACITY, CAPACITY_THRESHOLDS } from '../../config/constants.js';
import { demoState, initDemoState } from './state.js';
import { updateCommandPreview } from './command-preview.js';
import { renderQRToText, renderQRToCanvas, getQRMetadata, makeQRSquare } from './qr-renderer.js';
import { downloadQR, copyAsciiQR, copyCommandPreview, clearDemo } from './actions.js';
import { initOptions } from './options.js';
import { initControls } from './controls.js';
import { initInputHandlers } from './input-handler.js';

/**
 * Get capacity status for display
 */
function getCapacityStatus(text, level) {
  const maxCapacity = QR_CAPACITY[level] || QR_CAPACITY.M;
  const byteLength = new TextEncoder().encode(text).length;
  const percentage = Math.round((byteLength / maxCapacity) * 100);

  return { percentage, byteLength, maxCapacity };
}

/**
 * Generate demo QR code
 */
function generateDemoQR({ silent = false } = {}) {
  const { demoInput, demoQR, demoHint, demoMeta, invertCheck, largeCheck, errorLevel } = demoState;

  const text = demoInput?.value || 'https://qr-cli.dev';
  const level = errorLevel?.value || 'M';

  try {
    // Render ASCII QR
    const qrText = renderQRToText(text);
    if (demoQR) {
      demoQR.textContent = qrText;
      demoQR.classList.toggle('inverted', invertCheck?.checked);
      demoQR.classList.toggle('large', largeCheck?.checked);

      // Make QR perfectly square
      makeQRSquare(demoQR);

      // Trigger regenerate animation
      demoQR.classList.remove('just-generated');
      void demoQR.offsetWidth; // Force reflow
      demoQR.classList.add('just-generated');
    }

    // Render canvas for PNG download
    renderQRToCanvas(text);

    // Update metadata with capacity info
    const meta = getQRMetadata(text);
    const capacity = getCapacityStatus(text, level);

    if (meta && demoHint) {
      const baseText = demoInput?.value ? 'Ready' : 'Using default';
      let hintText;

      if (capacity.percentage >= CAPACITY_THRESHOLDS.CRITICAL) {
        hintText = `${capacity.percentage}% capacity - ${capacity.byteLength} bytes - Error correction ${meta.errorLevel}`;
      } else {
        hintText = `${baseText} - ${capacity.byteLength} bytes - Error correction ${meta.errorLevel}`;
      }

      demoHint.textContent = hintText;

      // Update styling based on capacity
      demoHint.classList.remove('capacity-warning', 'capacity-critical');
      if (capacity.percentage >= CAPACITY_THRESHOLDS.CRITICAL) {
        demoHint.classList.add('capacity-critical');
      } else if (capacity.percentage >= CAPACITY_THRESHOLDS.WARNING) {
        demoHint.classList.add('capacity-warning');
      }
    }

    if (meta && demoMeta) {
      demoMeta.innerHTML = `
        <span>Modules: ${meta.moduleCount}x${meta.moduleCount}</span>
        <span>Output: ${meta.rows}x${meta.columns}</span>
        <span>Mode: ${meta.isLarge ? 'Large' : 'Compact'}</span>
        <span>${meta.isInverted ? 'Inverted' : 'Standard'} colors</span>
      `;
    }

    // Update command preview
    updateCommandPreview(text);

    if (!silent) showToast('QR code generated!');
  } catch (e) {
    // Better error message with actionable suggestion
    const errorMsg = 'Text too long for QR code';
    const suggestion = 'Try shorter text or lower error correction level';

    showToast(`Error: ${errorMsg}`);
    if (demoHint) {
      demoHint.textContent = `Error - ${errorMsg}. ${suggestion}`;
      demoHint.classList.remove('capacity-warning');
      demoHint.classList.add('capacity-critical');
    }
    if (demoMeta) demoMeta.innerHTML = '';
  }
}

/**
 * Get demo actions for global API
 */
export function getDemoActions() {
  return {
    downloadQR,
    copyAsciiQR,
    copyCommandPreview,
    clearDemo,
    generateDemoQR,
  };
}

/**
 * Initialize demo QR interface
 */
export function initDemoQR() {
  // Initialize state (query DOM elements)
  if (!initDemoState()) {
    console.warn('Demo elements not found');
    return;
  }

  // Make generateDemoQR available globally
  window.generateDemoQR = generateDemoQR;

  // Initialize sub-modules
  initOptions(generateDemoQR);
  initControls(generateDemoQR);
  initInputHandlers(generateDemoQR);

  // Initialize command preview
  updateCommandPreview(demoState.demoInput?.value || 'https://qr-cli.dev');

  // Generate initial QR (silent — no toast on page load)
  generateDemoQR({ silent: true });
}
