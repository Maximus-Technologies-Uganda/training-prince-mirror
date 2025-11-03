# Phase 0 Research: Update PR Template for Spec Discipline

## Research Summary

This feature requires understanding GitHub's PR template capabilities, GitHub Actions for CI validation, and branch protection rules configuration. The goal is to implement hard-enforced validation that blocks PR merges if mandatory template fields (Spec URL, Figma Link) are not filled.

---

## Research Topic 1: GitHub PR Template Mechanism & Validation Capabilities

### Decision
Use GitHub Actions (`actions/github-script`) with custom validation logic to parse PR body and enforce field requirements. GitHub does not natively support template field validation; validation must be implemented via CI.

### Rationale
- **GitHub PR Template Limitation**: GitHub's native PR template mechanism only provides UI convenience (pre-populates description). It cannot programmatically enforce field presence or format.
- **Custom CI Validation**: GitHub Actions can read PR body via `github.context.payload.pull_request.body` and validate field presence via regex.
- **Simplicity**: Using `actions/github-script` (built-in GitHub Action) avoids external dependencies.
- **Standard Practice**: Field validation in PR body is common in industry; patterns well-established.

### Alternatives Considered
1. **Native GitHub Settings** → Rejected: No field-level validation support in GitHub's web UI
2. **Third-party Bot** (e.g., Probot) → Rejected: Adds external dependency; simpler to use GitHub Actions
3. **Manual Branch Protection Rule** → Rejected: Cannot reference PR body; workflow checks are only option
4. **Webhook Integration** → Rejected: Over-engineered for this use case

### Implementation Pattern
```
1. Developer creates PR → GitHub auto-populates template
2. Developer fills Spec URL, Figma Link, ticks acceptance boxes
3. PR created → Trigger GitHub Actions workflow
4. Workflow parses PR body via github-script
5. Validates: Spec URL non-empty, Figma Link non-empty (or "N/A" + justification)
6. If validation passes → Set check status: SUCCESS
7. If validation fails → Set check status: FAILURE + post comment with guidance
8. Branch protection rule requires check: SUCCESS (blocks merge if failed)
```

---

## Research Topic 2: GitHub Actions Workflow Configuration for PR Validation

### Decision
Use `actions/github-script@v7` to implement validation logic. Workflow triggers on `pull_request` events (opened, synchronize, reopened).

### Rationale
- **Event Trigger**: `pull_request` event fires when PR is opened or updated
- **GitHub Script**: Provides JavaScript runtime with access to GitHub API and PR context
- **Validation Logic**: Simple regex patterns can detect field presence
- **Error Reporting**: Workflow can post comments on PR with guidance

### Alternatives Considered
1. **Shell Script in Workflow** → Viable but more error-prone for regex parsing
2. **Node.js Script** → More complex; `github-script` handles Node.js execution already
3. **Python Script** → Overkill for simple validation; GitHub Actions lacks native Python
4. **Manual Approval** → Rejects hard enforcement goal

### Implementation Pattern
```yaml
name: Validate PR Template
on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v7
        with:
          script: |
            const body = context.payload.pull_request.body || '';
            
            // Validate Spec URL (non-empty)
            const specUrlPattern = /^## Spec URL.*\n(https?:\/\/|PRI-)/mi;
            const hasSpecUrl = specUrlPattern.test(body);
            
            // Validate Figma Link (non-empty or N/A)
            const figmaPattern = /^## Figma Dev Mode Link.*\n(https?:\/\/|N\/A.*)/mi;
            const hasFigmaLink = figmaPattern.test(body);
            
            if (!hasSpecUrl || !hasFigmaLink) {
              core.setFailed('PR template validation failed');
            }
```

---

## Research Topic 3: Branch Protection Rules & Merge Blocking

### Decision
Add required status check to branch protection rule on `development` branch. Check is named `validate / validate` and must pass before merge is allowed.

### Rationale
- **Merge Gate**: Required status checks are GitHub's standard mechanism for blocking merges
- **Development Branch**: All PRs merge to development; protection rule here ensures all code passes validation
- **No Manual Bypass**: Required checks cannot be bypassed (only admin override, with audit trail)

### Alternatives Considered
1. **Direct Branch Setting** → Not available; protection rules are only merge gate option
2. **CODEOWNERS Approval** → Can be bypassed; doesn't meet "hard enforcement" goal
3. **Webhook on Repository** → Over-engineered; protection rules sufficient

### Configuration Steps
1. Go to Repository Settings → Branches
2. Add rule for branch `development`
3. Enable: "Require status checks to pass before merging"
4. Add required check: `validate / validate`
5. Save

---

## Research Topic 4: Edge Case Handling - "N/A" Detection for Figma Field

### Decision
Accept three patterns as valid "N/A" entries:
- `N/A` (case-insensitive)
- `N/A - {reason}` (must have dash and reason)
- `[N/A]` (bracketed)

Validation regex: `(?i)(N\/A|n\/a|\[N\/A\]|\bN\/A\s*-\s*.+)` with requirement that text is non-empty.

### Rationale
- **Flexibility**: Developers may use different formats; accept common variations
- **Justification Required**: For "N/A - {reason}" pattern, require text after dash to ensure thoughtful entry
- **Consistency**: Enforce single standard via validation error message

### Validation Logic
```javascript
const figmaLinkValue = body.match(/^## Figma Dev Mode Link.*\n(.+)$/mi)?.[1] || '';
const isValidNA = /^(N\/A|N\/a|n\/a|\[N\/A\])(\s*-\s*.+)?$/.test(figmaLinkValue.trim());
const isValidURL = /^https?:\/\/.+$/.test(figmaLinkValue.trim());
const isFigmaValid = isValidNA || isValidURL;

if (!isFigmaValid) {
  core.setFailed('Figma field must be a valid URL or N/A with reason');
}
```

---

## Summary of Decisions

| Topic | Decision | Confidence |
|-------|----------|------------|
| Validation Method | GitHub Actions + github-script | High - standard, no external deps |
| Enforcement | Required status check on branch protection | High - GitHub best practice |
| Figma Handling | Mandatory-but-nullable, accepts N/A patterns | High - matches clarification Q2 |
| Error Handling | Post comment on PR + set check failed | High - clear UX |
| No Bypass | Admin-override only (audit trail) | High - constitutional requirement |

---

*Research Phase 0 Complete — Ready for Phase 1 Design*
