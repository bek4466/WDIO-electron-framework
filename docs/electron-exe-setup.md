# Electron .exe Setup

This framework is configured for Electron `41.0.0`.

## Windows packaged app

Set `ELECTRON_APP_BINARY_PATH` to the packaged `.exe` before running the smoke suite:

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

## Local sample app

When `ELECTRON_APP_BINARY_PATH` is not set, `yarn test:smoke` first creates a lightweight packaged sample app in:

```text
dist/electron-smoke-app
```

The sample app source is:

```text
src/fixtures/electron-smoke-app/main.cjs
```

That makes the framework runnable without your real packaged app while still keeping the `.exe` launch configuration ready for real test environments.
