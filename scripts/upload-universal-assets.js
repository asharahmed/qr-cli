#!/usr/bin/env node
const { execSync } = require('node:child_process');
const path = require('node:path');

const assets = [
  path.join('scripts', 'universal', 'qr-linux-universal.sh'),
  path.join('scripts', 'universal', 'qr-windows-universal.ps1'),
];

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

function getLatestTag() {
  const output = run('gh release view --json tagName');
  const parsed = JSON.parse(output);
  if (!parsed.tagName) {
    throw new Error('Unable to determine latest release tag.');
  }
  return parsed.tagName;
}

function main() {
  const tag = process.argv[2] || getLatestTag();
  const files = assets.map((asset) => `"${asset}"`).join(' ');
  run(`gh release upload ${tag} ${files} --clobber`);
  console.log(`Uploaded universal installers to ${tag}.`);
}

main();
