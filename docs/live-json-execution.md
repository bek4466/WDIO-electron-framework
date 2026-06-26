# Live JSON Execution

The JSON master specs support two execution modes:

- `catalog`: discovers executable JSON cases, validates structure, and attaches Allure metadata.
- `live`: dispatches JSON `Steps` against the running Electron UI.

Use `live` when you want the master specs to click/type/verify against the packaged `.exe`.

## Windows Command

```powershell
$env:CSDU_EXE_LOCATION="C:\Program Files\Extron\ControlScript Deployment Utility\ControlScript Deployment Utility.exe"
$env:E2E_JSON_EXECUTION_MODE="live"
$env:E2E_JSON_LIMIT="1"
$env:E2E_JSON_FOLDERS="Deployment-tests"
$env:E2E_APP_READY_TITLE="ControlScript Deployment Utility"
$env:E2E_APP_READY_SELECTOR="#deploy-component"
$env:E2E_JSON_BOOTSTRAP_PAUSE_MS="25000"
$env:E2E_RESOURCE_ROOT="C:\path\to\e2e\resources"
yarn test:e2e-json:newmaster
```

Remove `E2E_JSON_LIMIT` after the first live case is stable.

## Important Environment Variables

| Variable                                     | Purpose                                                                                  |
| -------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `E2E_JSON_EXECUTION_MODE=live`               | Enables real UI execution.                                                               |
| `E2E_JSON_LIMIT=1`                           | Runs only the first discovered executable case while debugging.                          |
| `E2E_JSON_FOLDERS=smoke-tests`               | Limits `UpdatedMaster.e2e-spec.ts` discovery to one folder.                              |
| `E2E_JSON_FILES=CSP-326.e2e-spec.json`       | Limits discovery to one or more comma-separated JSON files.                              |
| `E2E_JSON_CASES=TestCase1`                   | Limits discovery to one or more comma-separated case ids inside selected files.          |
| `E2E_APP_READY_TITLE`                        | Optional window title filter before tests start.                                         |
| `E2E_APP_READY_SELECTOR`                     | Optional selector that proves the real app UI is ready.                                  |
| `E2E_APP_READY_TIMEOUT_MS`                   | Startup readiness timeout. Defaults to `60000`.                                          |
| `E2E_APP_WINDOW_TIMEOUT_MS`                  | Main-window switch timeout. Defaults to `60000`.                                         |
| `E2E_JSON_BOOTSTRAP_PAUSE_MS`                | One-time live startup pause before window switching. Defaults to `25000`.                |
| `E2E_JSON_MESSAGE_TIMEOUT_MS`                | Maximum wait for an expected message, trace, or program-log entry. Defaults to `400000`. |
| `E2E_JSON_MESSAGE_POLL_INTERVAL_MS`          | Interval between message checks. Defaults to `1000`.                                     |
| `E2E_RESOURCE_ROOT`                          | Folder that contains project resources like `DeployProject\systeminfo.json`.             |
| `E2E_JSON_STRICT_UNSUPPORTED=false`          | Allows unsupported JSON actions to be attached to Allure without failing the test.       |
| `CSDU_EXE_LOCATION`                          | Preferred CSDU executable path alias.                                                    |
| `ELECTRON_APP_BINARY_PATH`                   | Generic packaged Electron executable path.                                               |
| `ELECTRON_APP_BROWSER_VERSION`               | Optional explicit Chromium/browser version for ChromeDriver matching.                    |
| `ELECTRON_AUTO_DETECT_BROWSER_VERSION=false` | Disables automatic browser-version detection from the `.exe`.                            |
| `CHROMEDRIVER_BINARY_PATH`                   | Optional explicit ChromeDriver executable path.                                          |

## Startup Timeout Triage

If the app opens but WDIO waits and then reports `WebDriverError: Operation was aborted due to timeout`, first confirm the framework reaches the real app window instead of the splash/loading renderer:

1. Set `E2E_JSON_FOLDERS=Deployment-tests` and `E2E_JSON_LIMIT=1` so only the first deployment case runs.
2. Set `E2E_APP_READY_SELECTOR` to a selector that only exists after the real deployment UI is loaded. Prefer a stable application selector over a splash-screen selector.
3. Keep `E2E_JSON_BOOTSTRAP_PAUSE_MS=25000` while debugging; this mirrors the old master spec's startup wait before switching to the main CSDU window.
4. Increase `E2E_APP_READY_TIMEOUT_MS` if the packaged `.exe` needs a longer first launch.
5. Review `reports/wdio-logs` and the Allure attachments named `Live Electron bootstrap state`, `Electron window switch state`, and `Electron renderer readiness state`; they record the main window title, certify/sign-in visibility, configured selector, and whether the selector was found.

Example:

```powershell
$env:E2E_JSON_FOLDERS="Deployment-tests"
$env:E2E_JSON_LIMIT="1"
$env:E2E_JSON_BOOTSTRAP_PAUSE_MS="25000"
$env:E2E_APP_READY_TIMEOUT_MS="180000"
$env:E2E_APP_READY_SELECTOR="#deploy-component"
```

## Live Mapping Coverage

The live dispatcher maps the legacy master-spec action vocabulary into one TypeScript executor:

