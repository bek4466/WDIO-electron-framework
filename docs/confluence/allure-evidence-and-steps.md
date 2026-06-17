# Allure Evidence and Step Reporting

## Purpose

This page explains how the framework uses Allure to make Electron test results useful for review, debugging, and release evidence.

The framework intentionally reports business-readable steps instead of every low-level WebDriver command. This keeps the report useful for QA, developers, and stakeholders while still attaching technical evidence when deeper debugging is needed.

## What Allure Captures

Every test can include:

| Evidence                   | Source                                 | Purpose                                                                                       |
| -------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------- |
| Suite labels               | `annotateTest()`                       | Groups results by smoke, regression, feature, and story.                                      |
| Owner, severity, tags      | `annotateTest()`                       | Improves filtering and triage.                                                                |
| Links                      | `annotateTest()` or JSON metadata      | Connects tests to requirements, tickets, or mock test case pages.                             |
| Business steps             | `allureStep()` or JSON flow step names | Shows the readable scenario flow.                                                             |
| JSON test data             | `attachJson()` or JSON runner          | Shows exactly what data drove the test.                                                       |
| Final screenshot           | `afterTest` evidence hook              | Captures the renderer state at the end of every test.                                         |
| Failure screenshot         | `afterTest` evidence hook              | Captures the renderer state on failure.                                                       |
| Runtime state              | `afterTest` evidence hook              | Captures title, URL, user agent, viewport, host OS, Node version, and result metadata.        |
| Browser console logs       | `afterTest` evidence hook              | Captures browser log output when WebDriver exposes it, otherwise records availability status. |
| WDIO and ChromeDriver logs | `afterTest` evidence hook              | Attaches tail output from runner and driver logs.                                             |
| Video                      | Windows `ffmpeg` recorder              | Attaches `.mp4` execution video when enabled on Windows.                                      |

Generated report files stay under `reports/`, which is ignored by Git.

## Step Strategy

Use Allure steps for actions that explain business intent:

```ts
await allureStep('Open sample dashboard', () => sampleDashboardScreen.open());
await allureStep('Increment counter through page object', () =>
  sampleDashboardScreen.incrementCounter(),
);
```

Avoid adding Allure steps for every selector lookup or every WebDriver command. Those details belong in the WDIO and ChromeDriver log attachments.

Good Allure step names should:

- describe user-visible behavior
- use feature language instead of implementation language
- map naturally to manual test steps
- be stable even if selectors or UI internals change

## JSON-Driven Step Reporting

JSON-driven tests use the JSON step `name` field as the Allure step name.

Example:

```json
{
  "name": "Validate ready status through shared assertion utility",
  "action": "expectStatusContains",
  "expected": "Ready for automation"
}
```

The TypeScript spec maps the JSON `action` to a typed handler. This gives the report readable steps while keeping execution controlled by framework code.

## Links

Allure links can point to real or mock systems:

```json
"links": [
  {
    "name": "Mock requirements",
    "url": "https://example.com/wdio-electron-framework/requirements",
    "type": "requirement"
  },
  {
    "name": "Mock test case",
    "url": "https://example.com/wdio-electron-framework/test-cases/JSON-SMOKE-001",
    "type": "test_case"
  }
]
```

Recommended link types:

| Type          | Example Destination                              |
| ------------- | ------------------------------------------------ |
| `requirement` | Jira story, Confluence requirement, product spec |
| `test_case`   | TestRail, Zephyr, Xray, or mock test case URL    |
| `issue`       | Defect or support ticket                         |
| `tms`         | Test management system item                      |

## Video Recording on Windows

Video recording is optional and controlled by environment variables.

Windows command:

```powershell
$env:E2E_RECORD_VIDEO="true"
$env:E2E_VIDEO_MAX_SECONDS="15"
$env:E2E_VIDEO_FPS="10"
yarn test:json-sample
```

Requirements:

- Windows desktop session must be available.
- `ffmpeg` must be installed and available in `PATH`.
- The runner must be allowed to capture the desktop session.

The framework uses `ffmpeg` with `gdigrab` and attaches the generated `.mp4` to Allure as `Test execution video`.

On non-Windows machines, video is skipped and Allure receives a `Video recording` JSON status attachment. This lets macOS local validation run without committing macOS-specific recorder behavior.

## Recommended Review Flow

1. Open the Allure test result.
2. Review labels, tags, owner, severity, and links.
3. Read the business steps in the `Execution` section.
4. Open the JSON test case attachment when validating data-driven behavior.
5. Open the final screenshot to inspect UI state.
6. Use runtime state, browser logs, WDIO logs, and ChromeDriver logs for debugging.
7. Use video on Windows when a scenario needs visual playback.

## Maintenance Rules

- Keep report artifacts ignored under `reports/`.
- Add links through metadata, not hardcoded report post-processing.
- Add business-level steps in specs or JSON data.
- Keep low-level command noise in log attachments.
- Keep video optional because it can increase runtime and report size.
