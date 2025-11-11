# Phase 1 Data Model: Default Branch Hygiene

## Entity: GitHub Repository Configuration

### Repository State (Before)
```
Repository: prnceb/hello-world
├── name: "hello-world"
├── owner: "prnceb"
├── default_branch: "main"  ← Current setting
├── branches:
│   ├── main (current default)
│   │   ├── status: DEFAULT_BRANCH
│   │   ├── protected: true (branch protection rules may exist)
│   │   ├── last_commit: <commit hash>
│   │   └── contains:
│   │       ├── README.md (outdated - doesn't have "How to review me" section)
│   │       ├── legacy state files (may include todo.json, expenses.json, etc.)
│   │       └── other artifacts
│   │
│   └── development (not default)
│       ├── status: BRANCH
│       ├── protected: true (branch protection rules may exist)
│       ├── last_commit: <commit hash>
│       └── contains:
│           ├── README.md (current - includes "How to review me" section)
│           ├── frontend/ (up-to-date)
│           ├── src/ (up-to-date)
│           └── other artifacts
```

### Repository State (After)
```
Repository: prnceb/hello-world
├── name: "hello-world"
├── owner: "prnceb"
├── default_branch: "development"  ← NEW setting
├── branches:
│   ├── main (no longer default)
│   │   ├── status: BRANCH (NOT_DEFAULT)
│   │   ├── protected: true (unchanged)
│   │   ├── content: UNCHANGED (per clarification)
│   │   └── note: "Legacy default branch - maintained for backwards compatibility"
│   │
│   └── development (now default)
│       ├── status: DEFAULT_BRANCH  ← CHANGED
│       ├── protected: true (unchanged)
│       ├── last_commit: (as verified in prerequisites)
│       └── contains:
│           ├── README.md (current - includes "How to review me" section)
│           ├── frontend/ (current)
│           ├── src/ (current)
│           └── other artifacts
```

---

## Entity Attributes

### Default Branch Setting
- **Type**: String enum
- **Valid Values**: `"main"`, `"development"` (any branch name technically)
- **Current Value**: `"main"`
- **Target Value**: `"development"`
- **Constraints**:
  - Target branch must exist in repository
  - User must have admin access to repository
  - No automation or scripts required
  - Change is platform-level (GitHub), not git-level

### Branch Configuration
Each branch has these properties:
- **name**: String (e.g., "main", "development")
- **is_default**: Boolean (only one branch can be default)
- **protection_rules**: Object (unchanged for this feature)
- **last_commit_hash**: String (not changed by this feature)

---

## State Transition Rules

### Transition: Main → Development Default
**Preconditions**:
1. Repository exists
2. `development` branch exists
3. `development` branch README.md contains "How to review me" section
4. User has admin access
5. No active deployments depend on `main` being default

**Transition Steps**:
1. Navigate to GitHub repository Settings
2. Locate "Default branch" setting
3. Select `development` from dropdown
4. Confirm change
5. GitHub applies change immediately

**Postconditions**:
1. `default_branch` setting is now `"development"`
2. New clones default to `development` branch
3. `main` branch remains unchanged (per clarification)
4. Branch protection rules remain intact
5. All team members can see the change in repository Settings page

---

## Validation Rules

| Rule | Type | Value | Enforced By |
|------|------|-------|------------|
| Default branch exists | Precondition | `development` branch exists | GitHub (prevents invalid selection) |
| One default per repo | Invariant | Only one branch can be default | GitHub (enforced) |
| No automation required | Design | Manual UI change | This feature |
| Verification included | Postcondition | Screenshot in PR description | Manual review |

---

## No Code Changes
This feature does NOT modify:
- Source code in `src/`, `frontend/`, `backend/`
- Any `.js`, `.ts`, `.md` files (except PR documentation)
- Git history or commits
- File contents on either branch

This is a **configuration-only change** at the GitHub repository platform level.

---
