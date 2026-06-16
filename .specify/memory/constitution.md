<!--
Sync Impact Report
- Version change: N/A -> 1.0.0
- Modified principles:
	- [PRINCIPLE_1_NAME] -> I. Existing-Pattern-First Development
	- [PRINCIPLE_2_NAME] -> II. Server Architecture Consistency (.NET)
	- [PRINCIPLE_3_NAME] -> III. Client Architecture Consistency (React + TypeScript)
	- [PRINCIPLE_4_NAME] -> IV. Mandatory Quality Gates and Testing Discipline
	- [PRINCIPLE_5_NAME] -> V. Security, Authentication, and Data Handling
- Added sections:
	- Engineering Constraints and Naming Conventions
	- Delivery Workflow and Review Standards
- Removed sections:
	- None
- Templates requiring updates:
	- ✅ Updated: .specify/templates/plan-template.md
	- ✅ Updated: .specify/templates/spec-template.md
	- ✅ Updated: .specify/templates/tasks-template.md
	- ✅ Reviewed: .specify/templates/checklist-template.md (no changes required)
	- ✅ Reviewed: .specify/templates/commands/*.md (directory not present in repository)
- Follow-up TODOs:
	- None
-->

# TasksTrack Constitution

## Core Principles

### I. Existing-Pattern-First Development
All changes MUST begin by referencing established implementations in this repository before
introducing a new pattern, library, abstraction, or folder structure. New patterns MAY be
introduced only when an existing pattern is proven insufficient for a concrete requirement, and
the pull request MUST document that rationale.
Rationale: this repository is a learning project that prioritizes consistency, maintainability,
and deliberate architectural decisions over novelty.

### II. Server Architecture Consistency (.NET)
Server changes MUST preserve the existing Clean Architecture and Repository Pattern boundaries
across Controllers, Services, Repositories, Models, and Data layers. JWT-protected endpoint
behavior, authentication middleware usage, and authorization checks MUST remain consistent with
the existing Auth flow and secure routes.
Rationale: architectural consistency keeps business logic testable, data access isolated, and
security controls predictable.

### III. Client Architecture Consistency (React + TypeScript)
Client changes MUST follow current React 18 + TypeScript conventions used in this repository,
including typed interfaces, component/hook organization, and TanStack Query-based server state
patterns. All client-side date parsing, formatting, comparison, and calculations MUST use
date-fns rather than manual Date manipulation utilities.
Rationale: consistent patterns reduce regression risk and improve onboarding speed.

### IV. Mandatory Quality Gates and Testing Discipline
No change is merge-ready unless all required quality gates pass:
- Frontend build MUST complete with zero errors and zero warnings.
- Backend build MUST complete with zero errors and zero warnings.
- Frontend tests and backend tests MUST pass at 100% pass rate.
- Coverage MUST remain at or above 80% for the project baseline.
- New behavior MUST include tests, including edge/error-path coverage.

Testing practices documented in repository guidance are mandatory, including:
- Frontend component tests using provider-aware rendering patterns.
- Proper mocking strategy for form workflows.
- Cleanup between tests to avoid test interference.
- Controller/service unit tests plus integration coverage for backend data/API behavior.

Rationale: quality gates are the primary protection against regressions in this full-stack codebase.

### V. Security, Authentication, and Data Handling
API endpoints handling protected resources MUST enforce JWT authentication/authorization and MUST
not bypass established middleware or token validation flows. Changes to auth, session, password,
or token flows MUST include explicit negative-path tests. Sensitive data MUST never be logged in
plaintext.
Rationale: security controls are foundational and must remain verifiable as features evolve.

## Engineering Constraints and Naming Conventions

The repository-wide naming conventions are mandatory:
- Server C# classes and methods: PascalCase.
- Server interfaces: I + PascalCase.
- Server private fields: _camelCase.
- Client TypeScript interfaces: I + PascalCase.
- Client components: PascalCase.
- Client custom hooks: use + camelCase.

Technology constraints for consistency:
- Backend stack remains ASP.NET Core Web API + EF Core + PostgreSQL.
- Frontend stack remains React + TypeScript + Vite + TanStack Query + Tailwind/shadcn.
- Date operations in client code MUST use date-fns.

## Delivery Workflow and Review Standards

Every pull request MUST include:
- A brief architecture consistency statement (server and/or client as applicable).
- Evidence of required quality-gate execution (build, tests, coverage, lint where applicable).
- A security impact statement for API/auth-related changes.
- Test evidence covering new functionality and edge cases.

Reviewers MUST block merge when constitutional rules are not met, including missing tests,
coverage regressions below 80%, architecture drift, or auth inconsistencies.

## Governance

This constitution is the highest-priority engineering policy for TasksTrack. In case of conflict,
this document takes precedence over ad hoc practices.

Amendment process:
1. Propose changes in a pull request that updates this file and any impacted templates.
2. Include rationale, impact analysis, and migration guidance for in-flight work.
3. Obtain approval from repository maintainers before merge.

Semantic versioning policy for this constitution:
- MAJOR: incompatible governance or principle removals/redefinitions.
- MINOR: new principle/section or materially expanded mandatory guidance.
- PATCH: clarifications, wording improvements, and non-semantic refinements.

Compliance checks:
- Constitution compliance MUST be explicitly reviewed in pull requests.
- Plan, spec, and tasks templates under .specify/templates MUST stay aligned with constitutional
	mandates.
- Non-compliant changes MUST be corrected before merge.

**Version**: 1.0.0 | **Ratified**: 2026-06-15 | **Last Amended**: 2026-06-15
