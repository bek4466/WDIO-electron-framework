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
- markdown descriptions
- structured JSON attachments
- named Allure steps

Failed tests also attach a PNG screenshot and JSON failure details to the Allure test result. A copy of each failure screenshot is saved under:

```text
reports/screenshots
```

Environment metadata is reported from `wdio.conf.ts`, including the Electron version, Node version, OS platform, architecture, and whether the run targets the included sample app or a packaged Electron binary.
