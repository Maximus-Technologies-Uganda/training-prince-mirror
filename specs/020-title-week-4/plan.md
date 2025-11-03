
# Implementation Plan: Week 4 Finisher - Update PR Template for Spec Discipline

**Branch**: `020-title-week-4` | **Date**: 2025-11-03 | **Spec**: [specs/020-title-week-4/spec.md](specs/020-title-week-4/spec.md)
**Input**: Feature specification from `/specs/020-title-week-4/spec.md`

## Summary

Update the repository's pull request template (`.github/pull_request_template.md`) to enforce spec discipline by requiring developers to fill three mandatory fields: Spec URL, Figma Dev Mode Link, and Acceptance Checklist verification. CI/CD system will validate these fields are non-empty before allowing PR merges, ensuring all PRs have design context and spec traceability.

**Key Decisions**:
- Hard enforcement: CI checks + branch protection block merges on validation failure
- Mandatory-but-nullable Figma field: Accepts "N/A" with justification for backend-only work
- Configuration-only: No code changes; pure template and CI validation setup

---

## Technical Context
**Language/Version**: GitHub Actions workflow (YAML) + Markdown template (no version dependency)  
**Primary Dependencies**: GitHub Actions, GitHub API (branch protection checks), Markdown  
**Storage**: N/A (template file-based configuration)  
**Testing**: CI validation via GitHub Actions; manual PR verification  
**Target Platform**: GitHub repository settings and CI/CD pipeline  
**Project Type**: Configuration/DevOps (not a code feature)  
**Performance Goals**: N/A (configuration task)  
**Constraints**: Must not block existing PR workflows; validation must be clear and actionable  
**Scale/Scope**: Single file update + one CI validation workflow

---

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Principle IV: PR Craft** ✅ APPLICABLE & SUPPORTED
- This feature directly implements PR craft requirements: mandatory Spec URL in PR description, acceptance checklist verification
- Constitution v1.1.0 Section 3 states: "PRs MUST use the required PR description template including... a `Spec:` link"
- **Implementation aligns**: Template now enforces spec URL + acceptance criteria + Figma context as constitutional requirement

**Other Principles**: Not directly impacted
- No code duplication (Principle I): Configuration task only
- No test coverage impact (Principle II): PR metadata, not application code
- No review-packet impact (Principle III): PR metadata enhancement, not core deliverable
- No tech stack changes (Principle V): Uses existing GitHub Actions, no new dependencies

**Complexity Tracking**: None required (no constitutional violations)

---

## Project Structure

### Documentation (this feature)
```
specs/020-title-week-4/
├── plan.md                          # This file (/plan command output)
├── research.md                      # Phase 0 output (/plan command)
├── data-model.md                    # Phase 1 output (/plan command)
├── quickstart.md                    # Phase 1 output (/plan command)
├── contracts/                       # Phase 1 output (/plan command)
│   └── github-pr-template.md        # Template schema + validation contract
└── tasks.md                         # Phase 2 output (/tasks command)
```

### Source Code (repository root)
```
.github/
├── pull_request_template.md         # Template to be updated (MAIN DELIVERABLE)
└── workflows/
    ├── lint.yml                     # Existing
    └── validate-pr-template.yml     # NEW: PR template validation workflow
```

**Structure Decision**: Configuration-only feature affecting `.github/` repository settings and adding a new GitHub Actions workflow. No changes to frontend/ or backend/ directories. Focus on CI/CD pipeline enhancement.

---

## Phase 0: Outline & Research

### Research Tasks (to be executed):

1. **GitHub PR Template Mechanism & Limitations**
   - Question: What does GitHub support for PR template field validation?
   - Decision needed: Native GitHub support vs. third-party Action vs. custom script
   - Output: research.md decision with rationale

2. **GitHub Actions for CI Validation**
   - Question: Best practices for parsing PR body and validating field presence?
   - Decision needed: Community Action (e.g., `actions/github-script`) vs. custom bash script
   - Output: research.md implementation pattern

3. **Branch Protection Rules & Merge Blocking**
   - Question: How to configure branch protection to require PR template validation?
   - Decision needed: Required status check via GitHub Actions vs. webhook integration
   - Output: research.md configuration steps

4. **Edge Case Handling: "N/A" Detection for Figma Field**
   - Question: How to distinguish valid "N/A" entries from empty fields?
   - Decision needed: Regex pattern for acceptance (e.g., `N/A|n/a|\[N/A\]` + justification text)
   - Output: research.md pattern spec

**Output**: `research.md` with decisions, alternatives, and implementation patterns for all 4 research topics

---

## Phase 1: Design & Contracts

### 1. Data Model (`data-model.md`)

**Entity**: PR Template Configuration

