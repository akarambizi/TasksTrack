# Spec Kit Usage Guide for TasksTrack

This guide explains how to use Spec Kit in this repository from now on.

## What Spec Kit Is Used For Here

Use existing project docs for strategy and backlog:
- `PROJECT_PLAN.md`
- `ReadMe.md`
- `docs/*`

Use Spec Kit for execution per feature:
1. Constitution (project rules)
2. Feature spec (what/why)
3. Clarification (remove ambiguity)
4. Technical plan (how)
5. Tasks (ordered implementation checklist)
6. Analyze/checklist (quality consistency)
7. Implement (execute tasks)

## One-Time Setup Status

Already completed in this repo:
- Spec Kit initialized in-place
- Copilot integration installed
- Spec Kit prompts/agents generated under `.github/`
- Project constitution created at `.specify/memory/constitution.md`

## Prerequisites

Required tools:
- Python 3.11+ recommended by Spec Kit
- `uv`
- `specify` CLI
- GitHub Copilot Chat in VS Code

If `specify` is not found in terminal, add this to shell profile:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

## Core Commands

Run from repository root.

Check installation:

```bash
specify check
specify self check
```

Upgrade CLI:

```bash
specify self upgrade --dry-run
specify self upgrade
```

## Recommended Feature Workflow (TasksTrack)

### Step 0: Pick a feature from backlog

Pick one unfinished feature section from `PROJECT_PLAN.md`.

### Step 1: Set or update constitution (only when standards change)

In Copilot Chat:

```text
/speckit.constitution
```

Constitution file:
- `.specify/memory/constitution.md`

### Step 2: Create feature specification

In Copilot Chat:

```text
/speckit.specify <feature request in product language>
```

Output goes under:
- `specs/<feature-id>/spec.md`

### Step 3: Clarify requirement gaps

```text
/speckit.clarify
```

### Step 4: Generate technical plan

```text
/speckit.plan
```

Output typically includes:
- `specs/<feature-id>/plan.md`
- `specs/<feature-id>/research.md`
- `specs/<feature-id>/data-model.md`
- `specs/<feature-id>/contracts/*`
- `specs/<feature-id>/quickstart.md`

### Step 5: Generate tasks

```text
/speckit.tasks
```

Output:
- `specs/<feature-id>/tasks.md`

### Step 6: Analyze quality and consistency

```text
/speckit.analyze
/speckit.checklist
```

Fix any HIGH issues before implementation.

### Step 7: Implement

```text
/speckit.implement
```

## TasksTrack Quality Gates (Must Pass)

Frontend:

```bash
cd client
npm run build
npm run test -- --run --coverage
npm run lint
```

Backend:

```bash
cd server
dotnet build
dotnet test
```

Expected policy:
- zero build errors/warnings
- tests passing
- coverage >= 80%

## How to Map Old Docs to Spec Kit

Use this mapping every time:

- Backlog section in `PROJECT_PLAN.md` -> input prompt for `/speckit.specify`
- Existing architecture constraints in `.github/copilot-instructions*.md` -> constraints in `/speckit.plan`
- Existing tests and quality standards -> mandatory tasks and gates in `/speckit.tasks`

## Practical Prompt Templates

Specification prompt template:

```text
/speckit.specify Implement <feature name> for TasksTrack.
User value:
- <value 1>
- <value 2>
Must include:
- <requirement list>
Edge cases:
- <edge cases>
```

Planning prompt template:

```text
/speckit.plan Use existing stack and patterns only:
- Backend: ASP.NET Core + EF Core + PostgreSQL + Controller/Service/Repository pattern
- Frontend: React + TypeScript + TanStack Query + existing component/hook conventions
- Use date-fns for all client date operations
- Keep JWT auth/authorization behavior unchanged
- Include tests and quality gates
```

## Current Feature Artifacts Example

For Timeline and Calendar Views:
- `specs/001-timeline-calendar-views/spec.md`
- `specs/001-timeline-calendar-views/plan.md`
- `specs/001-timeline-calendar-views/tasks.md`
- `specs/001-timeline-calendar-views/checklists/requirements.md`

## Common Pitfalls and Fixes

1. Branch/feature ID mismatch between spec and plan
- Keep the same feature identifier in all generated artifacts.

1. Placeholder text left in plan
- Remove any template notes like "ACTION REQUIRED" before implementation.

1. Path drift in tasks vs plan
- Keep file paths consistent with actual repo structure (for this repo, e2e tests are under `client/tests/e2e`).

1. Ambiguous planning eligibility
- Add explicit rules in spec for when create/update is allowed and blocked.

## Suggested Team Routine

For every new feature:
1. Run `/speckit.specify`
2. Run `/speckit.clarify`
3. Run `/speckit.plan`
4. Run `/speckit.tasks`
5. Run `/speckit.analyze` and fix blockers
6. Run `/speckit.implement`
7. Run quality gates before PR
8. Update `PROJECT_PLAN.md` checklist status

This keeps strategic planning in your existing docs and execution discipline in Spec Kit.
