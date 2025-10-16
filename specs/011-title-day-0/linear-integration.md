# Linear Integration Setup for Day 0: CI Maturity, Review Packet Parity, and Repository Hygiene

## Required Environment Variables

To create Linear sub-issues from the tasks.md file, you need to set these environment variables:

```bash
export LINEAR_API_KEY="your_linear_api_key_here"
export LINEAR_TEAM_NAME="your_team_name"
export LINEAR_PROJECT_NAME="your_project_name"
export LINEAR_PARENT_IDENTIFIER="PRI-XXX"  # Replace with your parent issue identifier
```

## How to Get Linear API Key

1. Go to Linear Settings → API
2. Create a new API key
3. Copy the key and set it as LINEAR_API_KEY

## How to Find Team and Project Names

1. Go to your Linear workspace
2. Check the team name in the sidebar
3. Check the project name in the project selector

## How to Find Parent Issue Identifier

1. Go to your parent Linear issue
2. Copy the identifier (e.g., "PRI-25", "ENG-123")
3. Set it as LINEAR_PARENT_IDENTIFIER

## Running the Linear Sync

Once environment variables are set, run:

```bash
cd /Users/prnceb/Desktop/WORK/hello-world
TASKS_FILE=/Users/prnceb/Desktop/WORK/hello-world/specs/011-title-day-0/tasks.md node scripts/linear-sync.js
```

## Generated Tasks Summary

The tasks.md file contains 50 tasks organized into 7 phases:

### Phase 3.1: Setup (T001-T004)
- Create /data/ directory structure
- Update .gitignore
- Configure CI pipeline
- Setup Playwright configuration

### Phase 3.2: Tests First (T005-T012) - TDD Approach
- 5 Contract tests for API endpoints
- 3 Integration tests for core functionality

### Phase 3.3: Core Implementation (T013-T023)
- 6 Entity models (parallel)
- 5 Service implementations

### Phase 3.4: Integration (T024-T030)
- CI pipeline integration
- Artifact handling
- Review packet generation

### Phase 3.5: Repository Hygiene (T031-T035)
- State file migration
- File cleanup
- Documentation updates

### Phase 3.6: Smoke Testing (T036-T042)
- 5 Playwright smoke tests (parallel)
- CI integration

### Phase 3.7: Polish (T043-T050)
- Unit tests
- Performance validation
- Documentation
- Final cleanup

## Parallel Execution Opportunities

The script will create Linear issues with [P] markers for tasks that can run in parallel:

- **T005-T012**: All contract and integration tests
- **T013-T018**: All entity models
- **T036-T040**: All smoke tests
- **T043-T045**: Unit tests for different models
- **T047**: Documentation updates

## Next Steps

1. Set up Linear environment variables
2. Run the linear-sync script
3. Review created sub-issues in Linear
4. Begin implementation following TDD approach (tests first)
5. Use parallel execution where marked [P]
