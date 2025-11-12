# Phase 0 Research: Default Branch Hygiene

## Research Summary

This feature is a **repository configuration task** that switches the GitHub default branch from `main` to `development`. No code changes are required; only repository settings adjustment.

---

## Research Topic 1: GitHub Default Branch Mechanism

### Decision
Use GitHub repository settings web UI to change the default branch from `main` to `development`.

### Rationale
- **GitHub Standard Practice**: The web UI is the documented, standard interface for repository configuration
- **Simplicity**: One-time configuration change; no need for API automation
- **Auditability**: Changes are logged in GitHub's activity audit log and visible in repository settings
- **Accessibility**: All team members with admin access can verify and understand the change

### Alternatives Considered
1. **GitHub API v3** (`PATCH /repos/{owner}/{repo}`)
   - **Pros**: Automatable, scriptable
   - **Cons**: Adds unnecessary complexity for a one-time configuration change; requires authentication management; less transparent to team
   - **Rejected Because**: Manual UI approach is sufficient and more maintainable for infrequent operations

2. **Git commands** (`git symbolic-ref refs/remotes/origin/HEAD`)
   - **Pros**: Scriptable from command line
   - **Cons**: Git commands work on local repository state, not the remote repository's default branch setting; this is a platform-level configuration, not a git-level operation
   - **Rejected Because**: Git doesn't control repository platform settings; must use GitHub settings

### Best Practice
GitHub recommends using the web UI for repository settings. API is provided for high-frequency automation scenarios (e.g., infrastructure-as-code for multiple repos), but is not necessary here.

---

## Research Topic 2: Verification & Documentation Method

### Decision
Manual verification via GitHub UI with screenshot documentation in PR description.

### Rationale
- **Matches Clarification**: Aligns with clarification requirement (Option D - Manual + screenshot)
- **Auditability**: Screenshot provides visual proof of change at specific point in time
- **No Overhead**: Avoids adding scripts or tools for a simple verification step
- **Team Understanding**: Visual confirmation is immediately understandable to reviewers

### Alternatives Considered
1. **Automated GitHub API Script**
   - **Pros**: Could verify state programmatically
   - **Cons**: Adds complexity; overkill for one-time verification; requires CI/CD integration
   - **Rejected Because**: Manual screenshot is simpler and equally auditable

2. **Git `symbolic-ref` Local Check**
   - **Pros**: Can be run locally after cloning
   - **Cons**: Requires developer environment setup; not visible in repository history; doesn't prove the change was made via UI
   - **Rejected Because**: UI screenshot is more direct and verifiable

### Best Practice
For configuration changes on public repositories, include visual documentation (screenshot) in PR description. This provides:
- Audit trail in PR history
- Visual proof of change for reviewers
- No ongoing maintenance burden

---

## Technical Prerequisites

Before implementing this feature, verify:
1. ✅ `development` branch exists and contains current documentation
2. ✅ `development` branch README.md includes the "How to review me" section
3. ✅ User performing the change has admin access to the GitHub repository
4. ✅ No branch protection rules prevent changing the default branch setting

---

## Reference Resources

- [GitHub: Setting the default branch](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-in-your-repository/changing-the-default-branch)
- [GitHub: Repository settings](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features)

---
