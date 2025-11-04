# Tasks: Week 5 Day-0: API Scaffolding and Spec-First Setup

**Input**: Design documents from `specs/021-title-week-5/`  
**Feature**: Week 5 Day-0: API Scaffolding and Spec-First Setup  
**Branch**: `021-title-week-5`  
**Status**: Ready for execution

---

## Phase 3.1: Setup & Project Structure

- [X] T001 Create `/api` directory structure at repository root with `src/`, `tests/`, and `spec/` subdirectories
- [X] T002 [P] Create `api/package.json` with Express, Zod, pino, supertest dependencies and scripts (test, lint, dev)
- [X] T003 [P] Create `api/tsconfig.json` with ES modules and strict TypeScript configuration
- [X] T004 [P] Create `api/vitest.config.ts` with coverage reporting configuration (lcov + HTML)
- [X] T005 Create `api/.env.example` file documenting PORT and NODE_ENV environment variables

---

## Phase 3.2: Spec-First Workflow (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: Specification must be committed before any endpoint implementation**

- [X] T006 Create `/api/spec/openapi.yaml` with OpenAPI 3.1 format and GET /health endpoint definition (status: "ok", timestamp: date-time)
- [X] T007 [P] Create contract test `api/tests/contract/health.contract.test.ts` validating GET /health matches OpenAPI spec (must fail initially - no implementation)

---

## Phase 3.3: Development Environment Setup

- [X] T008 Configure development server setup in `api/package.json` with tsx + nodemon for hot-reload (`npm run dev`)
- [X] T009 Create `api/src/server.ts` entry point with Express server initialization (basic structure, no routes yet)
- [X] T010 Create `api/src/middleware/validation.ts` structure for Zod request validation middleware (placeholder)
- [X] T011 Create `api/src/middleware/logger.ts` structure for pino structured logging middleware (placeholder)
- [X] T012 Create `api/src/types/index.ts` for TypeScript type definitions

---

## Phase 3.4: Core Implementation (ONLY after T006-T007 are complete)

- [X] T013 Implement GET /health route handler in `api/src/routes/health.ts` matching OpenAPI specification
- [X] T014 Register health route in `api/src/server.ts` and make contract test pass
- [X] T015 [P] Implement basic request validation middleware in `api/src/middleware/validation.ts` using Zod
- [X] T016 [P] Implement structured logging middleware in `api/src/middleware/logger.ts` using pino

---

## Phase 3.5: CI/CD Integration

- [X] T017 Create `.github/workflows/api-checks.yml` workflow file with lint, test, and coverage steps
- [X] T018 Create `.github/scripts/copy-api-coverage.sh` script to copy coverage reports from `api/coverage/` to `review-artifacts/`
- [X] T019 Create `.github/scripts/verify-api-artifacts.sh` script to verify all required files exist before artifact upload (fail-fast)
- [X] T020 Create `.github/scripts/generate-api-index.sh` script to generate `review-artifacts/index.html` with navigation structure for API review artifacts
- [X] T021 Update `.github/workflows/api-checks.yml` to include artifact generation steps (copy → verify → generate index.html → upload `review-packet-api`)

---

## Phase 3.6: Testing & Validation

- [X] T022 [P] Run contract test `api/tests/contract/health.contract.test.ts` and verify it passes after implementation
- [X] T023 [P] Verify `npm test` executes successfully with coverage reporting in `api/` directory
- [X] T024 [P] Verify `npm run lint` executes successfully in `api/` directory
- [X] T025 [P] Verify `npm run dev` starts development server successfully
- [X] T026 Verify CI workflow `.github/workflows/api-checks.yml` executes successfully and generates `review-packet-api` artifact
- [ ] T027 Verify no security middleware (e.g., CORS, rate-limiting) was implemented, confirming security remains out of scope for Day-0 (verifies FR-010-NOTE)

---

## Dependency Graph

