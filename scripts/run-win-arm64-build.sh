#!/usr/bin/env bash
set -euo pipefail

VM_NAME="Windows 11"
TAG="${1:-v1.1.5}"
REPO="asharahmed/qr-cli"
RUNNER_NAME="win-arm64-runner"
WORKFLOW_PATH=".github/workflows/release-win-arm64.yml"

# Start VM if not running
if ! prlctl status "$VM_NAME" | grep -q "running"; then
  echo "Starting VM: $VM_NAME"
  prlctl start "$VM_NAME"
fi

# Wait for runner to come online (max 10 minutes)
echo "Waiting for runner to be online..."
for i in {1..120}; do
  status=$(gh api "/repos/$REPO/actions/runners" --jq ".runners[] | select(.name==\"$RUNNER_NAME\") | .status" 2>/dev/null || true)
  if [ "$status" = "online" ]; then
    echo "Runner is online."
    break
  fi
  sleep 5
done

if [ "${status:-}" != "online" ]; then
  echo "Runner did not come online in time."
  exit 1
fi

# Trigger build
echo "Triggering ARM64 build for $TAG..."
gh workflow run "$WORKFLOW_PATH" -f tag="$TAG"

# Get latest run ID for this workflow
sleep 3
RUN_ID=$(gh run list --workflow "$WORKFLOW_PATH" --limit 1 --json databaseId --jq '.[0].databaseId')
echo "Watching run: $RUN_ID"
gh run watch "$RUN_ID"

# Optional: shut down VM after build
# prlctl stop "$VM_NAME"

echo "Done."
