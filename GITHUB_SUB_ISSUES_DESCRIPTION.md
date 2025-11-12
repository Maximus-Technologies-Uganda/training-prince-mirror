# Week 5 Final Polish: Sub-Issues for Parent Issue

**Feature**: 030-final-polish (Week 5 Day 5 - Final Polish, Review Packet & Demo Preparation)  
**Branch**: `030-final-polish`  
**Spec**: [spec.md](./specs/030-final-polish/spec.md)  
**Format**: GitHub Sub-Issues (maps to tasks.md for implementation)  

## Overview

This parent issue tracks the completion of Week 5 Day 5 - Final Polish, Review Packet & Demo Preparation. All sub-issues must be completed to ensure successful mentor demo and project finalization.

| Metric | Value |
|--------|-------|
| **Total Sub-Issues** | 15 |
| **User Story 1 (CHANGELOG)** | 2 sub-issues |
| **User Story 2 (Review Packet)** | 3 sub-issues |
| **User Story 3 (Project Board)** | 5 sub-issues |
| **User Story 4 (Git Tag)** | 2 sub-issues |
| **User Story 5 (Demo)** | 3 sub-issues |

---

## Phase 1: User Story 1 - Update CHANGELOG with Week 5 Summary (Priority: P1)

**Story Goal**: A reviewer opening the repository can quickly understand what features were added in Week 5 without digging through individual commits or pull requests.

**Independent Test**: CHANGELOG.md exists at repository root, contains a "Week 5" section, and documents all major deliverables (API Scaffolding, POST /expenses endpoint, GET /expenses/summary, Rate Limiter, Coverage Hardening) with accurate descriptions.

**Dependency**: None (can start immediately)  
**Blocks**: Demo script preparation  

### Sub-Issue 1: T005 [P] [US1] Create Week 5 Section Header in CHANGELOG.md
- **Description**: Add a new "## Week 5" section header at the top of CHANGELOG.md with date and summary line.
- **File Path**: `CHANGELOG.md`
- **Acceptance Criteria**:
  - [ ] Header format: `## Week 5 - Final Polish (2025-11-12)`
  - [ ] Positioned at repository root CHANGELOG.md
  - [ ] One-line summary below header: "Documentation finalization, review packet assembly, and mentor demo preparation"
- **Spec URL**: specs/030-final-polish/spec.md

### Sub-Issue 2: T006-T007 [P] [US1] Document Week 5 Features with Details in CHANGELOG.md
- **Description**: Add "Added" subsection with all 6 Week 5 features (API Scaffolding, POST /expenses, GET /expenses/summary, Rate Limiter, Coverage Hardening, Security CI) plus technical sub-bullets and issue references.
- **File Path**: `CHANGELOG.md`
- **Acceptance Criteria**:
  - [ ] Added subsection with 6 bullet points (one per feature)
  - [ ] API Scaffolding: "Added API scaffolding with Express middleware pipeline"
  - [ ] POST /expenses: "Added POST /expenses endpoint - create and track new expenses"
  - [ ] GET /expenses/summary: "Added GET /expenses/summary endpoint - retrieve expense summary with calculations"
  - [ ] Rate Limiter: "Added Rate Limiter middleware - throttle requests to 100 per 10-minute window, return 429 on limit exceeded"
  - [ ] Coverage Hardening: "Hardened test coverage to 70% threshold across all API modules"
  - [ ] Security CI: "Added automated security CI checks to review-packet workflow"
  - [ ] Each feature entry includes 2-3 sub-bullets with details and GitHub issue references
  - [ ] Sub-bullets show endpoint paths, thresholds, and configuration details
- **Spec URL**: specs/030-final-polish/spec.md

---

## Phase 2: User Story 2 - Generate Complete Review Packet with All Artifacts (Priority: P1)

**Story Goal**: A mentor preparing to review the project needs a comprehensive, single-location artifact package that includes all required documentation and coverage reports.

**Independent Test**: Review-packet CI workflow runs successfully and generates review-artifacts/index.html with working hyperlinks to: Coverage Table (≥70%), Playwright Report, OpenAPI HTML documentation (Redoc/Scalar), and CHANGELOG.md. All links are accessible and targets exist.

