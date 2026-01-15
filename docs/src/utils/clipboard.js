import { showToast } from './toast.js';

/**
 * Copy text to clipboard with fallback for older browsers
 * @param {string} text - Text to copy
 * @param {HTMLElement} [button] - Button element for visual feedback
 */
export async function copyToClipboard(text, button) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    showToast('Copied to clipboard');

    // Handle button reference from event
    if (!button && typeof event !== 'undefined' && event && event.currentTarget) {
      button = event.currentTarget;
    }

    // Button animation feedback
    if (button && button.classList) {
      button.classList.add('copied');
      setTimeout(() => button.classList.remove('copied'), 600);
    }
  } catch (err) {
    console.error('Failed to copy:', err);
    showToast('Failed to copy');
  }
}
