# Contract: GitHub PR Template Validation

**Status**: Reference (Configuration Contract)  
**Purpose**: Document the PR template schema, field requirements, and CI validation rules  
**Implementation**: GitHub Actions workflow + PR template markdown

---

## PR Template Schema

### File: `.github/pull_request_template.md`

```markdown
# Pull Request Description

## Spec URL
Link to the specification (required):
- GitHub: https://github.com/.../specs/XXX/spec.md
- Linear: PRI-2427

**Example**: https://github.com/prnceb/hello-world/blob/development/specs/020-title-week-4/spec.md

## Figma Dev Mode Link
Link to Figma design or N/A explanation (required):
- Design: https://www.figma.com/design/...
- N/A: N/A - Backend API update (no UI changes)

**Note**: This field must always be filled. Provide either a Figma link or explain why no design is needed.

## Acceptance Checklist
- [ ] I have ticked all acceptance boxes in my spec.md
- [ ] I have reviewed the Figma design (or marked N/A with reason)
- [ ] My PR description matches my specification
- [ ] I am ready for review

## Change Summary
[Describe your changes here]

## Related Issues
- Linear: [Link to parent issue]
- GitHub: [Link to related GitHub issues if any]
```

---

## Validation Contract

### Workflow: `.github/workflows/validate-pr-template.yml`

**Trigger**: `pull_request` event (opened, synchronize, reopened)

**Validation Rules**:

#### Field 1: Spec URL
- **Type**: Required (mandatory, non-empty)
- **Format**: Valid URL or Linear ticket ID
- **Regex Pattern**: 
  ```regex
  /^(https?:\/\/.+|PRI-\d+)$/
  ```
- **Validation Logic**: 
  1. Extract text after "## Spec URL" heading
  2. Trim whitespace
  3. Check non-empty (length > 0)
  4. Match regex pattern
  5. PASS if all checks succeed, FAIL otherwise

- **Error Message**: 
  ```
  ❌ Spec URL is required and must be a valid URL or Linear ticket ID (PRI-XXXX)
  Please provide the link to your specification (e.g., https://github.com/.../specs/XXX/spec.md or PRI-2427)
  ```

#### Field 2: Figma Dev Mode Link
- **Type**: Mandatory-but-nullable (must fill, can be "N/A")
- **Format**: Valid Figma URL OR "N/A" pattern with optional reason
- **Regex Patterns**:
  - URL: `/^https?:\/\/.+figma\.com\/.+$/`
  - N/A (simple): `/^(N\/A|n\/a)$/`
  - N/A (with reason): `/^(N\/A|n\/a|N\/A|n\/a)\s*-\s*.+$/`
  - Bracketed: `/^\[N\/A\]$/`

- **Validation Logic**:
  1. Extract text after "## Figma Dev Mode Link" heading
  2. Trim whitespace
  3. Check non-empty (length > 0)
  4. Check matches EITHER: URL pattern OR N/A pattern
  5. PASS if both non-empty AND pattern match, FAIL otherwise

- **Error Message**:
  ```
  ❌ Figma link is required. Please provide either:
     • A valid Figma URL (e.g., https://www.figma.com/design/...)
     • OR 'N/A - {reason}' for non-UI work (e.g., 'N/A - Backend API update')
  ```

#### Field 3: Acceptance Checklist
- **Type**: Informational (no automated validation)
- **Format**: Markdown checkboxes
- **Validation**: None (developer responsibility, human review)
- **Note**: Reviewers verify during code review

---

## Validation Scenarios

### Valid PR Examples

**Scenario 1: Feature with Figma Design**
```markdown
## Spec URL
https://github.com/prnceb/hello-world/blob/development/specs/020-title-week-4/spec.md

## Figma Dev Mode Link
https://www.figma.com/design/abcdef123456

## Acceptance Checklist
- [x] I have ticked all acceptance boxes in my spec.md
- [x] I have reviewed the Figma design
- [x] My PR description matches my specification
- [x] I am ready for review
```
**Validation Result**: ✅ PASS