**Dependency**: CI workflow verification (T003)  
**Blocks**: Demo script preparation, demo execution  

### Sub-Issue 3: T008 [P] [US2] Verify Review-Packet CI Workflow Includes All Four Artifact Steps
- **Description**: Verify `.github/workflows/review-packet.yml` includes all four artifact generation steps with correct configuration for coverage, OpenAPI, Playwright, and CHANGELOG linking.
- **File Path**: `.github/workflows/review-packet.yml`
- **Acceptance Criteria**:
  - [ ] Workflow file exists and is functional
  - [ ] Step 1: Collects coverage reports from `coverage/*/lcov-report/`
  - [ ] Step 2: Runs `redoc-cli` command to generate OpenAPI HTML (Redoc CLI v0.13.21)
  - [ ] Step 3: Uploads Playwright test report artifact
  - [ ] Step 4: Creates CHANGELOG reference in review-artifacts directory
  - [ ] All output configured to `review-artifacts/` directory
  - [ ] All job steps complete without failures (0 skipped jobs)
- **Spec URL**: specs/030-final-polish/spec.md

### Sub-Issue 4: T009 [P] [US2] Create Review Packet Index HTML with Four Main Sections
- **Description**: Create or update `review-artifacts/index.html` displaying Coverage Table, OpenAPI Documentation, Playwright Report, and CHANGELOG Summary with working hyperlinks.
- **File Path**: `review-artifacts/index.html`
- **Acceptance Criteria**:
  - [ ] Valid HTML structure with title "Week 5 Review Packet"
  - [ ] Section 1: "Coverage Table" with link to coverage-index.html
  - [ ] Section 2: "OpenAPI Documentation" with link to openapi.html
  - [ ] Section 3: "Playwright Test Report" with link to test artifacts
  - [ ] Section 4: "CHANGELOG Summary" with link to CHANGELOG.md
  - [ ] Each section includes 1-2 line description
  - [ ] All links are relative paths or absolute GitHub URLs (no localhost)
  - [ ] File loads in <2 seconds on typical browser
- **Spec URL**: specs/030-final-polish/spec.md

### Sub-Issue 5: T010-T012 [P] [US2] Validate Coverage Badge ≥70% and Test All Artifact Links
- **Description**: Verify coverage badge displays ≥70% overall API coverage, validate all four artifact links are functional with correct targets, and confirm no 404 errors.
- **File Path**: `review-artifacts/index.html` + all linked artifacts
- **Acceptance Criteria**:
  - [ ] Coverage badge displays overall percentage (≥70% with green indicator)
  - [ ] Module breakdown shows: hello, stopwatch, temp-converter, expense, todo, quote
  - [ ] Each module has individual coverage % and link to lcov-report
  - [ ] OpenAPI HTML link loads and renders Redoc interface correctly
  - [ ] All API endpoints visible: POST /expenses, GET /expenses, GET /expenses/summary
  - [ ] Playwright Report link loads with test results (if applicable)
  - [ ] CHANGELOG.md link accessible, Week 5 section visible
  - [ ] No 404 errors on any artifact link
  - [ ] All relative paths resolve correctly
  - [ ] Index.html itself loads <2 seconds
- **Spec URL**: specs/030-final-polish/spec.md

---

## Phase 3: User Story 3 - Clean GitHub Project Board for Final Review (Priority: P1)

**Story Goal**: A mentor checking the GitHub Project board can verify that all week-long work has been completed and tracked correctly. All issue cards related to Week 5 (Day 0 through Day 4) should be visibly moved to the "Done" column.

**Independent Test**: Opening the "Training Prince" GitHub Project board and verifying that all Week 5 issues (Day 0, Day 1, Day 2, Day 3, Day 4) are in the "Done" column. This can be confirmed within 2 minutes of manual inspection.

**Dependency**: None (can run in parallel)  
**Blocks**: Demo execution (verification step)  

