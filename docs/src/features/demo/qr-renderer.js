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
 * Make a QR text element render as a perfect square that fits its container.
 * Measures layout dimensions, scales font-size down if needed, applies scaleY
 * for exact squareness, and adds margin-bottom so the layout accounts for
 * the visual height increase.
 * @param {HTMLElement} element - The pre/code element containing QR text
 */
export function makeQRSquare(element) {
  if (!element) return;

  // Reset previous adjustments so we measure CSS-defined sizing
  element.style.transform = '';
  element.style.fontSize = '';
  element.style.marginBottom = '';

  const measure = () => {
    const s = getComputedStyle(element);
    const px = parseFloat(s.paddingLeft) + parseFloat(s.paddingRight);
    const py = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
    return {
      contentW: element.scrollWidth - px,
      contentH: element.scrollHeight - py,
      fontSize: parseFloat(s.fontSize),
    };
  };

  let { contentW, contentH, fontSize } = measure();
  if (contentW <= 0 || contentH <= 0) return;

  // Check if the resulting square fits the parent container
  const container = element.parentElement;
  if (container) {
    const cs = getComputedStyle(container);
    const availW = container.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);

    // Available height: container minus siblings and flex gaps
    let siblingsH = 0;
    const gap = parseFloat(cs.gap) || 0;
    let sibCount = 0;
    for (const child of container.children) {
      if (child !== element && getComputedStyle(child).display !== 'none') {
        siblingsH += child.offsetHeight;
        sibCount++;
      }
    }
    if (sibCount > 0) siblingsH += gap * (sibCount + 1);

    const availH = container.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - siblingsH;
    const maxSquare = Math.min(availW, Math.max(availH, 50));

    // Scale font-size down if the square (contentW × contentW) won't fit
    if (contentW > maxSquare) {
      element.style.fontSize = `${fontSize * (maxSquare / contentW)}px`;
      ({ contentW, contentH } = measure());
      if (contentW <= 0 || contentH <= 0) return;
    }
  }

  // Apply scaleY so visual height matches width (perfect square)
  const scaleY = contentW / contentH;
  element.style.transform = `scaleY(${scaleY.toFixed(4)})`;

  // scaleY increases visual height without affecting layout — add margin
  // so siblings aren't overlapped by the expanded element
  const extraH = element.offsetHeight * (scaleY - 1);
  element.style.marginBottom = `${extraH}px`;
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
