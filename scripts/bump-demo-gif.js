#!/usr/bin/env node
const { execSync } = require('node:child_process');
const fs = require('node:fs');

const readmePath = 'README.md';
const gifPath = 'docs/cli-demo.gif';

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

function isGifChanged() {
  try {
    const status = run(`git status --porcelain "${gifPath}"`);
    return status.length > 0;
  } catch {
    return false;
  }
}

function bumpQuery(readme) {
  const match = readme.match(/docs\/cli-demo\.gif\?v=(\d+)/);
  if (!match) {
    return readme;
  }
  const current = Number.parseInt(match[1], 10);
  const next = Number.isFinite(current) ? current + 1 : 2;
  return readme.replace(/docs\/cli-demo\.gif\?v=\d+/, `docs/cli-demo.gif?v=${next}`);
}

function main() {
  if (!fs.existsSync(gifPath)) {
    console.error(`Missing ${gifPath}.`);
    process.exit(1);
  }

  if (!isGifChanged()) {
    console.log('GIF unchanged; README not updated.');
    return;
  }

  const readme = fs.readFileSync(readmePath, 'utf8');
  const updated = bumpQuery(readme);
  if (updated !== readme) {
    fs.writeFileSync(readmePath, updated, 'utf8');
    console.log('Bumped README demo GIF query string.');
  } else {
    console.log('No demo GIF query string found in README.');
  }
}

main();
