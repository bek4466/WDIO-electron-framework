import fs from 'node:fs';
import path from 'node:path';
import childProcess from 'node:child_process';
import { getBooleanEnv, getEnv, getListEnv } from './env.js';

export const ELECTRON_MAJOR_VERSION = 41;
export const ELECTRON_VERSION = '41.0.0';

type ElectronServiceOptions = {
  appBinaryPath?: string;
  appArgs?: string[];
};

export type ChromedriverOptions = {
  binary?: string;
  logPath?: string;
  verbose?: boolean;
  [key: string]: unknown;
};

export type ElectronCapability = {
  browserName: 'electron';
  browserVersion?: string;
  webSocketUrl?: boolean;
  'wdio:enforceWebDriverClassic'?: boolean;
  'goog:chromeOptions'?: {
    args?: string[];
    windowTypes?: string[];
    debuggerAddress?: string;
    [key: string]: unknown;
  };
  'wdio:electronServiceOptions': ElectronServiceOptions;
  'wdio:chromedriverOptions'?: ChromedriverOptions;
};

export function getElectronCapabilityVersion(
  appBinaryPath?: string,
  appArgs: string[] = [],
): string | undefined {
  return (
    getEnv('ELECTRON_CAPABILITY_VERSION') ||
    getEnv('ELECTRON_APP_ELECTRON_VERSION') ||
    getEnv('ELECTRON_VERSION') ||
    ELECTRON_VERSION ||
    getEnv('ELECTRON_APP_BROWSER_VERSION') ||
    getEnv('ELECTRON_BROWSER_VERSION') ||
    getEnv('BROWSER_VERSION') ||
    (getBooleanEnv('ELECTRON_AUTO_DETECT_BROWSER_VERSION', false)
      ? detectBrowserVersionFromBinarySync(appBinaryPath, appArgs)
      : undefined) ||
    undefined
  );
}

function detectBrowserVersionFromBinarySync(
  appBinaryPath?: string,
  appArgs: string[] = [],
): string | undefined {
  if (
    process.platform !== 'win32' ||
    !appBinaryPath ||
    !fs.existsSync(appBinaryPath) ||
    !getBooleanEnv('ELECTRON_AUTO_DETECT_BROWSER_VERSION', true)
  ) {
    return undefined;
  }

  const port =
    Number(getEnv('ELECTRON_VERSION_DETECTION_PORT')) || 32000 + Math.floor(Math.random() * 10000);
  const userDataDir = path.resolve(process.cwd(), 'reports/electron-version-profile');
  fs.mkdirSync(userDataDir, { recursive: true });

  let child: childProcess.ChildProcess | undefined;

  try {
    child = childProcess.spawn(
      appBinaryPath,
      [
        ...appArgs,
        `--remote-debugging-port=${port}`,
        `--user-data-dir=${userDataDir}`,
        '--no-first-run',
        '--no-default-browser-check',
      ],
      {
        cwd: path.dirname(appBinaryPath),
        detached: false,
        stdio: 'ignore',
        windowsHide: true,
      },
    );

    for (let attempt = 0; attempt < 40; attempt += 1) {
      try {
        const out = childProcess.execFileSync(
          'powershell',
          [
            '-NoProfile',
            '-Command',
            `(Invoke-RestMethod -Uri 'http://127.0.0.1:${port}/json/version' -TimeoutSec 1 | ConvertTo-Json -Compress)`,
          ],
          { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
        );

        if (out) {
          try {
            const parsed = JSON.parse(out) as Record<string, unknown>;
            const browser = parsed.Browser ?? parsed['User-Agent'] ?? '';
            const chromeMatch = String(browser).match(/Chrome\/(\d+(?:\.\d+){0,3})/iu);
            if (chromeMatch) {
              return chromeMatch[1];
            }

            const plainVersionMatch = String(browser).match(/(\d+(?:\.\d+){0,3})/u);
            if (plainVersionMatch) {
              return plainVersionMatch[1];
            }
          } catch {
            // Fall through and retry while the Electron process is still booting.
          }
        }
      } catch {
        // Not up yet; wait briefly and retry.
      }

      sleepSync(200);
    }
  } catch {
    // Browser version detection is optional. WDIO can still use env-provided versions.
  } finally {
    if (child?.pid) {
      killProcessTree(child.pid);
    }
  }

  return undefined;
}

function sleepSync(milliseconds: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
}

function killProcessTree(pid: number): void {
  try {
    if (process.platform === 'win32') {
      childProcess.execFileSync('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore' });
      return;
    }

    process.kill(pid);
  } catch {
    // Ignore cleanup failures so optional detection never blocks test startup.
  }
}

