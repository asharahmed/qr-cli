#!/usr/bin/env node
const { execSync } = require('node:child_process');

const tag = process.argv[2];

if (!tag || !/^v\d+\.\d+\.\d+$/.test(tag)) {
  console.error('Usage: npm run release -- vX.Y.Z');
  process.exit(1);
}

const notes = `Release ${tag}

Automated binaries are built by GitHub Actions:
- linux x64/arm64
- macos x64/arm64 + universal
- windows x64

Windows ARM64 is built separately via the self-hosted runner.`;

function run(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}

run(`git tag ${tag}`);
run(`git push origin ${tag}`);
run(`gh release create ${tag} --title "${tag}" --notes "${notes.replace(/\n/g, '\\n')}"`);
