# Phase 1: Data Model

**Date**: October 28, 2025  
**Feature**: Friday Final Polish and Documentation Export  
**Status**: ✅ COMPLETE

---

## Entities

### Entity 1: UI Component

A reusable visual element that appears in one or more of the five UI applications.

**Schema**:
```
{
  "id": "unique_identifier",
  "name": "PrimaryButton",
  "type": "button | input | card | modal | list | other",
  "description": "Short description of purpose and usage",
  "file_location": [
    "path/to/component.js",
    "path/to/component.css"
  ],
  "applications": [
    "Quote",
    "Temperature Converter",
    "Expense Tracker",
    "To-Do List",
    "Stopwatch"
  ],
  "styling": {
    "css_classes": ["btn", "btn-primary"],
    "css_variables": ["--color-primary", "--spacing-md"],
    "inline_styles": "optional if applicable"
  },
  "props_configuration": {
    "size": "small | medium | large",
    "variant": "primary | secondary | danger",
    "disabled": "boolean",
    "loading": "boolean"
  },
  "example_usage": "<button class='btn btn-primary'>Click me</button>",
  "accessibility": {
    "aria_attributes": ["aria-label", "aria-pressed"],
    "semantic_html": "button element used for keyboard navigation"
  },
  "responsive_behavior": {
    "mobile_320px": "single column, full width",
    "tablet_768px": "adaptive sizing",
    "desktop_1920px": "standard sizing"
  }
}
```

**Instances** (to be populated during Phase 2 task execution):
- PrimaryButton (used in all 5 apps)
- SecondaryButton (used in Quote, Expense, To-Do)
- FormInput (used in all 5 apps for forms)
- TextArea (used in Expense, To-Do)
- Card (used in Quote, Expense, To-Do)
- Modal (used in To-Do, Stopwatch)
- List (used in To-Do, Expense)
- Checkbox (used in To-Do)
- RadioButton (used in Expense)
- Badge (used in Temperature Converter, Stopwatch)
- ... (additional components identified during inventory phase)

---

### Entity 2: Design Token

A named variable representing a design decision applied consistently across UI components.

**Schema**:
```
{
  "id": "unique_identifier",
  "token_name": "color/text/primary",
  "category": "colors | spacing | typography | shadows | borders | other",
  "value": "#333333 or 16px or 14px/1.5 sans-serif",
  "figma_reference": "Colors/Text/Primary",
  "css_variable": "--color-text-primary",
  "css_value": "#333333",
  "applications": [
    "Quote",
    "Temperature Converter",
    "Expense Tracker",
    "To-Do List",
    "Stopwatch"
  ],
  "usage_context": "Primary text color used in headings and body text",
  "description": "The canonical primary text color for all applications",
  "aliases": ["--primary-text", "primary-text-color"],
  "status": "active | deprecated | experimental"
}
```

**Token Categories**:

#### Colors
- `color/text/primary`: Primary text color (headings, body)
- `color/text/secondary`: Secondary text color (labels, hints)
- `color/text/disabled`: Disabled text color
- `color/background/primary`: Primary background color
- `color/background/secondary`: Secondary background color
- `color/border/primary`: Primary border color
- `color/border/secondary`: Secondary border color
- `color/status/success`: Success state color (green)
- `color/status/error`: Error state color (red)
- `color/status/warning`: Warning state color (orange)
- `color/status/info`: Info state color (blue)
- ... (additional colors from Figma library)

#### Spacing
- `spacing/xs`: Extra small (4px)
- `spacing/sm`: Small (8px)
- `spacing/md`: Medium (16px)
- `spacing/lg`: Large (24px)
- `spacing/xl`: Extra large (32px)
- `spacing/xxl`: Extra extra large (48px)
- ... (additional spacing values)

#### Typography
- `typography/heading/h1`: Large heading (32px, bold)
- `typography/heading/h2`: Medium heading (24px, bold)
- `typography/heading/h3`: Small heading (18px, bold)
- `typography/body`: Body text (14px, regular)
- `typography/body/small`: Small body text (12px, regular)
- `typography/button`: Button text (14px, semi-bold)
- `typography/caption`: Caption text (12px, regular)
- ... (additional typography rules)

