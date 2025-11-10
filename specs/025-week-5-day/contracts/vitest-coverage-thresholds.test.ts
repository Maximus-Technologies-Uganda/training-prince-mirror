import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Vitest Coverage Thresholds Contract", () => {
  it("should have vitest.config.js", () => {
    const configPath = path.join(process.cwd(), "vitest.config.js");
    expect(fs.existsSync(configPath)).toBe(true);
  });

  it("vitest.config.js should enforce 60% lines threshold", () => {
    const configContent = fs.readFileSync(path.join(process.cwd(), "vitest.config.js"), "utf8");
    expect(configContent).toMatch(/lines.*60|60.*lines/);
  });

  it("vitest.config.js should enforce 60% branches threshold", () => {
    const configContent = fs.readFileSync(path.join(process.cwd(), "vitest.config.js"), "utf8");
    expect(configContent).toMatch(/branches.*60|60.*branches/);
  });

  it("vitest.config.js should enforce 60% functions threshold", () => {
    const configContent = fs.readFileSync(path.join(process.cwd(), "vitest.config.js"), "utf8");
    expect(configContent).toMatch(/functions.*60|60.*functions/);
  });

  it("vitest.config.js should enforce 60% statements threshold", () => {
    const configContent = fs.readFileSync(path.join(process.cwd(), "vitest.config.js"), "utf8");
    expect(configContent).toMatch(/statements.*60|60.*statements/);
  });

  it("coverage should include src files", () => {
    const configContent = fs.readFileSync(path.join(process.cwd(), "vitest.config.js"), "utf8");
    expect(configContent).toMatch(/src.*\*\*|\*\*.*src/);
  });

  it("coverage should exclude test files", () => {
    const configContent = fs.readFileSync(path.join(process.cwd(), "vitest.config.js"), "utf8");
    expect(configContent).toMatch(/\.test\.|\.spec\./);
  });
});

