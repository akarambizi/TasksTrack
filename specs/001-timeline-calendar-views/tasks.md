# Tasks: Timeline and Calendar Views for Session History and Planning

**Input**: Design documents from `/specs/001-timeline-calendar-views/`

**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/timeline-calendar-api.yaml`, `.specify/memory/constitution.md`

**Tests**: Tests are REQUIRED. Backend and frontend test tasks are mandatory for every user story, including edge/error paths.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in each task description

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare feature scaffolding and shared contracts/types aligned with existing architecture.

- [ ] T001 Add focus-history DTO files for request/response contracts in `server/Models/FocusSession/FocusSessionHistoryFilterRequest.cs`, `server/Models/FocusSession/CalendarDaySummaryResponse.cs`, `server/Models/FocusSession/TimelineDayGroupResponse.cs`, and `server/Models/FocusSession/FocusSessionDayDetailResponse.cs`
- [ ] T002 [P] Add frontend history view types aligned to API contract in `client/src/types/focusSession.ts`
- [ ] T003 [P] Add shared date-range/timezone helper utilities (date-fns based) in `client/src/utils/focusSession.utils.ts`
- [ ] T004 Register new focus-history query key builders/constants in `client/src/queries/queryKeys.ts` and export in `client/src/queries/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared backend foundations that block all user stories.

**⚠️ CRITICAL**: No user story work begins until this phase completes.

- [ ] T005 Extend repository contracts for calendar/timeline/day-detail retrieval in `server/Repositories/IFocusSessionRepository.cs`
- [ ] T006 Implement timezone-aware range/filter query methods in `server/Repositories/FocusSessionRepository.cs`
- [ ] T007 Extend service contracts for focus-history orchestration in `server/Services/IFocusSessionService.cs`
- [ ] T008 Implement service-level validation (date span, timezone, filters) and mapping in `server/Services/FocusSessionService.cs`
- [ ] T009 Add authenticated controller endpoints for `/api/focus/history/calendar`, `/api/focus/history/timeline`, and `/api/focus/history/day/{localDate}` in `server/Controllers/FocusController.cs`
- [ ] T010 [P] Add foundational backend tests for validation and auth guards in `server/Tests/Services/FocusSessionServiceTest.cs` and `server/Tests/Controllers/FocusControllerTest.cs`

**Checkpoint**: Foundation complete; user story implementation can proceed.

---

## Phase 3: User Story 1 - Browse Sessions by Date (Priority: P1) 🎯 MVP

**Goal**: Users can browse calendar and timeline history with correct day grouping and day details.

**Independent Test**: Load history with multi-day sessions and confirm day highlights, day details, and chronological timeline ordering work without filter/navigation/planning features.

### Tests for User Story 1 (REQUIRED) ⚠️

> **NOTE: Write tests first and verify they fail before implementation changes.**

- [ ] T011 [P] [US1] Add backend repository aggregation tests for active-day and chronological grouping in `server/Tests/Repositories/FocusSessionRepositoryTest.cs`
- [ ] T012 [P] [US1] Add backend service tests for local-day bucketing (including midnight crossing) in `server/Tests/Services/FocusSessionServiceTest.cs`
- [ ] T013 [P] [US1] Add backend controller tests for calendar/timeline/day-detail success and invalid-input paths in `server/Tests/Controllers/FocusControllerTest.cs`
- [ ] T014 [P] [US1] Add frontend API contract tests for new history endpoints in `client/src/api/focusSession.spec.ts`
- [ ] T015 [P] [US1] Add frontend query tests for history hooks and cache keys in `client/src/queries/focusSessions.spec.ts`
- [ ] T016 [P] [US1] Add component tests for calendar highlights, day detail drawer, and timeline ordering in `client/src/components/FocusSession/FocusSessionHistory.spec.tsx`

### Implementation for User Story 1

- [ ] T017 [US1] Implement calendar/timeline/day-detail API functions in `client/src/api/focusSession.ts`
- [ ] T018 [US1] Implement TanStack Query hooks for history and day details in `client/src/queries/focusSessions.ts`
- [ ] T019 [US1] Implement calendar active-day rendering and day-selection detail panel in `client/src/components/FocusSession/FocusSessionHistory.tsx`
- [ ] T020 [US1] Implement timeline day grouping and chronological session list UI in `client/src/components/FocusSession/FocusSessionHistory.tsx`
- [ ] T021 [US1] Wire history view entry points and tab state in `client/src/components/FocusSession/FocusSessions.tsx`

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Filter and Navigate Time Ranges (Priority: P2)

