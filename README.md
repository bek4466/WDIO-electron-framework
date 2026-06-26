# WDIO Electron Framework

Scalable WebdriverIO v9 + TypeScript framework for testing Electron `41.0.0` desktop apps.

## Tech Stack

- TypeScript `5.4.5`
- Node.js
- WebdriverIO v9
- Mocha + Chai
- Allure reporting
- `wdio-electron-service` `^6.0.0`
- Electron pinned to `41.0.0`

## Quick Start

```bash
yarn install
yarn verify:electron
yarn typecheck
```

Set `CSDU_EXE_LOCATION` or `ELECTRON_APP_BINARY_PATH` before launching WDIO. The framework no longer ships a mock Electron app; it is configured to run against your packaged Electron application.

## Run Against a Packaged `.exe`

Use `CSDU_EXE_LOCATION` for the real Windows CSDU executable, or use `ELECTRON_APP_BINARY_PATH` for any packaged Electron executable:

```powershell
$env:CSDU_EXE_LOCATION="C:\Program Files\Extron\ControlScript Deployment Utility\ControlScript Deployment Utility.exe"
$env:ELECTRON_APP_ARGS="--automation"
$env:EXPECTED_WINDOW_TITLES="Your App"
yarn test:exe
```

The capability is built in `config/electron.config.ts` and passed to `wdio-electron-service` as:

```ts
{
  browserName: 'electron',
  browserVersion: '146.0.0.0',
  'wdio:electronServiceOptions': {
    appBinaryPath:
      'C:\\Program Files\\Extron\\ControlScript Deployment Utility\\ControlScript Deployment Utility.exe',
    appArgs: ['--automation'],
  },
}
```

If no executable env var is set, the framework checks the common CSDU install paths under `C:\Program Files` and `C:\Program Files (x86)`. Browser version can be set with `ELECTRON_APP_BROWSER_VERSION`, or detected from the `.exe` to help WDIO select the right ChromeDriver.

## Project Layout

```text
config/                         WDIO, Electron, environment, and reporting config
src/pages/                      Base page/screen abstractions
src/screens/                    Page object model classes
src/specs/smoke/                Critical launch and happy-path checks
src/specs/regression/           Broader regression coverage
src/test-data/                  Data-driven test inputs and expected values
src/support/                    Shared selectors, waits, and assertions
e2e/src/                        Imported legacy E2E page objects and JSON data
e2e/tests/                      Imported legacy E2E specs and JSON-driven master specs
scripts/                        Maintenance and validation scripts
docs/                           Usage notes
docs/confluence/                Confluence-ready framework documentation and diagrams
```

## Common Commands

```bash
yarn clean
yarn test:smoke
yarn test:regression
yarn test:e2e-json
yarn typecheck
yarn format
yarn allure:generate
yarn allure:open
```

Test scripts run `yarn clean:reports` before WDIO starts. The new reports remain available after the run for Allure generation and log review. Use `yarn clean` when you want a full cleanup including generated distribution output.

## Allure Reporting

Each WDIO run writes Allure results to `reports/allure-results`. Generate the HTML report after a run with:

```bash
yarn allure:generate
yarn allure:open
```

The report includes suite/epic/feature/story labels, severity, owner, tags, environment metadata, JSON attachments for useful runtime state, and failure screenshots.

## Framework Notes

- Page object model starts with `BaseScreen` in `src/pages/base.screen.ts`.
- Test data stays outside specs in `src/test-data`.
- Selectors use `data-testid` by default for stable automation contracts.
- Screenshots are saved to `reports/screenshots`.
- Allure results are saved to `reports/allure-results`.
- Smoke and regression suites require a packaged Electron app path.

## Adding Real App Coverage

1. Add stable `data-testid` attributes or other automation-friendly selectors in the app.
2. Create a screen object in `src/screens`.
3. Add scenario data in `src/test-data`.
4. Add specs under `src/specs/smoke` or `src/specs/regression`.
5. Run with the packaged `.exe` path:

```powershell
$env:CSDU_EXE_LOCATION="C:\Program Files\Extron\ControlScript Deployment Utility\ControlScript Deployment Utility.exe"
yarn test:smoke
```
