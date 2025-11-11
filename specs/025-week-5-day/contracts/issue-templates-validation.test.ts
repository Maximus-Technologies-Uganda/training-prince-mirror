import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Issue Templates Validation Contract", () => {
  const featureTemplatePath = path.join(
    process.cwd(),
    ".github",
    "ISSUE_TEMPLATE",
    "feature.md"
  );
  const bugTemplatePath = path.join(process.cwd(), ".github", "ISSUE_TEMPLATE", "bug.md");

  it("should have feature.md template", () => {
    expect(fs.existsSync(featureTemplatePath)).toBe(true);
  });

  it("should have bug.md template", () => {
    expect(fs.existsSync(bugTemplatePath)).toBe(true);
  });

  it("feature.md should have valid YAML frontmatter", () => {
    const content = fs.readFileSync(featureTemplatePath, "utf8");
    expect(content).toMatch(/^---[\s\S]+?---/);
    expect(content).toMatch(/name:\s*"?Feature Request"?/i);
    expect(content).toMatch(/about:\s*"?[^"]+feature[^"]*"?/i);
  });

  it("bug.md should have valid YAML frontmatter", () => {
    const content = fs.readFileSync(bugTemplatePath, "utf8");
    expect(content).toMatch(/^---[\s\S]+?---/);
    expect(content).toMatch(/name:\s*"?Bug Report"?/i);
    expect(content).toMatch(/about:\s*"?[^"]+bug[^"]*"?/i);
  });

  it("feature.md should have Description section", () => {
    const content = fs.readFileSync(featureTemplatePath, "utf8");
    expect(content).toMatch(/##\s+Description/i);
  });

  it("feature.md should have Acceptance Criteria with checkbox", () => {
    const content = fs.readFileSync(featureTemplatePath, "utf8");
    expect(content).toMatch(/##\s+Acceptance Criteria/i);
    expect(content).toMatch(/- \[\s*\]/);
  });

  it("bug.md should have Reproduction Steps section", () => {
    const content = fs.readFileSync(bugTemplatePath, "utf8");
    expect(content).toMatch(/##\s+Reproduction Steps/i);
  });

  it("bug.md should have Expected Behavior section", () => {
    const content = fs.readFileSync(bugTemplatePath, "utf8");
    expect(content).toMatch(/##\s+Expected Behavior/i);
  });

  it("bug.md should have Actual Behavior section", () => {
    const content = fs.readFileSync(bugTemplatePath, "utf8");
    expect(content).toMatch(/##\s+Actual Behavior/i);
  });

  it("feature.md should have valid Markdown syntax", () => {
    const content = fs.readFileSync(featureTemplatePath, "utf8");
    // Check for common Markdown syntax errors
    expect(content).not.toMatch(/\[\[/); // Double brackets
    expect(content).not.toMatch(/(#{7,})/); // Too many heading levels
  });

  it("bug.md should have valid Markdown syntax", () => {
    const content = fs.readFileSync(bugTemplatePath, "utf8");
    expect(content).not.toMatch(/\[\[/);
    expect(content).not.toMatch(/(#{7,})/);
  });
});


