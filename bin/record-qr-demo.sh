#!/usr/bin/env bash
set -euo pipefail

cat > /tmp/qr-demo.tape <<'TAPE'
Output docs/cli-demo.gif
Set FontSize 20
Set Width 900
Set Height 520
Set Theme "Builtin Dark"
Type 'qr "https://qr-cli.dev"'
Enter
Sleep 2s

Clear
Type 'qr --invert "Hello QR"'
Enter
Sleep 2s

Clear
Type 'qr --border 0 "No Border"'
Enter
Sleep 2s
TAPE

vhs /tmp/qr-demo.tape
