import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

// Ensure dist directory exists
mkdirSync(distDir, { recursive: true });

// Copy static assets
const assets = ['CNAME', 'logo.svg', 'qrcode.min.js'];

assets.forEach(asset => {
  const srcPath = join(rootDir, asset);
  const destPath = join(distDir, asset);

  if (existsSync(srcPath)) {
    try {
      copyFileSync(srcPath, destPath);
      console.log(`Copied ${asset}`);
    } catch (err) {
      console.error(`Failed to copy ${asset}:`, err.message);
    }
  } else {
    console.warn(`Asset not found: ${asset}`);
  }
});

console.log('Asset copy complete');