### Sub-Issue 6: T013 [US3] Move All Week 5 Day 0-4 Issues to Done Column on GitHub Project Board
- **Description**: Manually review and move all Week 5 Day 0, Day 1, Day 2, Day 3, Day 4 issues from current status to "Done" column on "Training Prince" GitHub Project board.
- **File Path**: GitHub Project board (manual operation at github.com/Maximus-Technologies-Uganda/training-prince/projects)
- **Acceptance Criteria**:
  - [ ] Open "Training Prince" GitHub Project board
  - [ ] View all Week 5 issues (with "week5" or "day-" labels)
  - [ ] Day 0 issues (5+): All moved to "Done" column
  - [ ] Day 1 issues (5+): All moved to "Done" column
  - [ ] Day 2 issues (5+): All moved to "Done" column
  - [ ] Day 3 issues (5+): All moved to "Done" column
  - [ ] Day 4 issues (5+): All moved to "Done" column
  - [ ] Verify zero Week 5 issues in "To Do" or "In Progress" columns
  - [ ] All 25+ Week 5 issues now visible in "Done" column
  - [ ] Operation completed within ~10 minutes
  - [ ] Screenshot of completed board captured for documentation
- **Manual Task**: Yes - Requires GitHub Project board access and manual card dragging
- **Spec URL**: specs/030-final-polish/spec.md

---

## Phase 4: User Story 4 - Tag Final Commit with week5-complete (Priority: P2)

**Story Goal**: A version control auditor or release manager reviewing the repository history needs a clear, findable marker indicating when Week 5 work was officially completed. The final commit on main should be tagged appropriately.

**Independent Test**: Verify that a tag named `week5-complete` exists on the remote repository and points to the final Week 5 merge commit on main branch by running `git ls-remote --tags origin | grep week5-complete`.

**Dependency**: All other user stories (all artifacts must be validated first)  
**Blocks**: None (finalization task)  

### Sub-Issue 7: T014 [P] [US4] Create Annotated Git Tag week5-complete
- **Description**: Create an annotated git tag named `week5-complete` pointing to the final Week 5 merge commit on main branch with descriptive commit message.
- **File Path**: Git repository (command-line operation)
- **Command**: `git tag -a week5-complete -m "Week 5 Complete: Final Polish, Review Packet & Demo Prep - Ready for Production"`
- **Acceptance Criteria**:
  - [ ] Tag name exactly matches: `week5-complete`
  - [ ] Tag is annotated (verified via `git cat-file -t week5-complete` returns "tag")
  - [ ] Tag message: "Week 5 Complete: Final Polish, Review Packet & Demo Prep - Ready for Production"
  - [ ] Tag points to merge commit on main branch
  - [ ] Git author information attached to tag
  - [ ] Tag can be listed via `git tag -l week5-complete`
  - [ ] `git show week5-complete` displays correct commit and message
- **Spec URL**: specs/030-final-polish/spec.md

### Sub-Issue 8: T015 [P] [US4] Push week5-complete Tag to Remote Repository
- **Description**: Push the newly created `week5-complete` tag to remote repository to make it visible on GitHub and accessible to all team members.
- **File Path**: Git repository (command-line operation)
- **Command**: `git push origin week5-complete`
- **Acceptance Criteria**:
  - [ ] Tag successfully pushed to remote (no push errors)
  - [ ] Tag visible on GitHub repository page under "Releases" or "Tags" section
  - [ ] Tag accessible via `git ls-remote --tags origin | grep week5-complete`
  - [ ] Developers cloning repository can fetch tag via `git fetch --tags`
  - [ ] Tag remains immutable on remote (points to same commit)
  - [ ] Tag queryable via GitHub API or web interface
- **Spec URL**: specs/030-final-polish/spec.md

---

## Phase 5: User Story 5 - Conduct 10-Minute Mentor Demo (Priority: P1)

**Story Goal**: A mentor scheduled for the final review session needs a structured, time-boxed demonstration that showcases all Week 5 work. The demo should highlight key deliverables without exceeding 10 minutes, culminating in mentor sign-off via a GitHub comment on the feature PR.

