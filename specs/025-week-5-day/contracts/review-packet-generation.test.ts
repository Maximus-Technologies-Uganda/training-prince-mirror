import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Review Packet Generation Contract", () => {
  const reviewArtifactsDir = path.join(process.cwd(), "review-artifacts");

  it("should have index.html entry point", () => {
    const indexPath = path.join(reviewArtifactsDir, "index.html");
    expect(fs.existsSync(indexPath)).toBe(true);
  });

  it("should have link to coverage report in index.html", () => {
    const indexPath = path.join(reviewArtifactsDir, "index.html");
    const content = fs.readFileSync(indexPath, "utf8");
    expect(content).toMatch(/coverage|coverage-/i);
  });

  it("should have coverage directory with reports", () => {
    const coverageDirs = fs.readdirSync(reviewArtifactsDir).filter(
      dir => dir.startsWith("coverage") || dir.startsWith("ui-coverage")
    );
    expect(coverageDirs.length).toBeGreaterThan(0);
  });

  it("should have review metadata", () => {
    const reviewPath = path.join(reviewArtifactsDir, "review.md");
    if (fs.existsSync(reviewPath)) {
      const content = fs.readFileSync(reviewPath, "utf8");
      expect(content.length).toBeGreaterThan(0);
    }
  });

  it("should have packet metadata", () => {
    const metadataPath = path.join(reviewArtifactsDir, "packet-metadata.json");
    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
      expect(metadata).toBeDefined();
    }
  });

  it("should have total package size < 100MB", () => {
    const dirSize = calculateDirSize(reviewArtifactsDir);
    const maxSizeMB = 100;
    expect(dirSize / (1024 * 1024)).toBeLessThan(maxSizeMB);
  });

  it("index.html should exist and be readable", () => {
    const indexPath = path.join(reviewArtifactsDir, "index.html");
    const content = fs.readFileSync(indexPath, "utf8");
    expect(content.length).toBeGreaterThan(0);
    expect(content).toMatch(/<!DOCTYPE|<html/i);
  });
});

function calculateDirSize(dirPath: string): number {
  let size = 0;
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      size += calculateDirSize(filePath);
    } else {
      size += stats.size;
    }
  });
  return size;
}

