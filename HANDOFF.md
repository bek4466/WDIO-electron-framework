# Engineering Handoff Summary

## Current System Architecture

Repository: `bek4466/WDIO-electron-framework`
Active branch: `feature-e2e`

This is a TypeScript + Node.js + WebdriverIO 9 framework for testing packaged Electron 41 apps, primarily Windows `.exe` targets.

Key architecture:

- `wdio.conf.ts`: WDIO runner configuration, Electron service wiring, suites, Allure hooks.
- `config/electron.config.ts`: Electron 41 binary/chromedriver configuration, Windows `.exe` resolution, browser version handling.
- `config/reporting.config.ts`: Report output directories for Allure, screenshots, videos, and logs.
- `e2e/tests/support/json-master-runner.ts`: Discovers JSON-driven cases from legacy folders/manifests.
- `e2e/tests/support/json-live-executor.ts`: Main live execution adapter that maps old JSON/master-spec actions into WDIO UI/file operations.
- `e2e/tests/regression/NEWMASTERSPEC/UpdatedMaster.e2e-spec.ts`: New master spec entrypoint calling `defineJsonMasterSuite`.
- `docs/live-json-execution.md`: Current operational documentation for live JSON execution and legacy parity.

## Active Files Under Development

Primary active file:

- `e2e/tests/support/json-live-executor.ts`

Documentation:

- `docs/live-json-execution.md`

Important old-source references already reviewed:

- `bek4466/e2e-wdio-refactor`, branch `old-code-e2e`
- `e2e/tests/regression/NEWMASTERSPEC/UpdatedMaster.e2e-spec.ts`
- `e2e/tests/commonMethods.po.ts`

## Recent Engineering Decisions

- The legacy huge master spec was not copied directly. Its behavior is being refactored into a centralized live JSON executor.
- JSON execution supports catalog and live modes via `E2E_JSON_EXECUTION_MODE`.
- All known old master-spec top-level branch names are now routed.
- Old file helpers from `commonMethods.po.ts` were ported where relevant to current JSON tests.
- Device/network operations such as `GmCommands`, `CheckECW`, `CheckNavCommands`, and `VerifyVTLP` are explicitly mapped as structured Allure evidence because they require real lab devices/controller web pages.
- WDIO tests were intentionally not run on macOS because the real packaged Windows `.exe` is required.
- Validation has been static only:
  - `yarn typecheck`
  - `yarn format:check`
  - `yarn validate:e2e-json`

## Latest Pushed Commits On `feature-e2e`

- `fcb95de` - `Expand legacy JSON live mappings`
- `95e8ef0` - `Complete old master spec live mappings`
- `a75f0e4` - `Port old common method behavior`

All commits use author:

```text
bek4466 <27562902+bek4466@users.noreply.github.com>
```

## Current Coverage Status

Mapped old master-spec branches include:

`AboutAction`, `AccessPageAction`, `AppAction`, `Banner`, `ChangeCredentials`, `ChangeName`, `ChangePythonFile`, `CheckECW`, `CheckNavCommands`, `CheckSpecificTraceMessages`, `CommonMethod`, `DeployAction`, `DeployPage`, `EditProjectFile`, `GmCommands`, `LoginPage`, `LoginPopUp`, `MiscellaneousAction`, `ProfileAction`, `ProfilePage`, `RenameFiles`, `SignOutAction`, `SignOutPopUp`, `Timeout`, `Toast`, `TroubleshootingAction`, `TroubleshootingPage`, `VerifyErrorUnderDeployFilePath`, `VerifyMessage`, `VerifyProgramMessageLogs`, `VerifyProgressBar`, `VerifyToastExists`, `VerifyTraceMessage`, `VerifyTraceMessageLogs`, `VerifyTroubleShootingMessage`, `VerifyVTLP`.

Ported common method behaviors include:

`copyFile`, `findFile`, `cannotFindFile`, `doNotFindFile`, `deleteFile`, `deleteFolder`, `appendToFile`, `prependToFile`, `textToMidFile`, `replaceTextInFile`, `renameFiles`, `saveFileModifiedDate`, `compareFileModifiedDateToSavedDate`, `saveFileContent`, `compareFileContentToSavedFileContent`, `checkMessageInFile`.

## Unresolved Bugs / Risks

- Runtime behavior has not yet been validated against the real Windows Electron `.exe`.
- Some device/network actions are evidence-only and need Windows lab validation.
- Selectors may need adjustment once real UI execution starts.
- `VerifyVTLP`, `CheckECW`, `CheckNavCommands`, and `GmCommands` cannot be fully validated without controller/device access.
- The app previously launched but sat idle; this should be retested now that live mappings are expanded.
- Some assertions are intentionally tolerant, especially date/certification checks, because old logic depended on timing windows.

## Exact Next Steps

1. On Windows, pull latest `feature-e2e`:

```powershell
git checkout feature-e2e
git pull origin feature-e2e
```

2. Set the real `.exe` path:

```powershell
$env:CSDU_EXE_LOCATION="C:\path\to\ControlScript Deployment Utility.exe"
```

or:

```powershell
$env:ELECTRON_APP_BINARY_PATH="C:\path\to\ControlScript Deployment Utility.exe"
```

3. Run one live JSON case first:

```powershell
$env:E2E_JSON_EXECUTION_MODE="live"
$env:E2E_JSON_LIMIT="1"
$env:E2E_APP_READY_TITLE="ControlScript Deployment Utility"
$env:E2E_RESOURCE_ROOT="C:\path\to\e2e\resources"

yarn wdio run ./wdio.conf.ts --logLevel debug --spec ./e2e/tests/regression/NEWMASTERSPEC/UpdatedMaster.e2e-spec.ts
```

4. If the app launches but test appears idle, inspect:

- `reports/wdio-logs`
- `reports/allure-results`
- screenshots/videos/log attachments
- Allure attachment named `Unsupported live JSON actions`

5. If unsupported actions appear, add mappings in:

```text
e2e/tests/support/json-live-executor.ts
```

6. If selector failures occur, update locator JSON mappings under:

```text
e2e/src/JSON
```

7. Regenerate and inspect Allure:

```powershell
yarn allure:generate
yarn allure:open
```

8. After Windows validation, commit only source/docs changes. Do not commit generated reports.