function isWindowsAbsolutePath(value: string): boolean {
  return /^[a-zA-Z]:[\\/]/.test(value) || /^\\\\/.test(value);
}

function normalizePathForCurrentHost(value: string): string {
  if (isWindowsAbsolutePath(value)) {
    return value;
  }

  return path.resolve(process.cwd(), value);
}

function dirnameForCurrentHost(value: string): string {
  if (isWindowsAbsolutePath(value)) {
    return path.win32.dirname(value);
  }

  return path.dirname(value);
}

function assertFileExists(filePath: string, description: string): void {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    throw new Error(`${description} does not exist or is not a file: ${filePath}`);
  }
}

function findExistingBinary(candidatePaths: string[]): string | undefined {
  for (const candidatePath of candidatePaths) {
    const normalizedPath = normalizePathForCurrentHost(candidatePath);

    if (fs.existsSync(normalizedPath) && fs.statSync(normalizedPath).isFile()) {
      return normalizedPath;
    }
  }

  return undefined;
}

const DEFAULT_CSDU_INSTALLER_PATH = path.resolve(
  process.cwd(),
  'dist',
  'electron-builder',
  'win-unpacked',
  'ControlScript Deployment Utility.exe',
);

const DEFAULT_WINDOWS_INSTALL_PATHS = [
  'C:\\Program Files (x86)\\Extron\\ControlScript Deployment Utility\\ControlScript Deployment Utility.exe',
  'C:\\Program Files\\Extron\\ControlScript Deployment Utility\\ControlScript Deployment Utility.exe',
];

export function getElectronServiceOptions(): ElectronServiceOptions {
  const envAppBinaryPath = getEnv('CSDU_EXE_LOCATION') || getEnv('ELECTRON_APP_BINARY_PATH');
  const appArgs = getListEnv('ELECTRON_APP_ARGS');

  let appBinaryPath: string | undefined = envAppBinaryPath;

  if (appBinaryPath) {
    appBinaryPath = normalizePathForCurrentHost(appBinaryPath);
    assertFileExists(appBinaryPath, 'ELECTRON_APP_BINARY_PATH or CSDU_EXE_LOCATION');
  } else {
    appBinaryPath = findExistingBinary([
      DEFAULT_CSDU_INSTALLER_PATH,
      ...DEFAULT_WINDOWS_INSTALL_PATHS,
    ]);
  }

  if (!appBinaryPath) {
    throw new Error(
      'ELECTRON_APP_BINARY_PATH or CSDU_EXE_LOCATION is required. Set it to the packaged Electron app binary, for example C:\\Program Files\\Extron\\ControlScript Deployment Utility\\ControlScript Deployment Utility.exe on Windows.',
    );
  }

  return {
    appBinaryPath,
    appArgs,
  };
}

