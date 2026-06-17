# Electron .exe Setup

This framework is configured for Electron `41.0.0`.

## Windows packaged app

Set `ELECTRON_APP_BINARY_PATH` to the packaged `.exe` before running any WDIO suite:

```powershell
$env:ELECTRON_APP_BINARY_PATH="C:\Apps\YourElectronApp\YourElectronApp.exe"
$env:ELECTRON_APP_ARGS="--automation,--disable-updates"
$env:EXPECTED_WINDOW_TITLES="Your App"
yarn test:exe
```

The WDIO capability is generated in `config/electron.config.ts`:

```ts
{
  browserName: 'electron',
  'wdio:electronServiceOptions': {
    appBinaryPath: 'C:\\Apps\\YourElectronApp\\YourElectronApp.exe',
    appArgs: ['--automation', '--disable-updates'],
  },
}
```

`ELECTRON_APP_BINARY_PATH` is required. The framework does not include or package a mock Electron app.
