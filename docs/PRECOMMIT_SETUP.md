# Pre-Commit Hook Setup

This document describes the pre-commit hook configuration for the TasksTrack project.

## Overview

The pre-commit hook ensures code quality by running the following checks before any commit:

1. **Markdown Linting** - Validates all markdown files for consistency
2. **Frontend Build** - Ensures the React client builds without errors
3. **Backend Build** - Ensures the .NET server builds without errors/warnings
4. **Frontend Tests** - Runs all client-side tests
5. **Backend Tests** - Runs all server-side tests

## Setup

The pre-commit hook is automatically configured when you run:

```bash
npm install
```

This will:
- Install Husky for git hook management
- Install lint-staged for running tasks on staged files
- Set up the pre-commit hook at `.husky/pre-commit`

## Manual Setup

If you need to set up manually:

```bash
# Install dependencies
npm install husky lint-staged markdownlint-cli2

# Initialize husky
npx husky init

# The pre-commit hook is already configured in .husky/pre-commit
```

## Available Scripts

- `npm run build` - Builds both frontend and backend
- `npm run build:client` - Builds only the React frontend
- `npm run build:server` - Builds only the .NET backend (treats warnings as errors)
- `npm run test:client` - Runs frontend tests
- `npm run test:server` - Runs backend tests
- `npm run lint:md` - Lints all markdown files
- `npm run precommit` - Runs build and markdown linting (subset of pre-commit)

## Pre-Commit Workflow

When you attempt to commit, the hook will:

1. **Check Markdown Files**
   - Validates formatting, line length, heading structure
   - Uses `.markdownlint.json` configuration

2. **Build Frontend**
   - Runs TypeScript compilation
   - Builds production bundle with Vite
   - Fails on any build errors

3. **Build Backend**
   - Compiles .NET 9 application in Release mode
   - Treats warnings as errors (enforces clean code)
   - Fails if any warnings or errors exist

4. **Run Tests**
   - Executes all frontend tests with Vitest
   - Executes all backend tests with xUnit
   - Requires 100% test pass rate

```bash
git commit --no-verify -m "Emergency commit message"
```

⚠️ **Warning**: Only use `--no-verify` for genuine emergencies. All bypassed commits should be fixed immediately after.

## Configuration Files

- `.husky/pre-commit` - The actual pre-commit script
- `.markdownlint.json` - Markdown linting rules
- `package.json` - Script definitions and dependencies

## Quality Standards Enforced

### Frontend
- ✅ Zero TypeScript compilation errors
- ✅ Zero build warnings/errors
- ✅ All tests passing
- ✅ 80%+ code coverage (configured in test scripts)

### Backend
- ✅ Zero compilation errors
- ✅ Zero compiler warnings
- ✅ All tests passing
- ✅ Clean Release build

### Documentation
- ✅ Consistent markdown formatting
- ✅ Proper heading structure
- ✅ Line length limits (120 characters)
- ✅ Proper code block formatting

## Troubleshooting

### Build Failures
If builds fail, the specific error will be shown. Common issues:
- TypeScript errors in frontend
- Unused variables in backend (causing warnings)
- Missing dependencies

### Test Failures
- Check test output for specific failing tests
- Ensure all tests are updated for recent changes
- Verify mock data and test environments

### Markdown Issues
- Run `npm run lint:md` to see specific issues
- Common problems: long lines, missing blank lines around headings/lists
- Reference `.markdownlint.json` for current rules

## Benefits

This setup ensures:
- **Consistent Code Quality** - No broken builds reach the repository
- **Faster Reviews** - Reviewers focus on logic, not formatting
- **Prevents Regressions** - Automated testing catches issues early
- **Clean Documentation** - Consistent markdown standards
- **Developer Confidence** - Know your changes work before pushing

---

*This pre-commit setup is part of the TasksTrack learning project, demonstrating professional development practices.*
