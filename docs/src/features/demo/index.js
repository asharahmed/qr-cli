import { showToast } from '../../utils/toast.js';
import { demoState, initDemoState } from './state.js';
import { updateCommandPreview } from './command-preview.js';
import { renderQRToText, renderQRToCanvas, getQRMetadata } from './qr-renderer.js';
import { downloadQR, copyAsciiQR, copyCommandPreview, clearDemo } from './actions.js';
import { initOptions } from './options.js';
import { initControls } from './controls.js';
import { initInputHandlers } from './input-handler.js';

/**
 * Generate demo QR code
 */
function generateDemoQR() {
  const { demoInput, demoQR, demoHint, demoMeta, invertCheck, largeCheck, errorLevel } = demoState;

  const text = demoInput?.value || 'https://qr-cli.dev';

  try {
    // Render ASCII QR
    const qrText = renderQRToText(text);
    if (demoQR) {
      demoQR.textContent = qrText;
      demoQR.classList.toggle('inverted', invertCheck?.checked);
      demoQR.classList.toggle('large', largeCheck?.checked);

      // Trigger regenerate animation
      demoQR.classList.remove('just-generated');
      void demoQR.offsetWidth; // Force reflow
      demoQR.classList.add('just-generated');
    }

    // Render canvas for PNG download
    renderQRToCanvas(text);

    // Update metadata
    const meta = getQRMetadata(text);
    if (meta && demoHint) {
      demoHint.textContent = `${demoInput?.value ? 'Ready' : 'Using default'} - ${meta.textLength} chars - Error correction ${meta.errorLevel}`;
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

    showToast('QR code generated!');
  } catch (e) {
    showToast('Error: Text too long or invalid');
    if (demoHint) demoHint.textContent = 'Error - Text too long or invalid';
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

  // Generate initial QR
  generateDemoQR();
}
