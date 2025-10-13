# Chore: Implement Day 0 Blockers

## Phase 1: Local File System Restructuring
- [x] T001: Create a new directory named `data` in the repository root.
- [x] T002: Move runtime state files (`todo.json`, `stopwatch-state.json`, `expenses.json`) into the `/data` directory.
- [x] T003: Add the `/data/` directory to the `.gitignore` file.
- [x] T004: Delete the stray file `hello.js..js`.
- [x] T005: Create a new directory named `.specify` in the repository root.
- [x] T006: Create empty spec files for `ui-expense`, `ui-temp`, `ui-todo`, and `ui-stopwatch`.
- [x] T007: Create and populate `/.specify/ui-quote.spec.md` with the spec stub template.

## Phase 2: Configuration & Templates
- [x] T008: Add a `spec:lint` script to `package.json`.
- [x] T009: Update the `.github/pull_request_template.md` to include the "Spec" section.

## Phase 3: CI Workflow Enhancements
- [x] T010: Modify the `checks.yml` workflow to add a step that runs `npm run spec:lint`.
- [x] T011: Verify the `review-packet.yml` workflow generates coverage for all six backend apps.
- [x] T012: Update the `review-packet.yml` workflow to scaffold UI coverage directories.
- [x] T013: Update the script that generates `review-artifacts/index.html` to include backend links and a UI section.
- [x] T014: Confirm the final artifact is named `review-packet`.

## Phase 4: Documentation & Final Commit
- [x] T015: Update `README.md` to add the "How to review me" box.
- [x] T016: Update `README.md` to add the "Frontend" section placeholder.
- [x] T017: Stage all changes and perform a final commit with the exact message: `chore(repo): move runtime to /data, ignore; remove stray files`.
 
<!-- sync: trigger Linear status update -->
