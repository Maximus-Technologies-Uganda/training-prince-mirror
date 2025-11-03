# Phase 1 Quickstart: Update PR Template for Spec Discipline

## Quick Start Guide: Fill Out the New PR Template

This guide walks you through filling out the updated PR template that requires Spec URL, Figma Dev Mode Link, and acceptance checklist verification.

---

## Prerequisites

Before you start, ensure:
1. ✅ You have created or are working on a feature from a specification (spec.md or Linear ticket)
2. ✅ You understand what a Figma "Dev Mode Link" is, or know why your PR doesn't need one
3. ✅ You have created a PR to the `development` branch

---

## The Updated PR Template

When you create a new PR, you'll see this template auto-populate in the description:

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

## Step-by-Step: Filling Out Each Section

### Step 1: Fill in "Spec URL" (Required)

**What to do:**
1. Locate the `## Spec URL` section in your PR description
2. Replace the placeholder text with the link to your specification

**Valid options:**
- 📄 **GitHub Spec File**: Copy the full GitHub URL to your `spec.md`
  ```
  https://github.com/prnceb/hello-world/blob/development/specs/020-title-week-4/spec.md
  ```
- 🎫 **Linear Ticket ID**: If your work is tracked in Linear, use the ticket ID
  ```
  PRI-2427
  ```
- 🔗 **Any Valid URL**: Link to external specifications if applicable

**Example:**
```markdown
## Spec URL
https://github.com/prnceb/hello-world/blob/development/specs/020-title-week-4/spec.md
```

**What happens if you leave it blank?**
❌ Your PR merge will be **blocked** by validation. You MUST provide a spec URL.

---

### Step 2: Fill in "Figma Dev Mode Link" (Required)

**What to do:**
1. Locate the `## Figma Dev Mode Link` section
2. Choose ONE of these options:

#### Option A: You have UI/design changes
**Provide the Figma link:**

1. Open your Figma design file
2. Click "Share" → Copy the link
3. Ensure it includes `/dev/` or `/design/` (Dev Mode link, not viewing link)
4. Paste into the PR template

**Example:**
```markdown
## Figma Dev Mode Link
https://www.figma.com/design/abc123def456/MyFeature?node-id=123%3A456
```

#### Option B: You DON'T have UI/design changes (Backend-only, infrastructure, testing, etc.)
**Explain why there's no design:**

Use the format: `N/A - {reason}`

**Examples:**
```markdown
## Figma Dev Mode Link
N/A - Backend API enhancement, no UI changes

## OR

N/A - Infrastructure/DevOps work

## OR

N/A - Unit test coverage improvement
```

**You can also use:**
- `n/a` (lowercase)
- `[N/A]` (bracketed)

**What happens if you leave it blank or use just "N/A" without reason?**
⚠️ Your PR validation will check that the field is filled. Simple "N/A" is accepted, but adding a reason is best practice for clarity.

---

### Step 3: Complete the Acceptance Checklist (Informational)

**What to do:**
1. Locate the `## Acceptance Checklist` section
2. Before submitting your PR, verify each item:
   - [ ] Have I ticked all acceptance boxes in my spec.md?
   - [ ] Have I reviewed the Figma design (or marked N/A with reason)?
   - [ ] Does my PR description match my specification?
   - [ ] Am I ready for review?

3. Check the boxes (`[x]`) for items you've completed

**Example:**
```markdown
## Acceptance Checklist
- [x] I have ticked all acceptance boxes in my spec.md
- [x] I have reviewed the Figma design
- [x] My PR description matches my specification
- [x] I am ready for review
```

**What happens if you don't check the boxes?**
✅ No automated block (this is informational). However, reviewers will see unchecked boxes and may ask questions during code review. It's a signal to yourself and reviewers that work isn't complete.

---

### Step 4: Add Change Summary & Related Issues (Optional)

**Change Summary:**
- Briefly describe what your changes do
- Why are they needed?

**Related Issues:**
- Link to the Linear parent issue (if any)
- Link to GitHub issues (if any)