**Independent Test**: Complete demo walkthrough demonstrating: (1) Review packet accessible with all four artifacts, (2) Test suite with coverage ≥70%, (3) Sample API request/response via Redoc, (4) Rate Limiter functionality with 429 responses, (5) GitHub Project board complete. Entire sequence demonstrable in under 10 minutes with mentor approval comment on PR.

**Dependency**: All prior user stories (US1-US4)  
**Blocks**: None (terminal task)  

### Sub-Issue 9: T016 [US5] Prepare Demo Script with 5-Phase 10-Minute Walkthrough Structure
- **Description**: Create a structured runbook (DEMO_SCRIPT.md) for the 10-minute mentor demo with 5 phases, timing gates, objectives, speaker notes, and fallback actions.
- **File Path**: `.specify/scripts/demo-script.md` or `DEMO_SCRIPT.md` at repository root
- **Acceptance Criteria**:
  - [ ] File contains title: "Week 5 Final Demo: 10-Minute Walkthrough"
  - [ ] Phase 1 (Setup & Context, ~1 min): Introduce Week 5 deliverables, open review-packet index
  - [ ] Phase 2 (Review Packet Overview, ~2 min): Navigate to all 4 artifacts, verify links functional
  - [ ] Phase 3 (Coverage & Testing, ~2 min): Display coverage ≥70% badge, run test suite if needed
  - [ ] Phase 4 (Feature Highlights, ~2 min): Demo POST /expenses, GET /expenses/summary, Rate Limiter throttle test
  - [ ] Phase 5 (Validation & Sign-Off, ~1 min): Show GitHub Project board complete, mentor approval template
  - [ ] Buffer of ~2 minutes documented for questions and technical delays
  - [ ] Total duration constraints: ≤10 minutes strict
  - [ ] Each phase includes: objectives, step-by-step actions, expected outcomes, timing checkpoint
  - [ ] Fallback actions documented (e.g., "If X unavailable, show screenshot instead")
  - [ ] Mentor sign-off template included (GitHub comment format with checkboxes)
  - [ ] All artifact links and file paths documented clearly
- **Spec URL**: specs/030-final-polish/spec.md

### Sub-Issue 10: T017 [US5] Execute Mentor Demo Walkthrough Following Script
- **Description**: Conduct the complete 10-minute mentor demo following prepared script, demonstrating all Week 5 deliverables: review-packet, coverage ≥70%, API endpoints, rate limiter, and project board completion.
- **File Path**: Live system (browser, terminal, GitHub board)
- **Timing**: ~10 minutes (strict limit)
- **Acceptance Criteria**:
  - [ ] Demo begins with review-packet opened in browser
  - [ ] All 4 artifact links accessible and clickable (Coverage, OpenAPI, Playwright, CHANGELOG)
  - [ ] Coverage badge displayed showing ≥70% overall API coverage (green indicator)
  - [ ] Module breakdown visible: hello, stopwatch, temp-converter, expense, todo, quote
  - [ ] OpenAPI HTML documentation opened successfully
  - [ ] All endpoints visible: POST /expenses, GET /expenses, GET /expenses/summary
  - [ ] API endpoint schemas displayed and readable (request/response structures)
  - [ ] Playwright test report opened (if applicable) showing passing tests
  - [ ] CHANGELOG.md opened, Week 5 section visible and readable (all 6 features listed)
  - [ ] Sample API request demonstrated (e.g., POST /expenses with valid payload)
  - [ ] API response displayed with correct structure and data
  - [ ] Rate Limiter tested with rapid requests (10+ consecutive requests)
  - [ ] 429 status code shown when rate limit threshold exceeded
  - [ ] GitHub Project board opened showing all Week 5 issues (Day 0-4) in "Done" column
  - [ ] Git tag `week5-complete` verified via `git tag -l week5-complete`
  - [ ] Demo completed within strict 10-minute window
  - [ ] No technical errors or console errors during walkthrough
  - [ ] Mentor questions handled professionally (covered by buffer time)
  - [ ] Demo flow smooth and logical progression
- **Spec URL**: specs/030-final-polish/spec.md

