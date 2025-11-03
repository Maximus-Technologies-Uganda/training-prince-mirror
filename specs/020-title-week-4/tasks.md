# Tasks: Week 4 Finisher - Update PR Template for Spec Discipline

**Input**: Design documents from `specs/020-title-week-4/`  
**Feature**: Week 4 Finisher - Update PR Template for Spec Discipline  
**Branch**: `020-title-week-4`  
**Status**: Ready for execution

---

## Phase 3.1: Setup & Configuration

- [ ] T001 Review current PR template at `.github/pull_request_template.md` and document existing structure
- [ ] T002 Create new PR template with mandatory sections (Spec URL, Figma Dev Mode Link, Acceptance Checklist) at `.github/pull_request_template.md`

---

## Phase 3.2: CI Validation Infrastructure

- [ ] T003 Create GitHub Actions validation workflow at `.github/workflows/validate-pr-template.yml`
- [ ] T004 Configure validation logic in workflow to validate Spec URL and Figma Link fields
- [ ] T005 Set up branch protection rule for `development` branch requiring validation check

---

## Phase 3.3: Testing & Verification (Parallelizable)

- [ ] T006 [P] Test valid PR with all fields properly filled - verify validation passes
- [ ] T007 [P] Test invalid PR with missing Spec URL - verify validation fails and merge blocked
- [ ] T008 [P] Test edge case with N/A Figma field + justification - verify N/A pattern accepted
- [ ] T009 [P] Test merge blocking when Figma field empty - verify hard enforcement working

---

## Phase 3.4: Documentation & Deployment

- [ ] T010 Document validation error messages and verify quickstart.md covers all scenarios
- [ ] T011 Create and merge PR to development with all template and workflow changes

---

## Dependency Graph

```
T001 → T002 → T003 → T004 → T005 → [T006, T007, T008, T009 in parallel] → T010 → T011
```

---

## Task Details Reference

### T001: Review Current PR Template
**File**: `.github/pull_request_template.md` (Read-only)  
**Duration**: ~5 min  
**Dependencies**: None

Review current content and document what exists before making changes.

---

### T002: Create New PR Template with Mandatory Sections
**File**: `.github/pull_request_template.md` (Create/Update)  
**Duration**: ~10 min  
**Dependencies**: T001

Add three mandatory sections:
1. `## Spec URL` - Link to specification (GitHub spec.md or Linear ticket)
2. `## Figma Dev Mode Link` - Design link or N/A with reason
3. `## Acceptance Checklist` - Checkboxes for verification

See `contracts/github-pr-template.md` for exact schema.

---

### T003: Create GitHub Actions Validation Workflow
**File**: `.github/workflows/validate-pr-template.yml` (Create)  
**Duration**: ~15 min  
**Dependencies**: T002

Create workflow triggered on pull_request (opened, synchronize, reopened) using `actions/github-script@v7`.

---

### T004: Configure Validation Logic
**File**: `.github/workflows/validate-pr-template.yml` (Update)  
**Duration**: ~10 min  
**Dependencies**: T003

Implement field extraction and validation:
- Spec URL: Non-empty + (URL or PRI-ID pattern)
- Figma Link: Non-empty + (Figma URL or N/A pattern)

Regex patterns in `research.md`.

---

### T005: Set Up Branch Protection Rule
**File**: GitHub repository settings (Manual)  
**Duration**: ~10 min  
**Dependencies**: T004

Configure branch protection on `development`:
1. Go to Settings → Branches → Add rule
2. Enable "Require status checks to pass before merging"
3. Add required check: `validate-pr-template / validate`

---

### T006-T009: Testing (Parallelizable)
**Duration**: ~32 min sequential / ~8 min parallel  
**Dependencies**: T005

Create test PRs and verify:
- **T006**: Valid PR → validation passes
- **T007**: Missing Spec URL → validation fails, merge blocked
- **T008**: N/A Figma → validation passes (N/A pattern works)
- **T009**: Empty Figma → validation fails, merge blocked

All test PRs close without merging (testing only).

---

### T010: Document Error Messages
**File**: `specs/020-title-week-4/quickstart.md` (Verify/Supplement)  
**Duration**: ~10 min  
**Dependencies**: T009

Verify quickstart covers:
- How to fill Spec URL section
- How to fill Figma Dev Mode Link (N/A guidance)
- What happens if validation fails
- How to fix validation errors

---

### T011: Create and Merge PR
**File**: Create PR from `020-title-week-4` to `development`  
**Duration**: ~5 min  
**Dependencies**: T010

1. Commit all changes (template, workflow, spec)
2. Create PR with title: `fix(repo): Week 4 Finisher - Update PR Template for Spec Discipline`
3. Ensure PR body follows NEW template (Spec URL, Figma Link, Acceptance Checklist)
4. Wait for validation workflow to pass
5. Merge to development

---

## Execution Timeline

**Sequential**: ~97 minutes
- Setup (T001-T002): 15 min
- CI Config (T003-T005): 35 min
- Testing (T006-T009): 32 min
- Docs & Merge (T010-T011): 15 min

**With Parallel Testing**: ~60 minutes (T006-T009 run together in ~8 min)

---

## Parallel Execution Group

When T005 is complete, launch T006-T009 together:

```bash
# All 4 can run in parallel:
T006: Test valid PR
T007: Test invalid Spec URL
T008: Test N/A Figma field
T009: Test merge blocking

# Wait for all 4 to complete before starting T010
```

---

## Notes
- All tasks are configuration-only (no code changes)
- Hard enforcement: PRs blocked if validation fails
- N/A handling: Backend-only work uses "N/A - reason" format
- Once merged, all future PRs must follow new template
- See `specs/020-title-week-4/quickstart.md` for developer guide

---

*Tasks Phase 3 Complete — Ready for Execution*
