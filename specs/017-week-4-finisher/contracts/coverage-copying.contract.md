# Contract: Coverage Report Copying

**Responsibility**: Copy all five coverage report directories from `coverage/` to `review-artifacts/`  
**Triggered By**: CI workflow after successful coverage generation  
**Produces**: Five coverage directories in review-artifacts/

---

## INPUT

```
{
  sourcePath: "coverage/",
  sourceDirectories: [
    "coverage/ui-expense/",
    "coverage/ui-stopwatch/",
    "coverage/ui-temp/",
    "coverage/ui-todo/",
    "coverage/ui-quote/"
  ],
  destinationPath: "review-artifacts/",
  copyCommand: "cp -r coverage/[suite]/* review-artifacts/[suite]/",
  createDestinationDirs: true
}
```

---

## OUTPUT

On Success: All coverage files copied to review-artifacts/

```
review-artifacts/
├── ui-expense/
│   ├── lcov.info
│   ├── index.html
│   └── [source files with annotations]
├── ui-stopwatch/
│   ├── lcov.info
│   ├── index.html
│   └── [source files with annotations]
├── ui-temp/
│   ├── lcov.info
│   ├── index.html
│   └── [source files with annotations]
├── ui-todo/
│   ├── lcov.info
│   ├── index.html
│   └── [source files with annotations]
└── ui-quote/
    ├── lcov.info
    ├── index.html
    └── [source files with annotations]
```

---

## VALIDATION RULES

✅ **Must Pass**:
1. All five source directories exist in `coverage/`
2. Each source directory contains lcov.info (non-empty)
3. Each source directory contains index.html (non-empty)
4. Copy command completes without errors
5. All five destination directories created in `review-artifacts/`
6. Destination lcov.info files are identical to source files
7. Destination index.html files are identical to source files
8. File permissions are preserved (readable by CI and artifact system)
9. Relative paths in HTML files remain valid (or are rewritten if necessary)

❌ **Failure Conditions**:
- Any source directory missing from `coverage/` → FAIL
- lcov.info file missing or empty in source → FAIL
- index.html file missing or empty in source → FAIL
- Copy command fails with non-zero exit code → FAIL
- Destination file is incomplete or truncated → FAIL
- File size of destination doesn't match source → FAIL
- Read/write permission errors → FAIL

---

## FAILURE HANDLING

**On Failure**:
1. Copy command exits with non-zero code
2. CI workflow MUST detect failure and exit immediately (fail-fast)
3. Do NOT proceed to verification step
4. Do NOT upload artifact
5. Mark CI build as FAILED with specific error message

**Error Message Format**:
```
❌ Coverage report copying failed
   Source: coverage/[suite-name]/
   Destination: review-artifacts/[suite-name]/
   Error: [permission denied | file not found | insufficient space | other]
   Build Status: FAILED - Coverage copying incomplete
```

---

## SUCCESS CRITERIA

Build continues to next step ONLY if:
- ✅ All five source directories verified
- ✅ All ten files (lcov.info + index.html) copied successfully
- ✅ Destination files match source files (size check)
- ✅ Copy command exits with code 0

---

## Implementation Notes

### Bash Implementation Example
```bash
#!/bin/bash
set -e  # Exit on any error (fail-fast)

SUITES=("ui-expense" "ui-stopwatch" "ui-temp" "ui-todo" "ui-quote")
SOURCE_DIR="coverage"
DEST_DIR="review-artifacts"

# Create destination directory if needed
mkdir -p "$DEST_DIR"

# Copy each suite's coverage
for suite in "${SUITES[@]}"; do
  SOURCE="$SOURCE_DIR/$suite"
  DEST="$DEST_DIR/$suite"
  
  # Verify source exists
  if [ ! -d "$SOURCE" ]; then
    echo "❌ Source directory missing: $SOURCE"
    exit 1
  fi
  
  # Verify required files
  if [ ! -f "$SOURCE/lcov.info" ]; then
    echo "❌ Missing lcov.info in $SOURCE"
    exit 1
  fi
  
  if [ ! -f "$SOURCE/index.html" ]; then
    echo "❌ Missing index.html in $SOURCE"
    exit 1
  fi
  
  # Create destination and copy
  mkdir -p "$DEST"
  cp -r "$SOURCE"/* "$DEST/"
  
  # Verify copy
  if [ ! -f "$DEST/lcov.info" ]; then
    echo "❌ Copy failed for $DEST/lcov.info"
    exit 1
  fi
  
  if [ ! -f "$DEST/index.html" ]; then
    echo "❌ Copy failed for $DEST/index.html"
    exit 1
  fi
  
  echo "✅ Copied $suite coverage to $DEST"
done

echo "✅ All coverage reports copied successfully"
exit 0
```

---

## Notes

- This step must run AFTER coverage generation completes successfully
- Must run BEFORE verification step
- Bash `set -e` ensures any error causes immediate exit (fail-fast)
- All error conditions result in non-zero exit code
- Destination paths must be writable by CI process

---

*Requirement Source: FR-004, FR-005, FR-009, FR-010*