export function getChromedriverOptions(): ChromedriverOptions | undefined {
  const binary = getEnv('CHROMEDRIVER_BINARY_PATH') || getEnv('CHROMEDRIVER_PATH');
  const logPath =
    getEnv('CHROMEDRIVER_LOG_PATH') ||
    path.resolve(process.cwd(), 'reports/wdio-logs/chromedriver-session.log');
  const verbose = getBooleanEnv('CHROMEDRIVER_VERBOSE', true);
  const options: ChromedriverOptions = {
    logPath,
    ...(verbose ? { verbose } : {}),
  };

  if (binary) {
    const normalizedBinary = normalizePathForCurrentHost(binary);
    assertFileExists(normalizedBinary, 'CHROMEDRIVER_BINARY_PATH or CHROMEDRIVER_PATH');
    options.binary = normalizedBinary;
  }

  return options;
}

function getChromedriverSpawnCwd(appBinaryPath: string): string {
  const configuredCwd = getEnv('CHROMEDRIVER_SPAWN_CWD') || getEnv('ELECTRON_APP_CWD');

  if (configuredCwd) {
    return normalizePathForCurrentHost(configuredCwd);
  }

  return dirnameForCurrentHost(appBinaryPath);
}

function writeCapabilityDebugFile(capability: ElectronCapability): void {
  const debugFile = path.resolve(
    process.cwd(),
    'reports/wdio-logs/electron-capability-request.json',
  );

  try {
    fs.mkdirSync(path.dirname(debugFile), { recursive: true });
    fs.writeFileSync(debugFile, `${JSON.stringify(capability, null, 2)}\n`);
  } catch {
    // Diagnostics should never prevent WDIO from starting.
  }
}

export function buildElectronCapability(): ElectronCapability {
  const serviceOptions = getElectronServiceOptions();
  const appBinaryPath = serviceOptions.appBinaryPath;

  if (!appBinaryPath) {
    throw new Error('Electron app binary path is required before building capabilities.');
  }

  const browserVersion = getElectronCapabilityVersion(appBinaryPath, serviceOptions.appArgs);
  const chromedriverOptions = getChromedriverOptions();
  const chromedriverSpawnCwd = getChromedriverSpawnCwd(appBinaryPath);
  const chromeArgs = getListEnv('ELECTRON_CHROME_ARGS');
  const userDataDir = getEnv('ELECTRON_USER_DATA_DIR') || getEnv('ELECTRON_APP_USER_DATA_DIR');
  const normalizedUserDataDir = userDataDir ? normalizePathForCurrentHost(userDataDir) : undefined;
  const windowTypes = getListEnv('ELECTRON_CHROME_WINDOW_TYPES');
  const debuggerAddress =
    getEnv('ELECTRON_DEBUGGER_ADDRESS') || getEnv('ELECTRON_CHROME_DEBUGGER_ADDRESS');
  const resolvedChromeArgs = [
    ...chromeArgs,
    ...(normalizedUserDataDir && !chromeArgs.some((arg) => arg.includes('user-data-dir'))
      ? [`--user-data-dir=${normalizedUserDataDir}`]
      : []),
  ];
  const enableBidi = getBooleanEnv('WDIO_ENABLE_BIDI', false);

  const capability: ElectronCapability = {
    browserName: 'electron',
    ...(browserVersion ? { browserVersion } : {}),
    ...(enableBidi ? { webSocketUrl: true } : {}),
    ...(!enableBidi ? { 'wdio:enforceWebDriverClassic': true } : {}),
    'goog:chromeOptions': {
      windowTypes: windowTypes.length > 0 ? windowTypes : ['page', 'app', 'webview'],
      ...(debuggerAddress ? { debuggerAddress } : {}),
      ...(resolvedChromeArgs.length > 0 ? { args: resolvedChromeArgs } : {}),
    },
    'wdio:electronServiceOptions': serviceOptions,
    ...(chromedriverOptions
      ? {
          'wdio:chromedriverOptions': {
            ...chromedriverOptions,
            spawnOpts: {
              cwd: chromedriverSpawnCwd,
              windowsHide: true,
            },
          },
        }
      : {}),
  };

  writeCapabilityDebugFile(capability);

  return capability;
}
