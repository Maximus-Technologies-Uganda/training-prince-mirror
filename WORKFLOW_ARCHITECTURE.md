# Consolidated Workflow Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         GitHub Events                               │
└─────────────────────────────────────────────────────────────────────┘
              ↓                    ↓                    ↓
    ┌────────────────┐   ┌────────────────┐  ┌────────────────┐
    │  PR to Dev     │   │ Push to Dev    │  │ Feature Branch │
    │  / Push to Dev │   │ / Main         │  │ + tasks.md     │
    └────────────────┘   └────────────────┘  └────────────────┘
         ↓↓↓                  ↓↓↓                      ↓
    ┌─────────────────────────────────────────────────────────────┐
    │         CI/CD Workflow Router                               │
    └─────────────────────────────────────────────────────────────┘
         ↓                ↓                    ↓
    ┌──────────┐      ┌──────────┐         ┌──────────┐
    │PR        │      │Core      │         │Linear    │
    │Validation│      │CI        │         │Sync      │
    └──────────┘      └──────────┘         └──────────┘
         ↓                ↓                      ↓
    ┌──────────────────────────────────────────────────────────┐
    │                Consolidated Workflows                   │
    └──────────────────────────────────────────────────────────┘
```

---

## Workflow Execution Matrix

### 1. Pull Request to Development

```
┌─────────────────────────────────────────────────────────────┐
│ Event: pull_request (opened, edited, synchronize, reopened)│
└─────────────────────────────────────────────────────────────┘
                              ↓
              ┌───────────────────────────────┐
              │   PR VALIDATION Workflow      │
              │   (pr-title-lint.yml)         │
              └───────────────────────────────┘
                    ↓         ↓         ↓
        ┌─────────────┐  ┌──────────┐  ┌─────────────┐
        │ Title Check │  │Spec URL  │  │ Spec Lint   │
        │ PRI-###     │  │ Required │  │ Boxes       │
        └─────────────┘  └──────────┘  └─────────────┘
              ↓         ↓         ↓
        ┌─────────────────────────────┐
        │ All checks pass? ✓           │
        └──────────┬────────────────────┘
                   ↓
        ┌─────────────────────────────────┐
        │   CI CHECKS & QUALITY GATES     │
        │   (checks.yml)                  │
        │   Sequential phases for safety  │
        └─────────────────────────────────┘
              ↓
        ┌──────────────────────────┐
        │ Phase 1: Quick Validation│  ⏱ ~50 sec
        │ - Checkout              │
        │ - Setup Node            │
        │ - Install dependencies  │
        │ - Lint checks           │
        │ - Unit tests            │
        └──────────────────────────┘
              ↓
        ┌──────────────────────────┐
        │ Phase 2: Coverage        │  ⏱ ~60 sec
        │ (needs: quick-validation)│
        │ - Backend coverage       │
        │ - Frontend coverage      │
        │ - Unified report         │
        │ - Upload artifacts       │
        └──────────────────────────┘
              ↓
        ┌──────────────────────────┐
        │ Phase 3: Build & E2E     │  ⏱ ~120 sec
        │ (needs: coverage)        │
        │ - Frontend build         │
        │ - E2E/smoke tests        │
        │ - Upload results         │
        └──────────────────────────┘
              ↓
        ┌──────────────────────────┐
        │ ✅ PR READY FOR REVIEW   │
        └──────────────────────────┘
              ↓ (when merged)
        ┌──────────────────────────────────┐
        │ UPDATE LINEAR ON PR EVENTS       │
        │ (linear-sync.yml)                │
        │                                  │
        │ - Parse PRI- from PR title       │
        │ - Update Linear issue status     │
        │ - Comment with PR URL            │
        └──────────────────────────────────┘
```

### 2. Push to Development Branch

```
┌─────────────────────────────────────────────────────────────┐
│ Event: push (to development branch)                         │
└─────────────────────────────────────────────────────────────┘
              ↓
    ┌─────────────────────────────┐
    │ Runs: CI CHECKS (checks.yml)│
    │       (all 3 phases)         │
    └─────────────────────────────┘
              ↓
    ┌─────────────────────────────────────┐
    │ DEPLOY TO GITHUB PAGES              │
    │ (deploy-pages.yml)                  │
    │                                     │
    │ - Build frontend                    │
    │ - Deploy to GitHub Pages            │
    └─────────────────────────────────────┘
              ↓
    ┌─────────────────────────────────────┐
    │ SYNC TO PUBLIC MIRROR               │
    │ (sync-to-public-mirror.yml)         │
    │                                     │
    │ - Push to mirror repository         │
    └─────────────────────────────────────┘