---

## Real-World Examples

### Example 1: Feature PR with UI Changes

```markdown
# Pull Request Description

## Spec URL
https://github.com/prnceb/hello-world/blob/development/specs/020-title-week-4/spec.md

## Figma Dev Mode Link
https://www.figma.com/design/aBc1234567890aBcDeFg/Hello-World-UI?node-id=42%3A123

## Acceptance Checklist
- [x] I have ticked all acceptance boxes in my spec.md
- [x] I have reviewed the Figma design
- [x] My PR description matches my specification
- [x] I am ready for review

## Change Summary
Updated PR template to enforce Spec URL and Figma link requirements per Week 4 feedback.

## Related Issues
- Linear: PRI-2427 (Week 4 Finisher: PR Template Discipline)
```

**Validation Result**: ✅ PASS

---

### Example 2: Backend-Only PR without UI Changes

```markdown
# Pull Request Description

## Spec URL
PRI-2428

## Figma Dev Mode Link
N/A - Backend API route refactoring, no UI changes

## Acceptance Checklist
- [x] I have ticked all acceptance boxes in my spec.md
- [x] Figma N/A verified - no design changes
- [x] My PR description matches my specification
- [x] I am ready for review

## Change Summary
Refactored authentication service to support multi-tenant architecture.

## Related Issues
- Linear: PRI-2428 (Backend: Auth Service Refactor)
```

**Validation Result**: ✅ PASS

---

## Troubleshooting

### ❌ "Spec URL is required"

**What went wrong?**
- You left the Spec URL field empty
- You didn't provide a valid URL or Linear ticket ID

**How to fix:**
1. Edit your PR description
2. Fill in the Spec URL with:
   - A GitHub link (https://github.com/...)
   - A Linear ticket ID (PRI-XXXX)
   - Any other valid URL reference to your spec
3. Click "Update comment"
4. The validation workflow will automatically re-run

---

### ❌ "Figma link is required"

**What went wrong?**
- You left the Figma field completely empty
- You wrote "N/A" but didn't provide any reason (only if required by team policy)

**How to fix:**
1. Edit your PR description
2. Choose ONE:
   - **Add a Figma link**: Paste your design file URL
   - **Explain the N/A**: Write `N/A - {your reason}` (e.g., `N/A - Backend API update`)
3. Click "Update comment"
4. Validation will re-run automatically

---

### ❓ "Validation workflow is pending/running"

**What's happening?**
- GitHub Actions is checking your PR description
- This typically completes in 10-30 seconds

**What to do:**
1. Wait for the workflow to complete
2. Refresh the PR page
3. Check the status indicator (should turn green ✅ if valid, or red ❌ if invalid)

---

### ✅ "Validation passed but I still can't merge"

**What's happening?**
- Your PR template is valid ✅
- But there may be other checks that need to pass (e.g., code review, CI tests)

**What to do:**
1. Check the "Checks" tab for other failing checks
2. Address those separately
3. Once all checks pass, the merge button will be enabled

---

## Tips for Success

1. **Do it right the first time**: Fill out the template completely before submitting. It's easier than fixing it later.

2. **Copy-paste your spec URL**: Don't type it manually; copy from your browser's address bar to avoid typos.

3. **Add context to N/A**: Even if you're doing backend-only work, explaining why (e.g., "N/A - Performance optimization") helps reviewers understand quickly.

4. **Reference the Acceptance Checklist in your spec**: Before ticking boxes in the PR, make sure you've completed the acceptance criteria in your spec.md.

5. **Link to related issues**: If your work is tracked in Linear or GitHub, link it in the PR. Reviewers appreciate the context.

---

## See Also

- 📄 **Spec Template**: `.specify/templates/spec-template.md`
- 🔍 **Validation Details**: `specs/020-title-week-4/contracts/github-pr-template.md`
- 📋 **PR Template Source**: `.github/pull_request_template.md`

---

*Quickstart Complete — Ready for Task Execution*
