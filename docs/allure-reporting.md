# Allure Reporting

Allure is configured through `wdio.conf.ts` with results stored in:

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
- named links, such as requirements, mock issue pages, or test case pages
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

Enable per-test video recording on macOS with:

```bash
E2E_RECORD_VIDEO=true yarn test:json-sample
```

Native recording uses a fixed maximum duration so macOS can finalize a `.mov` cleanly:

```bash
E2E_RECORD_VIDEO=true E2E_VIDEO_MAX_SECONDS=15 yarn test:json-sample
```

If the OS blocks native recording, the test still passes or fails normally and Allure receives a `Video recording` status attachment explaining why a video file was not produced.

Environment metadata is reported from `wdio.conf.ts`, including the Electron version, Node version, OS platform, architecture, and whether the run targets the included sample app or a packaged Electron binary.
