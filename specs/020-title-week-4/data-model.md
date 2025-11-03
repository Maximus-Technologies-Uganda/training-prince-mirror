# Phase 1 Data Model: Update PR Template for Spec Discipline

## Entity: PR Template Configuration

### PR Template File State

```
Entity: PullRequestTemplate
├── name: "pull_request_template.md"
├── path: ".github/pull_request_template.md"
├── format: Markdown
├── scope: Applies to all PRs in the repository
│
└── structure:
    ├── Section 1: Spec URL
    │   ├── heading: "## Spec URL"
    │   ├── type: Required (mandatory non-empty)
    │   ├── values_accepted:
    │   │   ├── https://github.com/.../specs/XXX/spec.md
    │   │   ├── https://linear.app/...
    │   │   ├── PRI-XXXX (Linear ticket ID)
    │   │   └── Any valid URL/ticket ID reference
    │   ├── placeholder: "Link to the specification document (e.g., https://github.com/prnceb/hello-world/blob/development/specs/020-title-week-4/spec.md or Linear ticket PRI-2427)"
    │   ├── helper_text: "Every PR must reference a spec. Provide the link to your spec.md or the Linear parent ticket."
    │   └── validation:
    │       ├── rule: Non-empty (length > 0)
    │       ├── pattern: /^https?:\/\/.+$|^PRI-\d+$/
    │       ├── error_message: "Spec URL is required. Please provide a link to your specification or Linear ticket."
    │       └── enforcement: HARD - merge blocked if empty
    │
    ├── Section 2: Figma Dev Mode Link
    │   ├── heading: "## Figma Dev Mode Link"
    │   ├── type: Mandatory-but-nullable (must fill, can be N/A)
    │   ├── values_accepted:
    │   │   ├── https://www.figma.com/...
    │   │   ├── N/A
    │   │   ├── N/A - Backend API update (no UI changes)
    │   │   ├── [N/A]
    │   │   └── n/a
    │   ├── placeholder: "Link to Figma design in dev mode, or 'N/A - {reason}' if no design changes"
    │   ├── helper_text: "Link to the design file for reviewers. If there are no UI changes, explain why (e.g., 'N/A - Backend API only'). Figma field must never be left blank."
    │   └── validation:
    │       ├── rule: Non-empty AND (valid_url OR valid_na_pattern)
    │       ├── url_pattern: /^https?:\/\/.+figma\.com\/.+/
    │       ├── na_pattern: /^(N\/A|n\/a|\[N\/A\])(\s*-\s*.+)?$/
    │       ├── combined: (url_pattern OR na_pattern) AND length > 0
    │       ├── error_message: "Figma link is required. Provide a valid Figma URL or enter 'N/A - {reason}' for non-UI work."
    │       └── enforcement: HARD - merge blocked if empty or invalid
    │
    └── Section 3: Acceptance Checklist
        ├── heading: "## Acceptance Checklist"
        ├── type: Verification (not validated, informational)
        ├── items:
        │   ├── [ ] I have ticked all acceptance boxes in my spec.md
        │   ├── [ ] I have reviewed the Figma design (or marked N/A with reason)
        │   ├── [ ] My PR description matches my specification
        │   └── [ ] I am ready for review
        ├── helper_text: "Before submitting, verify you have completed all acceptance criteria in your specification."
        └── validation:
            ├── rule: None (informational only - no automated check)
            ├── responsibility: Developer review before submit
            └── enforcement: SOFT - reviewer verification during code review
```

---

## Entity: PR Validation Workflow

### GitHub Actions Workflow State

