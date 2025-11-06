# Contract: Coverage Generation

**Responsibility**: Vitest test execution with coverage collection  
**Triggered By**: CI workflow test step  
**Produces**: Five coverage report directories with lcov.info and HTML files

---

## INPUT

```
{
  testCommand: "npm run test:ui:coverage",
  testSuites: [
    "frontend/tests/ui-expense.test.js",
    "frontend/tests/ui-stopwatch.test.js",
    "frontend/tests/ui-temp.test.js",
    "frontend/tests/ui-todo.test.js",
    "frontend/tests/ui-quote.test.js"
  ],
  vitestConfig: "vitest.config.js",
  coverageConfig: {
    enabled: true,
    providers: ["v8"],  // or equivalent
    reporters: ["lcov", "html", "text-summary"],
    outputDirectory: "coverage/",
    include: ["frontend/src/**/*"],
    exclude: ["node_modules/", "**/*.spec.js", "**/*.test.js"],
    statements: 40,      // Minimum 40% per Constitution
    branches: undefined,  // No other thresholds specified
    functions: undefined,
    lines: undefined
  }
}
```

---

## OUTPUT

On Success: Five coverage directories created

```
coverage/
├── ui-expense/
│   ├── lcov.info                   # LCOV coverage format
│   ├── index.html                  # HTML coverage report
│   └── [source files with coverage annotations]
├── ui-stopwatch/
│   ├── lcov.info
│   ├── index.html
│   └── [source files with coverage annotations]
├── ui-temp/
│   ├── lcov.info
│   ├── index.html
│   └── [source files with coverage annotations]
├── ui-todo/
│   ├── lcov.info
│   ├── index.html
│   └── [source files with coverage annotations]
└── ui-quote/
    ├── lcov.info
    ├── index.html
    └── [source files with coverage annotations]
```

---

## VALIDATION RULES

✅ **Must Pass**:
1. All five test suites execute without errors
2. All five directories are created
3. Each directory contains: `lcov.info` file (non-empty)
4. Each directory contains: `index.html` file (valid HTML)
5. Each suite meets minimum coverage threshold (≥40% statements)
6. lcov.info is valid LCOV format (parseable by coverage tools)
7. HTML report is valid and navigable

❌ **Failure Conditions**:
- Any test suite fails to execute → FAIL
- Coverage generation produces errors → FAIL
- Any directory missing lcov.info → FAIL
- Any directory missing index.html → FAIL
- Any suite reports <40% coverage → FAIL
- lcov.info is empty or corrupted → FAIL
- HTML file is invalid or empty → FAIL

---

## FAILURE HANDLING

**On Failure**:
1. Vitest exits with non-zero code
2. CI workflow MUST detect failure and exit immediately (fail-fast)
3. Do NOT proceed to coverage copying step
4. Do NOT proceed to verification step
5. Do NOT upload artifact
6. Mark CI build as FAILED with error message indicating which suite failed

**Error Message Format**:
```
❌ Coverage generation failed for: [suite-name]
   Reason: [test failure | missing lcov.info | coverage below 40% | other]
   Expected location: coverage/[suite-name]/lcov.info
   Build Status: FAILED - Coverage generation incomplete
```

---

## SUCCESS CRITERIA

Build continues to next step ONLY if:
- ✅ All five test suites executed successfully
- ✅ All ten files created (5 lcov.info + 5 index.html)
- ✅ All coverage percentages ≥ 40%
- ✅ All files are non-empty and valid

---

## Notes

- Vitest coverage is run as part of the main test suite (not separate step)
- Coverage reporters are configured in `vitest.config.js`
- Each test file corresponds to one UI application (ui-expense, ui-stopwatch, etc.)
- The test suite MUST be configured to generate separate coverage per suite (or aggregate and split)
- Output directory defaults to `coverage/` in project root

---

*Requirement Source: FR-001, FR-002, FR-003, FR-007, FR-009, FR-010*
