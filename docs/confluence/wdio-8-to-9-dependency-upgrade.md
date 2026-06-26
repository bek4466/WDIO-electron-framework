# WDIO 8 To WDIO 9 Dependency Upgrade

| Field           | Value                                          |
| --------------- | ---------------------------------------------- |
| Author          | Oybek                                          |
| Audience        | QA Team and Engineering                        |
| Repository      | `bek4466/WDIO-electron-framework`              |
| Branch          | `feature-e2e`                                  |
| Scope           | Framework dependency and runtime upgrade notes |
| Primary Runtime | Packaged Electron 41 `.exe` on Windows         |

## Executive Summary

The framework has been upgraded from the legacy WDIO 8 style into a WDIO 9 based TypeScript framework. The upgrade is not only a package version bump. It also changed how the framework handles Electron session creation, capability typing, Allure reporting, and JSON master spec execution.

The most important runtime change is that Electron 41 exposes Chromium 146. Because ChromeDriver must match the embedded Chromium version, the framework now supports an explicit `CHROMEDRIVER_BINARY_PATH` override and a manual attach config for packaged `.exe` execution.

## Upgrade Goals

- Move the automation stack to WebdriverIO 9 packages.
- Keep TypeScript strict and compatible with WDIO 9 types.
- Preserve legacy JSON master spec coverage from the old repo.
- Keep Allure reporting and evidence attachments working after the dependency upgrade.
- Support packaged Electron 41 execution on Windows.
- Avoid committing generated runtime artifacts.

## Dependency Baseline

The current dependency list is defined in `package.json`.

| Dependency              | Current Range | Purpose                                                                        |
| ----------------------- | ------------- | ------------------------------------------------------------------------------ |
| `@wdio/cli`             | `^9.0.0`      | WDIO command runner.                                                           |
| `@wdio/local-runner`    | `^9.0.0`      | Local worker execution.                                                        |
| `@wdio/mocha-framework` | `^9.0.0`      | Mocha integration for WDIO 9.                                                  |
| `@wdio/spec-reporter`   | `^9.0.0`      | Console reporter.                                                              |
| `@wdio/allure-reporter` | `^9.0.0`      | Allure reporter integration.                                                   |
| `@wdio/globals`         | `^9.0.0`      | WDIO globals and TypeScript global types.                                      |
| `@wdio/types`           | `^9.0.0`      | WDIO config/capability typing.                                                 |
| `wdio-electron-service` | `^6.0.0`      | Electron service support for packaged and local Electron execution.            |
| `electron`              | `41.0.0`      | Pinned Electron version required by the framework.                             |
| `chromedriver`          | `^132.0.0`    | Package-provided ChromeDriver; not always compatible with Electron 41 runtime. |
| `allure-commandline`    | `^2.31.0`     | Generates and opens Allure HTML report.                                        |
| `mocha`                 | `^10.4.0`     | Test framework used by WDIO.                                                   |
| `chai`                  | `^6.2.2`      | Assertion library.                                                             |
| `typescript`            | `5.4.5`       | TypeScript compiler.                                                           |
| `ts-node`               | `^10.9.2`     | TypeScript execution support.                                                  |
| `prettier`              | `^3.3.0`      | Formatting.                                                                    |
| `@types/node`           | `^20.12.12`   | Node.js types.                                                                 |
| `@types/mocha`          | `^10.0.7`     | Mocha types.                                                                   |
| `@types/chai`           | `^5.2.3`      | Chai types.                                                                    |

## Important Runtime Compatibility

Electron 41 contains Chromium 146 in the packaged app currently under test. The `chromedriver` npm package in this framework is declared as `^132.0.0`, which can be useful for baseline installs but is not guaranteed to match the packaged Electron runtime.

For Windows `.exe` runs, use:

```powershell
$env:CHROMEDRIVER_BINARY_PATH="C:\path\to\chromedriver-146.exe"
```

This prevents WDIO from using an incompatible ChromeDriver from `node_modules`.

## What Changed From WDIO 8 To WDIO 9