```
T001 → [T002, T003, T004, T005 in parallel] → T006 → T007 → T008 (Phase 3.2 must complete before Phase 3.3) → [T009, T010, T011, T012 in parallel] → [T013, T014] → [T015, T016 in parallel] → T017 → [T018, T019, T020 in parallel] → T021 → [T022, T023, T024, T025 in parallel] → T026 → T027
```

---

## Task Details Reference

### T001: Create API Directory Structure
**File**: `/api` directory (Create)  
**Duration**: ~5 min  
**Dependencies**: None

Create directory structure:
- `/api/src/` (source code)
- `/api/tests/contract/` (contract tests)
- `/api/tests/integration/` (integration tests)
- `/api/tests/unit/` (unit tests)
- `/api/spec/` (API specifications)

---

### T002: Create package.json
**File**: `api/package.json` (Create)  
**Duration**: ~10 min  
**Dependencies**: T001

Create package.json with:
- Scripts: `test`, `lint`, `dev`, `test:coverage`
- Dependencies: express, zod, pino, @types/express
- DevDependencies: vitest, @vitest/coverage-v8, typescript, tsx, nodemon, supertest, @types/supertest, eslint, @typescript-eslint/parser, @typescript-eslint/eslint-plugin

---

### T003: Create tsconfig.json
**File**: `api/tsconfig.json` (Create)  
**Duration**: ~5 min  
**Dependencies**: T001

Configure TypeScript:
- `"type": "module"` (ES modules)
- `"module": "ESNext"`
- `"target": "ES2022"`
- Strict mode enabled

---

### T004: Create vitest.config.ts
**File**: `api/vitest.config.ts` (Create)  
**Duration**: ~10 min  
**Dependencies**: T001

Configure Vitest:
- Coverage provider: `@vitest/coverage-v8`
- Output: lcov.info + HTML
- Test file patterns: `tests/**/*.test.ts`

---

### T005: Create .env.example
**File**: `api/.env.example` (Create)  
**Duration**: ~5 min  
**Dependencies**: T001

Document environment variables:
- `PORT=3000` (server listening port)
- `NODE_ENV=development` (development/production mode)

---

### T006: Create OpenAPI Specification
**File**: `api/spec/openapi.yaml` (Create)  
**Duration**: ~15 min  
**Dependencies**: T001

Create OpenAPI 3.1 specification with:
- OpenAPI version: 3.1.0
- Info section (title, version, description)
- GET /health endpoint with:
  - Response 200: `{ status: "ok", timestamp: "date-time" }`
- Commit to version control (spec-first discipline)

**Note**: This task includes committing the new openapi.yaml file to version control, fulfilling FR-016.

---

### T007: Create Contract Test for GET /health
**File**: `api/tests/contract/health.contract.test.ts` (Create)  
**Duration**: ~15 min  
**Dependencies**: T006

Create contract test using Supertest:
- Validates 200 status code
- Validates JSON response with status field
- Validates status === "ok"
- Validates timestamp field (ISO 8601 format)
- Validates response matches OpenAPI schema
- **MUST FAIL initially** (no implementation exists)

---

### T008: Configure Development Server
**File**: `api/package.json` (Update dev script)  
**Duration**: ~5 min  
**Dependencies**: T002

Add dev script:
- `"dev": "nodemon --exec tsx src/server.ts"`
- Hot-reload on file changes

---

### T009: Create Server Entry Point
**File**: `api/src/server.ts` (Create)  
**Duration**: ~10 min  
**Dependencies**: T002

Create Express server:
- Initialize Express app
- Basic middleware setup (JSON parser)
- Listen on PORT from environment
- Export app for testing

---

### T010: Create Validation Middleware Structure
**File**: `api/src/middleware/validation.ts` (Create placeholder)  
**Duration**: ~5 min  
**Dependencies**: T002

Create placeholder middleware structure for Zod validation.

---

### T011: Create Logger Middleware Structure
**File**: `api/src/middleware/logger.ts` (Create placeholder)  
**Duration**: ~5 min  
**Dependencies**: T002

