import { CONFIG } from '../config/constants.js';
import { safeQuery } from './error-handler.js';

/**
 * Show a toast notification
 * @param {string} message - Message to display
 */
export function showToast(message) {
  const toast = safeQuery('#toast');
  const toastMessage = safeQuery('#toastMessage');

  if (!toast || !toastMessage) {
    console.warn('Toast elements not found');
    return;
  }

  toastMessage.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), CONFIG.TOAST_DURATION);
}
