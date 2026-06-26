# Framework Documentation

## Purpose

The WDIO Electron Framework is a scalable TypeScript automation framework for Electron `41.0.0` desktop applications. It is built around WebdriverIO v9, Mocha, Chai, the page object model, data-driven test inputs, and Allure reporting.

The framework can run against:

- a real packaged Electron binary through `CSDU_EXE_LOCATION` or `ELECTRON_APP_BINARY_PATH`
- a Windows `.exe` path when tests are executed on Windows

## Technology Stack

| Area               | Tooling                 |
| ------------------ | ----------------------- |
| Language           | TypeScript `5.4.5`      |
| Runtime            | Node.js                 |
| Package manager    | Yarn classic `1.22.22`  |
| Test runner        | WebdriverIO v9          |
| Test framework     | Mocha                   |
| Assertions         | Chai                    |
| Desktop automation | `wdio-electron-service` |
| Electron target    | Electron `41.0.0`       |
| Reporting          | Allure                  |
| Formatting         | Prettier                |

## Framework Design Principles

- Keep specs focused on business behavior and assertions.
- Keep selectors and UI interactions inside screen objects.
- Keep test data outside specs for reusable and data-driven coverage.
- Keep environment-specific values in configuration and environment variables.
- Keep reports useful by attaching metadata, steps, screenshots, and structured runtime state.

## Folder Structure

```text
config/                         WDIO, Electron, environment, and reporting config
docs/                           Framework usage and Confluence-ready documentation
scripts/                        Maintenance, packaging, and validation scripts
src/pages/                      Base page/screen abstractions
src/screens/                    Page object model classes
src/specs/smoke/                Critical launch and happy-path checks
src/specs/regression/           Broader regression coverage
src/support/                    Selectors, waits, assertions, Allure helpers
src/test-data/                  Data-driven inputs and expectations
reports/                        Generated test output, ignored by git
```

## Key Configuration Files

| File                                    | Responsibility                                    |
| --------------------------------------- | ------------------------------------------------- |
| `wdio.conf.ts`                          | WDIO runner, suites, services, reporters, hooks   |
| `config/electron.config.ts`             | Electron binary resolution and service capability |
| `config/env.ts`                         | Typed environment variable helpers                |
| `config/reporting.config.ts`            | Report and screenshot output paths                |
| `src/support/allure.ts`                 | Reusable Allure labels, steps, and attachments    |
| `scripts/validate-electron-version.mjs` | Verifies Electron is pinned to `41.0.0`           |

## Execution Modes

### Real Packaged Electron App

Set `CSDU_EXE_LOCATION` or `ELECTRON_APP_BINARY_PATH` to the packaged app binary before running tests.

Windows PowerShell example:

```powershell
$env:CSDU_EXE_LOCATION="C:\Program Files\Extron\ControlScript Deployment Utility\ControlScript Deployment Utility.exe"
$env:ELECTRON_APP_ARGS="--automation,--disable-updates"
$env:EXPECTED_WINDOW_TITLES="Your App"
yarn test:exe
```

macOS/Linux example:

```bash
export ELECTRON_APP_BINARY_PATH="/Applications/YourElectronApp.app/Contents/MacOS/YourElectronApp"
export ELECTRON_APP_ARGS="--automation,--disable-updates"
export EXPECTED_WINDOW_TITLES="Your App"
yarn test:smoke
```

## Environment Variables

| Variable                               | Required | Description                                                     | Example                                                            |
| -------------------------------------- | -------- | --------------------------------------------------------------- | ------------------------------------------------------------------ |
| `CSDU_EXE_LOCATION`                    | No       | Preferred CSDU executable path alias.                           | `C:\Program Files\Extron\...\ControlScript Deployment Utility.exe` |
| `ELECTRON_APP_BINARY_PATH`             | No       | Generic path to the real packaged Electron binary.              | `C:\Apps\App\App.exe`                                              |
| `ELECTRON_APP_ARGS`                    | No       | Comma-separated arguments passed to the Electron app.           | `--automation,--disable-updates`                                   |
| `ELECTRON_APP_BROWSER_VERSION`         | No       | Explicit embedded Chromium/browser version for driver matching. | `146.0.0.0`                                                        |
| `ELECTRON_AUTO_DETECT_BROWSER_VERSION` | No       | Set to `false` to skip automatic `.exe` version detection.      | `false`                                                            |
| `CHROMEDRIVER_BINARY_PATH`             | No       | Explicit ChromeDriver executable path.                          | `C:\tools\chromedriver.exe`                                        |
| `EXPECTED_WINDOW_TITLES`               | No       | Comma-separated titles used by launch validation.               | `Your App,Login`                                                   |
| `WAIT_TIMEOUT_MS`                      | No       | Default wait timeout in milliseconds.                           | `15000`                                                            |