Create placeholder middleware structure for pino logging.

---

### T012: Create Type Definitions
**File**: `api/src/types/index.ts` (Create)  
**Duration**: ~5 min  
**Dependencies**: T002

Create basic TypeScript type definitions file.

---

### T013: Implement GET /health Route Handler
**File**: `api/src/routes/health.ts` (Create)  
**Duration**: ~10 min  
**Dependencies**: T006, T007, T009

Implement route handler:
- GET /health endpoint
- Returns `{ status: "ok", timestamp: ISO 8601 date-time }`
- Matches OpenAPI specification exactly

---

### T014: Register Health Route
**File**: `api/src/server.ts` (Update)  
**Duration**: ~5 min  
**Dependencies**: T013

Register health route:
- Import health route handler
- Mount at `/health` path
- Verify contract test passes

---

### T015: Implement Request Validation Middleware
**File**: `api/src/middleware/validation.ts` (Implement)  
**Duration**: ~15 min  
**Dependencies**: T002

Implement Zod validation middleware:
- Validate request body/query/params against Zod schemas
- Return 400 error if validation fails
- Type-safe request handling

---

### T016: Implement Structured Logging Middleware
**File**: `api/src/middleware/logger.ts` (Implement)  
**Duration**: ~15 min  
**Dependencies**: T002

Implement pino logging middleware:
- Structured JSON logging
- Request ID tracking
- Log levels (debug, info, warn, error)

---

### T017: Create CI Workflow File
**File**: `.github/workflows/api-checks.yml` (Create)  
**Duration**: ~15 min  
**Dependencies**: T002, T004

Create GitHub Actions workflow:
- Trigger on push/PR to main/develop
- Setup Node.js
- Install dependencies (`cd api && npm ci`)
- Lint step (`cd api && npm run lint`)
- Test step (`cd api && npm test -- --coverage`)

---

### T018: Create Copy Coverage Script
**File**: `.github/scripts/copy-api-coverage.sh` (Create)  
**Duration**: ~10 min  
**Dependencies**: T004

Create bash script:
- Copies `api/coverage/` to `review-artifacts/api-coverage/`
- Creates directory structure if needed
- Fails if coverage files missing

---

### T019: Create Verify Artifacts Script
**File**: `.github/scripts/verify-api-artifacts.sh` (Create)  
**Duration**: ~10 min  
**Dependencies**: T018, T020

Create bash script:
- Verifies `review-artifacts/index.html` exists
- Verifies `review-artifacts/openapi.yaml` exists (from `api/spec/openapi.yaml`)
- Verifies coverage files exist (lcov.info + HTML)
- **Fail-fast**: exits with code 1 if any file missing

---

### T020: Create Generate Index Script
**File**: `.github/scripts/generate-api-index.sh` (Create)  
**Duration**: ~15 min  
**Dependencies**: T018

Create bash script:
- Generates `review-artifacts/index.html` with navigation structure
- Links to:
  - OpenAPI specification (`openapi.yaml`)
  - Coverage reports (`api-coverage/index.html`)
  - Coverage LCOV (`api-coverage/lcov.info`)
  - Test results (if available)
- Matches Week 4 review artifact patterns

---

### T021: Update CI Workflow with Artifact Generation
**File**: `.github/workflows/api-checks.yml` (Update)  
**Duration**: ~10 min  
**Dependencies**: T017, T018, T019, T020

Add artifact generation steps:
- Copy coverage to review-artifacts
- Copy OpenAPI spec to review-artifacts
- Verify all files exist
- Generate index.html
- Upload `review-packet-api` artifact

---

### T022: Verify Contract Test Passes
**File**: `api/tests/contract/health.contract.test.ts` (Verify)  
**Duration**: ~5 min  
**Dependencies**: T014

Run contract test:
- `cd api && npm test -- tests/contract/health.contract.test.ts`
- Verify all assertions pass
- Verify response matches OpenAPI spec

---

