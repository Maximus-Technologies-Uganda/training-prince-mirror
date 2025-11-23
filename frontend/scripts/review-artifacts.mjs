#!/usr/bin/env node
import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const artifactsDir = path.join(root, 'review-artifacts');
const coverageSource = path.join(root, 'coverage', 'ui');
const coverageDest = path.join(artifactsDir, 'ui-coverage');
const screenshotDest = path.join(artifactsDir, 'ui-states');

const screenshotCandidates = [
  path.join(root, 'test-results', 'screenshots'),
  path.join(root, 'playwright-report', 'screenshots'),
  path.join(root, 'review-artifacts', 'ui-states'),
];

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function copyDir(source, destination) {
  await rm(destination, { recursive: true, force: true });
  await ensureDir(path.dirname(destination));
  await cp(source, destination, { recursive: true });
}

async function buildArtifactsIndex(screenshots) {
  const coverageIndex = path.relative(artifactsDir, path.join(coverageDest, 'index.html'));
  const screenshotMarkup = screenshots
    .map((file) => `<li><figure><img src="ui-states/${file}" alt="${file}" /><figcaption>${file}</figcaption></figure></li>`)
    .join('\n');

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Review Artifacts</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; margin: 2rem; }
    h1 { margin-bottom: 1rem; }
    ul { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; padding: 0; list-style: none; }
    figure { margin: 0; border: 1px solid #ececec; border-radius: 0.5rem; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.08); }
    img { width: 100%; display: block; }
    figcaption { padding: 0.5rem 0.75rem; font-size: 0.85rem; color: #444; }
    .coverage-link { margin-bottom: 2rem; display: inline-flex; gap: 0.5rem; align-items: center; }
  </style>
</head>
<body>
  <h1>Frontend Review Artifacts</h1>
  <p class="coverage-link">
    <strong>Coverage report:</strong>
    <a href="${coverageIndex}">Open HTML report</a>
  </p>
  <h2>UI State Screenshots</h2>
  ${screenshots.length ? `<ul>${screenshotMarkup}</ul>` : '<p>No screenshots were found. Run \`npm run test:e2e\` to generate them.</p>'}
</body>
</html>`;

  await writeFile(path.join(artifactsDir, 'index.html'), html, 'utf8');
}

async function main() {
  await ensureDir(artifactsDir);

  try {
    await copyDir(coverageSource, coverageDest);
    console.log('✓ Copied coverage report to review-artifacts/ui-coverage');
  } catch (error) {
    console.warn('⚠️  Coverage directory not found at', coverageSource);
    console.warn('    Run `npm run test:ui -- --coverage.enabled true` before bundling artifacts.');
  }

  let screenshotSource;
  for (const candidate of screenshotCandidates) {
    try {
      const entries = await readdir(candidate);
      if (entries.length > 0) {
        screenshotSource = candidate;
        break;
      }
    } catch {
      // Ignore missing directories
    }
  }

  let screenshotFiles = [];
  if (screenshotSource) {
    await copyDir(screenshotSource, screenshotDest);
    screenshotFiles = await readdir(screenshotDest);
    console.log(`✓ Copied ${screenshotFiles.length} screenshot(s) to review-artifacts/ui-states`);
  } else {
    console.warn('⚠️  No screenshots found. Run `npm run test:e2e` to capture required UI states.');
  }

  await buildArtifactsIndex(screenshotFiles);
  console.log('✓ Generated review-artifacts/index.html');
}

main().catch((error) => {
  console.error('Failed to bundle review artifacts:', error);
  process.exitCode = 1;
});
