# Data Model: Timeline and Calendar Views

## Overview

This feature primarily extends read/query projections over existing persisted entities. No mandatory new database table is required for Phase 1 design.

## Existing Persisted Entities (Reused)

## `FocusSession`

- Source: `server/Models/FocusSession/FocusSession.cs`
- Key fields used:
  - `Id` (int)
  - `HabitId` (int)
  - `StartTime` (`DateTimeOffset`)
  - `EndTime` (`DateTimeOffset?`)
  - `Status` (string: active/paused/completed/interrupted)
  - `PlannedDurationMinutes` (int)
  - `ActualDurationSeconds` (int?)
  - `PausedDurationSeconds` (int?)
  - `CreatedBy` (string?)
  - `CreatedDate` (`DateTimeOffset`)

## `Habit`

- Source: `server/Models/Habits/Habit.cs`
- Key fields used:
  - `Id` (int)
  - `Name` (string)
  - `Category` (string?)
  - `IsActive` (bool)

## `CategoryGoal` (Planning interaction reuse)

- Source: `server/Models/Category/CategoryGoal.cs` and `server/Controllers/CategoryGoalController.cs`
- Key fields used:
  - `Id` (int)
  - `CategoryId` (int)
  - `UserId` (string)
  - `WeeklyTargetMinutes` / `WeeklyTargetSessions` / daily targets
  - `IsActive` (bool)
  - `StartDate` / `EndDate`

## New/Extended API Projection Models (DTOs)

## `SessionHistoryFilter`

- Purpose: normalized filter object at service boundary.
- Fields:
  - `StartDate` (local date, `yyyy-MM-dd`)
  - `EndDate` (local date, `yyyy-MM-dd`)
  - `Timezone` (IANA name)
  - `HabitId` (optional int)
  - `Category` (optional string)

Validation rules:
- `StartDate <= EndDate`
- Max date span guard (implementation limit, e.g., 92 days)
- `Timezone` must resolve to a supported timezone identifier

## `CalendarDaySummary`

- Purpose: one day cell payload for calendar rendering.
- Fields:
  - `LocalDate` (string `yyyy-MM-dd`)
  - `IsActive` (bool)
  - `SessionCount` (int)
  - `TotalFocusMinutes` (int)
  - `CompletedSessionCount` (int)
  - `HabitIds` (int[])
  - `Categories` (string[])

## `TimelineDayGroup`

- Purpose: timeline grouping section.
- Fields:
  - `LocalDate` (string)
  - `DisplayLabel` (string)
  - `TotalFocusMinutes` (int)
  - `Sessions` (`SessionTimelineItem[]`)

## `SessionTimelineItem`

- Purpose: session item in a timeline day group.
- Fields:
  - `SessionId` (int)
  - `HabitId` (int)
  - `HabitName` (string)
  - `Category` (string?)
  - `StartTimeUtc` (ISO string)
  - `EndTimeUtc` (ISO string?)
  - `StartTimeLocal` (ISO string)
  - `EndTimeLocal` (ISO string?)
  - `Status` (string)
  - `DurationMinutes` (int)
  - `Notes` (string?)

## `DayDetailResponse`

- Purpose: expanded details for selected calendar day.
- Fields:
  - `LocalDate` (string)
  - `Timezone` (string)
  - `Summary` (`CalendarDaySummary`)
  - `Sessions` (`SessionTimelineItem[]`)
  - `PlanningEntries` (existing-model projection for category-goal entries where applicable)

## Relationships

- `Habit (1) -> (many) FocusSession`
- `Category (1) -> (many) Habit`
- `Category (1) -> (many) CategoryGoal` (planning context)
- `CalendarDaySummary` and `TimelineDayGroup` are derived read models from `FocusSession` + `Habit` joins and optional planning overlays.

## State Transitions

## Focus session states (existing)

- `active -> paused -> active -> completed`
- `active -> interrupted`
- `paused -> interrupted`

Timeline/calendar queries must represent current persisted state without introducing new transitions.

## Planning entry state (existing CategoryGoal semantics)

- Active/inactive transitions reuse existing create/update/deactivate behavior.
- Calendar interactions for planning are limited to operations already valid in this model.

## Timezone Handling Rules

- Persisted timestamps remain UTC (`DateTimeOffset`).
- Day grouping uses requested effective timezone at query time.
- Sessions crossing midnight are split by local date for summary counters while preserving single source session identity in detail views.
- DST transitions must not duplicate or lose sessions; local-day mapping is computed from timezone conversion, not string truncation.