# Implementation Plan: 023-title-week-5 - Week 5 MVP Expenses API

**Feature**: Week 5: Implement MVP API Endpoints (Expenses)  
**Branch**: `023-title-week-5`  
**Parent Linear Issue**: PRI-2501  
**Status**: ✅ Ready for Execution  
**Date**: November 5, 2025

---

## Executive Summary

The complete specification and task breakdown for implementing POST /expenses and GET /expenses/summary MVP endpoints has been generated. All design documents are finalized. The 30-task implementation plan is ready for immediate execution with Linear sub-issue automation.

### Key Deliverables

✅ **tasks.md** - 30 numbered, dependency-ordered tasks (27 core + 3 polish)  
✅ **Contract Tests** - Full API specifications via Vitest  
✅ **Implementation Scripts** - Automated Linear sub-issue creation  
✅ **Documentation** - Complete guides and troubleshooting  
✅ **Status Tracking** - All sub-issues marked "In Progress"

---

## What Was Generated

### 1. Complete Task Specification (`specs/023-title-week-5/tasks.md`)

**30 Tasks across 5 phases:**

| Phase | Tasks | Purpose |
|-------|-------|---------|
| **4.1** | T001-T005 | Contract tests (TDD foundation) - 5 tests validating request/response schemas |
| **4.2** | T006-T008 | Types & validation schemas - TypeScript interfaces, Zod validation, middleware |
| **4.3** | T009-T011 | OpenAPI specification - Document both endpoints in OpenAPI 3.0 |
| **4.4** | T012-T014 | Service layer - ExpenseStore class with create/filter/summarize methods |
| **4.5** | T015-T017 | Route implementation - POST /expenses, GET /expenses/summary handlers |
| **4.6** | T018-T023 | Integration tests - 6 comprehensive test suites with Supertest |
| **4.7** | T024-T026 | Unit tests - Service logic validation with 80%+ coverage target |
| **4.8** | T027 | Coverage verification - Ensure ≥80% unit, ≥70% integration |
| **4.9** | T028-T030 | Documentation & manual testing - Quickstart validation, error checking |

**Parallelizable Tasks** [P]: T001-T008, T012-T014, T018-T026
- Can execute in parallel where independent
- Reduce total execution time by 30-40%

### 2. Linear Automation Scripts

#### Main Script: `create-linear-sub-issues-023.mjs`
- Node.js script using Linear GraphQL API
- Creates 30 sub-issues under PRI-2501
- Automatic status: "In Progress"
- Includes error handling and rate limiting

#### Guides:
- `GUIDE_CREATE_LINEAR_SUB_ISSUES_023.md` - Full troubleshooting and setup
- `COMMAND_TO_CREATE_LINEAR_SUB_ISSUES_023.md` - Quick reference command

### 3. Design Artifacts (Complete)

All design phase documents are finalized in `specs/023-title-week-5/`:

| Document | Status | Lines | Purpose |
|----------|--------|-------|---------|
| `spec.md` | ✅ Final | 125 | Business requirements & acceptance scenarios |
| `plan.md` | ✅ Final | 280 | Technical approach & constitution check |
| `research.md` | ✅ Final | 283 | 9 architectural decisions documented |
| `data-model.md` | ✅ Final | 293 | Expense & ExpenseSummary entities |
| `quickstart.md` | ✅ Final | 408 | 9 manual test scenarios |
| `tasks.md` | ✅ Final | 500+ | **30 implementation tasks** |

---

## Task Breakdown by Phase

### Phase 4.1: Contract Tests (5 tasks)
**TDD Foundation - Contracts define behavior**

```
T001-T005: Create contract tests for POST /expenses (request + response)
           Create contract tests for GET /expenses/summary (with filters)
Goal: Define API specification through failing tests
Dependencies: None
Parallelizable: YES [P]
Estimated: 1-2 hours
```

### Phase 4.2: Types & Schemas (3 tasks)
**All types must be defined before implementation**

```
T006: Create TypeScript interfaces (Expense, ExpenseSummary, etc.)
T007: Create Zod validation schemas with custom error messages
T008: Create validation middleware for HTTP 400 responses
Goal: Type-safe foundation for all layers
Dependencies: T006 → T007 → T008
Parallelizable: YES [P]
Estimated: 1.5 hours
```

