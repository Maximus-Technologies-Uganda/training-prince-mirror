import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Pull Request Template Validation Contract", () => {
  const prTemplatePath = path.join(
    process.cwd(),
    ".github",
    "pull_request_template.md"
  );

  it("should have pull_request_template.md", () => {
    expect(fs.existsSync(prTemplatePath)).toBe(true);
  });

  it("should have Spec URL section", () => {
    const content = fs.readFileSync(prTemplatePath, "utf8");
    expect(content).toMatch(/##\s+Spec URL/i);
  });

  it("should have Contract Tests section", () => {
    const content = fs.readFileSync(prTemplatePath, "utf8");
    expect(content).toMatch(/##\s+Contract Tests/i);
  });

  it("should have Changes Made section", () => {
    const content = fs.readFileSync(prTemplatePath, "utf8");
    expect(content).toMatch(/##\s+Changes Made/i);
  });

  it("should have Checks section with checkboxes", () => {
    const content = fs.readFileSync(prTemplatePath, "utf8");
    expect(content).toMatch(/##\s+Checks/i);
    expect(content).toMatch(/- \[\s*\].*npm run test/i);
  });

  it("should have CHANGELOG Updated section", () => {
    const content = fs.readFileSync(prTemplatePath, "utf8");
    expect(content).toMatch(/##\s+CHANGELOG Updated/i);
  });

  it("should have Breaking Changes section", () => {
    const content = fs.readFileSync(prTemplatePath, "utf8");
    expect(content).toMatch(/##\s+Breaking Changes/i);
  });

  it("should have Related Issues section", () => {
    const content = fs.readFileSync(prTemplatePath, "utf8");
    expect(content).toMatch(/##\s+Related Issues/i);
  });

  it("should have valid Markdown syntax", () => {
    const content = fs.readFileSync(prTemplatePath, "utf8");
    expect(content).not.toMatch(/\[\[/);
    expect(content).not.toMatch(/(#{7,})/);
  });

  it("should mention local tests requirement", () => {
    const content = fs.readFileSync(prTemplatePath, "utf8");
    expect(content).toMatch(/npm run test|local.*test/i);
  });

  it("should mention coverage thresholds", () => {
    const content = fs.readFileSync(prTemplatePath, "utf8");
    expect(content).toMatch(/coverage|60%/i);
  });

  it("should mention E2E tests", () => {
    const content = fs.readFileSync(prTemplatePath, "utf8");
    expect(content).toMatch(/e2e|end.*to.*end|test:e2e/i);
  });
});

