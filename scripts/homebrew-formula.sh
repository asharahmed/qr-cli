#!/usr/bin/env bash
# Fills packaging/homebrew/qr-cli.rb for a published release and writes it to the
# Homebrew tap as Formula/qr-cli.rb. Checksums come from GitHub's digests of the
# uploaded assets, so they always match what Homebrew downloads.
#
#   scripts/homebrew-formula.sh v1.1.5            # print the filled formula
#   scripts/homebrew-formula.sh v1.1.5 --publish  # also write it to the tap
#
# GH_TOKEN (or a gh login) must read this repo's releases; with --publish,
# TAP_TOKEN (falling back to the same credentials) must write to the tap.
set -euo pipefail

TAG="${1:?usage: homebrew-formula.sh vX.Y.Z [--publish]}"
PUBLISH="${2:-}"
VERSION="${TAG#v}"
REPO="${GITHUB_REPOSITORY:-asharahmed/qr-cli}"
TAP=asharahmed/homebrew-tap
FORMULA_PATH=Formula/qr-cli.rb
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

DIGESTS=$(gh api "repos/$REPO/releases/tags/$TAG" --jq '.assets[] | "\(.name) \(.digest)"')
digest() {
  local sha
  sha=$(printf '%s\n' "$DIGESTS" | awk -v name="$1" '$1 == name { sub(/^sha256:/, "", $2); print $2 }')
  [[ ${#sha} -eq 64 ]] || { echo "homebrew-formula: no digest for $1 on $TAG" >&2; exit 1; }
  printf '%s' "$sha"
}

FORMULA=$(sed \
  -e "s/__VERSION__/$VERSION/" \
  -e "s/__SHA_MACOS_ARM64__/$(digest qr-macos-arm64)/" \
  -e "s/__SHA_MACOS_X64__/$(digest qr-macos-x64)/" \
  -e "s/__SHA_LINUX_ARM64__/$(digest qr-linux-arm64)/" \
  -e "s/__SHA_LINUX_X64__/$(digest qr-linux-x64)/" \
  "$ROOT/packaging/homebrew/qr-cli.rb")

if [[ "$PUBLISH" != "--publish" ]]; then
  printf '%s\n' "$FORMULA"
  exit 0
fi

export GH_TOKEN="${TAP_TOKEN:-${GH_TOKEN:-}}"
[[ -n "$GH_TOKEN" ]] || unset GH_TOKEN
EXISTING=$(gh api "repos/$TAP/contents/$FORMULA_PATH" --jq .sha 2>/dev/null || true)
gh api -X PUT "repos/$TAP/contents/$FORMULA_PATH" \
  -f message="qr-cli $VERSION" \
  -f content="$(printf '%s\n' "$FORMULA" | base64 | tr -d '\n')" \
  ${EXISTING:+-f sha="$EXISTING"} --jq .commit.html_url
