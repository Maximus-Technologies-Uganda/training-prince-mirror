# Day 0: CI Maturity, Review Packet Parity, and Repository Hygiene

> **How to review me:**
> - Go to GitHub Actions → latest run for `Day 0 CI Pipeline` on your PR.
> - Download the artifact named `review-packet`.
> - Open `review-artifacts/index.html` for the **unified Coverage Index** (main entry point for both backend and UI test coverage).
> - The Coverage Index provides direct links to Backend Coverage and UI Coverage sections.
> - Use the Coverage Index to navigate between CLI coverage reports and frontend UI coverage reports.
> - Check `review-artifacts/review.md` for comprehensive review metadata including environment details, commit history, and coverage summaries.
> - Review `test-results/smoke-test-report.html` for E2E test results and artifacts.

### PR Spec requirement
- Every PR must include a line in the description with a link to the specification or Linear ticket:
  - `Spec: https://...` (Linear issue URL or external spec doc)
- PR titles must start with the Linear key, for example: `DEV-123: Short description`.

## Day 0 CI Maturity Status

✅ **Unified Coverage Reporting**: Backend and UI coverage consolidated into single review packet
✅ **Repository Hygiene**: State files migrated to `/data/` directory with proper `.gitignore` configuration
✅ **E2E Smoke Testing**: Playwright smoke tests for all 5 applications with artifact capture
✅ **Enriched Review Metadata**: Comprehensive review.md with environment details, commit history, and coverage summaries
✅ **CI Pipeline Integration**: 4-phase pipeline with artifact handling and failure recovery
✅ **Review Packet Navigation**: Interactive index.html with coverage summaries and test results

## Week 2 Status

✅ **CLI Hardening Complete**: HELLO, STOPWATCH, TEMP-CONVERTER CLIs hardened with validation, error paths, and comprehensive testing
✅ **Coverage Targets Exceeded**: All CLIs meet or exceed workbook requirements (≥50-60%)
✅ **Review Packet**: Per-app HTML coverage structure implemented
✅ **Test Isolation**: All tests passing in full suite

## Week 5 Day-0: Final Hygiene & GitHub Projects Migration

✅ **Repository Production Readiness**: Main branch fully protected with comprehensive CI checks, contributor templates standardized, stray files removed  
✅ **GitHub Projects Migration**: Complete migration from Linear to GitHub Projects with 5 custom fields (Status, Priority, Size, Spec URL, Sprint/Week) and automated workflows  
✅ **Review Packet Complete**: Unified `review-artifacts/index.html` with coverage tables, Playwright E2E reports, OpenAPI documentation, and changelog  
✅ **Branch Protection Enforced**: 5 required status checks (spec-check, API coverage, Playwright, CodeQL, Dependency Review) block unvalidated merges  
✅ **Infrastructure as Code**: Contract tests verify all configurations, GitHub Actions workflow for Pages deployment

### Resources & Documentation

- 📋 **Specification**: [Week 5 Day-0 Feature Spec](./specs/025-week-5-day/spec.md) - Complete requirements and acceptance scenarios
- 📊 **Implementation Plan**: [Week 5 Day-0 Plan](./specs/025-week-5-day/plan.md) - Technical approach, architecture, and phase breakdown
- 🔍 **Review Packet**: [review-artifacts/index.html](./review-artifacts/index.html) - Unified coverage index (main entry point)
- 📁 **Data Model**: [Week 5 Day-0 Data Model](./specs/025-week-5-day/data-model.md) - Entity definitions and validation rules
- 🔬 **Contract Tests**: [specs/025-week-5-day/contracts/](./specs/025-week-5-day/contracts/) - Infrastructure verification tests
- 📖 **Research & Decisions**: [Week 5 Day-0 Research](./specs/025-week-5-day/research.md) - Technical findings and architecture decisions
- 🚀 **Quick Start**: [Week 5 Day-0 Quickstart](./specs/025-week-5-day/quickstart.md) - Execution walkthrough and validation steps

### How to Review This Implementation

1. **Start with Review Packet**: Open [`review-artifacts/index.html`](./review-artifacts/index.html) to see unified coverage, test results, and documentation
2. **Verify Branch Protection**: Settings → Branches → main should show 5 required status checks
3. **Check GitHub Project**: Projects tab should show "Training Prince" project with custom fields active
4. **Review Templates**: `.github/ISSUE_TEMPLATE/` should have feature.md and bug.md; `.github/pull_request_template.md` should be present
5. **Run Tests**: Execute `npm run test` to verify all contract tests pass
6. **Validate Coverage**: `npm run test:coverage` to confirm 60% thresholds met

### Related Documentation

- Constitution: [`.specify/memory/constitution.md`](./.specify/memory/constitution.md) - Project governance and quality principles
- Implementation Status: [IMPLEMENTATION_STATUS_W5_DAY0.md](./IMPLEMENTATION_STATUS_W5_DAY0.md) - Detailed task completion status and remaining work
- Contributing Guidelines: [CONTRIBUTING.md](./CONTRIBUTING.md) - Standards for contributors and PR process

## Code Quality Gates

🎯 **Code Coverage**: This project enforces **mandatory minimum coverage thresholds** to ensure code quality and test reliability.

- **Statements**: 60% minimum
- **Branches**: 50% minimum  
- **Functions**: 60% minimum
- **Lines**: 60% minimum

