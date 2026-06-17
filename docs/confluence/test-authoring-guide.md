# Test Authoring Guide

## Goal

This guide explains how to add maintainable Electron automation coverage using the framework patterns already in place.

## Test Authoring Checklist

Before adding a test, confirm:

- the application has stable selectors, preferably `data-testid`
- expected values are placed in `src/test-data`
- UI interactions are modeled in `src/screens`
- specs stay focused on scenario flow and assertions
- Allure metadata is added for report readability

## Naming Guidelines

| Artifact        | Convention                                        | Example                    |
| --------------- | ------------------------------------------------- | -------------------------- |
| Screen object   | `<feature>.screen.ts`                             | `login.screen.ts`          |
| Smoke spec      | `<behavior>.spec.ts` under `src/specs/smoke`      | `app-launch.spec.ts`       |
| Regression spec | `<behavior>.spec.ts` under `src/specs/regression` | `window-state.spec.ts`     |
| Test data       | `<feature>.data.ts`                               | `sample-dashboard.data.ts` |
| Selectors       | `data-testid` value describes purpose             | `submit-login-button`      |

## Step 1: Add Test Data

Create or update a file under `src/test-data`.

```ts
export const loginData = {
  validUser: {
    username: 'automation.user',
    password: 'secret',
  },
  messages: {
    welcome: 'Welcome',
  },
};
```

## Step 2: Create a Screen Object

Screen objects should expose user intent, not low-level implementation details.

```ts
import { BaseScreen } from '../pages/base.screen.js';

class LoginScreen extends BaseScreen {
  constructor() {
    super('[data-testid="login-screen"]');
  }

  get usernameInput() {
    return this.byTestId('username-input');
  }

  get passwordInput() {
    return this.byTestId('password-input');
  }

  get submitButton() {
    return this.byTestId('submit-login-button');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.setValue(username);
    await this.passwordInput.setValue(password);
    await this.submitButton.click();
  }
}

export const loginScreen = new LoginScreen();
```

## Step 3: Add a Spec

Specs should read like behavior documentation.

```ts
import { expect } from 'chai';
import { loginScreen } from '../../screens/login.screen.js';
import { annotateTest, allureStep, attachJson } from '../../support/allure.js';
import { loginData } from '../../test-data/login.data.js';

describe('Login', () => {
  it('allows a valid user to sign in', async () => {
    await annotateTest({
      suite: 'Smoke',
      epic: 'Authentication',
      feature: 'Login',
      story: 'Valid user sign in',
      severity: 'critical',
      owner: 'QA Automation',
      tags: ['smoke', 'login'],
      description: 'Validates that a known user can sign in successfully.',
    });

    await attachJson('Login user', {
      username: loginData.validUser.username,
    });

    await allureStep('Wait for login screen', () => loginScreen.waitForLoaded());
    await allureStep('Submit login form', () =>
      loginScreen.login(loginData.validUser.username, loginData.validUser.password),
    );

    expect(await loginScreen.getWindowTitle()).to.contain(loginData.messages.welcome);
  });
});
```

## Step 4: Run Quality Checks

Run the smallest useful suite first, then broader checks before pushing.

```bash
yarn typecheck
yarn format:check
yarn test:smoke
yarn allure:generate
```

For shared framework changes, run:

```bash
yarn test:regression
```

## Allure Metadata Standards

Use these fields consistently:

| Field         | Purpose             | Example                         |
| ------------- | ------------------- | ------------------------------- |
| `suite`       | Execution grouping  | `Smoke`                         |
| `epic`        | Product area        | `Authentication`                |
| `feature`     | Feature under test  | `Login`                         |
| `story`       | User behavior       | `Valid user sign in`            |
| `severity`    | Business impact     | `critical`                      |
| `owner`       | Responsible team    | `QA Automation`                 |
| `tags`        | Search/filter terms | `['smoke', 'login']`            |
| `description` | Short test intent   | `Validates successful sign in.` |

## Selector Standards

Prefer stable selectors owned by the product team:

```html
<button data-testid="submit-login-button">Sign in</button>
```

Avoid selectors based on:

- CSS layout classes
- text that changes frequently
- generated IDs
- deep DOM structure
- visual position

## Data-Driven Test Pattern

For multiple scenarios, keep the spec loop readable:

```ts
for (const scenario of loginScenarios) {
  it(`shows validation message for ${scenario.name}`, async () => {
    await attachJson('Scenario', scenario);
    await loginScreen.login(scenario.username, scenario.password);

    expect(await loginScreen.errorMessage.getText()).to.equal(scenario.expectedMessage);
  });
}
```

## When to Add Smoke vs Regression Tests

| Suite      | Use For                                                           |
| ---------- | ----------------------------------------------------------------- |
| Smoke      | Launch, critical user paths, release-blocking checks              |
| Regression | Broader workflows, edge cases, state handling, non-critical paths |

## Review Checklist

Before opening or merging a change:

- specs are readable without knowing selector details
- screen objects contain UI mechanics
- test data is not hardcoded into spec bodies
- Allure labels and steps explain the scenario
- failed test artifacts will be useful for debugging
- `yarn typecheck` passes
- `yarn format:check` passes
- the relevant WDIO suite passes
