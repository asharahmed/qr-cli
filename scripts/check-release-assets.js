#!/usr/bin/env node
const { execSync } = require('node:child_process');

const REQUIRED_ASSETS = [
  'qr-linux-x64',
  'qr-linux-arm64',
  'qr-linux-universal.sh',
  'qr-macos-x64',
  'qr-macos-arm64',
  'qr-macos-universal',
  'qr-win-x64.exe',
  'qr-win-arm64.exe',
  'qr-windows-universal.ps1',
];

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

function main() {
  const tag = process.argv[2];
  if (!tag) {
    console.error('Usage: npm run release:check-assets -- <tag>');
    process.exit(1);
  }

  let assetsJson;
  try {
    assetsJson = run(`gh release view ${tag} --json assets`);
  } catch (err) {
    console.error('Failed to query release assets. Ensure gh is installed and authenticated.');
    process.exit(1);
  }

  const parsed = JSON.parse(assetsJson);
  const assets = new Set((parsed.assets || []).map((asset) => asset.name));

  const missing = REQUIRED_ASSETS.filter((asset) => !assets.has(asset));
  if (missing.length === 0) {
    console.log(`All required assets present for ${tag}.`);
    return;
  }

  console.log(`Missing assets for ${tag}:`);
  for (const asset of missing) {
    console.log(`- ${asset}`);
  }

  process.exit(1);
}

main();
