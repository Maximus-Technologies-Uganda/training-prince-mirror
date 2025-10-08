# Review Packet - Week 2

## App Test Summary

| App | Coverage | Target | Status | Notes |
|-----|----------|--------|--------|-------|
| Quote CLI | 87.5% | ≥60% | ✅ | Edge-case tests; by-author validation |
| Stopwatch CLI | 98.26% | ≥50% | ✅ | Deterministic tests via Date.now mocking |
| Hello CLI | 96.49% | ≥50% | ✅ | Unknown flag validation; version flag |
| Temp-converter CLI | 92.95% | ≥50% | ✅ | Table-driven tests; negative paths |
| Expense CLI | 96.91% | ≥50% | ✅ | CLI validation; totals by category/month |
| To-Do CLI | 94.73% | ≥50% | ✅ | Duplicate guards; filters; negative cases |

## Coverage Collected
- Quote: coverage collected ✅
- Stopwatch: coverage collected ✅
- Hello: coverage collected ✅
- Temp-converter: coverage collected ✅
- Expense: coverage collected ✅
- To-Do: coverage collected ✅

## Week 2 Achievements
- Quote CLI: 28 comprehensive edge-case tests covering empty/invalid inputs, case-insensitive filtering
- Stopwatch CLI: 98.16% coverage with comprehensive CLI unit tests
- Hello CLI: Version flag implementation with test coverage
- Enhanced documentation: Copy-pasteable READMEs with real examples
- CHANGELOG.md: Complete Week 2 progress summary
- Professional journal entries: Friday Week 2 wrap-up in consistent format

## Key Learnings
- Pure functions + thin CLI pattern enables comprehensive testing
- Test isolation is crucial for reliable CI/CD
- Edge-case testing reveals important behavior differences
- Documentation fidelity requires copy-pasteable examples

## Notes
- All six CLIs meet or exceed Week 2 coverage thresholds.
- Review Packet artifact is produced by the `review-packet` workflow.