### T023: Verify Test Infrastructure
**File**: `api/` directory (Verify)  
**Duration**: ~5 min  
**Dependencies**: T004, T007

Run tests:
- `cd api && npm test`
- Verify tests execute successfully
- Verify coverage reports generated

---

### T024: Verify Linting
**File**: `api/` directory (Verify)  
**Duration**: ~5 min  
**Dependencies**: T002

Run linter:
- `cd api && npm run lint`
- Verify linting passes
- Fix any linting errors

---

### T025: Verify Development Server
**File**: `api/` directory (Verify)  
**Duration**: ~5 min  
**Dependencies**: T008, T009, T014

Start dev server:
- `cd api && npm run dev`
- Verify server starts on configured PORT
- Verify GET /health endpoint responds correctly
- Stop server

---

### T026: Verify CI Workflow
**File**: `.github/workflows/api-checks.yml` (Verify)  
**Duration**: ~10 min  
**Dependencies**: T021

Verify CI workflow:
- Push changes to trigger workflow
- Verify all steps execute successfully
- Verify `review-packet-api` artifact is generated
- Verify artifact contains all required files (index.html, openapi.yaml, coverage)

---

### T027: Verify Security Scope
**File**: `api/src/` directory (Verify)  
**Duration**: ~5 min  
**Dependencies**: T015, T016

Verify no security middleware was implemented:
- Check `api/src/middleware/` directory for security-related files
- Verify no CORS middleware is configured
- Verify no authentication/authorization middleware exists
- Verify no rate-limiting middleware is present
- Confirm security remains out of scope for Day-0 (FR-010-NOTE)

---

## Execution Timeline

**Sequential**: ~220 minutes
- Setup (T001-T005): 35 min
- Spec-First (T006-T007): 30 min
- Dev Environment (T008-T012): 30 min
- Core Implementation (T013-T016): 45 min
- CI/CD (T017-T021): 60 min
- Validation (T022-T026): 30 min

**With Parallel Execution**: ~155 minutes
- T002-T005: ~10 min (parallel)
- T008-T012: ~10 min (parallel)
- T015-T016: ~15 min (parallel)
- T018-T020: ~15 min (parallel)
- T022-T025: ~5 min (parallel)

---

## Parallel Execution Groups

### Group 1: Configuration Files (after T001)
```bash
# Launch T002-T005 together:
T002: Create package.json
T003: Create tsconfig.json
T004: Create vitest.config.ts
T005: Create .env.example
```

### Group 2: Development Environment (after T007)
```bash
# Launch T008-T012 together:
T008: Configure dev server
T009: Create server.ts
T010: Create validation middleware structure
T011: Create logger middleware structure
T012: Create types/index.ts
```

### Group 3: Middleware Implementation (after T014)
```bash
# Launch T015-T016 together:
T015: Implement validation middleware
T016: Implement logger middleware
```

### Group 4: Artifact Scripts (after T017)
```bash
# Launch T018-T020 together:
T018: Create copy-api-coverage.sh
T019: Create verify-api-artifacts.sh
T020: Create generate-api-index.sh
```

### Group 5: Validation Tests (after T021)
```bash
# Launch T022-T025 together:
T022: Verify contract test passes
T023: Verify test infrastructure
T024: Verify linting
T025: Verify development server
```

---

## Notes

- **Spec-First Discipline**: T006 (OpenAPI spec) MUST be completed and committed before T013 (implementation)
- **TDD**: T007 (contract test) MUST be written and MUST FAIL before T013 (implementation)
- **Fail-Fast**: CI workflow must fail if any step fails (lint, test, artifact verification)
- **Week 4 Patterns**: Review artifact generation follows Week 4 patterns (index.html navigation, coverage reports, verification scripts)
- **Artifact Name**: `review-packet-api` (distinct from `review-packet` for UI)
- **No Security**: Day-0 setup excludes security features (CORS, auth, rate limiting)

---

*Tasks Phase 3 Complete — Ready for Execution*

