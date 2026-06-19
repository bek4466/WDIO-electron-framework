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
  [key: string]: unknown;
};

export type ElectronCapability = {
  browserName: 'electron';
  browserVersion?: string;
  'wdio:electronServiceOptions': ElectronServiceOptions;
  'wdio:chromedriverOptions'?: ChromedriverOptions;
};

export function getElectronBrowserVersion(
  appBinaryPath?: string,
  appArgs: string[] = [],
): string | undefined {
  return (
    getEnv('ELECTRON_APP_BROWSER_VERSION') ||
    getEnv('ELECTRON_BROWSER_VERSION') ||
    getEnv('BROWSER_VERSION') ||
    detectBrowserVersionFromBinarySync(appBinaryPath, appArgs) ||
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

  if (!binary) {
    return undefined;
  }

  const normalizedBinary = normalizePathForCurrentHost(binary);
  assertFileExists(normalizedBinary, 'CHROMEDRIVER_BINARY_PATH or CHROMEDRIVER_PATH');

  return {
    binary: normalizedBinary,
  };
}

export function buildElectronCapability(): ElectronCapability {
  const serviceOptions = getElectronServiceOptions();
  const browserVersion = getElectronBrowserVersion(
    serviceOptions.appBinaryPath,
    serviceOptions.appArgs,
  );
  const chromedriverOptions = getChromedriverOptions();

  return {
    browserName: 'electron',
    ...(browserVersion ? { browserVersion } : {}),
    'wdio:electronServiceOptions': serviceOptions,
    ...(chromedriverOptions ? { 'wdio:chromedriverOptions': chromedriverOptions } : {}),
  };
}
