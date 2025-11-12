
# Implementation Plan: Week 4 Finisher: Default Branch Hygiene

**Branch**: `019-title-week-4` | **Date**: 2025-11-03 | **Spec**: [specs/019-title-week-4/spec.md](/specs/019-title-week-4/spec.md)
**Input**: Feature specification from `specs/019-title-week-4/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path ✓
   → Spec loaded: Default Branch Hygiene
2. Fill Technical Context
   → Project Type: Configuration task (repository settings)
   → No code implementation required
   → Primary action: GitHub repository settings change
3. Evaluate Constitution Check
   → No code changes involved; Constitutional principles not applicable
   → Verification: Manual screenshot requirement (acceptable for config task)
4. Execute Phase 0 → research.md
   → Research: GitHub default branch documentation & API
5. Execute Phase 1 → data-model.md, contracts, quickstart.md
   → Data model: GitHub repository configuration state
   → Contract: GitHub API for default branch (reference only; manual UI preferred)
6. Update agent context file
   → Not applicable for configuration task
7. Re-evaluate Constitution Check
   → Still not applicable (no code changes)
8. Plan Phase 2 → Task generation approach
   → Task: Switch default branch and verify
   → Task: Document verification in PR
9. STOP - Ready for /tasks command
```

## Summary

Switch the repository's default branch from `main` to `development` using GitHub's repository settings UI, verifying the change with a screenshot in the PR description. This addresses Week 4 feedback requiring current project documentation as the first impression reviewers receive when accessing the repository.

## Technical Context
**Language/Version**: N/A (configuration task)
**Primary Dependencies**: GitHub repository settings
**Storage**: N/A
**Testing**: Manual verification via GitHub UI
**Target Platform**: GitHub web interface
**Project Type**: Configuration / DevOps
**Performance Goals**: N/A
**Constraints**: (a) Development branch must be current before switching, (b) Change must be verified and documented
**Scale/Scope**: Single repository setting change

## Constitution Check
*GATE: Evaluate against Constitution v1.1.0*

This feature is a **DevOps/infrastructure task** (repository configuration) rather than a code change, therefore:

- ✅ **Principle I (No Logic Duplication)**: N/A - no code changes
- ✅ **Principle II (Test Coverage Mandate)**: N/A - no code changes
- ✅ **Principle III (Reviewability)**: Configuration change visible in GitHub settings; PR description documents change with screenshot
- ✅ **Principle IV (PR Craft)**: Configuration changes are minimal LOC (0 code changes); PR description includes verification screenshot
- ✅ **Principle V (Simplicity & Consistency)**: Using GitHub's native UI (no custom tooling)

**Constitution Verdict**: ✅ **PASS** - Configuration task complies with all principles by nature (no code involved).

## Project Structure

### Documentation (this feature)
```
specs/019-title-week-4/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (reference) (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### No Source Code Changes
This feature modifies repository settings only; no code changes in `src/`, `frontend/`, or `backend/` directories.

**Structure Decision**: Configuration-only task. No code structure modifications required. Verification occurs in GitHub UI and PR description.

## Phase 0: Outline & Research

**Research Task 1: GitHub Default Branch Mechanism**
- **Decision**: Use GitHub repository settings (web UI) to change default branch
- **Rationale**: GitHub web UI is the standard, documented way to change repository settings; no API required for this one-time configuration
- **Alternatives considered**: 
  - GitHub API v3 `PATCH /repos/{owner}/{repo}` endpoint (adds complexity; manual UI is simpler for one-time task)
  - Git commands (don't apply; default branch is a repository platform setting, not a git concept)

**Research Task 2: Verification Method**
- **Decision**: Manual verification via GitHub UI with screenshot in PR description
- **Rationale**: Matches clarification requirement (Option D); simple, auditable, no tooling overhead
- **Alternatives considered**:
  - Automated GitHub API script (overkill for one-time change)
  - Git symbolic-ref check (requires local clone; UI screenshot is more direct)

**Output**: research.md complete (see Phase 0 output below)

---

## Phase 1: Design & Contracts

### Data Model (Entity: GitHub Repository Configuration)
```
GitHub Repository
├── name: string (hello-world)
├── default_branch: string (currently: "main" → target: "development")
├── main_branch: Branch object
│   ├── name: "main"
│   ├── status: "not default"
│   ├── protection_rules: existing (unchanged)
│   └── content: unchanged (per clarification)
└── development_branch: Branch object
    ├── name: "development"
    ├── status: "new default"
    ├── protection_rules: existing
    └── content: current (must be verified before switch)
```

### Contract / API Reference (GitHub Repository Settings)
```
GitHub Repository Settings API (Reference)
POST /repos/{owner}/{repo}/settings
Request:
  {
    "default_branch": "development"
  }

Response:
  {
    "default_branch": "development",
    "updated_at": "2025-11-03T..."
  }

Note: Manual UI approach preferred (per clarification); this contract 
is for reference only if automation is needed in future.
```

### Quickstart (Manual Verification Steps)

**Goal**: Verify that the default branch switch was successful

**Prerequisites**:
1. User has admin access to the hello-world repository on GitHub
2. Confirmed that the `development` branch contains current documentation (README.md with "How to review me" section)

**Verification Steps**:
1. Navigate to the hello-world repository on GitHub
2. Click the **Settings** tab
3. Locate the **Default Branch** section (usually under "Repository" section)
4. Observe the current default branch dropdown
5. Confirm it displays `development`
6. Take a screenshot showing:
   - Repository name (prnceb/hello-world)
   - Settings tab active
   - Default branch dropdown showing `development`
   - Timestamp or any other confirmation indicator
7. Document the screenshot in the PR description under "Verification" section

**Expected Result**: Repository default branch is set to `development`; future clones will receive development branch as default.

**Output Phase 1 artifacts**: 
- ✅ data-model.md (generated)
- ✅ contracts/ (reference contract generated)
- ✅ quickstart.md (verification steps)
- ✅ Agent context (not applicable for config task)

---

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Task 1: Verify development branch state (pre-requisite check)
- Task 2: Change default branch in GitHub settings to `development`
- Task 3: Verify change was applied (screenshot verification)
- Task 4: Document verification in PR description
- Task 5: Create PR with documentation

**Ordering Strategy**:
- Sequential: Verification check (1) → Configuration change (2) → Verification check (3) → Documentation (4-5)
- No parallel tasks (single change sequence)

**Estimated Output**: 5 numbered, sequential tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

---

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (follow tasks.md; change GitHub repository settings)  
**Phase 5**: Validation (verify screenshot, PR review, merge)

---

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (None) | N/A | Constitutional principles fully satisfied by nature of task (no code involved) |

---

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented

---

*Based on Constitution v1.1.0 - See `/memory/constitution.md`*
