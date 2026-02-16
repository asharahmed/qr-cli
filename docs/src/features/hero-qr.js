import { generateQRCode } from './qr-generator.js';
import { makeQRSquare } from './demo/qr-renderer.js';
import { safeQuery } from '../utils/error-handler.js';

/**
 * Generate and display QR code in hero section
 */
export function generateHeroQR() {
  const qrOutput = safeQuery('#heroQR');
  if (qrOutput) {
    qrOutput.textContent = generateQRCode('https://github.com/asharahmed/qr-cli');
    makeQRSquare(qrOutput);
  }
}
