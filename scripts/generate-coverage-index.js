#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const artifactsDir = path.join(root, 'review-artifacts');
if (!fs.existsSync(artifactsDir)) {
  fs.mkdirSync(artifactsDir, { recursive: true });
}

function listDirs(prefix) {
  if (!fs.existsSync(artifactsDir)) return [];
  const entries = fs.readdirSync(artifactsDir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && e.name.startsWith(prefix))
    .map((e) => e.name)
    .sort();
}

const backendDirs = listDirs('coverage-');
const uiDirs = listDirs('ui-coverage-');

let html = '';
html += '<h1>Coverage Index</h1>\n';
html += '<h2>Backend Coverage</h2>\n<ul>\n';
for (const dir of backendDirs) {
  const app = dir.replace(/^coverage-/, '');
  html += `  <li><a href="./${dir}/lcov-report/index.html">${app}</a></li>\n`;
}
html += '</ul>\n';

html += '<h2>UI Coverage</h2>\n<ul>\n';
for (const dir of uiDirs) {
  const app = dir.replace(/^ui-coverage-/, '');
  html += `  <li><a href="./${dir}/lcov-report/index.html">ui-${app}</a></li>\n`;
}
html += '</ul>\n';

html += '<h2>API Documentation</h2>\n';
html += '<div class="suite-links">\n';
html += '  <a href="./openapi.html" class="link-button">OpenAPI Documentation</a>\n';
html += '</div>\n';

fs.writeFileSync(path.join(artifactsDir, 'index.html'), html, 'utf8');
console.log('Generated review-artifacts/index.html');


