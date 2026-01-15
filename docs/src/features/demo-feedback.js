import { ICONS } from '../config/constants.js';
import { safeQuery } from '../utils/error-handler.js';

/**
 * Initialize demo button feedback animations
 */
export function initDemoButtonFeedback() {
  const generateBtn = safeQuery('.demo-btn-generate');
  if (!generateBtn) return;

  const originalGenerateQR = window.generateDemoQR;
  if (!originalGenerateQR) return;

  window.generateDemoQR = function () {
    generateBtn.style.transform = 'scale(0.95)';
    generateBtn.innerHTML = `${ICONS.spinner} Generating...`;

    setTimeout(() => {
      originalGenerateQR();
      generateBtn.style.transform = '';
      generateBtn.innerHTML = `${ICONS.qrGrid} Generate QR`;
    }, 200);
  };
}
