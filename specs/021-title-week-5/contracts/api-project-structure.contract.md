# Contract: API Project Structure

**Feature**: Week 5 Day-0: API Scaffolding and Spec-First Setup  
**Scope**: API project directory structure and configuration  
**Date**: 2025-01-27

---

## Contract Definition

### Input
- Repository root directory
- Feature specification requirements (FR-001 to FR-004, FR-024 to FR-025)

### Output
- `/api` directory at repository root
- Complete Node.js project structure with:
  - `package.json` (dependencies and scripts)
  - `tsconfig.json` (TypeScript configuration)
  - `vitest.config.ts` (test configuration)
  - `.env.example` (environment variables template)
  - `src/` directory (source code)
  - `tests/` directory (test files)
  - `spec/` directory (API specifications)

### Validation Rules
1. **Directory Existence**: `/api` directory must exist at repository root
2. **Required Files**: All required configuration files must exist:
   - `package.json`
   - `tsconfig.json`
   - `vitest.config.ts`
   - `.env.example`
3. **Directory Structure**: Required directories must exist:
   - `src/`
   - `tests/` (with subdirectories: `contract/`, `integration/`, `unit/`)
   - `spec/`
4. **Package.json**: Must include:
   - Scripts: `test`, `lint`, `dev`
   - Dependencies: express, zod, pino, supertest
   - DevDependencies: vitest, @vitest/coverage-v8, typescript, tsx, nodemon
5. **Environment Variables**: `.env.example` must document:
   - `PORT` (server listening port)
   - `NODE_ENV` (development/production mode)

### Failure Conditions
- **ERROR**: `/api` directory already exists with incompatible structure → Mark as prerequisite to resolve
- **ERROR**: Required files missing → Scaffolding incomplete
- **ERROR**: Invalid package.json structure → Project cannot run
- **ERROR**: Missing environment variable documentation → Configuration unclear

### Success Criteria
- ✅ `/api` directory exists with all required files and directories
- ✅ `npm install` succeeds in `/api` directory
- ✅ `npm test` executes (tests may fail, but command must work)
- ✅ `npm run lint` executes
- ✅ `.env.example` documents PORT and NODE_ENV

---

## Implementation Notes

- Project uses ES modules (`"type": "module"`)
- TypeScript configuration must support ES modules and strict mode
- Vitest configuration must generate coverage reports (lcov + HTML)
- Development server must support hot-reload (tsx + nodemon)

---

## Related Contracts
- `api-specification.contract.md`: Spec directory structure
- `ci-workflow.contract.md`: CI workflow validates project structure

