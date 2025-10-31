# Research & Analysis: Week 4 Finisher - Fix Review-Packet Packaging

**Feature**: Fix review-packet packaging for CI workflow to ensure complete coverage reports for all five UI test suites (ui-expense, ui-stopwatch, ui-temp, ui-todo, ui-quote)

**Date**: October 31, 2025

---

## Phase 0 Findings

### 1. Current CI Workflow Analysis

**Decision**: GitHub Actions (`test.yml` or equivalent) is the CI platform  
**Rationale**: Feature spec explicitly mentions GitHub Actions Artifacts; CI fail-fast policies are GitHub Actions specific  
**Alternatives Considered**: GitLab CI, Jenkins, CircleCI - rejected because user requirements specify GitHub Actions Artifacts

**Current Gaps Identified**:
- Five UI test suites may not all be executing with coverage enabled
- Coverage generation from Vitest may not be collecting lcov.info for all suites
- HTML coverage reports may not be generated for all five suites
- Review-artifacts directory may not receive all coverage files before packaging
- No verification step to confirm all five coverage report sets exist
- No fail-fast validation to prevent incomplete artifacts
- Review-artifacts/index.html may reference reports that don't exist (broken links)

### 2. Vitest Coverage Configuration

**Decision**: Use Vitest's built-in coverage configuration with reporter options for lcov and HTML  
**Rationale**: Vitest supports multiple coverage reporters; lcov.info and HTML are standard formats for coverage tools  
**Alternatives Considered**: 
- nyc (Istanbul) as separate coverage tool - rejected because Vitest has native coverage support
- Manual coverage script - rejected because Vitest handles this automatically

**Key Configuration Points**:
- `vitest.config.js` must enable coverage collection for all five UI test suites
- Coverage reporters must include: `lcov`, `html`, and possibly `text-summary`
- Coverage output directory should be configurable per suite or in a standard location
- Each suite should generate: `coverage/<suite-name>/lcov.info` and `coverage/<suite-name>/index.html`

### 3. Coverage Report Copying Strategy

**Decision**: CI workflow should explicitly copy all five coverage report sets into `review-artifacts/` before artifact packaging  
**Rationale**: Centralizes all artifacts in one location for stakeholder review; ensures review-artifacts/ contains complete record  
**Alternatives Considered**:
- Leave coverage in `coverage/` directory and package from there - rejected because spec requires files in review-artifacts/
- Symlink coverage reports - rejected because artifacts may not preserve symlinks

**Implementation Approach**:
1. After coverage generation: Copy `coverage/ui-expense/` → `review-artifacts/ui-expense/`
2. Repeat for ui-stopwatch, ui-temp, ui-todo, ui-quote
3. Verify each destination exists before artifact creation

### 4. Coverage Verification & Fail-Fast

**Decision**: CI workflow must verify all five coverage report sets exist before packaging  
**Rationale**: Prevents silent failures; catches missing coverage early before artifact upload  
**Alternatives Considered**: Skip verification and silently skip missing files - rejected because spec requires fail-fast behavior

**Verification Checklist**:
- [ ] `review-artifacts/ui-expense/lcov.info` exists
- [ ] `review-artifacts/ui-expense/index.html` exists
- [ ] `review-artifacts/ui-stopwatch/lcov.info` exists
- [ ] `review-artifacts/ui-stopwatch/index.html` exists
- [ ] `review-artifacts/ui-temp/lcov.info` exists
- [ ] `review-artifacts/ui-temp/index.html` exists
- [ ] `review-artifacts/ui-todo/lcov.info` exists
- [ ] `review-artifacts/ui-todo/index.html` exists
- [ ] `review-artifacts/ui-quote/lcov.info` exists
- [ ] `review-artifacts/ui-quote/index.html` exists

If any check fails → exit with error, prevent artifact upload

### 5. GitHub Actions Artifact Handling

**Decision**: Use `actions/upload-artifact@v4` to upload final review-packet  
**Rationale**: Standard GitHub Actions approach; artifacts accessible from workflow run details  
**Alternatives Considered**:
- GitHub Releases - rejected because artifacts should be per CI run, not per release
- Direct S3/cloud storage - rejected because user specified GitHub Artifacts

**Configuration**:
- Artifact name: `review-packet` (or `review-artifacts`)
- Artifact path: `review-artifacts/` directory
- Retention: Use GitHub's default (typically 90 days, configurable in org settings)
- Only upload if all five coverage reports verified

### 6. Review Index (index.html) Validation

**Decision**: Validate that review-artifacts/index.html contains only links to files that actually exist  
**Rationale**: Prevents broken links; ensures reviewers can access all referenced content  
**Alternatives Considered**: Auto-generate index.html from discovered coverage files - deferred to future work

**Current Approach**:
- Manually verify all links in index.html point to existing files
- If a link is broken, fail the build

### 7. Integration with Existing Test Suites

**Decision**: All five UI test suites already exist (ui-expense, ui-stopwatch, ui-temp, ui-todo, ui-quote)  
**Rationale**: These are the UI modules explicitly named in feature spec  
**Finding**: ui-quote may be new or may need to be added to CI if not already present

**Coverage Thresholds** (per Constitution Principle II):
- Each UI test suite must maintain ≥40% statement coverage
- This is a gate for PR merges
- Coverage should be reported in review-packet

---

## Decisions Summary

| Area | Decision | Confidence |
|------|----------|-----------|
| CI Platform | GitHub Actions | High |
| Coverage Tool | Vitest native coverage | High |
| Coverage Formats | lcov.info + HTML | High |
| Report Location | review-artifacts/ | High |
| Verification | Fail-fast check script | High |
| Artifact Upload | actions/upload-artifact@v4 | High |
| Index Validation | Manual review + automated check | Medium |
| Test Suites | Five existing suites (ui-expense, ui-stopwatch, ui-temp, ui-todo, ui-quote) | High |

---

## Next Steps (Phase 1)

1. **Examine current `.github/workflows/test.yml`** to understand existing coverage configuration
2. **Audit vitest.config.js** to verify coverage is enabled for all five suites
3. **Create/update coverage copying script** in CI workflow
4. **Define verification script** to check all five coverage report sets exist
5. **Update review-artifacts/index.html** to ensure all five suites are referenced
6. **Design CI failure policy** to implement fail-fast behavior

---

*Based on feature spec requirements (FR-001 through FR-013, EHP-001 through EHP-003)*
*Aligned with Constitution Principle III (Reviewability) and Principle II (Test Coverage Mandate)*
