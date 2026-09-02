# JSON Live Execution Compatibility

**Author:** Oybek  
**Audience:** QA and Engineering

## Purpose

The WDIO 9 live JSON executor preserves the behavior of the legacy `UpdatedMaster.e2e-spec.ts` while moving reusable behavior into `e2e/tests/support/json-live-executor.ts`.

## Nested Element Operations

JSON element operations run in their declared order. For example:

```json
"ProjectFilePathInput": {
  "setPath": "NotGoodProject\\touch.wav",
  "errorMessageToValidate": "<<ValidationMessage>>"
}
```

The executor uploads the requested file first, then waits for the deployment validation element and verifies its displayed text. `errorMessageToValidate` is a semantic assertion and is not evaluated against the project-file input itself.

Enabled and disabled assertions poll the current DOM element until CSDU finishes asynchronous project validation. The timeout defaults to 30 seconds and can be changed with `E2E_JSON_STATE_TIMEOUT_MS`.

## Structured Message Verification

Each object in `VerifyMessage`, including numbered variants such as `VerifyMessage2`, is evaluated as one complete expectation:

- `MessageText` must be contained in the message column.
- `MessageType` must exactly match the severity column when supplied.
- `Exist` controls whether the matching row must be present or absent.
- `MessageText: "isEmpty"` verifies that no message rows are present.
- `IpAddress` or `IPAddress`, when supplied, must occur in the same row.

Positive message checks poll until `E2E_JSON_MESSAGE_TIMEOUT_MS`. Timeout evidence includes the expected fields and all observed rows in Allure.

## Per-Test Cleanup

Cleanup runs in a `finally` block after every live JSON case, including failed cases. It:

- Removes prepared project copies, sidecar files, and temporary Python files.
- Clears the contents of `e2e/resources/TmpDownloadProject`.
- Closes open dialogs, the project-download panel, and overwrite banners when present.
- Stops and clears troubleshooting trace state, clears program logs, and hides the message pane when needed.
- Returns the application to Deploy and clears deployment messages.

Cleanup problems are collected and attached to Allure so they do not replace the original test failure.

## Allure Steps and Screenshots

Allure uses readable action descriptions such as `Select project file: touch.wav`, `Verify Deploy button is disabled`, and `Verify invalid project file message`. JSON suffixes used for ordering, such as `_2`, are intentionally omitted from display names.

Screenshots are captured at review-worthy state changes:

- Electron renderer readiness and page navigation.
- Project-file and Protect/Extract output-folder selection.
- Project validation errors.
- Deployment, protection, extraction, authentication, and download actions.
- Successful positive and negative message verification.
- Final test state or failure state through the WDIO evidence hook.

Routine value entry and simple presence checks do not automatically capture screenshots. This keeps the report useful without generating excessive duplicate images.
