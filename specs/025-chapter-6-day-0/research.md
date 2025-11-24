# Phase 0 Research: Chapter 6 Day 0 - FinishtoGreen & CI Tightening

**Branch**: `025-chapter-6-day-0` | **Date**: 18 November 2025  
**Status**: Research Complete | **Next**: Phase 1 Design & Contracts

---

## Research Findings

### 1. GitHub Pages API Documentation Setup

**Decision**: API docs are already published to GitHub Pages on the `main` branch via the `deploy-pages.yml` workflow. Day 0 task is **verification and linking only**.

**Rationale**: The existing workflow deploys `frontend/dist/` to GitHub Pages. API documentation is typically served from a docs folder or build artifact. This is already in place per assumption in spec.

**Alternatives Considered**:
- Option A (selected): Verify existing Pages setup and link in README.md
- Option B: Set up new Pages configuration (rejected: out of scope; already published per assumptions)

**Implementation Details**:
- GitHub Pages is configured with environment: `github-pages`
- Source: `frontend/dist/` directory (or docs folder if configured separately)
- Deployment on `development` branch push or manual trigger (`workflow_dispatch`)
- Day 0 action: Verify URL works, add link to README.md with context

**Evidence**: `.github/workflows/deploy-pages.yml` exists and is functional

---

### 2. Ally-Check Accessibility Testing Integration

**Decision**: Use `axe-core` library with a new GitHub Actions job named `ally-check` that runs axe accessibility scans in CI. Establish a baseline of known violations on Day 0 and only fail on NEW violations not in allowlist.

**Rationale**: 
- Axe is industry-standard for automated accessibility testing
- Can run in CI environment without external dependencies
- Baseline approach prevents blocking on pre-existing issues while enforcing new quality standards

**Alternatives Considered**:
- Option A (selected): Axe-core + baseline allowlist
- Option B: Only enforce on Day 1 (rejected: spec requires hard blocker on Day 0)
- Option C: Full remediation of all violations (rejected: out of scope; baseline violations may need separate tracking)

**Implementation Details**:
- Install `axe-playwright` or `@axe-core/playwright` package
- Create `ally-check.yml` workflow that:
  - Runs on PRs to frontend branches
  - Uses Playwright to scan pages
  - Compares results against `ally-check-baseline.json` (allowlist of known issues)
  - Fails only if NEW violations detected
- Create `ally-check-baseline.json` file in `.github/accessibility/` to store baseline violations
- Document baseline in project wiki or CONTRIBUTING.md

**Configuration**:
```bash
npm install --save-dev @axe-core/playwright axe-html-reporter
```

**Baseline File Location**: `.github/accessibility/ally-check-baseline.json`

---

### 3. Coverage Threshold Configuration

**Decision**: 
- **API**: ≥70% (lines, functions, branches) - Already configured in `vitest.config.js` at root
- **UI**: ≥55% (lines, functions, branches) - Needs update from current 40% in `frontend/vitest.config.js`

**Rationale**: 
- API thresholds (70%) are already implemented in root config
- UI thresholds increased from 40% to 55% to reflect Chapter 6 frontend complexity
- Thresholds are enforced as hard blockers via `VITEST_DISABLE_THRESHOLD` environment variable

**Alternatives Considered**:
- Option A (selected): Update both configs; transition threshold on Day 0
- Option B: Gradual increase over time (rejected: spec requires hard blocker on Day 0)
- Option C: Different thresholds per app (rejected: spec mandates 70% API, 55% UI)

**Implementation Details**:

Root `vitest.config.js`:
```javascript
thresholds: process.env.VITEST_DISABLE_THRESHOLD === '1' ? undefined : {
  statements: 70,
  branches: 70,
  functions: 70,
  lines: 70
}
```
✅ **Status**: Already configured

Frontend `frontend/vitest.config.js`:
```javascript
thresholds: {
  statements: 55,
  lines: 55,
  functions: 55,    // If needed for consistency
  branches: 55       // If needed for consistency
}
```
**Status**: Needs update from 40% to 55%

**CI Integration**: `npm run test:coverage` command runs tests with thresholds; CI fails if thresholds not met

---

### 4. Review Packet Structure & GitHub Pages Evidence

**Decision**: 
- Review Packet build script already exists and is functional
- Add "Projects evidence" section (screenshot/link to GitHub Projects board)
- Add "Chapter 6 UI Assets" placeholder section for future UI reports

**Rationale**: 
- Review Packet is the unified artifact of record per constitution
- GitHub Projects evidence demonstrates infrastructure setup
- Placeholder allows progressive addition of UI reports without blocking Day 0

**Alternatives Considered**:
- Option A (selected): Add evidence link + placeholder section
- Option B: Full implementation of all UI reports (rejected: out of scope for Day 0)