### Sub-Issue 11: T018 [US5] Record Mentor Sign-Off via GitHub Comment on Feature PR
- **Description**: After successful demo completion, mentor posts a GitHub comment on the feature PR confirming successful review, approval of all Week 5 deliverables, and absence of critical blockers.
- **File Path**: GitHub PR comment (feature/030-final-polish PR)
- **Acceptance Criteria**:
  - [ ] GitHub comment posted on feature PR by mentor (or related issue)
  - [ ] Comment includes approval header: "## Week 5 Final Demo - Approved ✅"
  - [ ] Comment confirms: "Week 5 deliverables reviewed and approved"
  - [ ] Comment lists all four artifacts reviewed:
    - [ ] "✅ Review Packet: All four artifacts accessible (Coverage, OpenAPI, Tests, CHANGELOG)"
    - [ ] "✅ Coverage: ≥70% threshold achieved across all API modules"
    - [ ] "✅ API Functionality: POST /expenses and GET /expenses/summary working correctly"
    - [ ] "✅ Rate Limiter: Verified with 429 responses on throttled requests"
  - [ ] Comment confirms: "✅ Project Board: All Week 5 issues (Day 0-4) moved to Done"
  - [ ] Comment confirms: "✅ Documentation: CHANGELOG updated with comprehensive Week 5 summary"
  - [ ] Comment states: "No critical blockers identified"
  - [ ] Comment includes timestamp of demo completion (ISO format or readable date)
  - [ ] Comment serves as auditable record for final approval
  - [ ] Optional: Mentor includes observations, recommendations, or notes for future work
- **Comment Template**:
  ```
  ## Week 5 Final Demo - Approved ✅
  
  I have successfully reviewed all Week 5 deliverables:
  - ✅ Review Packet: All four artifacts accessible (Coverage, OpenAPI, Tests, CHANGELOG)
  - ✅ Coverage: ≥70% threshold achieved across all API modules
  - ✅ API Functionality: POST /expenses and GET /expenses/summary working correctly
  - ✅ Rate Limiter: Verified with 429 responses on throttled requests
  - ✅ Project Board: All Week 5 issues (Day 0-4) moved to Done
  - ✅ Documentation: CHANGELOG updated with comprehensive Week 5 summary
  
  No critical blockers identified. Week 5 is complete and ready for production.
  
  Demo completed: [timestamp]
  ```
- **Spec URL**: specs/030-final-polish/spec.md

---

## Final Verification Checklist

Before marking the parent issue complete, verify:

- [ ] **Story 1 (CHANGELOG)**: Week 5 section added with all 6 features, proper Markdown format, sub-bullets with details
- [ ] **Story 2 (Review Packet)**: All four artifacts linked in index.html, all links functional, coverage ≥70%
- [ ] **Story 3 (Project Board)**: All Week 5 Day 0-4 issues visible in GitHub Project board "Done" column
- [ ] **Story 4 (Git Tag)**: `week5-complete` tag created (annotated), pushed to remote, visible on GitHub
- [ ] **Story 5 (Demo)**: Demo script prepared, demo conducted within 10 minutes, mentor sign-off recorded on PR
- [ ] **Overall**: All 11 sub-issues completed, no blockers identified, project ready for production

---

## Implementation Dependencies & Execution Order

### Task Dependencies Graph

```
Parallel Wave 1 (Simultaneous):
├─ T005-T007: Create and document CHANGELOG Week 5 section
├─ T008-T012: Verify CI workflow, create index.html, validate artifact links
└─ T013: Move all Week 5 issues to Done on project board

↓ (after Wave 1 complete)

Parallel Wave 2:
├─ T016: Prepare demo script
└─ T014: Create git tag week5-complete

↓ (after Wave 2 complete)

Parallel Wave 3:
├─ T017: Execute mentor demo
└─ T015: Push git tag to remote

↓ (after Wave 3 complete)

T018: Record mentor sign-off via GitHub comment
```

### Recommended Execution Timeline

