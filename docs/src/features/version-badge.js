const GITHUB_RELEASES_URL = 'https://api.github.com/repos/asharahmed/qr-cli/releases/latest';

export async function initVersionBadge() {
  const badge = document.querySelector('.version-badge');
  if (!badge) {
    return;
  }

  const fallback = badge.getAttribute('data-version') || badge.textContent?.trim() || '';

  try {
    const response = await fetch(GITHUB_RELEASES_URL, {
      headers: {
        Accept: 'application/vnd.github+json',
      },
    });

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    const tag = typeof data.tag_name === 'string' ? data.tag_name.trim() : '';

    if (tag) {
      badge.textContent = tag.startsWith('v') ? tag : `v${tag}`;
      badge.title = `Latest release: ${badge.textContent}`;
      return;
    }
  } catch {
    // Fall back to the static version badge.
  }

  if (fallback) {
    badge.textContent = fallback;
  }
}
