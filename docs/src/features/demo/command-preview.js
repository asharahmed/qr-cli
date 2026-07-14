import { demoState } from './state.js';

/**
 * Escape user text for safe interpolation into markup
 * @param {string} text - Raw text
 * @returns {string} HTML-escaped text
 */
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Build command preview HTML
 * @param {string} text - Text to encode
 * @returns {string} HTML string for command preview
 */
export function buildCommandPreview(text) {
  const escaped = escapeHtml(text.replace(/"/g, '\\"'));
  const flags = [];

  if (demoState.invertCheck?.checked) flags.push('<span class="flag">-i</span>');
  if (demoState.largeCheck?.checked) flags.push('<span class="flag">-l</span>');

  const flagsText = flags.length ? ` ${flags.join(' ')}` : '';
  return `qr <span class="string">"${escaped}"</span>${flagsText}`;
}

/**
 * Update command preview display
 * @param {string} text - Text to encode
 */
export function updateCommandPreview(text) {
  if (demoState.demoCommandText) {
    demoState.demoCommandText.innerHTML = buildCommandPreview(text);
  }
}

/**
 * Get plain text command for copying
 * @param {string} text - Text to encode
 * @returns {string} Plain text command
 */
export function getPlainCommand(text) {
  const escaped = text.replace(/"/g, '\\"');
  const flags = [];

  if (demoState.invertCheck?.checked) flags.push('-i');
  if (demoState.largeCheck?.checked) flags.push('-l');

  const flagsText = flags.length ? ` ${flags.join(' ')}` : '';
  return `qr "${escaped}"${flagsText}`;
}