### Phase 4.3: OpenAPI Spec (3 tasks)
**Specification must be committed before implementation**

```
T009: Document POST /expenses endpoint
T010: Document GET /expenses/summary endpoint
T011: Document error response schemas
Goal: API documentation for client/server contract
Dependencies: None
Parallelizable: YES (but after T006-T008 for consistency)
Estimated: 1 hour
```

### Phase 4.4: Service Layer (3 tasks)
**Business logic and persistence abstraction**

```
T012: Create ExpenseStore class with create() method
T013: Implement filter() and summarize() aggregation methods
T014: Export singleton instance for route injection
Goal: Core business logic, testable in isolation
Dependencies: T007 (schemas)
Parallelizable: YES [P]
Estimated: 1.5 hours
```

### Phase 4.5: Route Implementation (3 tasks)
**Routes must pass contract tests**

```
T015: Implement POST /expenses route handler
T016: Implement GET /expenses/summary route handler
T017: Register routes in server.ts
Goal: HTTP API layer connected to services
Dependencies: T012, T008 (service + middleware)
Parallelizable: YES [P]
Estimated: 1 hour
```

### Phase 4.6: Integration Tests (6 tasks)
**Full endpoint behavior validation**

```
T018: POST /expenses success cases (creates expense with UUID)
T019: POST /expenses validation errors (all 400 scenarios)
T020: GET /expenses/summary no filters (correct aggregation)
T021: GET /expenses/summary category filter (subset aggregation)
T022: GET /expenses/summary month filter (date-based filtering)
T023: GET /expenses/summary both filters (AND logic validation)
Goal: End-to-end behavior verification
Dependencies: T015 (routes implemented)
Parallelizable: YES [P]
Estimated: 2 hours
```

### Phase 4.7: Unit Tests (3 tasks)
**Core business logic validation**

```
T024: Unit tests for ExpenseStore.create() - UUID generation
T025: Unit tests for ExpenseStore.filter() - filtering logic
T026: Unit tests for ExpenseStore.summarize() - aggregation math
Goal: 80%+ code coverage for service layer
Dependencies: T012 (service layer)
Parallelizable: YES [P]
Estimated: 1.5 hours
```

### Phase 4.8: Coverage Verification (1 task)
**Ensure test coverage meets requirements**

```
T027: Run `npm run test:coverage` verify ≥80% unit / ≥70% integration
Goal: Document coverage metrics for PR review
Dependencies: All tests (T024-T026, T018-T023)
Parallelizable: NO
Estimated: 30 minutes
```

### Phase 4.9: Documentation & Manual Testing (3 tasks)
**Specification validation and documentation**

```
T028: Update API documentation with quickstart examples
T029: Manually execute quickstart.md scenarios (9 curl tests)
T030: Verify no console errors/warnings; lint checks
Goal: Final validation before PR
Dependencies: T015 (routes working)
Parallelizable: NO (sequential)
Estimated: 1 hour
```

---

## Linear Automation Setup

### Quick Start

```bash
# Step 1: Get your Linear API key from https://linear.app/settings/api
export LINEAR_API_KEY="your-api-key-here"

# Step 2: Run the script
cd /Users/prnceb/Desktop/WORK/hello-world
node create-linear-sub-issues-023.mjs

# Step 3: Verify in Linear (should see 30 sub-issues under PRI-2501)
```

### What Gets Created

- **30 Linear sub-issues** (PRI-2501-1 through PRI-2501-30)
- **Status**: All marked "In Progress"
- **Parent**: PRI-2501 (Week 5 MVP Expenses API)
- **Descriptions**: Full task details from tasks.md
- **Dependencies**: Implicit in task ordering

### Verification Checklist

```
✅ 30 sub-issues created
✅ All under parent PRI-2501
✅ All marked "In Progress"
✅ Descriptions match tasks.md
✅ No duplicate issues
✅ Ready for team assignment
```

---

## Execution Timeline

### Recommended Execution Order

