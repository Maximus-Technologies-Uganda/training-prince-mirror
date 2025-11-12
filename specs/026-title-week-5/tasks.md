# Tasks: Week 5 Day 1: API Spec & Contracts First (Expenses)

**Input**: Design documents from `/specs/026-title-week-5/`  
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory ✅
   → Tech stack: TypeScript 5.3.3, Node.js 20, Express 4.18.2, supertest 6.3.3
   → Structure: Web application (api/ + frontend/)
2. Load design documents ✅
   → data-model.md: Expense, ExpenseSummary, ErrorEnvelope entities
   → contracts/: 4 contract files (OpenAPI spec, contract tests, spec-check CI, review-packet CI)
   → research.md: Technical decisions (pagination, error envelope, Redoc, etc.)
3. Generate tasks by category:
   → Setup: Ensure specs/core/ directory exists
   → Tests: Contract tests for all endpoints (must fail initially)
   → Core: OpenAPI spec updates (GET /expenses, ErrorEnvelope, request-id)
   → Integration: CI workflows (spec-check, review-packet)
   → Polish: Validation and verification
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness ✅
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: `api/` for backend, `specs/core/` for core OpenAPI spec
- OpenAPI spec: `api/spec/openapi.yaml` (source) and `specs/core/openapi.yaml` (per spec requirement)
- Contract tests: `api/tests/contract/expenses.contract.test.ts`
- CI workflows: `.github/workflows/`

