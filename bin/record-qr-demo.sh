#!/usr/bin/env bash
set -euo pipefail

cat > /tmp/qr-demo.tape <<'TAPE'
Output docs/cli-demo.gif
Set FontSize 20
Set Width 900
Set Height 520
Set Theme "Builtin Dark"
Set Loop true

Type "qr \"https://example.com\""
Enter
Wait 1s

Type "qr --format svg -o demo.svg \"Hello QR\""
Enter
Wait 1s
Type "ls demo.svg"
Enter
Wait 1s

Type "qr --format png -o demo.png \"Hello QR\""
Enter
Wait 1s
Type "ls demo.png"
Enter
Wait 1s
TAPE

vhs /tmp/qr-demo.tape