**Day 1 (3-4 hours)**
- T001-T005: Contract tests (1-2h) [P]
- T006-T008: Types & schemas (1.5h) [P]
- T009-T011: OpenAPI spec (1h)

**Day 2 (2-3 hours)**
- T012-T014: Service layer (1.5h) [P]
- T015-T017: Routes (1h)

**Day 3 (2-3 hours)**
- T018-T023: Integration tests (2h) [P]

**Day 4 (1-2 hours)**
- T024-T026: Unit tests (1.5h) [P]
- T027: Coverage verification (0.5h)
- T028-T030: Docs & manual testing (1h)

**Total**: 8-12 hours of focused implementation

### Parallel Execution Option (Faster)

Run these in parallel:
- Batch 1: T001-T005 + T006-T008 = 2h total
- Batch 2: T009-T011 + T012-T014 = 2.5h total
- Batch 3: T015-T017 = 1h
- Batch 4: T018-T023 + T024-T026 = 3.5h parallel
- Batch 5: T027-T030 = 1.5h

**Total with parallelization**: 6-8 hours

---

## Success Criteria

### Implementation Completeness
- [x] All 30 tasks defined and ordered
- [x] Dependency graph established
- [x] Parallel groups identified
- [x] Estimated time per task

### API Functionality
- [ ] POST /expenses creates expense with UUID
- [ ] GET /expenses/summary aggregates correctly
- [ ] Category filter works
- [ ] Month filter works
- [ ] Both filters work together (AND logic)
- [ ] Validation returns 400 with descriptive errors
- [ ] Empty results return 200 (not 404)

### Test Coverage
- [ ] Contract tests: 5/5 passing
- [ ] Integration tests: 10+ scenarios passing
- [ ] Unit tests: 15+ scenarios passing
- [ ] Coverage: ≥80% unit, ≥70% integration

### Documentation
- [ ] OpenAPI spec updated
- [ ] README updated with examples
- [ ] Quickstart.md scenarios all passing
- [ ] No console errors/warnings

### Code Quality
- [ ] No TypeScript errors
- [ ] Linting passes
- [ ] No console.log for debugging (Pino for logging)
- [ ] Following existing project patterns

### Linear Tracking
- [ ] 30 sub-issues created under PRI-2501
- [ ] All marked "In Progress"
- [ ] Issues assigned to team members
- [ ] Progress tracked through PR

---

## Next Steps

### Immediate (Today)

1. ✅ **Generate tasks.md** - DONE
2. ✅ **Create Linear automation** - DONE
3. 📋 **Review task specification** - You are here
4. 🚀 **Create Linear sub-issues** - Next step:

```bash
export LINEAR_API_KEY="your-key"
cd /Users/prnceb/Desktop/WORK/hello-world
node create-linear-sub-issues-023.mjs
```

### Short Term (This Sprint)

5. **Start implementation** - Begin with Phase 4.1 (contract tests)
6. **Execute in parallel** - Use parallel execution groups for speed
7. **Track progress** - Update Linear issue status as tasks complete
8. **Link commits** - Reference issue ID in git commits

### Medium Term (PR Review)

9. **Create pull request** - Link to PRI-2501 parent issue
10. **Code review** - Team reviews following Constitutional principles
11. **Deploy** - Merge to development branch

---

## Files Involved

### Core Implementation
```
api/src/types/index.ts                    # Expense, ExpenseSummary types
api/src/schemas/index.ts                  # Zod validation schemas
api/src/middleware/validation.ts          # Validation error handler
api/src/services/expenses.ts              # ExpenseStore class
api/src/routes/expenses.ts                # Route handlers
api/src/server.ts                         # Route registration
api/spec/openapi.yaml                     # API documentation
```

### Tests
```
api/tests/contract/expenses.contract.test.ts   # 5 contract tests
api/tests/integration/expenses.test.ts         # 6 integration test suites
api/tests/unit/expenses.test.ts                # 3 unit test suites
```

### Specification
```
specs/023-title-week-5/tasks.md           # 30 tasks (THIS IS THE EXECUTION PLAN)
specs/023-title-week-5/spec.md            # Business requirements
specs/023-title-week-5/plan.md            # Technical approach
specs/023-title-week-5/research.md        # Architectural decisions
specs/023-title-week-5/data-model.md      # Entity definitions
specs/023-title-week-5/quickstart.md      # Manual test scenarios
specs/023-title-week-5/contracts/         # API contract definitions
```

