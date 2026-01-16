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

Type 'qr --format svg -o demo.svg "Hello QR"'
Enter
Sleep 2s
Type "ls demo.svg"
Enter
Sleep 2s

Type 'qr --format png -o demo.png "Hello QR"'
Enter
Sleep 2s
Type "ls demo.png"
Enter
Sleep 2s
TAPE

vhs /tmp/qr-demo.tape
