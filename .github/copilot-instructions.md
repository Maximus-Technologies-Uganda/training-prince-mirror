# training-prince Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-11-11

## Active Technologies
- JavaScript (Node.js, ES modules) + Vitest (v3.2.4), @vitest/coverage-v8, supertest, Playwright (v1.48.2) (029-coverage-hardening)
- N/A (test-focused feature, no data persistence changes) (029-coverage-hardening)
- JavaScript (Node.js ES modules) for backend; Node.js v18+ for CLI tools and scripts + Vitest v3.2.4, @vitest/coverage-v8, supertest, Playwright v1.48.2, Redoc CLI v0.13.21 (030-final-polish)
- N/A for this feature (documentation-focused; uses existing CI artifacts and git tags) (030-final-polish)
- GitHub Actions (YAML), Node.js 20 + @axe-core/playwright, Vitest v3.2.4, GitHub Projects API, Git tags (025-chapter-6-day-0)
- Next.js 15 App Router (React 18) documented under the existing Vite workspace until the app scaffold lands later this chapter + TanStack Query 5 for shared caching + mutations, `react-window` for virtualization, telemetry hooks reusing the established frontend observability clien (003-frontend-integration)
- N/A (frontend fetches Chapter 5 API) (003-frontend-integration)

- Node.js (Redoc generation), YAML (OpenAPI spec), JavaScript (Playwright test) + Redoc CLI (documentation generation), Playwright (UI testing), GitHub Actions (CI/CD workflow) (028-week-5-day)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

Node.js (Redoc generation), YAML (OpenAPI spec), JavaScript (Playwright test): Follow standard conventions

## Recent Changes
- 001-scaffold-expenses-ui: Added [if applicable, e.g., PostgreSQL, CoreData, files or N/A]
- 003-frontend-integration: Added Next.js 15 App Router (React 18) documented under the existing Vite workspace until the app scaffold lands later this chapter + TanStack Query 5 for shared caching + mutations, `react-window` for virtualization, telemetry hooks reusing the established frontend observability clien
- 025-chapter-6-day-0: Added GitHub Actions (ally-check workflow), @axe-core/playwright for accessibility scanning, GitHub Projects field management, git tag creation, coverage threshold configuration (Vitest thresholds: API 70%, UI 55%)


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
