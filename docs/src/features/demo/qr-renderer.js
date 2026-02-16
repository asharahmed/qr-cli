/* global qrcode */

import { generateQRCode } from '../qr-generator.js';
import { demoState } from './state.js';

/**
 * Render QR code to canvas for PNG export
 * @param {string} text - Text to encode
 */
export function renderQRToCanvas(text) {
  const { demoCanvas, errorLevel, cellSize, invertCheck } = demoState;
  if (!demoCanvas) return;

  try {
    const level = errorLevel?.value || 'M';
    const qr = qrcode(0, level);
    qr.addData(text);
    qr.make();

    const cellSizeNum = Number(cellSize?.value) || 10;
    const isInverted = invertCheck?.checked || false;
    const margin = 20;
    const size = qr.getModuleCount() * cellSizeNum + margin * 2;

    demoCanvas.width = size;
    demoCanvas.height = size;

    const ctx = demoCanvas.getContext('2d');
    ctx.fillStyle = isInverted ? '#000000' : '#ffffff';
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = isInverted ? '#ffffff' : '#000000';
    for (let row = 0; row < qr.getModuleCount(); row++) {
      for (let col = 0; col < qr.getModuleCount(); col++) {
        if (qr.isDark(row, col)) {
          ctx.fillRect(
            margin + col * cellSizeNum,
            margin + row * cellSizeNum,
            cellSizeNum,
            cellSizeNum
          );
        }
      }
    }
  } catch (err) {
    console.error('Canvas rendering failed:', err);
  }
}

/**
 * Render QR code as ASCII text
 * @param {string} text - Text to encode
 * @returns {string} ASCII QR code
 */
export function renderQRToText(text) {
  const isLarge = demoState.largeCheck?.checked || false;
  return generateQRCode(text, isLarge);
}

/**
 * Apply exact scaleY to make a QR text element render as a perfect square.
 * Measures actual layout dimensions and compensates for the monospace
 * character aspect ratio (chars are taller than wide).
 * @param {HTMLElement} element - The pre/code element containing QR text
 */
export function makeQRSquare(element) {
  if (!element) return;
  const style = getComputedStyle(element);
  const px = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  const py = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
  const contentW = element.scrollWidth - px;
  const contentH = element.scrollHeight - py;
  if (contentW > 0 && contentH > 0) {
    element.style.transform = `scaleY(${(contentW / contentH).toFixed(4)})`;
  }
}

/**
 * Get QR code metadata
 * @param {string} text - Text encoded
 * @returns {object} Metadata about the QR code
 */
export function getQRMetadata(text) {
  try {
    const level = demoState.errorLevel?.value || 'M';
    const qr = qrcode(0, level);
    qr.addData(text);
    qr.make();

    const moduleCount = qr.getModuleCount();
    const isLarge = demoState.largeCheck?.checked || false;
    const isInverted = demoState.invertCheck?.checked || false;
    const rows = isLarge ? moduleCount : Math.ceil(moduleCount / 2);

    return {
      moduleCount,
      rows,
      columns: moduleCount,
      isLarge,
      isInverted,
      errorLevel: level,
      textLength: text.length,
    };
  } catch (err) {
    return null;
  }
}
