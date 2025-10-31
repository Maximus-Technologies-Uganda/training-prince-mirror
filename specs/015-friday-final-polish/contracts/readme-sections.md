# README Sections Contract

**Purpose**: This document defines the exact markdown sections to be added to the main README.md file during Phase 2 implementation of the Friday Final Polish feature.

---

## Section 1: UI Component Library

This section documents all reusable UI components organized by type, showing cross-application usage and implementation details.

### Markdown Template

```markdown
## UI Component Library

All reusable UI components are organized by type below. Each component lists the applications where it is used, file location, and usage examples.

### Buttons

**Primary Button**
- **File**: `frontend/src/components/buttons.js`
- **Used in**: Quote, Temperature Converter, Expense Tracker, To-Do List, Stopwatch
- **CSS Classes**: `btn btn-primary`
- **CSS Variables**: `--color-primary`, `--spacing-md`, `--typography-button`
- **Example Usage**: 
  ```html
  <button class="btn btn-primary">Click me</button>
  ```
- **Accessibility**: Native button element, supports keyboard navigation and screen readers

**Secondary Button**
- **File**: `frontend/src/components/buttons.js`
- **Used in**: Quote, Expense Tracker, To-Do List
- **CSS Classes**: `btn btn-secondary`
- **Example Usage**: 
  ```html
  <button class="btn btn-secondary">Cancel</button>
  ```

### Inputs

**Form Input**
- **File**: `frontend/src/components/inputs.js`
- **Used in**: Quote, Temperature Converter, Expense Tracker, To-Do List
- **CSS Classes**: `form-input`
- **Example Usage**: 
  ```html
  <input class="form-input" type="text" placeholder="Enter text">
  ```

**Text Area**
- **File**: `frontend/src/components/inputs.js`
- **Used in**: Expense Tracker, To-Do List
- **CSS Classes**: `form-textarea`
- **Example Usage**: 
  ```html
  <textarea class="form-textarea" rows="4"></textarea>
  ```

### Cards

**Card Container**
- **File**: `frontend/src/components/cards.js`
- **Used in**: Quote, Expense Tracker, To-Do List
- **CSS Classes**: `card`
- **Example Usage**: 
  ```html
  <div class="card">
    <h2>Card Title</h2>
    <p>Card content goes here</p>
  </div>
  ```

### Modals

**Confirm Modal**
- **File**: `frontend/src/components/modals.js`
- **Used in**: To-Do List, Stopwatch
- **CSS Classes**: `modal modal-confirm`
- **Accessibility**: Dialog element with keyboard navigation

### Lists

**Item List**
- **File**: `frontend/src/components/lists.js`
- **Used in**: To-Do List, Expense Tracker
- **CSS Classes**: `item-list item-row`
- **Example Usage**: 
  ```html
  <ul class="item-list">
    <li class="item-row">Item 1</li>
    <li class="item-row">Item 2</li>
  </ul>
  ```

### Other Components

**Checkbox**
- **File**: `frontend/src/components/checkboxes.js`
- **Used in**: To-Do List
- **CSS Classes**: `checkbox`

**Badge**
- **File**: `frontend/src/components/badges.js`
- **Used in**: Temperature Converter, Stopwatch, Expense Tracker
- **Example Usage**: 
  ```html
  <span class="badge badge-success">Active</span>
  ```

---
```

---

## Section 2: Design System Tokens

This section documents all design tokens organized by category (colors, spacing, typography, shadows, borders), showing token names, values, and usage context.

### Markdown Template

```markdown
## Design System Tokens

All design tokens are defined in the **Figma design library** and serve as the single source of truth for visual consistency across all five applications. CSS implementations must use these canonical values to maintain consistency.

### Colors

| Token Name | Value | Usage |
|-----------|-------|-------|
| `color/text/primary` | `#333333` | Primary text in headings and body copy |
| `color/text/secondary` | `#666666` | Secondary text for labels and hints |
| `color/background/primary` | `#ffffff` | Primary background for content areas |
| `color/background/secondary` | `#f5f5f5` | Secondary background for differentiation |
| `color/border/primary` | `#e0e0e0` | Borders for form inputs and cards |
| `color/status/success` | `#10b981` | Success states and positive feedback (green) |
| `color/status/error` | `#ef4444` | Error states and validation failures (red) |
| `color/status/warning` | `#f59e0b` | Warning states and alerts (orange) |
| `color/status/info` | `#3b82f6` | Informational messages and neutral alerts (blue) |

