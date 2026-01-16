#!/usr/bin/env node
const { execSync } = require('node:child_process');

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

function getTags() {
  const output = run('git tag --sort=version:refname');
  return output ? output.split('\n').filter(Boolean) : [];
}

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--from') parsed.from = args[i + 1];
    if (arg === '--to') parsed.to = args[i + 1];
  }
  return parsed;
}

function main() {
  const tags = getTags();
  if (tags.length < 2) {
    console.error('Need at least two tags to generate release notes.');
    process.exit(1);
  }

  const { from, to } = parseArgs();
  const toTag = to || tags[tags.length - 1];
  const fromTag = from || tags[tags.length - 2];

  const log = run(`git log ${fromTag}..${toTag} --pretty=format:"%s"`);
  const lines = log ? log.split('\n').filter(Boolean) : [];

  console.log(`## Changes\n`);
  if (!lines.length) {
    console.log('- No changes detected.');
  } else {
    for (const line of lines) {
      console.log(`- ${line}`);
    }
  }

  console.log(`\n## Universal installers\n`);
  console.log('- Linux: qr-linux-universal.sh');
  console.log('- Windows: qr-windows-universal.ps1');
}

main();
