# Engineering Handoff Summary

## Current System Architecture

Repository: `bek4466/WDIO-electron-framework`
Branch: `feature-e2e`

This is a TypeScript + Node.js + WebdriverIO 9 automation framework for a packaged Windows Electron 41 application.

Primary architecture:

- `wdio.conf.ts`: Main WDIO config using `wdio-electron-service`.
- `wdio.attach.conf.ts`: Alternate manual attach WDIO config that spawns the packaged `.exe`, waits for the Electron DevTools port, then attaches ChromeDriver as plain Chrome via `debuggerAddress`.
- `config/electron.config.ts`: Central Electron capability builder, packaged `.exe` path resolution, Electron 41 / Chromium 146 capability handling, ChromeDriver options, window target filtering.
- `config/env.ts`: Env parsing helpers.
- `config/reporting.config.ts`: Report/log/output directory paths.
- `scripts/inspect-electron-targets.mjs`: Launches the `.exe` with a DevTools port and prints exposed Electron/Chromium targets.
- `scripts/probe-chromedriver-attach.mjs`: Starts ChromeDriver directly, attaches to an already-running Electron DevTools endpoint, and probes session/window/title behavior outside WDIO.
- `e2e/tests/support/json-master-runner.ts`: Discovers and registers JSON-driven master spec cases.
- `e2e/tests/support/json-live-executor.ts`: Maps legacy JSON/master-spec actions to live WDIO UI/file operations.
- `e2e/tests/regression/NEWMASTERSPEC/UpdatedMaster.e2e-spec.ts`: JSON-driven master spec entrypoint.

## Active Files Under Development

- `config/electron.config.ts`
- `wdio.conf.ts`
- `wdio.attach.conf.ts`
- `scripts/inspect-electron-targets.mjs`
- `scripts/probe-chromedriver-attach.mjs`
- `package.json`
- `HANDOFF.md`

## Recent Engineering Decisions

- The current blocker is not the master spec or JSON mapping. WDIO fails before Mocha/spec execution during WebDriver session creation.
- Lifecycle evidence repeatedly showed:
  - `onPrepare`
  - `onWorkerStart`
  - `beforeSession`
  - `onWorkerEnd exitCode -1`
  - `onComplete exitCode -1`
- Added lifecycle/capability diagnostics:
  - `reports/wdio-logs/electron-capability-request.json`
  - `reports/wdio-logs/electron-capability-before-session.json`
  - `reports/wdio-logs/wdio-lifecycle.log`
  - `reports/wdio-logs/electron-attached-windows.json`
- WDIO 9 auto-injected BiDi unless disabled, so `wdio:enforceWebDriverClassic: true` was added by default.
- `webSocketUrl` is only sent when `WDIO_ENABLE_BIDI=true`.
- Electron app target discovery showed the real target is:
  - `type: tab`
  - `title: ControlScript Deployment Utility`
- Framework and probe now default `windowTypes` to:
  - `tab,page,app,webview`
- The app exposes:
  - `Browser: Chrome/146...`
  - `User-Agent: Chrome/146...`
  - `Protocol-Version: 1.3`
  - `webSocketDebuggerUrl: ws://127.0.0.1:9229/devtools/browser/...`
- ChromeDriver 146 is required. The repo dependency `chromedriver` is 132, so diagnostics must use `CHROMEDRIVER_BINARY_PATH` pointing to the discovered ChromeDriver 146 executable.
- `@types/node` is already present in `devDependencies` and included in `tsconfig.json`.

## Latest Relevant Commits

Recent pushed commits on `feature-e2e`:

- `4270360` - `Add manual Electron attach WDIO config`
- `5090944` - `Retry ChromeDriver attach probe session`
- `8041482` - `Use IPv4 host for ChromeDriver attach probe`
- `c7af7f8` - `Align attach probe with tab targets`
- `8508e52` - `Include tab targets for Electron attach`
- `7f4b83c` - `Guard ChromeDriver attach probe timeout`
- `e0f85ec` - `Improve ChromeDriver attach probe errors`
- `ae65881` - `Harden ChromeDriver attach probe logging`
- `f4adaeb` - `Resolve ChromeDriver binary for attach probe`
- `19a97b7` - `Add ChromeDriver attach probe`
- `9520fd6` - `Support attaching ChromeDriver to Electron debugger`
- `42c5b81` - `Include page targets for Electron ChromeDriver attach`
- `8d0357a` - `Increase Electron startup diagnostics timeout`
- `333a82a` - `Add Electron window target diagnostics`
- `4f7e4c6` - `Enforce classic WebDriver for Electron sessions`

Git author is configured as:

```text
bek4466 <27562902+bek4466@users.noreply.github.com>
```

## Current Debugging State

Confirmed:

- The packaged app launches.
- The app exposes a DevTools endpoint on `127.0.0.1:9229` when launched with `--remote-debugging-port=9229`.
- `/json/version` reports Chrome 146.
- ChromeDriver 146 starts successfully.
- ChromeDriver sees the target:

```text
type: tab
title: ControlScript Deployment Utility
url: file:///...
attached: false
```

Current failure:

