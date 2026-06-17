# JSON-Driven E2E Suites

The imported legacy E2E assets live under:

```text
e2e/src
e2e/tests
```

The framework keeps the original files available, but WDIO runs the refactored master specs by default for JSON-driven coverage:

```bash
yarn test:e2e-json
```

Focused master suites are also available:

```bash
yarn test:e2e-json:newmaster
yarn test:e2e-json:nbp
yarn test:e2e-json:hardware
```

## Execution Mode

The current runner uses `E2E_JSON_EXECUTION_MODE=catalog` by default. Catalog mode makes the JSON files the source of truth, discovers executable cases from each `files.json` manifest, validates case structure, and attaches sanitized JSON/action summaries to Allure.

This gives the framework a stable data-driven foundation without depending on private product modules or hardware resources during local validation.

## Useful Filters

Limit the number of generated cases during local checks:

```bash
E2E_JSON_LIMIT=5 yarn test:e2e-json
```

Run selected `NEWMASTERSPEC` folders:

```bash
E2E_JSON_FOLDERS=smoke-tests yarn test:e2e-json:newmaster
```

Run selected hardware folders:

```bash
E2E_JSON_HARDWARE_FOLDERS=NAV-tests yarn test:e2e-json:hardware
```

Use an external resource folder when live project resources are available:

```bash
E2E_RESOURCE_ROOT=/path/to/e2e/resources yarn test:e2e-json
```

## Allure Output

Each JSON test case adds:

- suite, epic, feature, story, owner, and tags
- links parsed from `UserStoryLink`, `TaskLink`, and `TestCaseLink`
- sanitized JSON test case attachment
- action summary attachment
- manifest discovery summary

Generate the report after the run:

```bash
yarn allure:generate
```
