# QR CLI
<img src="docs/logo.svg" alt="qr-cli logo" width="96" height="96" />

Generate QR codes in your terminal or save them as PNG files.
Short description: A fast, minimal CLI for generating terminal and PNG QR codes.

## Features
- Render QR codes in the terminal
- Read input from arguments or stdin
- Save QR codes as PNG files
- Invert colors or use large rendering

## Install
Install directly from the public GitHub repo:
```bash
npm install -g github:asharahmed/qr-cli
```

## Install (GitHub Packages)
Configure npm for the @asharahmed scope:
```bash
npm config set @asharahmed:registry https://npm.pkg.github.com
```

Then install the CLI:
```bash
npm install -g @asharahmed/qr-cli
```

## Usage
```bash
qr "https://example.com"
echo "hello world" | qr
```

Options:
- `-i, --invert` Invert colors (for light terminals)
- `-l, --large` Use large mode (2 chars per module)
- `-o, --output <file>` Save as PNG file

Examples:
```bash
qr -l "Hello from the terminal"
qr -o code.png "https://example.com"
```

## Development
```bash
npm install
npm run build
node dist/index.js "hello"
```

## License
MIT
