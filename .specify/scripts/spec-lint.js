#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

function findSpecFiles(rootDir) {
  const specsDir = path.join(rootDir, 'specs');
  if (!fs.existsSync(specsDir)) return [];
  const featureDirs = fs.readdirSync(specsDir).map((d) => path.join(specsDir, d)).filter((p) => fs.statSync(p).isDirectory());
  const specFiles = [];
  for (const dir of featureDirs) {
    const file = path.join(dir, 'spec.md');
    if (fs.existsSync(file)) specFiles.push(file);
  }
  return specFiles;
}

function lintSpec(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const unchecked = (text.match(/\[ \]/g) || []).length;
  const hasChecklist = /Review & Acceptance Checklist/i.test(text);
  return { filePath, unchecked, hasChecklist };
}

function main() {
  const root = process.cwd();
  const specFiles = findSpecFiles(root);
  let failures = 0;
  for (const file of specFiles) {
    const { unchecked, hasChecklist } = lintSpec(file);
    if (!hasChecklist) {
      console.error(`Spec missing checklist: ${file}`);
      failures++;
      continue;
    }
    if (unchecked > 0) {
      console.error(`Unchecked acceptance boxes in ${file}: ${unchecked}`);
      failures++;
    } else {
      console.log(`OK: ${file}`);
    }
  }
  if (failures > 0) {
    console.error(`Spec lint failed on ${failures} file(s).`);
    process.exit(1);
  }
}

main();