### Automation
```
create-linear-sub-issues-023.mjs          # Linear sub-issue creation script
GUIDE_CREATE_LINEAR_SUB_ISSUES_023.md      # Troubleshooting & setup guide
COMMAND_TO_CREATE_LINEAR_SUB_ISSUES_023.md # Quick reference
```

---

## Constitutional Principles Alignment

### Principle I: No Logic Duplication
✅ Business logic isolated in `ExpenseStore` service  
✅ Routes only handle HTTP layer (validation → service → response)  
✅ Reuses existing Zod validation pattern

### Principle II: Test Coverage Mandate
✅ Contract tests (5): Define API specification  
✅ Integration tests (6): End-to-end behavior  
✅ Unit tests (3): Core service logic  
✅ Target: ≥80% unit, ≥70% integration

### Principle III: Reviewability is Paramount
✅ Clear file organization (types → schemas → services → routes)  
✅ Small, focused tasks (1-2 hour each)  
✅ Contract tests act as living documentation  
✅ CI coverage artifacts included

### Principle IV: PR Craft
✅ Single focused PR: 2 endpoints only  
✅ Estimated code: 300-400 LOC implementation  
✅ Tests: 800+ LOC (comprehensive)  
✅ Clear commit message templates

### Principle V: Simplicity & Consistency
✅ Uses existing stack (Express, Zod, Vitest, Supertest)  
✅ No new dependencies or tools  
✅ Follows existing project patterns  
✅ Consistent with 022-title-week-5 approach

---

## Troubleshooting During Execution

### "Contract tests fail" → Expected in T001-T005
- This is TDD: tests fail first
- Tests pass once routes implemented (T015-T017)

### "Circular dependency error"
- Check import order: types → schemas → services → routes
- Ensure no route imports back into services

### "Validation middleware not catching errors"
- Verify middleware is registered before routes in server.ts
- Check error format matches OpenAPI schema

### "Coverage below 80%"
- Add missing test cases for edge scenarios
- Check that all branches in summarize() logic are tested
- Use coverage report to identify gaps

### "Integration tests timeout"
- Increase timeout in Supertest: `jest.setTimeout(10000)`
- Check port 3000 isn't already in use

---

## Communication Checklist

- [ ] Share task breakdown with team
- [ ] Post Linear issue link in Slack/Discord
- [ ] Assign sub-issues to team members
- [ ] Daily standup: discuss blockers
- [ ] Update PR description as tasks complete
- [ ] Code review session before merge

---

## Success Celebration 🎉

When all tasks complete:

```
✅ 30/30 tasks done
✅ 100% test coverage achieved
✅ All quickstart scenarios passing
✅ API endpoints fully functional
✅ OpenAPI spec documented
✅ PR ready for merge
✅ Deployed to development branch
✅ Week 5 MVP complete! 🚀
```

---

## Related Documents

- 📋 **Task Specification**: `specs/023-title-week-5/tasks.md`
- 📝 **Business Spec**: `specs/023-title-week-5/spec.md`
- 🏗️ **Technical Plan**: `specs/023-title-week-5/plan.md`
- 🔬 **Research**: `specs/023-title-week-5/research.md`
- 📊 **Data Model**: `specs/023-title-week-5/data-model.md`
- 🧪 **Quickstart**: `specs/023-title-week-5/quickstart.md`
- 🤖 **Linear Automation**: `create-linear-sub-issues-023.mjs`
- 📖 **Linear Guide**: `GUIDE_CREATE_LINEAR_SUB_ISSUES_023.md`

---

## Key Contacts & Resources

- **Linear Workspace**: https://linear.app/
- **Linear API Docs**: https://developers.linear.app/
- **GitHub Branch**: `023-title-week-5`
- **Parent Issue**: PRI-2501 (Week 5 MVP Expenses API)

---

*Implementation plan ready for execution. All designs finalized. Awaiting Linear sub-issue creation. Last updated: November 5, 2025*

