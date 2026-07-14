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