- Deployment actions: `Deploy`, `DeployCodeOnly`, `Certify`, `ProjectDownload`, `GoToDeploy`, progress-bar checks, project-file upload, and project-file error assertions.
- Message, trace, and program-log actions: `ShowMessagePane`, `HideMessagePane`, `ClearMessagePane`, `SaveMessageCount`, `isCurrentMessageCountMoreThanSaved`, `StartTrace`, `StopTrace`, `ClearTrace`, `StartProgramLog`, `StopProgramLog`, `RefreshProgramLog`, `NoProgramLog`, and clickable/not-clickable checks.
- Page operations: `exists`, `Exist`, `isVisible`, `isEnabled`, `isDisabled`, `isDisbaled`, `isEmpty`, `isOpen`, `isChecked`, `isObfuscated`, `click`, `close`, `noSwitchWindowClick`, `setPath`, `set`, `setIp`, `setUsername`, `setPassword`, `setValue`, `setDownload`, `SendKeys`, `emailToType`, `clearInput`, `clearPath`, `clearValue`, `clearPassword`, `matches`, `matchesText`, `textMatches`, `verifyTextMatches`, `verifyMessageMatches`, `verifyPathMatches`, `verifyIP`, `verifyNotExistIP`, `verifyIpError`, `verifyHoverMessage`, and credential/download helper assertions.
- JSON/file utilities: `Preconditions`, `EditProjectFile`, `findFile`, `cannotFindFile`, `doNotFindFile`, `deleteFile`, `deleteFolder`, `appendToFile`, `prependToFile`, `textToMidFile`, `replaceTextInFile`, `copyFile`, `renameFiles`, `saveFileModifiedDate`, `compareFileModifiedDateToSavedDate`, `saveFileContent`, `compareFileContentToSavedFileContent`, and `checkMessageInFile`.
- Login/profile/sign-out/toast blocks: `AppAction`, `LoginPage`, `LoginPopUp`, `ProfilePage`, `ProfileAction`, `SignOutAction`, `SignOutPopUp`, `Toast`, `VerifyToastExists`, and `VerifyCertifyToast`.
- Legacy master-spec branch blocks: `ChangePythonFile`, `ChangeName`, `RenameFiles`, `VerifyErrorUnderDeployFilePath`, and `VerifyVTLP` are explicitly routed.
- Hardware command blocks: `GmCommands`, `CheckNavCommands`, `CheckECW`, and `CheckKevin` are mapped and attached to Allure as structured command evidence. Their real device side effects still require the Windows lab machine/device environment.

`VerifyMessage`, `VerifyTraceMessage`, `VerifyTroubleShootingMessage`, `VerifyProgramMessageLogs`, `VerifyCLIMessage`, and `CheckSpecificTraceMessages` search visible message-pane rows, trace rows, and program-log text.

Expected messages are polled until they appear or `E2E_JSON_MESSAGE_TIMEOUT_MS` expires. On timeout, the rows observed during the final check are written to the console and attached to Allure as `Message verification timeout`.

Unsupported actions are attached to Allure as `Unsupported live JSON actions`. By default they fail the test so missing mappings are visible. Use `E2E_JSON_STRICT_UNSUPPORTED=false` only while triaging a new legacy action.

## Current Validation Status

This refactor was validated with static checks only:

- `yarn typecheck`
- `yarn format:check`
- `yarn validate:e2e-json`

WDIO was intentionally not run during this refactor. Runtime validation should happen on the Windows machine with the packaged Electron 41 `.exe`.

## Old Master Spec Parity

The live dispatcher has been reviewed against `bek4466/e2e-wdio-refactor` branch `old-code-e2e`, file `e2e/tests/regression/NEWMASTERSPEC/UpdatedMaster.e2e-spec.ts`.

All old top-level branch names from that master spec are now routed in the new executor:

`AboutAction`, `AccessPageAction`, `AppAction`, `Banner`, `ChangeCredentials`, `ChangeName`, `ChangePythonFile`, `CheckECW`, `CheckNavCommands`, `CheckSpecificTraceMessages`, `CommonMethod`, `DeployAction`, `DeployPage`, `EditProjectFile`, `GmCommands`, `LoginPage`, `LoginPopUp`, `MiscellaneousAction`, `ProfileAction`, `ProfilePage`, `RenameFiles`, `SignOutAction`, `SignOutPopUp`, `Timeout`, `Toast`, `TroubleshootingAction`, `TroubleshootingPage`, `VerifyErrorUnderDeployFilePath`, `VerifyMessage`, `VerifyProgramMessageLogs`, `VerifyProgressBar`, `VerifyToastExists`, `VerifyTraceMessage`, `VerifyTraceMessageLogs`, `VerifyTroubleShootingMessage`, and `VerifyVTLP`.

Device/network branches such as `GmCommands`, `CheckECW`, `CheckNavCommands`, and `VerifyVTLP` are intentionally mapped as structured Allure evidence because their old implementation reached outside the Electron app into lab devices or controller web pages.

## Old Common Methods Parity

The `CommonMethod` executor was also reviewed against `bek4466/e2e-wdio-refactor` branch `old-code-e2e`, file `e2e/tests/commonMethods.po.ts`.

Ported helper behavior includes binary-safe file corruption (`appendToFile`, `prependToFile`, `textToMidFile`), project JSON sidecar copying for `copyFile`, recursive folder copying, project-relative `renameFiles`, `findFile` / `cannotFindFile` raw-path handling, `deleteFile`, `deleteFolder`, saved modified-date comparisons, saved file-content comparisons, and exported trace text checks.

Old SSO/window-switching helpers remain represented by the live executor's app readiness and login/action mappings. Old communication-client and controller-web helpers remain device/environment dependent and are attached as structured Allure evidence when reached.
