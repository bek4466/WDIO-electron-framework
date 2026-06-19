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
$env:E2E_JSON_FOLDERS="smoke-tests"
$env:E2E_APP_READY_TITLE="ControlScript Deployment Utility"
$env:E2E_APP_READY_SELECTOR="#deploy-component"
$env:E2E_RESOURCE_ROOT="C:\path\to\e2e\resources"
yarn wdio run ./wdio.conf.ts --logLevel debug --spec ./e2e/tests/regression/NEWMASTERSPEC/UpdatedMaster.e2e-spec.ts
```

Remove `E2E_JSON_LIMIT` after the first live case is stable.

## Important Environment Variables

| Variable                                     | Purpose                                                                            |
| -------------------------------------------- | ---------------------------------------------------------------------------------- |
| `E2E_JSON_EXECUTION_MODE=live`               | Enables real UI execution.                                                         |
| `E2E_JSON_LIMIT=1`                           | Runs only the first discovered executable case while debugging.                    |
| `E2E_JSON_FOLDERS=smoke-tests`               | Limits `UpdatedMaster.e2e-spec.ts` discovery to one folder.                        |
| `E2E_APP_READY_TITLE`                        | Optional window title filter before tests start.                                   |
| `E2E_APP_READY_SELECTOR`                     | Optional selector that proves the real app UI is ready.                            |
| `E2E_APP_READY_TIMEOUT_MS`                   | Startup readiness timeout. Defaults to `60000`.                                    |
| `E2E_RESOURCE_ROOT`                          | Folder that contains project resources like `DeployProject\systeminfo.json`.       |
| `E2E_JSON_STRICT_UNSUPPORTED=false`          | Allows unsupported JSON actions to be attached to Allure without failing the test. |
| `CSDU_EXE_LOCATION`                          | Preferred CSDU executable path alias.                                              |
| `ELECTRON_APP_BINARY_PATH`                   | Generic packaged Electron executable path.                                         |
| `ELECTRON_APP_BROWSER_VERSION`               | Optional explicit Chromium/browser version for ChromeDriver matching.              |
| `ELECTRON_AUTO_DETECT_BROWSER_VERSION=false` | Disables automatic browser-version detection from the `.exe`.                      |
| `CHROMEDRIVER_BINARY_PATH`                   | Optional explicit ChromeDriver executable path.                                    |

## Live Mapping Coverage

The live dispatcher maps the legacy master-spec action vocabulary into one TypeScript executor:

- Deployment actions: `Deploy`, `DeployCodeOnly`, `Certify`, `ProjectDownload`, `GoToDeploy`, progress-bar checks, project-file upload, and project-file error assertions.
- Message, trace, and program-log actions: `ShowMessagePane`, `HideMessagePane`, `ClearMessagePane`, `SaveMessageCount`, `isCurrentMessageCountMoreThanSaved`, `StartTrace`, `StopTrace`, `ClearTrace`, `StartProgramLog`, `StopProgramLog`, `RefreshProgramLog`, `NoProgramLog`, and clickable/not-clickable checks.
- Page operations: `exists`, `Exist`, `isVisible`, `isEnabled`, `isDisabled`, `isDisbaled`, `isEmpty`, `isOpen`, `isChecked`, `isObfuscated`, `click`, `close`, `noSwitchWindowClick`, `setPath`, `set`, `setIp`, `setUsername`, `setPassword`, `setValue`, `setDownload`, `SendKeys`, `emailToType`, `clearInput`, `clearPath`, `clearValue`, `clearPassword`, `matches`, `matchesText`, `textMatches`, `verifyTextMatches`, `verifyMessageMatches`, `verifyPathMatches`, `verifyIP`, `verifyNotExistIP`, `verifyIpError`, `verifyHoverMessage`, and credential/download helper assertions.
- JSON/file utilities: `Preconditions`, `EditProjectFile`, `findFile`, `cannotFindFile`, `doNotFindFile`, `deleteFile`, `deleteFolder`, `appendToFile`, `prependToFile`, `textToMidFile`, `replaceTextInFile`, `copyFile`, `renameFiles`, `saveFileModifiedDate`, `compareFileModifiedDateToSavedDate`, `saveFileContent`, `compareFileContentToSavedFileContent`, and `checkMessageInFile`.
- Login/profile/sign-out/toast blocks: `AppAction`, `LoginPage`, `LoginPopUp`, `ProfilePage`, `ProfileAction`, `SignOutAction`, `SignOutPopUp`, `Toast`, `VerifyToastExists`, and `VerifyCertifyToast`.
- Hardware command blocks: `GmCommands`, `CheckNavCommands`, `CheckECW`, and `CheckKevin` are mapped and attached to Allure as structured command evidence. Their real device side effects still require the Windows lab machine/device environment.

`VerifyMessage`, `VerifyTraceMessage`, `VerifyTroubleShootingMessage`, `VerifyProgramMessageLogs`, `VerifyCLIMessage`, and `CheckSpecificTraceMessages` search visible message-pane rows, trace rows, and program-log text.

Unsupported actions are attached to Allure as `Unsupported live JSON actions`. By default they fail the test so missing mappings are visible. Use `E2E_JSON_STRICT_UNSUPPORTED=false` only while triaging a new legacy action.

## Current Validation Status

This refactor was validated with static checks only:

- `yarn typecheck`
- `yarn format:check`
- `yarn validate:e2e-json`

WDIO was intentionally not run during this refactor. Runtime validation should happen on the Windows machine with the packaged Electron 41 `.exe`.
