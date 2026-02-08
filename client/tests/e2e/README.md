# E2E Testing with Playwright

Comprehensive end-to-end testing setup following best practices from popular repositories.

## Architecture Overview

Our E2E testing follows these established patterns:

- **Page Object Model (POM)** - Reusable page classes in `pages/`
- **Test Fixtures** - Custom fixtures for authentication and data setup
- **Test Utilities** - Helper functions in `utils/`
- **Constants** - Centralized test data and selectors in `constants/`
- **Base Test Setup** - Common configuration and cleanup

## Structure

```
tests/e2e/
├── README.md                 # This file
├── base.test.ts             # Base test with common setup
├── playwright.config.ts     # Main configuration
├── constants/
│   └── test-data.ts        # Test constants and selectors
├── fixtures/
│   └── auth.fixture.ts     # Authentication fixtures
├── pages/
│   ├── BasePage.ts         # Base page class
│   ├── LoginPage.ts        # Login page object
│   ├── DashboardPage.ts    # Dashboard page object
│   └── HabitsPage.ts       # Habits page object
├── utils/
│   └── test-helpers.ts     # Utility functions
└── specs/
    ├── auth.spec.ts        # Authentication tests
    ├── habits.spec.ts      # Habits management tests
    └── focus-timer.spec.ts # Focus timer tests
```

## Quick Start

### Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run test:e2e:install
```

### Running Tests

```bash
# Run all tests
npm run test:e2e

# Run with UI mode (recommended for development)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run specific browser
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit

# Run mobile tests
npm run test:e2e:mobile

# Run desktop tests only
npm run test:e2e:desktop

# Debug tests
npm run test:e2e:debug

# Generate test code
npm run test:e2e:codegen
```

### Viewing Reports

```bash
# View HTML report
npm run test:e2e:report

# View trace files
npm run test:e2e:trace
```

## Best Practices Implemented

### 1. **Test Organization**
- Tests grouped by feature/domain
- Descriptive test names following BDD style
- Proper use of `describe` and `test` blocks

### 2. **Data Management**
- Centralized test constants in `constants/test-data.ts`
- Dynamic test data generation to avoid conflicts
- Consistent user credentials across tests

### 3. **Page Object Model**
- Reusable page classes with methods and locators
- Inheritance from `BasePage` for common functionality
- Clear separation of concerns

### 4. **Selectors Strategy**
- Prioritize `data-testid` attributes
- Fallback to semantic selectors (role, text)
- Avoid fragile CSS selectors

### 5. **Async/Await Patterns**
- Proper async/await usage
- Appropriate waiting strategies
- Timeout configuration

### 6. **Error Handling**
- Graceful error handling in fixtures
- Meaningful error messages
- Screenshot and trace capture on failures

### 7. **Test Isolation**
- Each test runs independently
- Clean browser state between tests
- No test dependencies

### 8. **CI/CD Integration**
- GitHub Actions workflow included
- Artifact upload for reports
- Database setup for CI

## Configuration

### Environment Variables

```bash
# .env.test
CI=true                    # CI mode (affects retries, workers)
BASE_URL=http://localhost:3000
DATABASE_URL=postgresql://...
```

### Playwright Config Highlights

- **Multi-browser testing** (Chromium, Firefox, WebKit)
- **Mobile device emulation**
- **Automatic screenshot/video on failure**
- **Trace collection for debugging**
- **Docker-compose integration**

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '../base.test';
import { TEST_USERS, SELECTORS } from '../constants/test-data';
import { login, expectElementToBeVisible } from '../utils/test-helpers';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Common setup
    await login(page, TEST_USERS.STANDARD.email, TEST_USERS.STANDARD.password);
  });

  test('should perform action successfully', async ({ page }) => {
    // Test implementation
    await page.goto('/feature');
    await expectElementToBeVisible(page, SELECTORS.FEATURE_ELEMENT);
  });
});
```

### Using Page Objects

```typescript
import { LoginPage } from '../pages/LoginPage';

test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(user.email, user.password);
  await loginPage.expectSuccessfulLogin();
});
```

### Using Test Helpers

```typescript
import { fillForm, submitForm, waitForNavigation } from '../utils/test-helpers';

// Fill multiple form fields
await fillForm(page, {
  email: 'user@example.com',
  password: 'password123'
});

// Submit any form
await submitForm(page);

// Wait for navigation
await waitForNavigation(page, '**/dashboard');
```

## Debugging

### Visual Debugging

```bash
# Run with browser visible
npm run test:e2e:headed

# Step-by-step debugging
npm run test:e2e:debug

# UI mode (best for development)
npm run test:e2e:ui
```

### Trace Analysis

```bash
# Generate and view traces
npx playwright show-trace test-results/*/trace.zip
```

### Common Issues

1. **Element not found** - Check selectors in `constants/test-data.ts`
2. **Timing issues** - Use appropriate wait strategies
3. **Authentication fails** - Check test user credentials
4. **Docker issues** - Ensure services are running

## CI/CD Integration

Tests run automatically on:
- Pull requests to `main`/`develop`
- Pushes to `main`
- Daily schedule (2 AM UTC)

Artifacts are preserved for 30 days:
- HTML reports
- Screenshots
- Videos
- Trace files

## Maintenance

### Adding New Tests

1. Follow existing patterns in `specs/`
2. Add new selectors to `constants/test-data.ts`
3. Create page objects if needed
4. Use existing helpers when possible

### Updating Selectors

1. Update `constants/test-data.ts`
2. Tests automatically use new selectors
3. No need to update individual test files

### Performance

- Tests run in parallel (6 workers locally)
- CI runs sequentially for stability
- Average test suite time: ~2-3 minutes

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices Guide](https://playwright.dev/docs/best-practices)
- [Page Object Model](https://playwright.dev/docs/test-pom)
- [CI/CD Integration](https://playwright.dev/docs/ci-intro)