**Implementation Details**:
- Modify `build-review-packet` workflow or script to:
  - Add Projects board link/screenshot URL to `review-artifacts/index.html`
  - Create placeholder section titled "Chapter 6 UI Assets" with subsections:
    - UI Coverage Report (placeholder)
    - Playwright E2E Report (placeholder)
    - Lighthouse Report (placeholder)
- Update index.html template to include Projects evidence link near top

**Location**: `.github/scripts/build-review-packet.sh` or equivalent script

---

### 5. GitHub Projects Configuration & Automation

**Decision**: 
- GitHub Projects board "Training Prince" already exists (per assumptions)
- Verify all 5 required fields are present and configured
- Test automations: auto-add (new issues/PRs) and PR-to-Done (move item to Done when PR merged)

**Rationale**: 
- Projects are already in use; Day 0 is verification and completion
- Required fields ensure consistent metadata tracking
- Automations reduce manual overhead

**Alternatives Considered**:
- Option A (selected): Verify existing + complete missing fields
- Option B: Create new project (rejected: already exists per assumptions)

**Implementation Details**:

**Required Fields (5)**:
1. ✅ Status (provided: Not Started, In Progress, In Review, Done)
2. Priority (provided: P0, P1, P2, P3)
3. Size (provided: S, M, L, XL)
4. Spec URL (text field: link to spec or Linear issue)
5. Sprint/Chapter (provided: Chapter 5, Chapter 6, etc.)

**Automations**:
- Auto-add: Configure in Projects settings to add new issues/PRs automatically to board
- PR-to-Done: Configure automation to move items to "Done" when PR is merged

**Verification Steps**:
- Navigate to Projects → Training Prince board
- Check field settings for all 5 fields
- Test by creating sample issue: should auto-add to board
- Test by creating sample PR: should update status when merged

**Evidence**: GitHub Projects UI configuration (screenshot if needed)

---

### 6. SECURITY.md File Requirements

**Decision**: Create `SECURITY.md` in repository root with responsible disclosure policy and contact information.

**Rationale**: 
- Required by GitHub for security vulnerability reporting
- Establishes trust with users/contributors
- Provides clear escalation path for vulnerabilities

**Alternatives Considered**:
- Option A (selected): Create new SECURITY.md with responsible disclosure guidelines
- Option B: Rely on GitHub default (rejected: spec requires explicit file)

**Implementation Details**:

File location: `/SECURITY.md`

Content template:
```markdown
# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it to 
[security-contact@example.com] or [create a private security advisory](https://github.com/Maximus-Technologies-Uganda/training-prince/security/advisories).

**Please do not open public issues for security vulnerabilities.**

### Responsible Disclosure Guidelines

1. **Report privately**: Use email or GitHub's private vulnerability reporting
2. **Include details**: Describe the vulnerability, affected version, and reproduction steps
3. **Allow time**: We commit to acknowledging reports within 48 hours and providing fixes within 30 days
4. **Coordinate timeline**: We will work with you on a responsible disclosure timeline

## Supported Versions

- **Latest release**: Fully supported
- **Previous major version**: Security fixes only
- **Older versions**: No longer supported

## Security Considerations

- All PRs must pass CodeQL analysis and dependency review
- Coverage thresholds are enforced to maintain code quality
- Accessibility standards are mandatory to ensure inclusive access

## Contact

- Primary: [security contact email]
- Secondary: Project maintainers (see CONTRIBUTING.md)
```

---

### 7. Chapter 5 Completion Milestone

**Decision**: 
- Create git tag `chapter5-complete` on the final Chapter 5 commit on main branch
- Tag should be pushed to origin and visible in GitHub releases
- Document this as a formal milestone

**Rationale**: 
- Git tags create auditable milestones
- Visible in GitHub releases for stakeholder communication
- Marks clear boundary between Chapter 5 API work and Chapter 6 frontend work

**Alternatives Considered**:
- Option A (selected): Create git tag on main branch
- Option B: Release page only (rejected: tag provides more precise git history tracking)

**Implementation Details**:

```bash
# On main branch, after all Chapter 5 work is complete
git tag -a chapter5-complete -m "Chapter 5 API Development Complete: FinishtoGreen baseline established"
git push origin chapter5-complete

# Verify
git describe --tags
git tag -l chapter5-complete -n1
```

**Pre-conditions**:
- All Chapter 5 requirements met (per Week 5 Day-0 spec)
- Main branch is in known-good state
- All required CI checks passing

**Post-actions**:
- Tag visible in GitHub Releases page
- Tag visible in git log: `git log --oneline --decorate | head -5`

---

### 8. Branch Protection Rules Verification

**Decision**: Verify that main branch has the following required status checks enabled:
1. `spec-check` (spec validation)
2. `test-api` (API tests)
3. `codeql` (security analysis)
4. `dependency-review` (supply chain security)

