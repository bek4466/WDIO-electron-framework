# Framework Environment Variables

This reference lists the environment variables supported by the WDIO Electron framework. Most variables are optional. The final section contains the recommended minimum configuration for running packaged CSDU tests on Windows.

## Required Windows Setup

| Variable                       | Example or default                                                 | Purpose                                                                   |
| ------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `CSDU_EXE_LOCATION`            | `C:\Program Files\Extron\...\ControlScript Deployment Utility.exe` | Preferred path to the packaged CSDU executable.                           |
| `ELECTRON_APP_BINARY_PATH`     | No default                                                         | Generic alternative to `CSDU_EXE_LOCATION`.                               |
| `CHROMEDRIVER_BINARY_PATH`     | `C:\tools\chromedriver-146\chromedriver.exe`                       | Forces the framework to use the matching ChromeDriver executable.         |
| `CHROMEDRIVER_PATH`            | No default                                                         | Alias for `CHROMEDRIVER_BINARY_PATH`.                                     |
| `NODE_OPTIONS`                 | `--dns-result-order=ipv4first`                                     | Prevents Windows VM session errors caused by IPv6 `localhost` resolution. |
| `ELECTRON_ATTACH_TARGET_TITLE` | `ControlScript Deployment Utility`                                 | Selects the real CSDU window instead of a splash or service window.       |
| `ELECTRON_CHROME_WINDOW_TYPES` | `tab,page,app,webview`                                             | Allows ChromeDriver to discover an Electron target exposed as `tab`.      |

## JSON Test Selection

| Variable                         | Default                | Purpose                                                                                                                       |
| -------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `E2E_JSON_EXECUTION_MODE`        | `catalog`              | Use `live` to execute UI actions. `catalog` only discovers and validates cases. Test scripts may set live mode automatically. |
| `E2E_JSON_FOLDERS`               | All configured folders | Comma-separated New Master folders, such as `Deployment-tests`.                                                               |
| `E2E_JSON_HARDWARE_FOLDERS`      | All hardware folders   | Filters hardware folders, such as `FOX3-tests,NAV-tests`.                                                                     |
| `E2E_JSON_FILES`                 | All JSON files         | Filters specific files, such as `CSP-30.e2e-spec.json`.                                                                       |
| `E2E_JSON_CASES`                 | All executable cases   | Filters case identifiers, such as `1` or `TestCase1`.                                                                         |
| `E2E_JSON_LIMIT`                 | `0`                    | Limits the number of discovered cases. Zero means no limit.                                                                   |
| `E2E_JSON_INCLUDE_MANIFEST_TEST` | Conditional            | Includes the discovery test. It defaults to false when file or case filters are present.                                      |
| `TESTTYPE`                       | Set by the WDIO suite  | Internal suite identifier. Smoke values select `smoke-tests`.                                                                 |
| `E2E_RESOURCE_ROOT`              | `e2e/resources`        | Overrides the test-resource directory.                                                                                        |
| `E2E_JSON_STRICT_UNSUPPORTED`    | `true`                 | Fails a case when its JSON contains unsupported actions.                                                                      |

## Application Startup And Attachment

| Variable                                     | Default              | Purpose                                                                    |
| -------------------------------------------- | -------------------- | -------------------------------------------------------------------------- |
| `ELECTRON_APP_ARGS`                          | Empty                | Comma-separated arguments passed to CSDU.                                  |
| `ELECTRON_CHROME_ARGS`                       | Empty                | Additional Chromium arguments passed to Electron.                          |
| `ELECTRON_APP_CWD`                           | Executable directory | Overrides the application and ChromeDriver working directory.              |
| `ELECTRON_DEBUGGER_ADDRESS`                  | `127.0.0.1:9229`     | DevTools endpoint used by attach mode.                                     |
| `ELECTRON_CHROME_DEBUGGER_ADDRESS`           | Empty                | Debugger-address alias used by the general Electron capability builder.    |
| `ELECTRON_ATTACH_DEBUG_PORT`                 | `9229`               | Remote-debugging port used when launching CSDU.                            |
| `ELECTRON_ATTACH_TIMEOUT_MS`                 | `300000`             | Maximum time to wait for Electron's DevTools endpoint.                     |
| `ELECTRON_ATTACH_TARGET_TIMEOUT_MS`          | Attach timeout       | Maximum time to wait for the correct Electron window.                      |
| `ELECTRON_ATTACH_TARGET_STABLE_MS`           | `3000`               | Time the selected target must remain stable before attachment.             |
| `ELECTRON_ATTACH_TARGET_URL_PATTERN`         | Empty                | Optional target URL filter.                                                |
| `ELECTRON_ATTACH_EXCLUDE_TARGET_URL_PATTERN` | Empty                | Excludes matching splash or initializer targets.                           |
| `ELECTRON_ATTACH_CLOSE_EMPTY_TARGETS`        | `true`               | Closes empty Electron targets before attachment.                           |
| `ELECTRON_ATTACH_CLOSE_OTHER_TARGETS`        | `false`              | Closes other non-selected targets.                                         |
| `ELECTRON_ATTACH_CLOSE_TARGET_TITLE_PATTERN` | Empty                | Limits automatic target closing to matching titles.                        |
| `ELECTRON_ATTACH_CLOSE_TARGET_URL_PATTERN`   | Empty                | Limits automatic target closing to matching URLs.                          |
| `ELECTRON_USER_DATA_DIR`                     | Empty                | Optional Chromium profile directory.                                       |
| `ELECTRON_APP_USER_DATA_DIR`                 | Empty                | Alias for the Electron user-data directory.                                |
| `WDIO_ENABLE_BIDI`                           | `false`              | Enables WebDriver BiDi. Keep it disabled for the current CSDU attach flow. |

