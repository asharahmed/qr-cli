#!/usr/bin/env sh
set -eu

REPO="asharahmed/qr-cli"
TAG="latest"
INSTALL_DIR="${INSTALL_DIR:-$HOME/.local/bin}"

print_help() {
  echo "Usage: qr-linux-universal.sh [--tag vX.Y.Z] [--dir /path]"
  echo ""
  echo "Downloads the correct Linux binary and installs it as \"qr\"."
  echo "Defaults to the latest release and installs to \$HOME/.local/bin."
}

while [ $# -gt 0 ]; do
  case "$1" in
    --tag)
      TAG="$2"
      shift 2
      ;;
    --dir)
      INSTALL_DIR="$2"
      shift 2
      ;;
    -h|--help)
      print_help
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      print_help >&2
      exit 1
      ;;
  esac
done

ARCH="$(uname -m)"
case "$ARCH" in
  x86_64|amd64)
    ARCH="x64"
    ;;
  aarch64|arm64)
    ARCH="arm64"
    ;;
  *)
    echo "Unsupported architecture: $ARCH" >&2
    exit 1
    ;;
esac

ASSET="qr-linux-$ARCH"
if [ "$TAG" = "latest" ]; then
  URL="https://github.com/$REPO/releases/latest/download/$ASSET"
else
  URL="https://github.com/$REPO/releases/download/$TAG/$ASSET"
fi

TMP_FILE="$(mktemp)"
cleanup() {
  rm -f "$TMP_FILE"
}
trap cleanup EXIT

if command -v curl >/dev/null 2>&1; then
  curl -fsSL "$URL" -o "$TMP_FILE"
elif command -v wget >/dev/null 2>&1; then
  wget -qO "$TMP_FILE" "$URL"
else
  echo "curl or wget is required to download the binary." >&2
  exit 1
fi

chmod +x "$TMP_FILE"
mkdir -p "$INSTALL_DIR"
mv "$TMP_FILE" "$INSTALL_DIR/qr"

echo "Installed qr to $INSTALL_DIR/qr"
echo "Ensure $INSTALL_DIR is on your PATH."
