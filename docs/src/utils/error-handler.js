/**
 * Global error handler for graceful degradation
 */
export function initErrorHandler() {
  window.addEventListener('error', event => {
    console.error('Global error:', event.error);
  });

  window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason);
  });
}

/**
 * Safe DOM query with error handling
 * @param {string} selector - CSS selector
 * @param {Document|Element} context - Context to search in
 * @returns {Element|null} Found element or null
 */
export function safeQuery(selector, context = document) {
  try {
    return context.querySelector(selector);
  } catch (err) {
    console.error(`Failed to query selector: ${selector}`, err);
    return null;
  }
}

/**
 * Safe DOM query for multiple elements
 * @param {string} selector - CSS selector
 * @param {Document|Element} context - Context to search in
 * @returns {NodeList} Found elements
 */
export function safeQueryAll(selector, context = document) {
  try {
    return context.querySelectorAll(selector);
  } catch (err) {
    console.error(`Failed to query selector: ${selector}`, err);
    return [];
  }
}