```

### 3. Push to Feature Branch with tasks.md Changes

```
┌─────────────────────────────────────────────────────────────┐
│ Event: push (to feature/* branches)                         │
│        Paths: specs/*/tasks.md or specs/*/.linear-parent    │
└─────────────────────────────────────────────────────────────┘
              ↓
    ┌─────────────────────────────┐
    │ AUTOMATED LINEAR SYNC       │
    │ (linear-tasks-sync.yml)     │
    └─────────────────────────────┘
         ↓
    ┌─────────────────────────────┐
    │ Detect changed tasks files  │
    └─────────────────────────────┘
         ↓
    ┌─────────────────────────────┐
    │ For each changed spec:      │
    │                             │
    │ 1. Read tasks.md            │
    │ 2. Find parent issue        │
    │ 3. Parse task items         │
    │ 4. Create Linear sub-issues │
    │ 5. Update linear-map.json   │
    │ 6. Commit mapping update    │
    └─────────────────────────────┘
         ↓
    ┌─────────────────────────────┐
    │ ✅ Sub-issues created!      │
    │    Ready for development    │
    └─────────────────────────────┘
```

### 4. Manual Linear Status Update (Workflow Dispatch)

```
┌─────────────────────────────────────────────────────────────┐
│ Event: workflow_dispatch (manual trigger from GitHub UI)    │
│ Inputs:                                                     │
│   - task_ids: "PRI-1,PRI-2,PRI-3"                          │
│   - status: "Done" / "In Review" / "In Progress" / etc.    │
└─────────────────────────────────────────────────────────────┘
              ↓
    ┌─────────────────────────────┐
    │ UPDATE LINEAR ISSUE STATUS  │
    │ (update-linear-status.yml)  │
    └─────────────────────────────┘
         ↓
    ┌─────────────────────────────┐
    │ For each task_id:           │
    │                             │
    │ 1. Find Linear issue        │
    │ 2. Get team states          │
    │ 3. Find target state        │
    │ 4. Update issue status      │
    │ 5. Verify update            │
    └─────────────────────────────┘
         ↓
    ┌─────────────────────────────┐
    │ ✅ Status updated!          │
    └─────────────────────────────┘
```

---

## Workflow Dependency Graph

```
PR Event
├─ PR Validation (parallel jobs)
│  ├─ validate-pr-title
│  ├─ validate-spec-url
│  └─ spec-lint
│
└─ CI Checks (sequential phases)
   ├─ quick-validation (immediate)
   │  ├─ Checkout
   │  ├─ Setup
   │  ├─ Lint
   │  └─ Unit tests
   │
   ├─ coverage (after: quick-validation)
   │  ├─ Backend coverage
   │  ├─ Frontend coverage
   │  └─ Generate report
   │
   └─ build-and-e2e (after: coverage)
      ├─ Build frontend
      ├─ E2E tests
      └─ Upload results

Feature Branch Event
└─ linear-tasks-sync (on: push to feature/*)
   └─ Detect + sync tasks.md changes

PR Merge Event
└─ linear-sync (on: PR closed + merged)
   └─ Update Linear status → Done

Deployment Events
├─ deploy-pages (on: push to development)
└─ sync-to-public-mirror (on: push to main/development)
```

---

## Job Parallelization Strategy

### PR Validation: Parallel (No Dependencies)
```
validate-pr-title
    |
    ├─→ validate-spec-url  (parallel)
    |
    └─→ spec-lint           (parallel)

Result: All checks run together (~30-35 sec total)
```

### CI Checks: Sequential (Dependency Chain)
```
quick-validation ─→ coverage ─→ build-and-e2e
      (50s)          (60s)         (120s)

Total time: ~230 sec (~3.8 min)
Benefit: Fail fast - stop at earliest issue
```

### Overall PR Execution: Parallel workflows, Sequential jobs
```
PR Validation (parallel)        CI Checks (sequential)
    ~35 sec                         ~230 sec

Both start together, CI takes longer
Total PR check time: ~230 sec (not additive!)
```

---

## Scalability & Extensibility

### Adding a New Spec (e.g., PRI-2000)

```
Before Consolidation:
  1. Create specs/020-*/tasks.md
  2. Write .github/workflows/create-sub-issues-pri2000.yml
  3. Hardcode PRI-2000 in workflow
  4. Commit workflow file
  5. Test by pushing branch
  6. Fix if broken (edit workflow, re-push)
  Time: 30-45 minutes

After Consolidation:
  1. Create specs/020-*/tasks.md
  2. Push feature branch
  3. linear-tasks-sync.yml automatically detects change
  4. Runs generic .github/scripts/linear-sync.js
  5. Sub-issues created automatically
  Time: 2 minutes (automatic!)
```

### Adding a New Quality Gate

```
Before:
  1. Create new workflow file
  2. Configure triggers
  3. Add job definition
  4. Update documentation
  Time: 20 minutes

After:
  1. Add new job to checks.yml
  2. Define dependencies
  3. Update documentation
  Time: 10 minutes
  
Note: All in same file = easier to maintain
```

---

## Performance Characteristics

### Per-Run Statistics

| Phase | Duration | Status |
|-------|----------|--------|
| PR Validation | ~35 sec | Parallel |
| Quick Validation | ~50 sec | Phase 1 |
| Coverage | ~60 sec | Phase 2 |
| Build & E2E | ~120 sec | Phase 3 |
| **Total (PR)** | **~230 sec** | Sequential |
| **Total (with validation)** | **~230 sec** | Parallel |

### Comparison: Before vs After

**Before** (Redundant Execution):
- Multiple workflows trigger
- Coverage runs 2-3x
- Tests run multiple times
- E2E tests run 2x
- Total effective time: ~400-500 sec with waste

**After** (Consolidated):
- Single orchestrated flow
- Each test runs exactly once
- Optimal sequencing
- Total effective time: ~230 sec (no waste)

**Improvement: ~50% faster execution** ✅

---

## Summary

✅ **8 workflows** providing all quality gates and automation
✅ **Sequential + Parallel hybrid** execution model
✅ **100% elimination** of hardcoded per-spec workflows
✅ **Automatic scaling** for new specifications
✅ **Clear dependency chains** prevent errors
✅ **Fast fail** approach stops early on issues
✅ **Unified documentation** in architecture files

**Result**: Maintainable, scalable, efficient CI/CD pipeline

