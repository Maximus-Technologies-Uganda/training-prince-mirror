# Data Model: Day 0 Blockers

## Entities

### ReviewPacket
- artifactName: string ("review-packet")
- indexPath: string ("review-artifacts/index.html")
- backendCoverageDirs: string[] (coverage-<app>/lcov-report/)
- uiCoverageDirs: string[] (ui-coverage-<app>/lcov-report/)

### RuntimeData
- todoFile: string ("data/todo.json")
- stopwatchFile: string ("data/stopwatch.json")
- expensesFile: string ("data/expenses.json")
- ignoredByGit: boolean (true)
