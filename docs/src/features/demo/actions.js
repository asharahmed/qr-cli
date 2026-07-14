import { showToast } from '../../utils/toast.js';
import { copyToClipboard } from '../../utils/clipboard.js';
import { demoState } from './state.js';
import { updateCommandPreview, getPlainCommand } from './command-preview.js';

/**
 * Download QR code as PNG
 */
export function downloadQR() {
  if (!demoState.demoQR?.textContent?.trim()) {
    showToast('Nothing to download yet');
    return;
  }

  const link = document.createElement('a');
  link.download = 'qrcode.png';
  link.href = demoState.demoCanvas.toDataURL('image/png');
  link.click();
  showToast('PNG downloaded');
}

/**
 * Copy ASCII QR code to clipboard
 */
export function copyAsciiQR() {
  if (!demoState.demoQR?.textContent?.trim()) {
    showToast('Nothing to copy yet');
    return;
  }

  copyToClipboard(demoState.demoQR.textContent);
  showToast('ASCII copied');
}

/**
 * Copy command preview to clipboard
 */
export function copyCommandPreview() {
  const text = demoState.demoInput?.value || 'https://qr-cli.dev';
  copyToClipboard(getPlainCommand(text));
  showToast('Command copied');
}

/**
 * Clear demo input and output
 */
export function clearDemo() {
  if (demoState.demoInput) demoState.demoInput.value = '';
  if (demoState.demoQR) demoState.demoQR.textContent = '';
  if (demoState.demoMeta) demoState.demoMeta.innerHTML = '';
  if (demoState.demoHint) demoState.demoHint.textContent = 'Waiting for input';

  updateCommandPreview('https://qr-cli.dev');
  showToast('Cleared');
}
