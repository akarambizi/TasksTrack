# Quickstart Validation Guide

## Purpose

Validate timeline/calendar session history and planning interactions end-to-end for authenticated users, including timezone-sensitive edge cases.

## Prerequisites

- .NET 8 SDK installed
- Node.js and npm installed
- PostgreSQL available (local, Docker, or configured environment)
- Auth-capable test user account available

## Setup

1. Start backend dependencies if needed.

```bash
docker-compose up -d postgres
```

2. Start server.

```bash
cd server
dotnet restore
dotnet build
dotnet run
```

3. Start client.

```bash
cd client
npm install
npm run dev
```

4. Sign in with an authenticated user.

## Validation Scenarios

### Scenario A: Calendar active-day highlighting

1. Seed or create focus sessions across multiple days.
2. Open focus history calendar view.
3. Confirm only days with matching sessions are highlighted.
4. Apply habit filter, then category filter.
5. Confirm highlights update and non-matching days become inactive.

Expected outcome:
- Active days reflect filtered results accurately.
- Empty filtered ranges show motivational empty state and start-session action.

### Scenario B: Timeline grouping and ordering

1. Open timeline view for the same date range.
2. Confirm sessions are grouped by local day and ordered chronologically within and across groups.
3. Navigate week and month ranges.

Expected outcome:
- No duplicate groups.
- No skipped or repeated range transitions.

### Scenario C: Day detail and planning interaction

1. Select an active calendar day.
2. Confirm day details show all sessions for that local day.
3. Where planning is supported in existing model, create or update planning entry via existing domain behavior.
4. Return to timeline/calendar and confirm updated planning context is reflected.

Expected outcome:
- Day detail is complete and readable for high-volume days.
- Planning changes remain consistent with existing category-goal rules.

### Scenario D: Timezone and DST edge handling

1. Repeat calendar/timeline checks with at least three timezones (for example UTC, Africa/Kigali, America/New_York).
2. Include sessions near midnight UTC and around DST transition dates.
3. Validate local-day assignment and counts.

Expected outcome:
- Sessions crossing local midnight are assigned to correct local day.
- DST shifts do not create duplicates or omissions.

### Scenario E: Mobile swipe navigation

1. Open on mobile viewport.
2. Perform repeated swipe navigation across week/month ranges.

Expected outcome:
- Each swipe changes exactly one intended range.
- No skipped or duplicate transitions.

## Automated Test Strategy

## Backend

- Add/extend tests in:
  - `server/Tests/Services/FocusSessionServiceTest.cs`
  - `server/Tests/Controllers/*Focus*` (or equivalent focus history controller tests)
  - repository-focused tests for date-range/timezone aggregation logic
- Cover:
  - range validation and filter correctness
  - timezone conversion and day bucketing
  - midnight crossing and DST cases
  - unauthorized and invalid-input paths

## Frontend

- Add/extend tests in:
  - `client/src/components/FocusSession/*.spec.tsx`
  - `client/src/queries/focusSessions.spec.ts`
  - optional e2e additions in `client/tests/e2e`
- Cover:
  - calendar highlight logic
  - timeline grouping/order
  - filter + navigation behavior
  - empty states and day detail rendering
  - mobile swipe interactions

## Quality Gates (Mandatory)

Run before merge:

```bash
cd client
npm run build
npm run test -- --run --coverage
npm run lint
```

```bash
cd server
dotnet build
dotnet test
```

Release is blocked unless all conditions are met:
- Frontend/backend builds: zero errors and zero warnings
- Frontend/backend tests: 100% pass
- Coverage: >= 80% baseline

## Contract and Model References

- API contract: `specs/001-timeline-calendar-views/contracts/timeline-calendar-api.yaml`
- Data model details: `specs/001-timeline-calendar-views/data-model.md`
- Planning rationale and decisions: `specs/001-timeline-calendar-views/research.md`
