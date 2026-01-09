# QR CLI

Generate QR codes in your terminal or save them as PNG files.

## Features
- Render QR codes in the terminal
- Read input from arguments or stdin
- Save QR codes as PNG files
- Invert colors or use large rendering

## Install (GitHub Packages)
1) Configure npm to use GitHub Packages for the @asharahmed scope:
```bash
npm config set @asharahmed:registry https://npm.pkg.github.com
```

2) Authenticate to GitHub Packages (requires a PAT with read:packages and write:packages):
```bash
npm login --registry=https://npm.pkg.github.com --scope=@asharahmed
```

3) Install the CLI:
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

## Publishing
Publishing is handled by GitHub Actions. Create a GitHub Release on the repo
and the workflow will publish to GitHub Packages.

## License
MIT