**Goal**: Users can filter by habit/category and navigate week/month ranges with consistent updates in both views.

**Independent Test**: Apply habit/category filters and switch week/month ranges, then verify matching sessions/highlights only, including zero-match states.

### Tests for User Story 2 (REQUIRED) ⚠️

- [ ] T022 [P] [US2] Add backend repository tests for habit/category filter correctness across ranges in `server/Tests/Repositories/FocusSessionRepositoryTest.cs`
- [ ] T023 [P] [US2] Add backend service tests for range validation limits and zero-match handling in `server/Tests/Services/FocusSessionServiceTest.cs`
- [ ] T024 [P] [US2] Add backend controller tests for filter query binding and 400 responses on invalid filters in `server/Tests/Controllers/FocusControllerTest.cs`
- [ ] T025 [P] [US2] Add frontend query tests for filter/range key invalidation behavior in `client/src/queries/focusSessions.spec.ts`
- [ ] T026 [P] [US2] Add component tests for filter controls, week/month navigation, and empty states in `client/src/components/FocusSession/FocusSessionHistory.spec.tsx`
- [ ] T027 [P] [US2] Add e2e tests for filter and range navigation workflows in `client/tests/e2e/focus-timer.spec.ts`

### Implementation for User Story 2

- [ ] T028 [US2] Add habit/category filter support to backend history endpoints in `server/Controllers/FocusController.cs` and `server/Services/FocusSessionService.cs`
- [ ] T029 [US2] Implement week/month range state and date-fns navigation helpers in `client/src/components/FocusSession/FocusSessionHistory.tsx` and `client/src/utils/focusSession.utils.ts`
- [ ] T030 [US2] Implement habit/category filter controls and server-query wiring in `client/src/components/FocusSession/FocusSessionHistory.tsx`
- [ ] T031 [US2] Implement motivational zero-results empty state and start-session CTA in `client/src/components/FocusSession/FocusSessionHistory.tsx`

**Checkpoint**: User Stories 1 and 2 are independently functional and testable.

---

## Phase 5: User Story 3 - Plan with Calendar Interactions (Priority: P3)

**Goal**: Users can create/update planning-relevant entries via existing domain capabilities and see reflected results in day details/timeline.

**Independent Test**: Create/update a planning entry from calendar day context and verify the updated planning overlay appears in day detail and timeline history.

### Tests for User Story 3 (REQUIRED) ⚠️

- [ ] T032 [P] [US3] Add backend service tests for planning overlay mapping from existing category-goal data in `server/Tests/Services/FocusSessionServiceTest.cs`
- [ ] T033 [P] [US3] Add backend controller tests for planning overlay responses in day-detail endpoint in `server/Tests/Controllers/FocusControllerTest.cs`
- [ ] T033A [P] [US3] Add backend service/controller tests for planning eligibility rules (PER-003, PER-004, PER-005) including blocked create/update and clear validation responses in `server/Tests/Services/FocusSessionServiceTest.cs` and `server/Tests/Controllers/FocusControllerTest.cs`
- [ ] T034 [P] [US3] Add frontend API tests for planning-aware day-detail payload handling in `client/src/api/focusSession.spec.ts`
- [ ] T035 [P] [US3] Add component tests for planning create/update interactions from selected day in `client/src/components/FocusSession/FocusSessionHistory.spec.tsx`
- [ ] T035A [P] [US3] Add frontend component tests for non-destructive blocked-action messaging when planning eligibility validation fails in `client/src/components/FocusSession/FocusSessionHistory.spec.tsx`
- [ ] T036 [P] [US3] Add e2e tests for planning create/update and reflected timeline/day-detail behavior in `client/tests/e2e/focus-timer.spec.ts`

### Implementation for User Story 3

- [ ] T037 [US3] Extend day-detail service/repository composition to include planning overlays from existing category-goal domain in `server/Services/FocusSessionService.cs` and `server/Repositories/FocusSessionRepository.cs`
- [ ] T038 [US3] Add planning entry projection model for history payloads in `server/Models/FocusSession/PlanningEntryViewResponse.cs`
- [ ] T039 [US3] Add planning create/update interaction wiring using existing endpoints in `client/src/api/categories.ts` and `client/src/components/FocusSession/FocusSessionHistory.tsx`
- [ ] T040 [US3] Render planning overlays and update states in selected-day detail UI in `client/src/components/FocusSession/FocusSessionHistory.tsx`

**Checkpoint**: All user stories are independently functional and testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cross-story hardening, documentation, and mandatory quality gates.

