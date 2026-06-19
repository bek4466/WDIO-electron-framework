# Electron .exe Setup

This framework is configured for Electron `41.0.0`.

## Windows packaged app

Set `CSDU_EXE_LOCATION` or `ELECTRON_APP_BINARY_PATH` to the packaged `.exe` before
running any WDIO suite:

```powershell
$env:CSDU_EXE_LOCATION="C:\Program Files\Extron\ControlScript Deployment Utility\ControlScript Deployment Utility.exe"
$env:ELECTRON_APP_ARGS="--automation,--disable-updates"
$env:EXPECTED_WINDOW_TITLES="Your App"
yarn test:exe
```

If neither env var is set, the framework checks the common installed CSDU paths under
`C:\Program Files` and `C:\Program Files (x86)`.

The WDIO capability is generated in `config/electron.config.ts`:

```ts
{
  browserName: 'electron',
  browserVersion: '146.0.0.0',
  'wdio:electronServiceOptions': {
    appBinaryPath:
      'C:\\Program Files\\Extron\\ControlScript Deployment Utility\\ControlScript Deployment Utility.exe',
    appArgs: ['--automation', '--disable-updates'],
  },
}
```

Browser version is resolved in this order:

1. `ELECTRON_APP_BROWSER_VERSION`
2. `ELECTRON_BROWSER_VERSION`
3. `BROWSER_VERSION`
4. Automatic detection from the `.exe` through the DevTools `/json/version` endpoint

Set `ELECTRON_AUTO_DETECT_BROWSER_VERSION=false` if you do not want the framework to
launch the app briefly for version detection. Set `CHROMEDRIVER_BINARY_PATH` or
`CHROMEDRIVER_PATH` if you need to force a specific ChromeDriver executable.

The framework does not include or package a mock Electron app.
