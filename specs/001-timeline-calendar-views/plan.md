# Implementation Plan: Timeline and Calendar Views for Session History and Planning

**Branch**: `001-timeline-calendar-views` | **Date**: 2026-06-15 | **Spec**: `/specs/001-timeline-calendar-views/spec.md`

**Input**: Feature specification from `/specs/001-timeline-calendar-views/spec.md`

## Summary

Add authenticated calendar and timeline history views for focus sessions with habit/category/date-range filtering, day details, and planning entry interactions using existing domain capabilities. Keep architecture consistent with existing server Controller/Service/Repository layering and client API/query/component patterns, while introducing timezone-aware day bucketing and robust edge-case coverage for midnight crossing, DST changes, empty states, and mobile swipe navigation.

## Technical Context

**Language/Version**:
- Backend: C# 12 on .NET 9 (ASP.NET Core Web API)
- Frontend: TypeScript 5.x with React 18 + Vite

**Primary Dependencies**:
- Backend: ASP.NET Core, Entity Framework Core, PostgreSQL provider, existing OData usage where already present
- Frontend: TanStack Query, date-fns, existing shadcn/ui + Tailwind setup

**Storage**: PostgreSQL via EF Core (reuse `FocusSessions`, `Habits`, `Categories`, `CategoryGoals`)

**Testing**:
- Backend: xUnit + Moq in `server/Tests`
- Frontend: Vitest + React Testing Library in `client/src/**/*.spec.ts(x)`
- End-to-end/regression: existing Playwright suite in `client/tests/e2e`

**Target Platform**: Web application (desktop + mobile responsive) with ASP.NET API backend

**Project Type**: Full-stack web app (monorepo: `server/` + `client/`)

**Performance Goals**:
- Support fluid week/month navigation and timeline scrolling without skipped/duplicated ranges
- Calendar/timeline history responses should remain efficient for normal user history ranges (week/month windows): p95 <= 500ms for 31-day windows and p95 <= 800ms for 92-day windows in local integration test environments
- Preserve measurable outcomes from spec (SC-001 through SC-006)

**Constraints**:
- Must preserve current Clean Architecture and naming conventions
- Must keep JWT authorization behavior for protected data
- Client date operations must use date-fns
- Must pass constitution quality gates: build/test/coverage thresholds
- Must handle timezone/day-boundary and DST edge cases deterministically

**Scale/Scope**:
- Feature scope is focused session history and planning interactions for authenticated users
- Includes backend query/aggregation logic + frontend calendar/timeline UX + test updates

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Existing-pattern-first check: PASS
  Evidence: reuse `FocusController` + `IFocusSessionService` + `IFocusSessionRepository` layering and existing client `api/` + `queries/` + `components/FocusSession` organization.
- Server architecture check: PASS
  Plan keeps new logic in repository query methods, service orchestration, and controller endpoints with existing DI registration pattern in `DependencyInjectionSetup.cs`.
- Client architecture check: PASS
  Plan uses typed API functions, TanStack Query hooks, and existing component conventions (`FocusSessionHistory`, shared UI components).
- Date handling check: PASS
  Plan enforces date-fns for all client date parsing/formatting/range calculations.
- Security check: PASS
  New/reused endpoints remain under authenticated access (`[Authorize]` conventions preserved), user-scoped filtering stays server-side.
- Quality gates check: PASS (required for merge)
  - Frontend build: zero errors and zero warnings.
  - Backend build: zero errors and zero warnings.
  - Frontend/backend tests: 100% pass.
  - Coverage: >= 80% baseline maintained.
- Testing discipline check: PASS
  Plan includes backend controller/service tests and frontend component/query tests, including edge/error paths.

## Project Structure

### Documentation (this feature)

```text
specs/001-timeline-calendar-views/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── timeline-calendar-api.yaml
└── tasks.md             # Created by /speckit.tasks
```

### Source Code (repository root)
```text
server/
├── Controllers/
├── Services/
├── Repositories/
├── Models/
├── Data/
└── Tests/

client/
├── src/
│  ├── api/
│  ├── queries/
│  ├── components/FocusSession/
│  ├── types/
│  └── utils/
└── tests/e2e/

specs/001-timeline-calendar-views/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

**Structure Decision**: Keep the existing monorepo web-application structure and extend only established folders. No new top-level architecture or library is introduced.

## Implementation Sequencing

1. Backend contract + query layer
  - Add history-focused repository methods for date range, day-detail retrieval, and calendar aggregation with user-scoped filters.
  - Add service methods for timezone-aware date bucketing and response composition.
  - Add controller endpoints under existing focus domain (`api/focus/...`) with validation and auth-preserving behavior.
2. Frontend data and state
  - Add typed API functions and TanStack Query hooks for calendar/timeline/day-detail requests.
  - Extend query keys and cache invalidation strategy for range/filter changes.
3. Frontend UI
  - Implement calendar view with highlighted active days and selectable day detail panel.
  - Implement timeline view grouped by local day with chronological ordering.
  - Add habit/category filters, week/month navigation, and mobile swipe transitions.
  - Reuse existing planning data interactions (CategoryGoal endpoints) for create/update paths where applicable.
4. Testing and quality gates
  - Backend: repository/service/controller unit tests for filtering, timezone conversions, edge dates, unauthorized access.
  - Frontend: component and query tests for rendering, filtering, empty states, swipe/range navigation, timezone display correctness.
  - Execute full quality-gate commands before merge.

## Post-Design Constitution Re-Check

- Existing-pattern-first: PASS (design only extends current layers and component/query patterns).
- Server architecture: PASS (no business logic in controllers, no direct DbContext use outside repositories).
- Client architecture: PASS (typed interfaces/hooks retained, TanStack Query preserved).
- Date handling: PASS (date-fns-only client strategy plus explicit timezone contract).
- Security: PASS (JWT-protected history/planning routes remain authenticated and user scoped).
- Quality/test gates: PASS by plan (enforced as release blockers in quickstart validation).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitutional violations identified at planning stage.