---

**Scenario 2: Backend-Only Work with N/A**
```markdown
## Spec URL
PRI-2427

## Figma Dev Mode Link
N/A - Backend API enhancement, no UI changes

## Acceptance Checklist
- [x] I have ticked all acceptance boxes in my spec.md
- [x] Figma N/A verified - no UI changes
- [x] My PR description matches my specification
- [x] I am ready for review
```
**Validation Result**: ✅ PASS

---

### Invalid PR Examples

**Scenario 3: Missing Spec URL**
```markdown
## Spec URL
[blank or placeholder text]

## Figma Dev Mode Link
https://www.figma.com/design/xyz789
```
**Validation Result**: ❌ FAIL - Spec URL required

---

**Scenario 4: Empty Figma Field**
```markdown
## Spec URL
https://github.com/prnceb/hello-world/blob/development/specs/020-title-week-4/spec.md

## Figma Dev Mode Link
[blank]
```
**Validation Result**: ❌ FAIL - Figma field required (must have URL or "N/A - reason")

---

**Scenario 5: Invalid Figma N/A Format**
```markdown
## Spec URL
https://github.com/...

## Figma Dev Mode Link
N/A
[No explanation provided]
```
**Validation Result**: ⚠️ PASS (single "N/A" is valid; explanation is optional)

---

## GitHub Actions Workflow Implementation

### File: `.github/workflows/validate-pr-template.yml`

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
            const errors = [];

            // Validate Spec URL
            const specUrlMatch = body.match(/^## Spec URL\s*\n+(.+?)(?=^##|\Z)/ms);
            const specUrlValue = specUrlMatch ? specUrlMatch[1].trim() : '';
            const specUrlPattern = /^(https?:\/\/.+|PRI-\d+)$/;
            
            if (!specUrlValue || !specUrlPattern.test(specUrlValue)) {
              errors.push('❌ Spec URL is required (URL or PRI-XXXX format)');
            }

            // Validate Figma Link
            const figmaMatch = body.match(/^## Figma Dev Mode Link\s*\n+(.+?)(?=^##|\Z)/ms);
            const figmaValue = figmaMatch ? figmaMatch[1].trim() : '';
            const figmaUrlPattern = /^https?:\/\/.+figma\.com\/.+$/;
            const figmaNAPattern = /^(N\/A|n\/a|\[N\/A\])(\s*-\s*.+)?$/;
            const isFigmaValid = figmaUrlPattern.test(figmaValue) || figmaNAPattern.test(figmaValue);
            
            if (!figmaValue || !isFigmaValid) {
              errors.push('❌ Figma link is required (URL or N/A with reason)');
            }

            // Report results
            if (errors.length > 0) {
              core.setFailed('PR Template Validation Failed:\n' + errors.join('\n'));
              
              // Post comment on PR
              github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: '⚠️ **PR Template Validation Failed**\n\n' + errors.join('\n') + '\n\nPlease update your PR description and try again.'
              });
            } else {
              core.info('✅ PR Template Validation Passed');
            }
```

---

## Branch Protection Rule Configuration

**Branch**: `development`

**Required Status Check**: `validate-pr-template / validate`

**Configuration Steps**:
1. Go to Repository Settings → Branches
2. Add/Edit branch protection rule for `development`
3. Check: "Require status checks to pass before merging"
4. Add required check: `validate-pr-template / validate`
5. Save

---

## Error Handling & Recovery

| Error | Cause | Resolution |
|-------|-------|-----------|
| "Spec URL is required" | Field empty or invalid format | Update PR description with valid spec URL or Linear ticket ID |
| "Figma link is required" | Field empty, invalid URL, or invalid N/A format | Provide Figma URL or enter "N/A - {reason}" |
| Workflow fails silently | GitHub API permission issue | Verify workflow has proper GitHub token permissions |
| Merge button stays disabled | Check status shows "pending" | Wait for workflow to complete; refresh page if needed |

---

*Contract Phase 1 Complete — Ready for Quickstart*