#### Shadows
- `shadow/sm`: Small shadow (0 1px 2px rgba(0,0,0,0.05))
- `shadow/md`: Medium shadow (0 4px 6px rgba(0,0,0,0.1))
- `shadow/lg`: Large shadow (0 10px 15px rgba(0,0,0,0.1))
- ... (additional shadow definitions)

#### Borders
- `border/radius/sm`: Small border radius (4px)
- `border/radius/md`: Medium border radius (8px)
- `border/radius/lg`: Large border radius (16px)
- `border/width/thin`: Thin border (1px)
- `border/width/medium`: Medium border (2px)
- ... (additional border rules)

---

### Entity 3: Visual Polish Issue

A minor visual refinement identified during the final review phase.

**Schema**:
```
{
  "id": "QUOTE-001",
  "type": "alignment | spacing | glitch | responsive | color | typography | other",
  "severity": "critical | high | medium | low",
  "affected_app": "Quote | Temperature Converter | Expense Tracker | To-Do List | Stopwatch",
  "location": "Component name or screen path",
  "description": "Detailed description of what needs fixing",
  "root_cause": "Why the issue occurred (if known)",
  "proposed_fix": "Specific CSS or code changes needed",
  "status": "pending | in-progress | resolved | verified",
  "fix_priority": 1 to N,
  "estimated_effort": "15 min | 30 min | 1 hour | 2 hours | 4 hours",
  "tags": ["ui", "responsive", "quote-app"]
}
```

**Severity Definitions**:
- **Critical**: Blocks visual polish acceptance; visibly broken UI (overlapping elements, cut-off text, major misalignment)
- **High**: Impacts user experience but not broken (slight misalignment, inconsistent spacing)
- **Medium**: Visual inconsistency (color mismatch, slightly different spacing)
- **Low**: Minor cosmetic issue (1-2px offset, subtle color tone difference)

**Issue Instances** (to be populated during visual review phase):
- QUOTE-001: Button text overlapping with icon (critical)
- QUOTE-002: Spacing inconsistent between heading and content (high)
- TEMP-001: Temperature display truncated on mobile (critical)
- ... (issues identified during systematic review)

---

## Relationships & Dependencies

### Component → Token
- Each UI component uses one or more design tokens for colors, spacing, typography
- Example: PrimaryButton uses `color/background/primary`, `color/text/primary`, `spacing/md`

### Component → Application
- Each component is used by one or more applications
- Example: PrimaryButton used in Quote, Temperature Converter, Expense Tracker, To-Do List, Stopwatch

### Token → Figma Design Library
- Each token has a canonical definition in Figma
- CSS implementation must match Figma value
- Example: `color/text/primary` defined as `#333333` in Figma and as `--color-text-primary: #333333` in CSS

### Visual Polish Issue → Component
- Issues may affect one or more components
- Fixing one component issue may fix similar issues in other components
- Example: Fixing spacing in PrimaryButton fixes layout in all applications using it

---

## Validation Rules

1. **Component Naming**: Use PascalCase (e.g., PrimaryButton, FormInput)
2. **Token Naming**: Use hierarchical kebab-case (e.g., color/text/primary, spacing/md)
3. **File Locations**: Use relative paths from `frontend/src/`
4. **Applications**: Reference all applications where component is used
5. **Figma References**: Use full path from Figma library structure
6. **Severity Classification**: Critical issues must be fixed before high/medium issues
7. **Issue Status**: All critical issues must reach "verified" status before PR submission

---

## Data Volume & Scope

- **UI Components**: Estimated 15-25 reusable components across all five applications
- **Design Tokens**: Estimated 30-50 tokens (colors, spacing, typography, shadows, borders)
- **Visual Polish Issues**: Estimated 3-10 issues identified during review (prioritized by severity)

---

## Next Steps

- Generate component-inventory.json export format
- Generate design-tokens.json export format
- Generate README markdown sections
- Create quickstart validation scenarios
- Update CLAUDE.md agent context

**Status**: Ready for Phase 1 artifact generation (contracts, quickstart, agent context).
