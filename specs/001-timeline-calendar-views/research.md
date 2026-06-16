# Phase 0 Research: Timeline and Calendar Views

## Decision 1: Keep server-side timezone day bucketing with explicit timezone input

- Decision: Add an explicit `timezone` request parameter (IANA string, e.g., `Africa/Kigali`) for calendar/timeline/day-detail history endpoints; aggregate by local day server-side from UTC `DateTimeOffset` values.
- Rationale: Existing focus sessions are stored with `DateTimeOffset` and created in UTC. Day-level correctness for midnight crossings and DST transitions must be deterministic and user-scoped. Server-side bucketing avoids client inconsistencies and duplicated business logic.
- Alternatives considered:
  - Client-only day bucketing after fetching raw sessions: rejected due to pagination/filter mismatches and potential inconsistency across views.
  - Persisting denormalized per-timezone day keys: rejected due to complexity and timezone-change drift.

## Decision 2: Extend existing Focus domain endpoints instead of introducing a new bounded context

- Decision: Place new history endpoints under the existing focus route space (`/api/focus/...`) and keep logic in Controller -> Service -> Repository layers.
- Rationale: `FocusController`, `IFocusSessionService`, and `IFocusSessionRepository` are already established and registered in DI. This keeps conventions intact and reduces architectural drift.
- Alternatives considered:
  - New `HistoryController` and parallel service/repository stacks: rejected as unnecessary duplication.
  - OData-only expansion: rejected for complex calendar/timeline aggregate shapes not represented well as plain entity projections.

## Decision 3: Reuse existing planning model capabilities instead of introducing a new planning table

- Decision: Use existing planning-capable domain endpoints (`/api/category-goals` create/update flows) as calendar planning interactions where applicable, and represent them in timeline/calendar UI.
- Rationale: Feature spec explicitly limits planning behavior to what existing domain supports. `CategoryGoal` model and controller/service/repository already support create/update/deactivate.
- Alternatives considered:
  - Add new `PlanningEntry` persistence model/table now: rejected because not required by current domain rules and increases migration risk.

## Decision 4: Client date handling remains date-fns only with current query-builder utilities

- Decision: Continue using date-fns for all date parsing/formatting/range calculations and leverage existing OData helper/query-builder patterns where applicable.
- Rationale: Constitution mandates date-fns. Existing utilities (`odataHelpers`, `ODataQueryBuilder`) already implement date formatting behavior and reduce bespoke date logic.
- Alternatives considered:
  - Native `Date` arithmetic for new views: rejected due to timezone/DST fragility and constitutional non-compliance.
  - Additional date libraries: rejected to avoid unnecessary dependency expansion.

## Decision 5: Testing strategy must be dual-layered (backend + frontend) with timezone edge fixtures

- Decision: Add backend tests for timezone aggregation/filter behavior and frontend tests for calendar/timeline rendering, filters, empty states, and mobile range navigation interactions.
- Rationale: Feature success criteria and constitution require behavioral correctness and quality-gate compliance across both stacks.
- Alternatives considered:
  - Rely mainly on frontend tests: rejected because aggregation correctness lives server-side.
  - Rely mainly on backend tests: rejected because UI interaction failures (swipe/range/filter states) would be missed.