## Phase 3.1: Setup
- [x] T001 [P] Create `specs/core/` directory structure for OpenAPI specification

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [x] T002 [P] Write HTTP contract test for GET /expenses endpoint in `api/tests/contract/expenses.contract.test.ts`
  - Test pagination parameters (page, pageSize)
  - Validate response structure matches OpenAPI spec
  - Test error responses (400, 500) match ErrorEnvelope schema
  - Test request-id header handling
  - **Expected**: Test fails with 404 (endpoint doesn't exist yet)

- [x] T003 [P] Write HTTP contract test for POST /expenses endpoint in `api/tests/contract/expenses.contract.test.ts`
  - Test valid request body (amount, category, date)
  - Validate 201 Created response matches Expense schema
  - Test validation errors (400) match ErrorEnvelope schema
  - Test request-id header handling
  - **Expected**: Test fails with 404 (endpoint doesn't exist yet)

- [x] T004 [P] Write HTTP contract test for GET /expenses/summary endpoint in `api/tests/contract/expenses.contract.test.ts`
  - Test query parameters (category, month)
  - Validate response structure matches ExpenseSummary schema
  - Test error responses match ErrorEnvelope schema
  - Test request-id header handling
  - **Expected**: Test fails with 404 (endpoint doesn't exist yet)

## Phase 3.3: Core Implementation (OpenAPI Specification)
**ONLY after tests are written and failing**

- [x] T005 Update `api/spec/openapi.yaml` to add GET /expenses endpoint with pagination
  - Add GET /expenses path with query parameters: page (integer, default: 1, min: 1), pageSize (integer, default: 20, min: 1, max: 100)
  - Add 200 OK response with array of Expense objects
  - Add error responses (400, 500) using ErrorEnvelope schema
  - Add optional request-id header parameter
  - Include example request/response payloads

- [x] T006 Update `api/spec/openapi.yaml` to add shared ErrorEnvelope schema
  - Define ErrorEnvelope component schema in components/schemas section
  - Fields: code (string, required), message (string, required), details (object/array, optional), requestId (string, optional)
  - Reference ErrorEnvelope in all error responses (400, 404, 422, 429, 500)
  - Include examples for different error types

- [x] T007 Update `api/spec/openapi.yaml` to add request-id header support to all expense endpoints
  - Add request-id header parameter to GET /expenses, POST /expenses, GET /expenses/summary
  - Define header as optional string parameter
  - Document that request-id is echoed in error responses

- [x] T008 [P] Create `specs/core/openapi.yaml` from updated `api/spec/openapi.yaml`
  - Copy complete OpenAPI specification to `specs/core/openapi.yaml`
  - Ensure both files are synchronized
  - Verify OpenAPI 3.1.x version specified

## Phase 3.4: CI Integration

- [x] T009 [P] Create `.github/workflows/spec-check.yml` CI workflow
  - Configure workflow to run on PRs with changes to OpenAPI spec files
  - Add step to install `@apidevtools/swagger-cli` or `swagger-parser`
  - Add step to validate `specs/core/openapi.yaml` (or `api/spec/openapi.yaml`)
  - Configure as required status check for PRs
  - Ensure workflow fails if OpenAPI spec is invalid
  - **Note**: This check must be manually configured as a 'required status check' in the repository's branch protection rules (Settings → Branches → Branch protection rules) after this PR is merged

- [x] T010 Update `.github/workflows/api-checks.yml` to allow Test & Coverage - API job to fail initially
  - Add `continue-on-error: true` to test step (or configure job-level)
  - Document that tests are expected to fail until endpoints are implemented
  - Ensure contract tests run as part of Test & Coverage - API job

- [x] T011 [P] Update `.github/workflows/review-packet.yml` to generate OpenAPI HTML documentation
  - Add step to install Redoc CLI (`npm install -g @redocly/cli` or use npx)
  - Add step to generate HTML from `api/spec/openapi.yaml` using Redoc
  - Output HTML file to `review-artifacts/openapi.html`
  - Ensure step runs before artifact packaging

- [x] T012 [P] Update `scripts/generate-coverage-index.js` or create script to add OpenAPI link to `review-artifacts/index.html`
  - Add "API Documentation" section to index.html
  - Add link to `openapi.html` with class "link-button"
  - Ensure link is added to the navigation structure

## Phase 3.5: Polish & Validation

- [x] T013 [P] Verify OpenAPI specification passes spec-check CI validation
  - Run `swagger-cli validate specs/core/openapi.yaml` locally
  - Ensure all required endpoints are defined
  - Verify ErrorEnvelope schema is shared and referenced correctly
  - Verify request-id header is defined for all endpoints

- [x] T014 [P] Verify contract tests fail initially (confirming spec-first approach)
  - Run `npm test` in `api/` directory
  - Confirm GET /expenses test fails with 404
  - Confirm POST /expenses test fails with 404
  - Confirm GET /expenses/summary test fails with 404
  - Document that failures are expected until endpoints are implemented

- [x] T015 [P] Verify OpenAPI HTML documentation generates correctly
  - Run Redoc CLI manually: `redocly build-docs api/spec/openapi.yaml -o test-openapi.html`
  - Verify HTML file is generated and displays correctly in browser
  - Verify all endpoints and schemas are documented

- [x] T016 [P] Run quickstart.md validation steps
  - Execute all validation steps from `quickstart.md`
  - Verify OpenAPI spec exists and validates
  - Verify contract tests exist and fail initially
  - Verify spec-check CI job configured
  - Verify review packet CI includes OpenAPI HTML generation

## Dependencies
- T001 (Setup) before T008 (Create specs/core/openapi.yaml)
- T002-T004 (Contract tests) before T005-T007 (OpenAPI spec updates) - TDD order
- T005-T007 (OpenAPI spec updates) before T008 (Create specs/core/openapi.yaml)
- T008 (Create specs/core/openapi.yaml) before T009 (Spec-check CI)
- T005-T007 (OpenAPI spec updates) before T011 (Review packet CI)
- T011 (Review packet CI) before T012 (Update index.html)
- T009-T012 (CI jobs) before T013-T016 (Validation)

## Parallel Execution Examples

### Example 1: Contract Tests (T002-T004)
These can run in parallel as they're all modifying the same test file but different test suites:
```
# Note: T002-T004 modify the same file (expenses.contract.test.ts) but different describe blocks
# They can be written in parallel if done carefully, but safer to do sequentially
# However, the test logic itself is independent, so can be planned in parallel
```

**Recommended**: Write T002-T004 sequentially to avoid merge conflicts, but plan them together.

### Example 2: OpenAPI Spec Updates (T005-T007)
These modify the same file, so must be sequential:
```
T005 → T006 → T007 (all update api/spec/openapi.yaml)
```

### Example 3: CI Workflows (T009, T011, T012)
These can run in parallel as they modify different files:
```
Task: "Create .github/workflows/spec-check.yml"
Task: "Update .github/workflows/review-packet.yml"
Task: "Update scripts/generate-coverage-index.js"
```

### Example 4: Validation Tasks (T013-T016)
These can run in parallel as they're independent verification steps:
```
Task: "Verify OpenAPI specification passes spec-check CI validation"
Task: "Verify contract tests fail initially"
Task: "Verify OpenAPI HTML documentation generates correctly"
Task: "Run quickstart.md validation steps"
```

## Notes
- **[P] tasks**: Different files, no dependencies (T009, T011, T012, T013-T016)
- **Sequential tasks**: Same file modifications (T005-T007 all update api/spec/openapi.yaml)
- **TDD order**: Contract tests (T002-T004) MUST be written before OpenAPI spec updates (T005-T007)
- **Expected failures**: Contract tests should fail with 404 errors initially (endpoints don't exist)
- **CI configuration**: Spec-check must be required status check; Test & Coverage allowed to fail initially
- **File synchronization**: `api/spec/openapi.yaml` and `specs/core/openapi.yaml` must stay in sync

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - ✅ `openapi-spec.contract.md` → T005-T008 (OpenAPI spec updates)
   - ✅ `contract-tests.contract.md` → T002-T004 (Contract test tasks)
   - ✅ `spec-check-ci.contract.md` → T009 (Spec-check CI job)
   - ✅ `review-packet-ci.contract.md` → T011-T012 (Review packet CI enhancement)

2. **From Data Model**:
   - ✅ Expense entity → Referenced in OpenAPI schema (T005-T007)
   - ✅ ExpenseSummary entity → Referenced in OpenAPI schema (T005-T007)
   - ✅ ErrorEnvelope entity → T006 (Shared schema definition)

3. **From Research**:
   - ✅ Pagination pattern → T005 (Page-based pagination)
   - ✅ Error Envelope design → T006 (Shared schema)
   - ✅ Request-ID header → T007 (Header support)
   - ✅ Documentation tool → T011 (Redoc CLI)

4. **Ordering**:
   - ✅ Setup → Tests → OpenAPI Spec → CI → Validation
   - ✅ Dependencies block parallel execution where files conflict

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tasks
  - ✅ OpenAPI spec contract → T005-T008
  - ✅ Contract tests contract → T002-T004
  - ✅ Spec-check CI contract → T009
  - ✅ Review packet CI contract → T011-T012

- [x] All entities referenced in tasks
  - ✅ Expense → OpenAPI schema (T005-T007)
  - ✅ ExpenseSummary → OpenAPI schema (T005-T007)
  - ✅ ErrorEnvelope → Shared schema (T006)

- [x] All tests come before implementation
  - ✅ T002-T004 (Contract tests) before T005-T007 (OpenAPI spec)

- [x] Parallel tasks truly independent
  - ✅ T009, T011, T012 (different CI workflow files)
  - ✅ T013-T016 (independent validation steps)

- [x] Each task specifies exact file path
  - ✅ All tasks include specific file paths

- [x] No task modifies same file as another [P] task
  - ✅ T005-T007 are sequential (same file: api/spec/openapi.yaml)
  - ✅ T002-T004 are sequential (same file: expenses.contract.test.ts)

---

**Status**: ✅ Tasks ready for execution  
**Total Tasks**: 16  
**Parallel Tasks**: 8 (T001, T008, T009, T011, T012, T013, T014, T015, T016)  
**Sequential Tasks**: 8 (T002-T004, T005-T007, T010)


