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
Type "qlmanage -t -s 512 -o /tmp demo.svg >/dev/null 2>&1"
Enter
Sleep 1s
Type "imgcat /tmp/demo.svg.png"
Enter
Sleep 2s

Type 'qr --format png -o demo.png "Hello QR"'
Enter
Sleep 2s
Type "imgcat demo.png"
Enter
Sleep 2s
TAPE

vhs /tmp/qr-demo.tape