### Spacing

| Token Name | Value | Usage |
|-----------|-------|-------|
| `spacing/xs` | `4px` | Extra small gaps between tightly related elements |
| `spacing/sm` | `8px` | Small gaps between related components |
| `spacing/md` | `16px` | Medium gaps for standard component spacing |
| `spacing/lg` | `24px` | Large gaps between major sections |
| `spacing/xl` | `32px` | Extra large gaps for significant vertical spacing |
| `spacing/xxl` | `48px` | Extra extra large gaps for page-level spacing |

### Typography

| Token Name | Value | Usage |
|-----------|-------|-------|
| `typography/heading/h1` | `32px bold` | Large page headings and major titles |
| `typography/heading/h2` | `24px bold` | Secondary headings and section titles |
| `typography/heading/h3` | `18px semi-bold` | Tertiary headings and subsection titles |
| `typography/body` | `14px regular` | Body text and regular content |
| `typography/body/small` | `12px regular` | Small body text for secondary content |
| `typography/button` | `14px semi-bold` | Button and call-to-action text |
| `typography/caption` | `11px regular` | Captions and small text labels |

### Shadows

| Token Name | Value | Usage |
|-----------|-------|-------|
| `shadow/sm` | `0 1px 2px rgba(0, 0, 0, 0.05)` | Subtle shadows for slight elevation |
| `shadow/md` | `0 4px 6px rgba(0, 0, 0, 0.1)` | Medium shadows for normal card elevation |
| `shadow/lg` | `0 10px 15px rgba(0, 0, 0, 0.1)` | Large shadows for modal and overlay elevation |

### Borders

| Token Name | Value | Usage |
|-----------|-------|-------|
| `border/radius/sm` | `4px` | Subtle rounding for slight curvature |
| `border/radius/md` | `8px` | Standard rounding for most components |
| `border/radius/lg` | `16px` | Significant rounding for prominent elements |

---

### Source of Truth

All design tokens are defined in the **Figma design library** and represent the canonical values for visual consistency. The CSS implementations in the codebase must match these token values exactly to ensure consistency across all applications.

To view or update tokens:
1. Access the Figma design library (team credentials required)
2. Navigate to the Design Tokens file
3. Export or review token definitions by category

Any discrepancies between code implementations and Figma token values should be corrected by updating the code to match the Figma canonical values.

---
```

---

## Integration Notes

### When Adding to README

1. **Location**: Add these two sections after the project overview/getting started sections, before any API or technical documentation sections.

2. **Formatting**: 
   - Use heading level 2 (`##`) for section titles
   - Use heading level 3 (`###`) for subsections and component types
   - Use bold for component names and emphasis
   - Use code blocks for HTML examples
   - Use tables for token documentation for better readability

3. **Structure Order**:
   - First: UI Component Library section (component inventory)
   - Second: Design System Tokens section (token documentation)
   - Source of Truth note at the end

4. **Length Estimates**:
   - Component Library section: 80-120 lines of markdown
   - Design System Tokens section: 60-100 lines of markdown
   - Total additions: ~200 lines (well under the 300 LOC PR limit when combined with spec file)

5. **Maintainability**:
   - Keep component examples as minimal HTML snippets
   - Update token table if Figma library changes
   - Document new components when added to the library
   - Maintain alphabetical order within sections for consistency

---

## Validation Checklist

When these sections are added to README, verify:

- [ ] Component inventory lists all reusable components (15-25 expected)
- [ ] Components are organized by type (buttons, inputs, cards, modals, lists, other)
- [ ] Each component includes: name, file location, applications using it, CSS classes, example usage
- [ ] Design tokens are organized by category (colors, spacing, typography, shadows, borders)
- [ ] Each token includes: token name, value, and usage description
- [ ] All colors match Figma token values (9 colors in example)
- [ ] All spacing values match Figma tokens (6 spacing tokens in example)
- [ ] All typography rules match Figma definitions (7 typography tokens in example)
- [ ] Source of Truth note is clearly visible at the end of tokens section
- [ ] No hardcoded CSS values are used that don't correspond to a token
- [ ] Markdown formatting is consistent with rest of README
- [ ] No broken links or missing code examples

---

## Document Metadata

- **Version**: 1.0
- **Last Updated**: October 28, 2025
- **Owner**: Friday Final Polish Feature Team
- **Status**: Ready for Phase 2 Implementation