```
Entity: PRValidationWorkflow
├── name: "validate-pr-template.yml"
├── path: ".github/workflows/validate-pr-template.yml"
├── trigger: pull_request (opened, synchronize, reopened)
├── runtime: ubuntu-latest
│
└── validation_logic:
    ├── step_1_parse_body:
    │   ├── action: github-script@v7
    │   ├── input: context.payload.pull_request.body
    │   └── output: body_text (markdown)
    │
    ├── step_2_validate_spec_url:
    │   ├── rule: Extract "## Spec URL" section, check non-empty
    │   ├── regex: /^## Spec URL\s*\n+(.+?)(?=##|$)/ms
    │   ├── pattern_match: /^(https?:\/\/.+|PRI-\d+)$/
    │   ├── result: PASS | FAIL
    │   └── error: "Spec URL field is empty or invalid format"
    │
    ├── step_3_validate_figma_link:
    │   ├── rule: Extract "## Figma Dev Mode Link" section, check non-empty AND (URL or N/A)
    │   ├── regex: /^## Figma Dev Mode Link\s*\n+(.+?)(?=##|$)/ms
    │   ├── url_pattern: /^https?:\/\/.+figma\.com\/.+$/
    │   ├── na_pattern: /^(N\/A|n\/a|\[N\/A\])(\s*-\s*.+)?$/
    │   ├── combined_check: (url_pattern OR na_pattern) AND length > 0
    │   ├── result: PASS | FAIL
    │   └── error: "Figma field must be a valid Figma URL or 'N/A - {reason}'"
    │
    ├── step_4_overall_result:
    │   ├── all_pass: true
    │   ├── status: "success"
    │   └── action: Set workflow check to SUCCESS
    │
    └── step_5_on_failure:
        ├── status: "failure"
        ├── action: Set workflow check to FAILURE
        ├── post_comment: true
        └── comment_content: "❌ PR Template Validation Failed\n\nPlease fix the following:\n- [errors list]\n\nSee docs for details."
```

---

## Entity: Branch Protection Rule

### GitHub Branch Protection State

```
Entity: BranchProtectionRule (development branch)
├── branch: "development"
├── protection_enabled: true
│
└── requirements:
    ├── required_status_checks:
    │   ├── enabled: true
    │   ├── strict: true (dismiss stale checks on new pushes)
    │   └── required_checks:
    │       └── "validate-pr-template / validate" ← must pass before merge
    │
    ├── required_review:
    │   ├── enabled: false (not part of this feature)
    │   └── note: "May be required separately"
    │
    └── enforcement:
        ├── dismiss_stale_reviews: false
        ├── allow_force_pushes: false
        ├── allow_deletions: false
        └── allow_auto_merge: true
```

---

## Validation Flow Diagram

```
Developer creates PR
    ↓
GitHub auto-populates template
    ↓
Developer fills 3 sections (Spec URL, Figma, Checklist)
    ↓
PR submitted
    ↓
GitHub fires: pull_request.opened event
    ↓
Workflow: validate-pr-template.yml triggered
    ↓
    ├─→ Parse PR body
    ├─→ Extract "## Spec URL" section
    ├─→ Regex validate: non-empty + valid URL/Linear ID
    │   └─→ FAIL? → Set check FAILURE, post comment
    │   └─→ PASS? → Continue
    │
    ├─→ Extract "## Figma Dev Mode Link" section
    ├─→ Regex validate: non-empty + (valid URL OR valid N/A pattern)
    │   └─→ FAIL? → Set check FAILURE, post comment
    │   └─→ PASS? → Continue
    │
    └─→ All checks pass?
        └─→ YES → Set check SUCCESS
        └─→ NO → Set check FAILURE
    ↓
Branch Protection Rule reads check status
    ↓
    ├─→ Status = SUCCESS? → Allow merge
    └─→ Status = FAILURE? → Block merge, show error
```

---

## State Transitions

### PR Lifecycle with Template Validation

| State | Trigger | Action | Next State |
|-------|---------|--------|-----------|
| Draft | Developer creates PR | Auto-populate template | Template Filled |
| Template Filled | Developer fills sections | Validation workflow runs | Validating |
| Validating | Workflow parses body | Checks: Spec URL, Figma | Validation Result |
| Valid | All checks pass | Set status SUCCESS | Ready to Merge |
| Invalid | Any check fails | Set status FAILURE, post comment | Needs Fixes |
| Needs Fixes | Developer updates PR body | Workflow re-runs (on synchronize event) | Validating |
| Ready to Merge | All validations pass + other checks pass | Merge button enabled | Merged |
| Merged | Developer clicks merge | PR merged to development | Closed |

---

## Key Validation Rules Summary

| Field | Required? | Format | Validation | Blocking? |
|-------|-----------|--------|-----------|-----------|
| Spec URL | YES | URL or PRI-ID | Non-empty + regex match | YES (hard) |
| Figma Link | YES | URL or N/A | Non-empty + (URL pattern OR "N/A - reason") | YES (hard) |
| Acceptance Checklist | NO | Checkboxes | Informational only | NO (soft) |

---

*Phase 1 Data Model Complete — Ready for Phase 1 Contracts & Quickstart*
