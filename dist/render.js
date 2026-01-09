"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderQRCode = renderQRCode;
const BLOCKS = {
    FULL: '█',
    TOP: '▀',
    BOTTOM: '▄',
    EMPTY: ' ',
};
function renderQRCode(matrix, options = {}) {
    const { invert = false, small = true } = options;
    const { data, size } = matrix;
    // Add quiet zone (border)
    const quietZone = 2;
    const paddedSize = size + quietZone * 2;
    const padded = [];
    for (let y = 0; y < paddedSize; y++) {
        const row = [];
        for (let x = 0; x < paddedSize; x++) {
            const srcY = y - quietZone;
            const srcX = x - quietZone;
            if (srcY >= 0 && srcY < size && srcX >= 0 && srcX < size) {
                row.push(data[srcY][srcX]);
            }
            else {
                row.push(false); // quiet zone is white (false = light)
            }
        }
        padded.push(row);
    }
    if (small) {
        return renderSmall(padded, paddedSize, invert);
    }
    else {
        return renderLarge(padded, paddedSize, invert);
    }
}
function renderSmall(data, size, invert) {
    const lines = [];
    // Process two rows at a time using half-block characters
    for (let y = 0; y < size; y += 2) {
        let line = '';
        for (let x = 0; x < size; x++) {
            const top = data[y]?.[x] ?? false;
            const bottom = data[y + 1]?.[x] ?? false;
            // In QR codes: true = dark module, false = light module
            // For dark terminal: dark=white text, light=black (space)
            // For invert (light terminal): swap the colors
            const topDark = invert ? !top : top;
            const bottomDark = invert ? !bottom : bottom;
            if (topDark && bottomDark) {
                line += BLOCKS.FULL;
            }
            else if (topDark && !bottomDark) {
                line += BLOCKS.TOP;
            }
            else if (!topDark && bottomDark) {
                line += BLOCKS.BOTTOM;
            }
            else {
                line += BLOCKS.EMPTY;
            }
        }
        lines.push(line);
    }
    return lines.join('\n');
}
function renderLarge(data, size, invert) {
    const lines = [];
    for (let y = 0; y < size; y++) {
        let line = '';
        for (let x = 0; x < size; x++) {
            const isDark = data[y][x];
            const show = invert ? !isDark : isDark;
            // Use two characters per module for better aspect ratio
            line += show ? '██' : '  ';
        }
        lines.push(line);
    }
    return lines.join('\n');
}
