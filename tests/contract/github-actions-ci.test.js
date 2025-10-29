import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../');
const checksWorkflowPath = path.join(projectRoot, '.github/workflows/checks.yml');

describe('GitHub Actions CI Workflow Contract', () => {
  let workflowContent;

  // Note: This would require yaml parsing in production, using simple text checks for now
  beforeAll(() => {
    if (fs.existsSync(checksWorkflowPath)) {
      workflowContent = fs.readFileSync(checksWorkflowPath, 'utf8');
    }
  });

  it('should have checks.yml workflow file', () => {
    expect(fs.existsSync(checksWorkflowPath)).toBe(true);
  });

  describe('Coverage Step Configuration', () => {
    it('should have a coverage check step', () => {
      if (!workflowContent) return;
      expect(workflowContent).toContain('coverage');
    });

    it('should run test:coverage command', () => {
      if (!workflowContent) return;
      expect(workflowContent).toContain('npm run test:coverage');
    });

    it('should not have continue-on-error for coverage step', () => {
      if (!workflowContent) return;
      // Look for the coverage step section
      const coverageSection = workflowContent.match(
        /(?:- name:.*coverage.*\n[\s\S]*?)(?=\n\s*- name:|$)/i
      );
      if (coverageSection) {
        expect(coverageSection[0]).not.toContain('continue-on-error: true');
      }
    });
  });

  describe('Artifact Configuration', () => {
    it('should upload coverage artifacts', () => {
      if (!workflowContent) return;
      expect(workflowContent).toContain('upload-artifact');
    });

    it('should preserve artifacts on failure', () => {
      if (!workflowContent) return;
      expect(workflowContent).toContain('if: always()');
    });

    it('should specify retention days', () => {
      if (!workflowContent) return;
      expect(workflowContent).toContain('retention-days');
    });

    it('should preserve coverage artifacts for at least 30 days', () => {
      if (!workflowContent) return;
      // Extract retention-days value
      const retentionMatch = workflowContent.match(/retention-days:\s*(\d+)/);
      if (retentionMatch) {
        const days = parseInt(retentionMatch[1], 10);
        expect(days).toBeGreaterThanOrEqual(30);
      }
    });
  });

  describe('Workflow Validity', () => {
    it('should have valid YAML structure', () => {
      if (!workflowContent) return;
      // Basic checks for YAML structure
      expect(workflowContent).toContain('name:');
      expect(workflowContent).toContain('on:');
      expect(workflowContent).toContain('jobs:');
    });

    it('should reference coverage path', () => {
      if (!workflowContent) return;
      expect(workflowContent).toContain('coverage');
    });
  });
});
