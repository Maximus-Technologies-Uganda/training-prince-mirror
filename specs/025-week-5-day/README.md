# Week 5 Day-0: Final Hygiene & Migration to GitHub Projects

**Branch**: `025-week-5-day`  
**Status**: ✅ Specification Phase Complete  
**Created**: November 6, 2025

---

## Overview

This specification folder contains all requirements, design, and planning documentation for **Week 5 Day-0**, a critical milestone that finalizes the repository setup, enforces code quality checks, and migrates project management from Linear to GitHub Projects.

The goal is to make the repository production-ready, reviewer-friendly, and self-contained on the GitHub platform.

---

## What's Inside

### 📋 Specification Documents

| File | Purpose | Status |
|------|---------|--------|
| **[spec.md](./spec.md)** | Feature specification with all D0 requirements and acceptance criteria | ✅ Complete |
| **[plan.md](./plan.md)** | Implementation plan with technical context, constitution check, and phased approach | ✅ Complete |
| **[research.md](./research.md)** | Technical research on GitHub Projects API, branch protection, Vitest, templates | ✅ Complete |
| **[data-model.md](./data-model.md)** | Entity definitions, relationships, and validation rules for all D0 systems | ✅ Complete |
| **[quickstart.md](./quickstart.md)** | Step-by-step validation walkthrough with all acceptance scenarios | ✅ Complete |
| **[contracts/](./contracts/)** | Formal contracts defining system interfaces and success criteria | ✅ Complete |

### 🎯 Core Requirements (from spec.md)

**D0.1: Branch Hygiene & Merge to main**
- Update main README.md → point to Week 5 paths and review-packet
- Remove stray files from main branch
- Squash merge development → main
- Create tag: `week5-day0`

**D0.2: Required CI Checks (Branch Protection)**
- spec-check
- Test & Coverage - API
- Playwright Smoke
- CodeQL
- Dependency Review

**D0.3 & D0.4: Verify Coverage & Review Packet**
- Vitest: 60% thresholds on all metrics
- Include/exclude paths for 5 UI suites (Expense, Stopwatch, Temp, Todo, Quote)
- review-artifacts/index.html with links to: coverage table, Playwright report, OpenAPI docs, changelog

**1.1: GitHub Project Setup**
- Create GitHub Project (new format)
- Custom fields: Status, Priority, Size, Spec URL, Sprint/Week
- Automation: auto-add issues/PRs, PR open→In Review, PR merge→Done

**1.2: Issue Templates**
- `.github/ISSUE_TEMPLATE/feature.md` → Feature requests
- `.github/ISSUE_TEMPLATE/bug.md` → Bug reports

**1.3: Pull Request Template**
- `.github/pull_request_template.md`
- Sections: Spec URL, Contract Tests, Checks, CHANGELOG Updated, Breaking Changes, Related Issues

---

## Implementation Roadmap

### Phase 0: Research & Planning ✅
- Investigated GitHub Projects API and automation options
- Researched branch protection rules and exact check names
- Analyzed Vitest coverage configuration for multi-suite projects
- Documented review packet generation and linking strategy
- Identified template best practices and GitHub syntax
- Resolved squash merge and tagging strategy

**Outcome**: research.md with all technical decisions documented

### Phase 1: Design & Contracts ✅
- Defined all entities: GitHub Project, Branch Protection, CI Workflow, Artifacts, Templates, Tags
- Created formal contracts for each subsystem
- Designed data model with validation rules
- Outlined API contracts and success criteria
- Prepared quickstart validation steps

**Outcome**: data-model.md, contracts/index.md, quickstart.md with comprehensive specifications

### Phase 2: Task Planning (Next)
- Generate tasks.md with numbered, ordered work items
- Group tasks by subsystem (6 subsystems)
- Define parallelization opportunities (B, C, D tasks can run in parallel)
- Create dependency order (A → B,C,D,E,F → G)

**Expected Output**: tasks.md with 20-25 tasks

### Phase 3: Implementation (After /tasks)
- Execute tasks following TDD approach (test first, then code)
- Update main branch files (README, remove stray files)
- Configure GitHub branch protection rules
- Create GitHub Project and automation rules
- Generate templates (.github/)
- Verify artifacts and coverage
- Execute squash merge and tagging

### Phase 4: Validation (After implementation)
- Run quickstart.md validation steps
- Verify Definition of Done checklist
- Test issue and PR templates with real submissions
- Confirm all CI checks block invalid PRs
- Validate GitHub Project auto-add and status updates

---

## Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| GitHub Projects (new) not legacy | Better automation, GraphQL API, more powerful field types |
| 60% coverage threshold | Achievable baseline for multi-suite UI project |
| Squash merge strategy | Clean history; one commit per major milestone |
| Relative links in review packet | Portable, works offline, no broken references |
| Branch protection via Settings UI | Transparent to maintainers; easier troubleshooting |
| 5 status checks required | Comprehensive quality gates: spec, unit tests, e2e, security, supply chain |