```
PR Template State (GitHub Repository Configuration):
├── name: "pull_request_template.md"
├── location: ".github/pull_request_template.md"
├── format: "Markdown"
├── sections:
│   ├── Spec URL
│   │   ├── type: required (non-empty)
│   │   ├── placeholder: "https://github.com/.../specs/XXX/spec.md or Linear ticket"
│   │   └── validation: regex match (URL or Linear ID)
│   ├── Figma Dev Mode Link
│   │   ├── type: mandatory-but-nullable
│   │   ├── values: URL | "N/A - {justification}"
│   │   ├── validation: non-empty + (URL OR "N/A" pattern)
│   │   └── justification_required: true if "N/A"
│   └── Acceptance Checklist
│       ├── type: checkbox verification
│       ├── items: ["Spec acceptance boxes ticked", "Figma designs reviewed", "PR description complete"]
│       └── validation: at least one checkbox marked
│
└── validation_contract:
    ├── trigger: PR opened or synchronized
    ├── check_spec_url: regex(URL | Linear)
    ├── check_figma_link: regex(URL | "N/A" + text)
    ├── check_acceptance: at_least_one_checkbox
    └── merge_blocking: ALL checks must pass
```

### 2. Contracts (`contracts/github-pr-template.md`)

**File**: `contracts/github-pr-template.md`

**Purpose**: Document the PR template schema, field requirements, and validation contract

**Content** (to be generated):
- PR template markdown structure
- Field definitions (Spec URL, Figma, Acceptance Checklist)
- Validation rules for each field
- Example valid/invalid PR descriptions
- Error messages for each validation failure

### 3. Quickstart (`quickstart.md`)

**Purpose**: Developer guide for filling out the new PR template

**Sections**:
1. Template overview and purpose
2. How to fill Spec URL field (with examples)
3. How to fill Figma Dev Mode Link (with N/A guidance)
4. How to verify acceptance checklist
5. What happens if validation fails
6. Troubleshooting common validation errors

### 4. Agent Context Update

Execute `.specify/scripts/bash/update-agent-context.sh cursor` to add PR template validation workflow to the agent context file.

**Output**: `research.md`, `data-model.md`, `contracts/github-pr-template.md`, `quickstart.md`, and updated agent context

---

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

### Task Generation Strategy

The `/tasks` command will generate tasks from Phase 1 artifacts:

1. **Setup & Configuration Tasks** (Sequential)
   - T001: Review and validate current `.github/pull_request_template.md` 
   - T002: Create new PR template with 3 mandatory sections

2. **CI Validation Infrastructure Tasks** (Sequential - depends on template)
   - T003: Create GitHub Actions workflow for PR template validation
   - T004: Configure validation logic (Spec URL + Figma Link + Acceptance Checklist checks)
   - T005: Set up branch protection rule requiring validation workflow

3. **Testing & Verification Tasks** (Parallel - independent)
   - T006: Test valid PR with all fields properly filled [P]
   - T007: Test invalid PR with missing Spec URL [P]
   - T008: Test edge case: PR with "N/A" Figma field + justification [P]
   - T009: Test merge blocking when validation fails [P]

4. **Documentation & Deployment Tasks** (Sequential)
   - T010: Document validation error messages
   - T011: Create PR with template changes and merge

### Ordering Strategy

- **Setup first** (T001-T002): Update template file before CI setup
- **CI configuration** (T003-T005): Configure validation workflow and protection rules
- **Testing** (T006-T009): Verify all scenarios; parallel testing recommended
- **Documentation** (T010-T011): Final docs and deployment

### Task Interdependencies

```
T001 → T002 → T003 → T004 → T005 → [T006, T007, T008, T009 in parallel] → T010 → T011
```

### Estimated Output

10-12 numbered, ordered tasks that can be completed in 1-2 hours total

---

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: `/tasks` command generates tasks.md  
**Phase 4**: Implementation - Execute tasks following template specifications  
**Phase 5**: Validation - Verify CI workflow functions, test all scenarios, and merge PR

---

## Complexity Tracking

No constitutional violations detected. This feature directly supports Constitutional Principle IV (PR Craft) by enforcing mandatory Spec URL and acceptance criteria in PR descriptions.

---

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command) — Planned above, to be executed by agent
- [x] Phase 1: Design complete (/plan command) — Planned above, to be executed by agent
- [x] Phase 2: Task planning complete (/plan command - describe approach only) — Defined above
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS — PR Craft (Principle IV) alignment verified
- [ ] Post-Design Constitution Check: PASS — Will verify after Phase 1 design artifacts created
- [x] All NEEDS CLARIFICATION resolved — 2 clarifications integrated (hard enforcement + mandatory-but-nullable Figma)
- [x] Complexity deviations documented — None required

---

*Based on Constitution v1.1.0 - See `.specify/memory/constitution.md`*
