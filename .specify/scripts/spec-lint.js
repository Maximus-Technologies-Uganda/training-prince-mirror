#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function getActiveFeatureSpecPath(rootDir) {
  // Prefer CI-provided branch names first (pull_request uses GITHUB_HEAD_REF)
  const envBranch = process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME;
  console.log('CI Branch detection:', { envBranch, GITHUB_HEAD_REF: process.env.GITHUB_HEAD_REF, GITHUB_REF_NAME: process.env.GITHUB_REF_NAME });
  
  // Branch name mapping for CI
  const branchMapping = {
    'feature/day-0-ci-maturity': '011-title-day-0',
    'feature/day-0-c...': '011-title-day-0'
  };
  
  let targetBranch = envBranch;
  if (targetBranch && branchMapping[targetBranch]) {
    targetBranch = branchMapping[targetBranch];
    console.log('Mapped branch:', envBranch, '->', targetBranch);
  }
  
  if (targetBranch) {
    const byEnv = path.join(rootDir, 'specs', targetBranch, 'spec.md');
    console.log('Checking CI spec path:', byEnv);
    if (fs.existsSync(byEnv)) return byEnv;
  }
  try {
    // Prefer current git branch name mapping
    const head = execSync('git rev-parse --abbrev-ref HEAD', { cwd: rootDir }).toString().trim();
    console.log('Git branch:', head);
    
    // Apply branch mapping for local git branch too
    let mappedHead = head;
    if (branchMapping[head]) {
      mappedHead = branchMapping[head];
      console.log('Mapped local branch:', head, '->', mappedHead);
    }
    
    if (mappedHead && mappedHead !== 'HEAD') {
      const candidate = path.join(rootDir, 'specs', mappedHead, 'spec.md');
      console.log('Checking git spec path:', candidate);
      if (fs.existsSync(candidate)) return candidate;
    }
  } catch (error) {
    console.log('Git branch detection failed:', error.message);
  }
  // Fallback: last created feature
  try {
    const metaPath = path.join(rootDir, '.specify/.last-created-feature.json');
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    if (meta && meta.SPEC_FILE && fs.existsSync(meta.SPEC_FILE)) return meta.SPEC_FILE;
  } catch (_) {}
  // Final fallback: none
  return null;
}

function findSpecFiles(rootDir) {
  const targeted = getActiveFeatureSpecPath(rootDir);
  if (targeted) return [targeted];
  // fallback to prior behavior scanning all specs
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

function parseStatus(text) {
  // Match lines like: **Status**: Draft / Ready
  const m = /\*\*Status\*\*:\s*([^\n]+)/i.exec(text);
  return (m?.[1] || '').trim().toLowerCase();
}

function lintSpec(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const unchecked = (text.match(/\[ \]/g) || []).length;
  const hasChecklist = /Review & Acceptance Checklist/i.test(text);
  const status = parseStatus(text); // 'draft' | 'ready' | etc.
  return { filePath, unchecked, hasChecklist, status };
}

function main() {
  const root = process.cwd();
  const specFiles = findSpecFiles(root);
  let failures = 0;
  for (const file of specFiles) {
    const { unchecked, hasChecklist, status } = lintSpec(file);
    if (!hasChecklist) {
      console.error(`Spec missing checklist: ${file}`);
      failures++;
      continue;
    }
    const isReady = status === 'ready';
    if (unchecked > 0) {
      if (isReady) {
        console.error(`Unchecked acceptance boxes in ${file}: ${unchecked}`);
        failures++;
      } else {
        console.log(`WARN (non-blocking): ${file} has ${unchecked} unchecked boxes but status='${status || 'unknown'}'.`);
      }
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


