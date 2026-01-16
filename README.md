# QR CLI
[![Release](https://img.shields.io/github/v/release/asharahmed/qr-cli)](https://github.com/asharahmed/qr-cli/releases)
[![Node](https://img.shields.io/badge/node-%3E%3D20-2E6E4A?logo=node.js&logoColor=white)](https://nodejs.org/)
[![GitHub Packages](https://img.shields.io/badge/GitHub%20Packages-@asharahmed/qr--cli-blue)](https://github.com/asharahmed/qr-cli/packages)
[![Build](https://img.shields.io/github/actions/workflow/status/asharahmed/qr-cli/deploy.yml?label=docs)](https://github.com/asharahmed/qr-cli/actions/workflows/deploy.yml)
[![Release Binaries](https://img.shields.io/github/actions/workflow/status/asharahmed/qr-cli/release-binaries.yml?label=release%20binaries)](https://github.com/asharahmed/qr-cli/actions/workflows/release-binaries.yml)
[![Dependencies](https://img.shields.io/badge/dependencies-2-green)](package.json)
[![License](https://img.shields.io/github/license/asharahmed/qr-cli)](LICENSE)

<img src="docs/logo.svg" alt="qr-cli logo" width="96" height="96" />

![CLI demo](docs/cli-demo.gif?v=7)

A fast, minimal CLI for generating terminal and PNG QR codes.

**[Try it online](https://qr-cli.dev/#try-it)** | **[Website](https://qr-cli.dev)**

## Features
- Render QR codes in the terminal
- Read input from arguments or stdin
- Save QR codes as PNG files
- Invert colors or use large rendering
- Cross-platform binaries available via GitHub Releases

## Quick Start
No install needed — run directly with npx:
```bash
npx github:asharahmed/qr-cli "https://example.com"
```

## Install
For frequent use, install globally:
```bash
npm install -g github:asharahmed/qr-cli
```

Prefer a binary? Download from [Releases](https://github.com/asharahmed/qr-cli/releases).

## Release Binaries
Supported targets:
- Linux: x64, arm64
- macOS: x64, arm64, universal
- Windows: x64, arm64

Universal installers (auto-pick the right binary):
- Linux: `qr-linux-universal.sh`
- Windows: `qr-windows-universal.ps1`

Grab them from the GitHub Releases assets and run locally:
```bash
curl -fsSL -o qr-linux-universal.sh https://github.com/asharahmed/qr-cli/releases/latest/download/qr-linux-universal.sh
bash qr-linux-universal.sh
```
```powershell
Invoke-WebRequest -Uri https://github.com/asharahmed/qr-cli/releases/latest/download/qr-windows-universal.ps1 -OutFile qr-windows-universal.ps1
powershell -ExecutionPolicy Bypass -File qr-windows-universal.ps1 -AddToPath
```

Defaults:
- Linux installs to `$HOME/.local/bin` (override with `--dir /path`)
- Windows installs to `%LOCALAPPDATA%\\qr-cli\\bin` (override with `-InstallDir "C:\\path"`)

Example usage:
```bash
bash qr-linux-universal.sh
```
```powershell
powershell -ExecutionPolicy Bypass -File qr-windows-universal.ps1 -AddToPath
```

Latest version: see the GitHub Releases page.

## Options
| Flag | Description |
| --- | --- |
| `-i, --invert` | Invert colors (for light terminals) |
| `-l, --large` | Use large mode (2 chars per module) |
| `-f, --file <path>` | Read input from a file |
| `-e, --error <level>` | Error correction level: L, M, Q, H |
| `--format <format>` | Output format: text, png, svg |
| `--size <px>` | PNG size in pixels |
| `--margin <px>` | Quiet zone margin in modules |
| `--border <modules>` | Text output quiet zone size in modules |
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

## Troubleshooting
- **No input provided**: pass text as an argument (`qr "text"`) or pipe stdin (`echo "text" | qr`).
- **PNG stdout error**: if you see “Refusing to write PNG to terminal”, use `-o <file>` or pipe output to a file.
- **Command not found**: run with `npx github:asharahmed/qr-cli "text"` or install globally via npm.

## Development
```bash
npm install
npm run build
node dist/index.js "hello"
```

## License
MIT