## Live Test Timing And State

All timeout and pause values are in milliseconds unless stated otherwise.

| Variable                            | Default                   | Purpose                                                                                   |
| ----------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------- |
| `E2E_JSON_BOOTSTRAP_PAUSE_MS`       | `25000`                   | Initial pause before live-test bootstrap.                                                 |
| `E2E_APP_WINDOW_TIMEOUT_MS`         | `60000`                   | Wait for the expected CSDU window.                                                        |
| `E2E_APP_READY_TIMEOUT_MS`          | `60000`                   | Wait for the Electron renderer to become ready.                                           |
| `E2E_APP_READY_TITLE`               | Main title from test data | Expected application-window title.                                                        |
| `E2E_APP_READY_SELECTOR`            | Empty                     | Optional selector proving the application is ready.                                       |
| `E2E_JSON_STATE_TIMEOUT_MS`         | `120000`                  | Wait for general UI state transitions.                                                    |
| `E2E_JSON_MESSAGE_TIMEOUT_MS`       | `400000`                  | Wait for deployment and message-pane results.                                             |
| `E2E_JSON_MESSAGE_POLL_INTERVAL_MS` | `1000`                    | Message polling interval.                                                                 |
| `E2E_JSON_CLEANUP_PAUSE_MS`         | `5000`                    | Pause before final evidence collection and cleanup.                                       |
| `E2E_AUTH_TIMEOUT_MS`               | `90000`                   | Login and logout flow timeout.                                                            |
| `E2E_AUTH_BOOTSTRAP_MODE`           | `certified`               | `certified` ensures the required user is signed in. `preserve` keeps the current session. |
| `WAIT_TIMEOUT_MS`                   | `10000`                   | Default element wait timeout.                                                             |
| `MOCHA_TIMEOUT_MS`                  | `600000`                  | Maximum Mocha test and hook duration.                                                     |
| `WDIO_CONNECTION_RETRY_TIMEOUT_MS`  | `300000` in attach mode   | WebDriver request and session timeout.                                                    |
| `WDIO_CONNECTION_RETRY_COUNT`       | `1`                       | Number of WebDriver connection retries.                                                   |
| `E2E_PROJECT_FILE_INPUT_SELECTOR`   | Framework locator         | Overrides the project-file input selector.                                                |

`E2E_NATIVE_DIALOG_PATH` is set internally by the framework while automating a Windows file dialog. Users should not set it manually.

## Electron And Chromium Versions

| Variable                               | Default                          | Purpose                                                  |
| -------------------------------------- | -------------------------------- | -------------------------------------------------------- |
| `ELECTRON_CAPABILITY_VERSION`          | Framework fallback               | Highest-priority capability-version override.            |
| `ELECTRON_APP_ELECTRON_VERSION`        | Empty                            | Electron-version override alias.                         |
| `ELECTRON_VERSION`                     | `41.0.0`                         | Electron-version override before the framework fallback. |
| `ELECTRON_APP_BROWSER_VERSION`         | Empty                            | Embedded Chromium-version override.                      |
| `ELECTRON_BROWSER_VERSION`             | Empty                            | Chromium-version override alias.                         |
| `BROWSER_VERSION`                      | Empty                            | Generic browser-version fallback.                        |
| `ELECTRON_AUTO_DETECT_BROWSER_VERSION` | `false` for capability selection | Enables Chromium-version detection from the executable.  |
| `ELECTRON_VERSION_DETECTION_PORT`      | Random available candidate       | Port used during automatic version detection.            |

