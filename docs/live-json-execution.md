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

## Supported First-Pass Actions

The live dispatcher currently supports the highest-volume master spec actions:

- `DeployAction`: `Deploy`, `DeployCodeOnly`, `ClearMessagePane`, `Certify`, `ProjectDownload`, `StartTrace`, `RefreshProgramLog`, `ShowMessagePane`.
- Page element checks/actions: `exists`, `isVisible`, `isEnabled`, `isDisabled`, `isEmpty`, `isOpen`, `click`, `setPath`, `setIp`, `setPassword`, `setValue`, `clearInput`, `clearPath`, `matches`, `matchesText`, `textMatches`, `verifyDeviceInfo`.
- `VerifyMessage`: scans message pane rows for expected message text and severity.
- `CommonMethod`: `findFile`, `deleteFile`, `appendToFile`, `replaceTextInFile`, `copyFile`, `renameFiles`, `saveFileModifiedDate`, `compareFileModifiedDateToSavedDate`.
- `Preconditions` / `EditProjectFile`: applies JSON mutations to a temp project file before upload.

Unsupported actions are attached to Allure as `Unsupported live JSON actions`. By default they fail the test so missing mappings are visible.
