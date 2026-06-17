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
yarn test:smoke
```

By default, `yarn test:smoke` launches the included sample Electron app. This proves the framework, WDIO service, TypeScript config, page object model, data layer, and reports all work before connecting it to a real app.

## Run Against a Packaged `.exe`

Use `ELECTRON_APP_BINARY_PATH` for the real Windows Electron executable:

```powershell
$env:ELECTRON_APP_BINARY_PATH="C:\Apps\YourElectronApp\YourElectronApp.exe"
$env:ELECTRON_APP_ARGS="--automation"
$env:EXPECTED_WINDOW_TITLES="Your App"
yarn test:exe
```

The capability is built in `config/electron.config.ts` and passed to `wdio-electron-service` as:

```ts
{
  browserName: 'electron',
  'wdio:electronServiceOptions': {
    appBinaryPath: 'C:\\Apps\\YourElectronApp\\YourElectronApp.exe',
    appArgs: ['--automation'],
  },
}
```

When no `.exe` path is set, `yarn test:smoke` creates a lightweight packaged sample app under `dist/electron-smoke-app` and points WDIO at that real Electron binary for a runnable baseline.

## Project Layout

```text
config/                         WDIO, Electron, environment, and reporting config
src/pages/                      Base page/screen abstractions
src/screens/                    Page object model classes
src/specs/smoke/                Critical launch and happy-path checks
src/specs/regression/           Broader regression coverage
src/test-data/                  Data-driven test inputs and expected values
src/support/                    Shared selectors, waits, and assertions
src/fixtures/electron-smoke-app/ Local Electron 41 smoke app
scripts/                        Maintenance and validation scripts
docs/                           Usage notes
```

## Common Commands

```bash
yarn clean
yarn test:smoke
yarn test:regression
yarn typecheck
yarn format
yarn allure:generate
yarn allure:open
```

## Framework Notes

- Page object model starts with `BaseScreen` in `src/pages/base.screen.ts`.
- Test data stays outside specs in `src/test-data`.
- Selectors use `data-testid` by default for stable automation contracts.
- Screenshots are saved to `reports/screenshots` on failure.
- Allure results are saved to `reports/allure-results`.
- The sample dashboard spec is skipped automatically when `ELECTRON_APP_BINARY_PATH` is set, so real `.exe` smoke runs stay generic until app-specific page objects are added.

## Adding Real App Coverage

1. Add stable `data-testid` attributes or other automation-friendly selectors in the app.
2. Create a screen object in `src/screens`.
3. Add scenario data in `src/test-data`.
4. Add specs under `src/specs/smoke` or `src/specs/regression`.
5. Run with the packaged `.exe` path:

```powershell
$env:ELECTRON_APP_BINARY_PATH="C:\Apps\YourElectronApp\YourElectronApp.exe"
yarn test:smoke
```