```text
WebDriverError: operation aborted due to timeout
POST /session timed out
RESPONSE InitSession ERROR session not created: cannot connect to chrome not reachable
```

Attach probe also saw:

```text
POST http://127.0.0.1:9519/session failed: TypeError: fetch failed
Caused by HeadersTimeoutError
```

Interpretation:

- ChromeDriver can see the DevTools target.
- ChromeDriver cannot complete WebDriver `InitSession` against that target.
- This is still before test/spec execution.
- The next useful data is the tail of the raw ChromeDriver log around `InitSession`.

## Commands To Resume

Pull latest:

```powershell
git checkout feature-e2e
git pull origin feature-e2e
```

Clean stale processes before any run:

```powershell
taskkill /F /IM chromedriver.exe
taskkill /F /IM "ControlScript Deployment Utility.exe"
```

Normal Electron-service WDIO run:

```powershell
$env:CSDU_EXE_LOCATION="C:\path\to\ControlScript Deployment Utility.exe"
$env:ELECTRON_CAPABILITY_VERSION="41.0.0"
$env:ELECTRON_CHROME_WINDOW_TYPES="tab,page,app,webview"
$env:CHROMEDRIVER_BINARY_PATH="C:\path\to\chromedriver-146.exe"
$env:WDIO_CONNECTION_RETRY_TIMEOUT_MS="600000"

yarn wdio run ./wdio.conf.ts --logLevel debug --spec ./e2e/tests/regression/NEWMASTERSPEC/UpdatedMaster.e2e-spec.ts
```

Manual attach WDIO run:

```powershell
$env:CSDU_EXE_LOCATION="C:\path\to\ControlScript Deployment Utility.exe"
$env:CHROMEDRIVER_BINARY_PATH="C:\path\to\chromedriver-146.exe"
$env:ELECTRON_ATTACH_DEBUG_PORT="9229"
$env:ELECTRON_CHROME_WINDOW_TYPES="tab,page,app,webview"
$env:ELECTRON_ATTACH_TIMEOUT_MS="300000"
$env:WDIO_CONNECTION_RETRY_TIMEOUT_MS="600000"

yarn test:attach:e2e-json:newmaster
```

Inspect app DevTools targets:

```powershell
$env:CSDU_EXE_LOCATION="C:\path\to\ControlScript Deployment Utility.exe"
$env:ELECTRON_TARGET_INSPECT_PORT="9229"
$env:ELECTRON_TARGET_INSPECT_TIMEOUT_MS="300000"
$env:ELECTRON_TARGET_INSPECT_KEEP_APP="true"

yarn debug:electron-targets
```

Probe ChromeDriver attach directly, with app already open from `debug:electron-targets`:

```powershell
$env:CHROMEDRIVER_BINARY_PATH="C:\path\to\chromedriver-146.exe"
$env:ELECTRON_DEBUGGER_ADDRESS="127.0.0.1:9229"
$env:ELECTRON_CHROME_WINDOW_TYPES="tab,page,app,webview"
$env:CHROMEDRIVER_ATTACH_PROBE_HOST="127.0.0.1"
$env:CHROMEDRIVER_ATTACH_PROBE_PORT="9519"
$env:CHROMEDRIVER_ATTACH_PROBE_TIMEOUT_MS="30000"
$env:CHROMEDRIVER_ATTACH_SESSION_TIMEOUT_MS="30000"

yarn debug:chromedriver-attach
```

## Exact Next Steps

1. Re-run the manual attach config first:

```powershell
yarn test:attach:e2e-json:newmaster
```

2. If it fails, collect:

```powershell
Get-Content reports\wdio-logs\wdio-attach-lifecycle.log -Tail 100

Get-ChildItem reports\wdio-logs -Filter "*chromedriver*.log" |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 5 FullName, LastWriteTime
```

3. Tail the newest ChromeDriver log:

```powershell
Get-Content "PASTE_NEWEST_CHROMEDRIVER_LOG_PATH" -Tail 150
```

4. Look specifically for:

```text
COMMAND InitSession
RESPONSE InitSession ERROR
chrome not reachable
unable to discover open pages
Target.getTargets
type: tab
ControlScript Deployment Utility
```

5. If ChromeDriver still sees `type: tab` and fails `chrome not reachable`, consider one of:

- Try only `ELECTRON_CHROME_WINDOW_TYPES="tab"`.
- Try only `ELECTRON_CHROME_WINDOW_TYPES="page"` as a control.
- Run app manually with `--remote-debugging-port=9229` and attach ChromeDriver probe.
- Investigate whether the app blocks ChromeDriver attach to `file:///...renderer.html` targets despite exposing DevTools.

## Unresolved Bugs / Risks

- Runtime tests have not reached Mocha yet on Windows because WebDriver session creation fails.
- Generated reports/logs must not be committed.
- `chromedriver` package in `node_modules` is 132 and should not be used for Electron 41 diagnostics; always point `CHROMEDRIVER_BINARY_PATH` to ChromeDriver 146.
- `wdio-electron-service` may not support this app’s exposed target shape cleanly; manual attach config exists to isolate that.
- JSON live executor mapping work exists, but it cannot be validated until session creation succeeds.