| Phase | Tasks | Duration | Notes |
|-------|-------|----------|-------|
| **Hour 1** | T005-T007 (CHANGELOG) | 20-30 min | Can run parallel with Wave 1 tasks |
| **Hour 1-2** | T008-T012 (Review Packet) | 30-45 min | CI workflow verification + link testing |
| **Hour 1** | T013 (Board Cleanup) | 10-15 min | Manual GitHub board dragging |
| **Hour 2** | T016 (Demo Script) | 15-20 min | After Wave 1 artifacts ready |
| **Hour 2** | T014 (Create Tag) | 5 min | Git command (can do anytime) |
| **Hour 3** | T017 (Execute Demo) | 10 min | Strict time-boxed demo session |
| **Hour 3** | T015 (Push Tag) | 2 min | After demo completes |
| **Hour 3-4** | T018 (Mentor Sign-Off) | 5 min | Mentor posts comment |
| **Total** | All 11 tasks | ~4-5 hours | With parallelization |

---

## Success Criteria Summary

### User Story Completion Gates

✅ **US1 Complete**: CHANGELOG.md contains Week 5 section with all 6 features + sub-bullets with details  
✅ **US2 Complete**: review-artifacts/index.html accessible with 4 functional artifact links, coverage ≥70%  
✅ **US3 Complete**: All Week 5 Day 0-4 issues visible in GitHub Project board "Done" column  
✅ **US4 Complete**: Git tag `week5-complete` created (annotated), pushed to remote, queryable via `git ls-remote`  
✅ **US5 Complete**: 10-minute demo conducted successfully, mentor sign-off recorded on PR with checkmarks  

### Project Completion Gates

✅ **Documentation**: CHANGELOG updated with comprehensive Week 5 summary + demo script prepared  
✅ **Artifacts**: review-packet fully functional with all 4 links tested and validated  
✅ **Quality**: Coverage ≥70% verified, no technical errors during demo  
✅ **Process**: GitHub board reflecting completion, Git history tagged properly  
✅ **Approval**: Mentor sign-off recorded and auditable via GitHub comment  

**Overall Status**: ✅ **READY FOR PRODUCTION** (after all 11 sub-issues complete + mentor approval)

---

## Additional Notes

### Parallelization Opportunities
- **T005-T007 + T008-T012 + T013** can all run simultaneously (different files, no dependencies)
- **T016 + T014** can start once Wave 1 complete
- **T017 + T015** can run together (demo in browser, git push in terminal)
- **T018** is dependent on successful T017 (demo execution)

### Fallback Scenarios
- **If review-packet CI workflow fails**: Manually create index.html with hardcoded links to existing artifacts
- **If demo environment has connectivity issues**: Pre-record demo video or use local artifacts
- **If mentor unavailable at scheduled time**: Document expected demo flow and request async approval via comment
- **If GitHub Project board has issues**: Take screenshots of board completion as proof

### Quality Checkpoints
- T012: Test all artifact links in multiple browsers before demo
- T016: Practice demo walkthrough 2-3 times before mentor session
- T017: Have backup internet connection and local artifact copies available
- T018: Ensure mentor comment includes all checkmarks for audit trail

---

## Mapping to tasks.md

This document (11 sub-issues) maps to tasks.md as follows:

| Sub-Issue | tasks.md | Task ID | Type |
|-----------|----------|---------|------|
| Sub-1 | US1 CHANGELOG Header | T005 | Parallelizable |
| Sub-2 | US1 CHANGELOG Features | T006-T007 | Parallelizable |
| Sub-3 | US2 CI Workflow | T008 | Parallelizable |
| Sub-4 | US2 Index HTML | T009 | Parallelizable |
| Sub-5 | US2 Coverage + Links | T010-T012 | Parallelizable |
| Sub-6 | US3 Board Cleanup | T013 | Parallelizable |
| Sub-7 | US4 Create Tag | T014 | Parallelizable |
| Sub-8 | US4 Push Tag | T015 | Parallelizable |
| Sub-9 | US5 Demo Script | T016 | Sequential |
| Sub-10 | US5 Execute Demo | T017 | Sequential |
| Sub-11 | US5 Mentor Sign-Off | T018 | Sequential |

---

**Generated from speckit.tasks.prompt.md workflow**  
**Spec URL**: specs/030-final-polish/spec.md  
**Last Updated**: 2025-11-12  
**Ready for GitHub**: Copy content to GitHub parent issue description and create sub-issues per user story
