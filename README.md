# QR CLI
<img src="docs/logo.svg" alt="qr-cli logo" width="96" height="96" />

A fast, minimal CLI for generating terminal and PNG QR codes.

## Features
- Render QR codes in the terminal
- Read input from arguments or stdin
- Save QR codes as PNG files
- Invert colors or use large rendering
- Cross-platform binaries available via GitHub Releases

## Install
Install directly from the public GitHub repo:
```bash
npm install -g github:asharahmed/qr-cli
```

Prefer a binary? Download one from the Releases page:
https://github.com/asharahmed/qr-cli/releases

## Quick start
```bash
qr "https://example.com"
echo "hello world" | qr
```

## Options
| Flag | Description |
| --- | --- |
| `-i, --invert` | Invert colors (for light terminals) |
| `-l, --large` | Use large mode (2 chars per module) |
| `-e, --error <level>` | Error correction level: L, M, Q, H |
| `--format <format>` | Output format: text, png, svg |
| `--size <px>` | PNG size in pixels |
| `--margin <px>` | Quiet zone margin in modules |
| `--raw` | Do not trim input |
| `--quiet` | Suppress non-essential output |
| `-o, --output <file>` | Save output to file, or use `-` for stdout |

## Examples
```bash
qr -l "Hello from the terminal"
qr -o code.png "https://example.com"
qr --format svg -o code.svg "https://example.com"
echo "secret message" | qr --format png -o -
echo "secret message" | qr -i
```

## Development
```bash
npm install
npm run build
node dist/index.js "hello"
```

## License
MIT