The packaged application's embedded Chromium version must match the selected ChromeDriver major version. The installed desktop Chrome version does not determine the required ChromeDriver version.

## Reporting And Diagnostics

| Variable                     | Default               | Purpose                                                     |
| ---------------------------- | --------------------- | ----------------------------------------------------------- |
| `E2E_RECORD_VIDEO`           | `false`               | Set to `true` to record Windows test video with FFmpeg.     |
| `E2E_VIDEO_MAX_SECONDS`      | `10`                  | Maximum video duration per test, in seconds.                |
| `E2E_VIDEO_FPS`              | `10`                  | Video frame rate.                                           |
| `E2E_LOG_ATTACHMENT_BYTES`   | `80000`               | Maximum log-tail size attached to Allure.                   |
| `CHROMEDRIVER_LOG_PATH`      | `reports/wdio-logs`   | Overrides the ChromeDriver log location.                    |
| `CHROMEDRIVER_VERBOSE`       | `true`                | Enables verbose ChromeDriver logging.                       |
| `CHROMEDRIVER_SPAWN_CWD`     | Application directory | Overrides ChromeDriver's working directory.                 |
| `E2E_DEBUG_COMMANDS`         | `false`               | Enables detailed WDIO command lifecycle logging.            |
| `ALLURE_DISABLE_MOCHA_HOOKS` | `false`               | Disables Allure's automatic Mocha hooks when set to `true`. |
| `EXPECTED_WINDOW_TITLES`     | Empty                 | Comma-separated expected Electron window titles.            |

## Debug Scripts Only

| Variable                                 | Default     | Purpose                                          |
| ---------------------------------------- | ----------- | ------------------------------------------------ |
| `ELECTRON_TARGET_INSPECT_PORT`           | `9229`      | DevTools port for `yarn debug:electron-targets`. |
| `ELECTRON_TARGET_INSPECT_TIMEOUT_MS`     | `180000`    | Target-inspection timeout.                       |
| `ELECTRON_TARGET_INSPECT_KEEP_APP`       | `false`     | Keeps CSDU open after target inspection.         |
| `CHROMEDRIVER_ATTACH_PROBE_HOST`         | `127.0.0.1` | Host used by the ChromeDriver attach probe.      |
| `CHROMEDRIVER_ATTACH_PROBE_PORT`         | `9517`      | ChromeDriver port used by the probe.             |
| `CHROMEDRIVER_ATTACH_PROBE_TIMEOUT_MS`   | `30000`     | Wait for probe ChromeDriver startup.             |
| `CHROMEDRIVER_ATTACH_SESSION_TIMEOUT_MS` | `30000`     | Wait for the probe WebDriver session.            |

## Recommended Windows Configuration

Use this baseline for packaged CSDU execution on a Windows workstation or VM:

```powershell
$env:NODE_OPTIONS="--dns-result-order=ipv4first"
$env:CSDU_EXE_LOCATION="C:\path\to\ControlScript Deployment Utility.exe"
$env:CHROMEDRIVER_BINARY_PATH="C:\path\to\chromedriver-146\chromedriver.exe"
$env:CHROMEDRIVER_PATH=$env:CHROMEDRIVER_BINARY_PATH
$env:ELECTRON_DEBUGGER_ADDRESS="127.0.0.1:9229"
$env:ELECTRON_ATTACH_DEBUG_PORT="9229"
$env:ELECTRON_ATTACH_TARGET_TITLE="ControlScript Deployment Utility"
$env:ELECTRON_ATTACH_CLOSE_EMPTY_TARGETS="true"
$env:ELECTRON_CHROME_WINDOW_TYPES="tab,page,app,webview"
$env:E2E_JSON_EXECUTION_MODE="live"
```

To run one JSON case:

```powershell
$env:E2E_JSON_FOLDERS="Deployment-tests"
$env:E2E_JSON_FILES="CSP-30.e2e-spec.json"
$env:E2E_JSON_CASES="1"

yarn test:attach:e2e-json:newmaster
```

PowerShell environment variables remain active for the current terminal session. Remove temporary test filters before running a broader suite:

```powershell
Remove-Item Env:E2E_JSON_FOLDERS -ErrorAction SilentlyContinue
Remove-Item Env:E2E_JSON_FILES -ErrorAction SilentlyContinue
Remove-Item Env:E2E_JSON_CASES -ErrorAction SilentlyContinue
Remove-Item Env:E2E_JSON_LIMIT -ErrorAction SilentlyContinue
```
