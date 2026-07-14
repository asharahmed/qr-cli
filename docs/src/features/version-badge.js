const GITHUB_RELEASES_URL = 'https://api.github.com/repos/asharahmed/qr-cli/releases/latest';
const CACHE_KEY = 'qrcli-latest-release';

function readCache() {
  try {
    return sessionStorage.getItem(CACHE_KEY) || '';
  } catch {
    return '';
  }
}

function writeCache(tag) {
  try {
    sessionStorage.setItem(CACHE_KEY, tag);
  } catch {
    // Storage unavailable; the fetch simply repeats next load.
  }
}

/**
 * Real data: the latest release tag from the GitHub API, cached client-side
 * per session, degrading to the build-time version on any failure.
 */
export async function initVersionBadge() {
  const badge = document.querySelector('.version-badge');
  if (!badge) {
    return;
  }

  const fallback = badge.getAttribute('data-version') || badge.textContent?.trim() || '';

  const apply = tag => {
    badge.textContent = tag.startsWith('v') ? tag : `v${tag}`;
    badge.title = `Latest release · ${badge.textContent}`;
  };

  const cached = readCache();
  if (cached) {
    apply(cached);
    return;
  }

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
      writeCache(tag);
      apply(tag);
      return;
    }
  } catch {
    // Fall back to the static version badge.
  }

  if (fallback) {
    badge.textContent = fallback;
  }
}