**Rationale**: 
- These checks ensure code quality and security
- Day 0 task is verification; checks should already be in place (per assumptions)
- `ally-check` will be added as a new required check for Chapter 6

**Alternatives Considered**:
- Option A (selected): Verify existing checks; add new ally-check
- Option B: Remove and reconfigure all checks (rejected: no breaking changes per assumptions)

**Implementation Details**:

**Verification Steps**:
1. Navigate to Settings → Branches → Branch protection rules
2. Select main branch rule
3. Confirm required status checks include:
   - ✅ spec-check
   - ✅ test-api
   - ✅ codeql
   - ✅ dependency-review
   - ⚠️ ally-check (to be added Day 0)

**New Check to Add**: ally-check
- Enable: "Require status checks to pass before merging"
- Make required: Yes
- Dismiss stale PR approvals: Yes
- Require branches to be up to date: Yes

---

## Technical Context Summary

| Aspect | Status | Details |
|--------|--------|---------|
| **Language/Version** | Node.js 18+ | Backend: TypeScript; Frontend: JavaScript; CLI: Node.js v18+ |
| **Primary Dependencies** | Vitest 3.2.4, Playwright 1.48.2, Redoc CLI | Testing: Vitest, E2E: Playwright, Docs: Redoc |
| **Storage** | N/A | This feature is CI/CD configuration only; no data persistence |
| **Testing** | Vitest 3.2.4 | Unit: Vitest; E2E: Playwright; Coverage: @vitest/coverage-v8 |
| **Target Platform** | Node.js, GitHub Actions | CI/CD runs on ubuntu-latest; Tests on Node.js 20 |
| **Project Type** | Monorepo (web + CLI) | `api/`, `frontend/`, `src/` with separate test suites |
| **Performance Goals** | CI efficiency | Fast feedback; test suite runs <5min |
| **Constraints** | Hard blockers | Coverage thresholds enforce quality; branch protection blocks non-compliant PRs |
| **Scale/Scope** | Medium | 3 applications (CLI, API, Frontend); 15+ GitHub Actions workflows |

---

## Resolved Clarifications

### ✅ Clarification 1: Coverage Thresholds Timing
**Q**: Should coverage thresholds be hard blockers on Day 0 or transition to hard blockers on Day 1?  
**A**: Hard blockers on Day 0 (Option A). Coverage thresholds enforced immediately; PRs below thresholds are rejected. Baseline coverage is assessed and documented.

**Resolution**: Root `vitest.config.js` already enforces 70% API thresholds. Frontend thresholds will be updated to 55% on Day 0 and enforced.

---

### ✅ Clarification 2: Ally-Check Violations Handling
**Q**: Should ally-check fail on any violation or use a baseline of acceptable violations?  
**A**: Baseline with exceptions (Option B). Establish baseline of known violations on Day 0; only new violations trigger job failure. Document exceptions in allowlist file.

**Resolution**: Create `ally-check-baseline.json` allowlist. Ally-check job compares against baseline and only fails on new violations.

---

### ✅ Clarification 3: GitHub Pages API Documentation
**Q**: Is GitHub Pages API documentation already published or needs setup on Day 0?  
**A**: Already published (Option A). API docs currently published to GitHub Pages; Day 0 only verifies URL and links it in README.md. Publishing setup is not part of Day 0 scope.

**Resolution**: Verify `deploy-pages.yml` workflow and GitHub Pages settings; add link to README.md.

---

## Constitution Alignment

This feature aligns with the **Hello-World UI Initiative Constitution (v1.1.0)**:

| Principle | Alignment | Evidence |
|-----------|-----------|----------|
| **No Logic Duplication** | ✅ N/A | CI/CD configuration only; no business logic duplicated |
| **Test Coverage Mandate** | ✅ Enforced | Coverage thresholds: API 70%, UI 55%; hard blockers in CI |
| **Reviewability is Paramount** | ✅ Enhanced | Review Packet updated with Projects evidence; unified coverage index |
| **PR Craft** | ✅ Enforced | Branch protection requires all checks pass before merge |
| **Simplicity & Consistency** | ✅ Maintained | Uses existing tech stack (Vitest, Playwright, GitHub Actions); no new tools |

---

## Next Steps (Phase 1)

1. **Design Phase**: Create `data-model.md` with entity definitions (Git Tag, GitHub Actions Workflow, Branch Protection Rule, etc.)
2. **Contracts Phase**: Define verification tests for each CI component
3. **Agent Context**: Run `update-agent-context.sh copilot` to sync new technologies (ally-check, GitHub Pages) to copilot-instructions.md
4. **Quickstart**: Create `quickstart.md` with execution walkthrough and validation steps

---

**Research Status**: ✅ COMPLETE  
**All NEEDS CLARIFICATION items resolved**  
**Ready for Phase 1: Design & Contracts**