| Area               | WDIO 8 Style / Legacy Risk                                                 | WDIO 9 Framework Decision                                                                                         |
| ------------------ | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| WDIO packages      | Older `@wdio/*` package set.                                               | All core WDIO packages now use `^9.0.0`.                                                                          |
| Config typing      | Looser or older capability/config typing.                                  | Configs import `Capabilities` and `Options` from `@wdio/types`.                                                   |
| Globals            | Legacy specs often relied on global `browser`, `$`, and `expect` patterns. | `@wdio/globals` is installed and `tsconfig.json` includes `@wdio/globals/types`.                                  |
| Module system      | Legacy CommonJS style was common.                                          | Project uses ESM with `"type": "module"` and NodeNext TypeScript settings.                                        |
| Electron service   | Service startup can hide attach/session issues.                            | `wdio.conf.ts` keeps service usage, while `wdio.attach.conf.ts` provides explicit packaged `.exe` attach control. |
| BiDi behavior      | Older WDIO flows were classic WebDriver only.                              | Framework enforces classic WebDriver by default with `wdio:enforceWebDriverClassic`; BiDi is opt-in.              |
| ChromeDriver match | Older Electron/browser pairing was different.                              | Electron 41 requires ChromeDriver 146 for the target packaged app.                                                |
| Reporting          | Allure steps/evidence needed modernization.                                | Allure labels, links, screenshots, videos, logs, and JSON attachments are centralized.                            |
| Master specs       | Large master spec contained most orchestration logic.                      | Master specs are thin and delegate to `defineJsonMasterSuite()`.                                                  |
| Data selection     | Filtering by title/grep could run the wrong case.                          | Runner-level folder/file/case filters were added before Mocha registration.                                       |

## Config Changes

### Main WDIO Config

`wdio.conf.ts` remains the standard config:

```text
services: ['electron']
framework: 'mocha'
reporters: ['spec', ['allure', ...]]
capabilities: [buildElectronCapability()]
```

Use this config for normal Electron service execution when session creation is stable.

### Manual Attach Config

`wdio.attach.conf.ts` was added for packaged Windows `.exe` runs and ChromeDriver attach troubleshooting.

It performs these steps before WDIO reaches Mocha:

1. Launches the configured `.exe`.
2. Waits for the DevTools endpoint.
3. Finds the stable `ControlScript Deployment Utility` target.
4. Closes hidden or blank Electron targets.
5. Activates the selected target.
6. Starts ChromeDriver session creation through `debuggerAddress`.

This config was required because ChromeDriver was attaching to hidden/blank Electron targets before the actual app window.

## Capability Changes

The Electron capability is generated from `config/electron.config.ts`.

Important capability fields:

```ts
{
  browserName: 'electron',
  browserVersion: '41.0.0',
  'wdio:enforceWebDriverClassic': true,
  'goog:chromeOptions': {
    windowTypes: ['tab', 'page', 'app', 'webview']
  },
  'wdio:electronServiceOptions': {
    appBinaryPath: '...'
  },
  'wdio:chromedriverOptions': {
    binary: '...',
    logPath: 'reports/wdio-logs/chromedriver-session.log',
    verbose: true
  }
}
```

For the manual attach config, the capability uses:

```ts
{
  browserName: 'chrome',
  'goog:chromeOptions': {
    debuggerAddress: '127.0.0.1:9229',
    windowTypes: ['tab', 'page', 'app', 'webview']
  }
}
```

## TypeScript Changes

The framework uses:

```json
{
  "module": "NodeNext",
  "moduleResolution": "NodeNext",
  "target": "ES2022",
  "types": ["node", "mocha", "@wdio/globals/types"],
  "strict": true
}
```

Impact:

- Imports use ESM-compatible `.js` paths in TypeScript source.
- WDIO config files are typechecked.
- Global WDIO types are available in specs and support files.
- Strict typing catches unsupported JSON action mappings earlier.

## Allure Upgrade Notes

Allure reporting is configured in both WDIO configs.

The framework attaches:

- suite, epic, feature, story, owner, severity, and tags
- Jira/test-management links from JSON metadata
- sanitized JSON test case attachments
- JSON action summaries
- screenshots
- videos when evidence capture is enabled
- WDIO logs
- ChromeDriver logs
- Electron target diagnostic JSON files

Generate the report:

```powershell
yarn allure:generate
yarn allure:open
```

Do not commit:

```text
reports/allure-results
reports/allure-report
reports/screenshots
reports/videos
reports/wdio-logs
```

## JSON Master Spec Runner Changes

The WDIO 9 refactor changed the old master spec shape.

Old approach:

- large master spec file
- direct orchestration inside the spec
- hard to isolate one JSON file
- grep could run the wrong test if titles did not include the file id

