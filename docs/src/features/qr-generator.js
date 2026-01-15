/* global qrcode */

/**
 * Generate QR code as ASCII art
 * @param {string} text - Text to encode
 * @param {boolean} large - Use large rendering mode
 * @param {string} errorLevel - Error correction level (L/M/Q/H)
 * @returns {string} ASCII QR code
 */
export function generateQRCode(text, large = false, errorLevel = 'M') {
  if (typeof qrcode === 'undefined') {
    console.error('qrcode library not loaded');
    return 'Error: QR library not available';
  }

  try {
    const qr = qrcode(0, errorLevel);
    qr.addData(text);
    qr.make();

    const moduleCount = qr.getModuleCount();
    let output = '';

    if (large) {
      // Large mode: 2 chars per module for better aspect ratio
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          output += qr.isDark(row, col) ? '████' : '    ';
        }
        output += '\n';
      }
    } else {
      // Compact mode: use Unicode half blocks
      for (let row = 0; row < moduleCount; row += 2) {
        for (let col = 0; col < moduleCount; col++) {
          const top = qr.isDark(row, col);
          const bottom = row + 1 < moduleCount ? qr.isDark(row + 1, col) : false;

          if (top && bottom) {
            output += '██';
          } else if (top && !bottom) {
            output += '▀▀';
          } else if (!top && bottom) {
            output += '▄▄';
          } else {
            output += '  ';
          }
        }
        output += '\n';
      }
    }

    return output.trim();
  } catch (err) {
    console.error('QR generation failed:', err);
    return 'Error: Failed to generate QR code';
  }
}
