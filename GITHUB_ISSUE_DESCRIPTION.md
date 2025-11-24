## Phase 1: Setup & Prerequisites

- [ ] T001 Verify git branch is `025-chapter-6-day-0` and main branch is accessible
- [ ] T002 Ensure all design documents are loaded (spec.md, plan.md, research.md, data-model.md, quickstart.md)
- [ ] T003 Update .github/copilot-instructions.md with Chapter 6 technologies (if not already done)

## Phase 2: Foundational Infrastructure

- [ ] T004 Create SECURITY.md in repository root with responsible disclosure policy
- [ ] T005 Create .github/workflows/ally-check.yml GitHub Actions workflow
- [ ] T006 Create .github/accessibility/ally-check-baseline.json with initial baseline
- [ ] T007 Create placeholder scripts: .github/scripts/run-ally-check.js and compare-ally-baseline.js

## Phase 3: User Story 1 (P1) - FinishtoGreen: Chapter 5 API Work Complete

**Goal**: Formally close Chapter 5 API development and document completion

- [ ] T008 [P] [US1] Clean main branch: remove stray/debug files
- [ ] T009 [P] [US1] Update README.md with links to Review Packet, API docs, and Chapter 6
- [ ] T010 [US1] Create and push git tag `chapter5-complete` marking final Chapter 5 commit
- [ ] T011 [US1] Verify branch protection rule on main requires all 4 existing status checks

## Phase 4: User Story 2 (P1) - CI Tightening: New Quality Gates

**Goal**: Establish coverage thresholds and accessibility scanning baseline

- [ ] T012 [US2] Update API coverage threshold to 70% in api/vitest.config.ts
- [ ] T013 [P] [US2] Update frontend coverage threshold from 40% to 55% in frontend/vitest.config.js
- [ ] T014 [US2] Implement .github/scripts/run-ally-check.js accessibility scanning logic
- [ ] T015 [US2] Implement .github/scripts/compare-ally-baseline.js baseline comparison logic
- [ ] T016 [P] [US2] Add ally-check to branch protection required status checks

## Phase 5: User Story 3 (P2) - Review Packet & Project Hygiene

**Goal**: Update Review Packet and verify GitHub Projects configuration

- [ ] T017 [P] [US3] Update Review Packet index.html to include Projects evidence section
- [ ] T018 [P] [US3] Verify GitHub Projects "Training Prince" board has all 5 required fields
- [ ] T019 [P] [US3] Test GitHub Projects automations: auto-add and PR-to-Done

## Phase 6: Validation & Integration

- [ ] T020 Create comprehensive test PR on 025-chapter-6-day-0 branch
- [ ] T021 Verify Review Packet artifact generates correctly
- [ ] T022 Verify coverage threshold enforcement blocks low-coverage PRs
- [ ] T023 Merge PR to main and confirm chapter5-complete tag visible

---

**Total Tasks**: 23 | **Estimated Time**: 3-4 hours | **Parallelizable**: 8 tasks