New approach:

- master spec calls `defineJsonMasterSuite(...)`
- runner discovers JSON cases from `files.json`
- live execution is handled by `json-live-executor.ts`
- filters run before Mocha registers tests

Supported filters:

| Variable                  | Example                 | Purpose                                                  |
| ------------------------- | ----------------------- | -------------------------------------------------------- |
| `E2E_JSON_EXECUTION_MODE` | `live`                  | Runs real UI actions instead of catalog-only validation. |
| `E2E_JSON_FOLDERS`        | `Deployment-tests`      | Runs one or more master spec folders.                    |
| `E2E_JSON_FILES`          | `CSP-326.e2e-spec.json` | Runs one or more JSON files.                             |
| `E2E_JSON_CASES`          | `TestCase1`             | Runs one or more case ids inside selected files.         |
| `E2E_JSON_LIMIT`          | `1`                     | Limits selected cases during triage.                     |

Recommended targeted command:

```powershell
$env:E2E_JSON_EXECUTION_MODE="live"
$env:E2E_JSON_FOLDERS="Deployment-tests"
$env:E2E_JSON_FILES="CSP-326.e2e-spec.json"
$env:E2E_JSON_CASES="TestCase1"

yarn test:attach:e2e-json:newmaster
```

## Package Manager Change

The framework uses Yarn:

```json
"packageManager": "yarn@1.22.22"
```

Expected install command:

```powershell
yarn install
```

The repo should use `yarn.lock`. Do not add or commit `package-lock.json`.

## Report Cleanup Behavior

All test scripts run `yarn clean:reports` before WDIO starts. This removes stale report output from the previous run, then leaves the new run's reports in place after execution.

Use:

```powershell
yarn clean:reports
```

to remove only report output.

Use:

```powershell
yarn clean
```

for full cleanup, including generated distribution output.

## Verification Commands

Use these commands after dependency/config changes:

```powershell
yarn typecheck
yarn format:check
yarn validate:e2e-json
yarn verify:electron
```

For Windows packaged `.exe` validation:

```powershell
$env:CSDU_EXE_LOCATION="C:\path\to\ControlScript Deployment Utility.exe"
$env:CHROMEDRIVER_BINARY_PATH="C:\path\to\chromedriver-146.exe"
$env:ELECTRON_ATTACH_TARGET_TITLE="ControlScript Deployment Utility"
$env:ELECTRON_ATTACH_CLOSE_EMPTY_TARGETS="true"
$env:E2E_JSON_EXECUTION_MODE="live"
$env:E2E_JSON_FOLDERS="Deployment-tests"
$env:E2E_JSON_FILES="CSP-326.e2e-spec.json"
$env:E2E_JSON_CASES="TestCase1"

yarn test:attach:e2e-json:newmaster
```

## Risk And Mitigation

| Risk                                     | Mitigation                                                                                    |
| ---------------------------------------- | --------------------------------------------------------------------------------------------- |
| ChromeDriver version mismatch            | Use `CHROMEDRIVER_BINARY_PATH` and validate Electron/Chromium version.                        |
| WDIO attaches to hidden Electron target  | Use `wdio.attach.conf.ts`, target activation, and blank-target cleanup.                       |
| Wrong JSON case runs                     | Use `E2E_JSON_FOLDERS`, `E2E_JSON_FILES`, and `E2E_JSON_CASES`.                               |
| Allure report is empty                   | Confirm WDIO reached `beforeTest`; session failures happen before Mocha creates test results. |
| Legacy action not mapped                 | The live executor reports unsupported actions in Allure and can fail fast in strict mode.     |
| Runtime artifacts accidentally committed | `.gitignore` excludes reports, logs, screenshots, and videos.                                 |

## QA And Engineering Responsibilities

QA Team:

- Owns JSON test data, manifests, expected values, and test case selection.
- Reviews Allure evidence and confirms behavior.
- Provides the exact JSON folder/file/case for targeted runs.

Engineering:

- Owns product behavior, stable selectors, Electron startup behavior, and DevTools target exposure.
- Helps diagnose renderer/window changes that affect automation attach.

Automation:

- Owns framework dependency alignment, WDIO config, live JSON action mapping, and reporting evidence.
- Maintains compatibility between Electron version, ChromeDriver version, and WDIO runtime behavior.
