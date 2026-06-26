# Allure Reporting

Allure is configured through the WDIO configs with results stored in:

```text
reports/allure-results
```

Generate and open the HTML report after any test run:

```bash
yarn allure:generate
yarn allure:open
```

The framework adds report metadata through `src/support/allure.ts`:

- suite hierarchy, epic, feature, and story
- severity, owner, and tags
- named links, such as requirements, issue pages, or test case pages
- markdown descriptions
- structured JSON attachments
- named Allure steps

## Evidence Attachments

The framework adds evidence through `src/support/evidence.ts` after every test:

- final PNG screenshot
- Electron renderer runtime state
- browser console log output or availability status
- WDIO and ChromeDriver log tail attachments
- optional native video recording
- JSON failure details when a test fails

Screenshot copies are saved under:

```text
reports/screenshots
```

WDIO and ChromeDriver logs are written under:

```text
reports/wdio-logs
```

Optional videos are saved under:

```text
reports/videos
```

Enable per-test video recording on Windows with:

```bash
E2E_RECORD_VIDEO=true yarn test:smoke
```

Windows video recording uses `ffmpeg` with `gdigrab`, so the Windows runner must have `ffmpeg` installed and available in `PATH`. The framework writes `.mp4` files and attaches them to Allure as `Test execution video`.

Tune recording duration and frame rate with:

```bash
E2E_RECORD_VIDEO=true E2E_VIDEO_MAX_SECONDS=15 E2E_VIDEO_FPS=10 yarn test:smoke
```

On non-Windows machines, the framework skips video recording and attaches a `Video recording` status JSON so local macOS validation can still run without changing committed Windows behavior. If `ffmpeg` is missing or blocked on Windows, the test still passes or fails normally and Allure receives a status attachment explaining why a video file was not produced.

Environment metadata is reported from the active WDIO config, including the Electron version, Node version, OS platform, architecture, and packaged Electron target information.
