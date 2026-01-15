import { demoState } from './state.js';

/**
 * Initialize control listeners (error level, cell size)
 * @param {Function} generateFn - Generate QR function
 */
export function initControls(generateFn) {
  const { errorLevel, cellSize, cellSizeDisplay, liveCheck } = demoState;

  // Error level change
  if (errorLevel) {
    errorLevel.addEventListener('change', () => {
      if (liveCheck?.checked) {
        generateFn();
      }
    });
  }

  // Cell size slider
  if (cellSize && cellSizeDisplay) {
    cellSizeDisplay.textContent = `${cellSize.value} px`;

    cellSize.addEventListener('input', () => {
      cellSizeDisplay.textContent = `${cellSize.value} px`;
      if (liveCheck?.checked) {
        generateFn();
      }
    });
  }
}