- [ ] T041 [P] Add DST/timezone regression fixtures and assertions in `server/Tests/Repositories/FocusSessionRepositoryTest.cs` and `server/Tests/Services/FocusSessionServiceTest.cs`
- [ ] T042 [P] Add mobile swipe navigation interaction tests in `client/src/components/FocusSession/FocusSessionHistory.spec.tsx` and `client/tests/e2e/focus-timer.spec.ts`
- [ ] T042A [P] Add responsive layout tests for calendar/timeline/day-detail across mobile/tablet/desktop breakpoints in `client/src/components/FocusSession/FocusSessionHistory.spec.tsx` and `client/tests/e2e/focus-timer.spec.ts`
- [ ] T043 [P] Update focus history API notes and usage examples in `client/src/api/API_DOCS.md`
- [ ] T044 [P] Update end-to-end validation steps for this feature in `specs/001-timeline-calendar-views/quickstart.md`
- [ ] T044A [P] Add performance verification step for history endpoints (31-day and 92-day windows) and record p95 results in `specs/001-timeline-calendar-views/quickstart.md`
- [ ] T045 Run frontend quality gate build (`npm run build`) in `client/` and resolve all errors/warnings
- [ ] T046 Run frontend quality gate tests with coverage (`npm run test -- --run --coverage`) in `client/` and keep coverage >= 80%
- [ ] T047 Run frontend quality gate lint (`npm run lint`) in `client/` and resolve all lint errors
- [ ] T048 Run backend quality gate build (`dotnet build`) in `server/` and resolve all errors/warnings
- [ ] T049 Run backend quality gate tests (`dotnet test`) in `server/` and ensure 100% pass rate
- [ ] T050 Record constitution compliance evidence (architecture consistency, auth enforcement, testing proof) in `specs/001-timeline-calendar-views/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2; defines MVP.
- **Phase 4 (US2)**: Depends on Phase 3 baseline APIs/UI but remains independently testable.
- **Phase 5 (US3)**: Depends on Phase 3 day-detail baseline and existing category-goal flows.
- **Phase 6 (Polish)**: Depends on completion of desired user stories.

### User Story Dependencies

- **US1 (P1)**: No dependency on other user stories.
- **US2 (P2)**: Uses US1 history endpoints/components as base.
- **US3 (P3)**: Uses US1 day-detail flow and existing category-goal domain behavior.

### Within Each User Story

- Tests first (backend + frontend), and confirm fail-before-implement.
- Backend implementation before frontend query/component wiring for new payloads.
- API/query updates before component rendering changes.

## Parallel Opportunities

- Setup parallel tasks: `T002`, `T003`, `T004`.
- Foundational parallel task: `T010` can run while implementation in `T005`-`T009` stabilizes.
- US1 parallel tests: `T011`-`T016`.
- US2 parallel tests: `T022`-`T027`.
- US3 parallel tests: `T032`-`T036`.
- Polish parallel tasks: `T041`-`T044`.

## Parallel Example: User Story 1

```bash
# Backend tests in parallel
Task: T011 server/Tests/Repositories/FocusSessionRepositoryTest.cs
Task: T012 server/Tests/Services/FocusSessionServiceTest.cs
Task: T013 server/Tests/Controllers/FocusControllerTest.cs

# Frontend tests in parallel
Task: T014 client/src/api/focusSession.spec.ts
Task: T015 client/src/queries/focusSessions.spec.ts
Task: T016 client/src/components/FocusSession/FocusSessionHistory.spec.tsx
```

## Parallel Example: User Story 2

```bash
# Filter and navigation tests in parallel
Task: T022 server/Tests/Repositories/FocusSessionRepositoryTest.cs
Task: T025 client/src/queries/focusSessions.spec.ts
Task: T026 client/src/components/FocusSession/FocusSessionHistory.spec.tsx
Task: T027 client/tests/e2e/focus-timer.spec.ts
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete US1 tests and implementation (Phase 3).
3. Validate independently via US1 acceptance scenarios and quality gates.

### Incremental Delivery

1. Deliver MVP (US1).
2. Add filtering/navigation (US2) and re-run all quality gates.
3. Add planning interactions (US3) and re-run all quality gates.
4. Complete polish tasks and final constitution compliance evidence.

### Constitution Alignment Checklist

- Preserve existing Controller -> Service -> Repository boundaries in `server/`.
- Keep JWT-protected access behavior on focus history endpoints.
- Use date-fns for all client date operations.
- Keep TanStack Query patterns and typed API contracts consistent.
- Maintain >= 80% coverage and 100% pass rate before merge.