---

## Definition of Done

All tasks must satisfy this checklist:

- [ ] Main branch README.md updated with Week 5 paths and review packet link
- [ ] Stray files removed from main (verified via git diff)
- [ ] Development squash-merged into main (verified via git log)
- [ ] Tag `week5-day0` created on main (verified via git tag -l)
- [ ] Branch protection rules on main with all 5 status checks
- [ ] Vitest config enforces 60% thresholds with correct include/exclude
- [ ] review-artifacts/index.html with links to coverage, Playwright, OpenAPI, changelog
- [ ] GitHub Project created with all 5 custom fields configured
- [ ] GitHub Project automation active (auto-add, status updates)
- [ ] `.github/ISSUE_TEMPLATE/feature.md` and `bug.md` created
- [ ] `.github/pull_request_template.md` created with mandatory sections
- [ ] Team notified: Linear decommissioned, GitHub Projects is source of truth
- [ ] All D0 tests passing; main is green

---

## How to Use This Specification

### For Implementation Teams

1. **Start with [plan.md](./plan.md)** to understand the overall approach and phases
2. **Review [research.md](./research.md)** for technical decisions and alternatives
3. **Study [data-model.md](./data-model.md)** to understand entities and relationships
4. **Reference [contracts/](./contracts/)** for formal interface definitions
5. **Follow [quickstart.md](./quickstart.md)** step-by-step during implementation
6. **Verify against [spec.md](./spec.md)** to ensure all requirements met

### For Reviewers

1. Use **[quickstart.md](./quickstart.md)** as acceptance test scenario
2. Cross-reference **[spec.md](./spec.md)** for requirement completeness
3. Review **[data-model.md](./data-model.md)** for entity relationships
4. Check **[contracts/](./contracts/)** for interface compliance

### For Documentation

- **[spec.md](./spec.md)**: User-facing requirements (what needs to be done)
- **[plan.md](./plan.md)**: Technical approach (how it will be done)
- **[research.md](./research.md)**: Decision rationale (why this approach)

---

## Success Metrics

**D0 will be successful when**:

1. ✅ Main branch is the new PR target (not development)
2. ✅ All PRs to main blocked unless 5 required checks pass
3. ✅ GitHub Project has all custom fields and automation active
4. ✅ Review packet is accessible and complete
5. ✅ Contributors use feature/bug templates without Linear
6. ✅ Team workflow is 100% GitHub-based
7. ✅ Repository is polished and reviewer-friendly
8. ✅ Git tag week5-day0 marks the milestone

---

## Related Documentation

- **[README.md](../../README.md)** → Main repository overview
- **[review-artifacts/](../../review-artifacts/)** → Review packet entry point
- **[.github/workflows/](../../.github/workflows/)** → CI/CD workflow configurations
- **[CHANGELOG.md](../../CHANGELOG.md)** → Release notes

---

## Questions & Clarifications

**Outstanding Questions** (for design refinement):
1. API Coverage output format? (JSON, HTML, both?)
2. Where is OpenAPI spec stored? (openapi.json? Generated on build?)
3. CHANGELOG format standard? (Keep a Changelog? Conventional Commits?)

These don't block D0 but should be clarified before Phase 3+ implementation.

---

## Phase Status

| Phase | Name | Status |
|-------|------|--------|
| 0 | Outline & Research | ✅ Complete (research.md) |
| 1 | Design & Contracts | ✅ Complete (data-model.md, contracts/, quickstart.md) |
| 2 | Task Planning | ⏳ Pending (/tasks command) |
| 3 | Task Execution | ⏳ Pending (manual implementation) |
| 4 | Validation | ⏳ Pending (test & verify) |

---

## Next Steps

1. ✅ **Read** this README for overview
2. ✅ **Review** spec.md and plan.md for requirements and approach
3. ⏳ **Run** `/tasks` command to generate tasks.md with work items
4. ⏳ **Execute** tasks.md following the numbered order
5. ⏳ **Validate** against quickstart.md and Definition of Done
6. ⏳ **Merge** development → main with tag week5-day0
7. ⏳ **Deploy** and notify team

---

## File Manifest

```
specs/025-week-5-day/
├── README.md                    # This file
├── spec.md                      # Feature specification (requirements)
├── plan.md                      # Implementation plan (approach)
├── research.md                  # Technical research (decisions)
├── data-model.md                # Entity definitions (design)
├── quickstart.md                # Validation walkthrough (testing)
└── contracts/
    └── index.md                 # Contract definitions (interfaces)
```

---

**Specification Completed**: November 6, 2025  
**Branch**: `025-week-5-day`  
**Status**: Ready for Task Generation Phase

---

*For questions or clarifications, refer to the specific document sections or the memory from previous weeks.*