## Common Commands

| Command                | Purpose                                            |
| ---------------------- | -------------------------------------------------- |
| `yarn install`         | Install dependencies from `yarn.lock`              |
| `yarn verify:electron` | Confirm Electron is pinned to `41.0.0`             |
| `yarn typecheck`       | Run TypeScript compile checks                      |
| `yarn format:check`    | Verify Prettier formatting                         |
| `yarn format`          | Format project files                               |
| `yarn clean:reports`   | Remove generated report output only                |
| `yarn clean`           | Remove reports plus full transient output          |
| `yarn test:smoke`      | Run smoke suite                                    |
| `yarn test:regression` | Run regression suite                               |
| `yarn test:exe`        | Run smoke suite against configured packaged binary |
| `yarn allure:generate` | Generate HTML report from Allure results           |
| `yarn allure:open`     | Open generated Allure HTML report                  |

All `yarn test:*` scripts run `yarn clean:reports` before WDIO starts. Reports are preserved after the test finishes so the user can inspect logs or generate Allure.

## Page Object Model

The framework uses a layered page object model:

- `BaseScreen` owns common screen behavior such as root lookup and load waits.
- Screen classes expose semantic elements and user actions.
- Specs call screen methods and assert behavior.
- Selectors stay centralized and stable through `data-testid`.

Example flow:

```text
Spec -> Screen object -> BaseScreen/support helper -> WDIO browser/element API -> Electron renderer
```

## Data-Driven Testing

Test data is stored in `src/test-data`. Specs import the data and use it for assertions or scenario iteration.

Benefits:

- test logic stays readable
- expected values are reusable
- future product data can be moved to JSON, API fixtures, or environment-aware providers

## Reporting

Allure reporting is configured in `wdio.conf.ts` and supported by `src/support/allure.ts`.

Each run writes raw results to:

```text
reports/allure-results
```

Generate the HTML report:

```bash
yarn allure:generate
```

Open the report:

```bash
yarn allure:open
```

The report includes:

- suite, epic, feature, and story labels
- severity, owner, tags, and links
- environment metadata
- named business steps
- JSON test data and runtime state attachments
- final screenshots for every test
- failure details for failed tests
- browser console availability or log output
- WDIO and ChromeDriver log tails
- optional Windows video evidence through `ffmpeg`

See `docs/confluence/allure-evidence-and-steps.md` for the detailed reporting strategy.

## Adding New Test Coverage

1. Add stable selectors to the application under test, preferably `data-testid`.
2. Add or update test data in `src/test-data`.
3. Create a screen object in `src/screens`.
4. Add specs under `src/specs/smoke` or `src/specs/regression`.
5. Use `annotateTest`, `allureStep`, and `attachJson` for report quality.
6. Run `yarn typecheck`, `yarn format:check`, and the relevant suite.
7. Generate Allure with `yarn allure:generate` when sharing evidence.

## Quality Gates

Before pushing framework changes, run:

```bash
yarn verify:electron
yarn typecheck
yarn format:check
yarn test:smoke
yarn test:regression
yarn allure:generate
```

## Troubleshooting

| Symptom                                       | Likely Cause                                                             | Action                                                   |
| --------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------- |
| Electron launches default app error           | Packaged app path points to Electron shell instead of real app resources | Verify packaging output and `appBinaryPath`              |
| No renderer windows found                     | App failed to launch or startup is too slow                              | Check app path, app args, and increase `WAIT_TIMEOUT_MS` |
| Allure report is empty                        | Tests did not run or results directory was cleaned                       | Run a test before `yarn allure:generate`                 |
| Windows `.exe` path fails on non-Windows host | `.exe` must run on Windows                                               | Execute the `.exe` suite on a Windows machine            |