All PRs must pass coverage checks in CI. See [CONTRIBUTING.md](./CONTRIBUTING.md#code-coverage-requirements) for details on running coverage locally and understanding the enforcement policy.

---

## Frontend

Modern web UI built with Vite, featuring reusable core logic, accessibility support, and comprehensive test coverage.

🌐 **Live Demo**: [View the application on GitHub Pages](https://maximus-technologies-uganda.github.io/training-prince/)

### Available UIs
- **Quote**: Random quotes with author filtering
- **Expense**: Personal expense tracking with categories
- **Temperature Converter**: Celsius/Fahrenheit conversion
- **To-Do**: Task management with due dates and priority filtering
- **Stopwatch**: Precision timing with lap tracking

### UI Screenshots

#### Quote Explorer
<p align="center">
  <img src="frontend/quote-ui.png" alt="Quote UI screenshot showing random quote display with author filtering" width="600" />
</p>

#### Expense Tracker
<p align="center">
  <img src="frontend/expense-ui.png" alt="Expense UI screenshot showing expense form and tracking table" width="600" />
</p>

#### Temperature Converter
<p align="center">
  <em>Screenshot coming soon - Temperature Converter UI with Celsius/Fahrenheit conversion</em>
</p>

#### To-Do Manager
<p align="center">
  <img src="frontend/todo-ui.png" alt="To-Do UI screenshot showing task management interface" width="600" />
</p>

#### Stopwatch Timer
<p align="center">
  <img src="frontend/stopwatch-ui.png" alt="Stopwatch UI screenshot showing timer controls and lap tracking" width="600" />
</p>

### Development
```bash
# Start dev server
npm run dev

# Run UI tests
cd frontend && npm test

# Run E2E tests
npm run test:e2e
```

### Installation
- **Clone the repository**
- **Navigate into the project directory**
- **Install dependencies**

```bash
npm install
```

### Running Tests
Run the full test suite:

```bash
npm test
```

### Usage Examples

#### Hello CLI
- **Default greeting**

```bash
node src/hello/index.js
```

- **Greeting with a name**

```bash
node src/hello/index.js Alice
```

- **Greeting with a name and --shout flag**

```bash
node src/hello/index.js Alice --shout
```

- **Run via npx (after building/publishing or with `npm link`)**

```bash
npx . hello-cli Alice --shout
```

#### Stopwatch CLI
- **Start the stopwatch (resets any previous state)**

```bash
node src/stopwatch/index.js start
```

- **Record a lap**

```bash
node src/stopwatch/index.js lap
```

- **Run via npx**

```bash
npx . stopwatch-cli start
npx . stopwatch-cli lap
```

#### Temperature Converter CLI
- **Convert Celsius to Fahrenheit**

```bash
node src/temp-converter/index.js 100 --from C --to F
```

- **Convert Fahrenheit to Celsius**

```bash
node src/temp-converter/index.js 32 --from F --to C
```

- **Example that would cause an error (identical units)**

```bash
node src/temp-converter/index.js 100 --from C --to C
```

- **Run via npx**

```bash
npx . temp-cli 100 --from C --to F
```

If invalid or identical units are provided, the CLI will print an error message.
Sync test performed on September 23, 2025.

#### Expense CLI
- Add an expense

```bash
node src/expense/index.js add --amount 12000 --category transport
```

- List expenses

```bash
node src/expense/index.js list
```

- Total (optionally filter)

```bash
node src/expense/index.js total
node src/expense/index.js total --category food
node src/expense/index.js total --month 3
```

- Error example (non-numeric amount → non‑zero exit)

```bash
node src/expense/index.js add --amount abc --category food
```

#### To‑Do CLI
- Add; list; toggle; remove (spec flags with backward compatibility)

```bash
# Spec flags
node src/todo/index.js add "Buy milk" --due 2025-09-24 --priority high

# Legacy flags (still supported)
node src/todo/index.js add "Pay bills" --highPriority --dueToday

# Other commands
node src/todo/index.js list
node src/todo/index.js toggle 0
node src/todo/index.js remove 0
```

- Error examples

```bash
# Missing text → non-zero exit
node src/todo/index.js add

# Bad date format → non-zero exit
node src/todo/index.js add "Task" --due 2025/09/24

# Bad priority value → non-zero exit
node src/todo/index.js add "Task" --priority urgent
```

#### Quote CLI
- Default random

```bash
node src/quote/index.js
```

- By author (case‑insensitive)

```bash
node src/quote/index.js --by "Maya Angelou"
```

- Error example (author not found → non‑zero exit)

```bash
node src/quote/index.js --by "Unknown Author"
```

## Coverage Index
The **unified Coverage Index** (`review-artifacts/index.html`) is the main entry point for all test coverage reports. It's packaged in the GitHub Actions artifact named `review-packet` (available on the `development` branch and PRs).

### How to Access Coverage Reports
1. **Download the artifact**: Go to GitHub Actions → latest run for `review-packet` on your PR
2. **Open the Coverage Index**: Navigate to `review-artifacts/index.html` in the downloaded artifact
3. **Navigate coverage sections**: Use the Coverage Index to access both Backend Coverage and UI Coverage sections

### Coverage Sections Available
- **Backend Coverage**: CLI application test coverage (Hello, Stopwatch, Temp-Converter, Expense, To-Do, Quote)
- **UI Coverage**: Frontend application test coverage (To-Do UI, Stopwatch UI, and other UI components)

### UI Coverage (To‑Do and Stopwatch)

- UI To‑Do coverage is included under `ui-coverage-todo/` in the `review-packet` artifact.
- UI Stopwatch coverage is included under `ui-coverage-stopwatch/`.
- Open `review-artifacts/index.html` and click the respective links.
