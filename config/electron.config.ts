import path from 'node:path';
import { getEnv, getListEnv } from './env.js';

export const ELECTRON_MAJOR_VERSION = 41;
export const ELECTRON_VERSION = '41.0.0';

type ElectronServiceOptions = {
  appBinaryPath?: string;
  appArgs?: string[];
};

export type ElectronCapability = {
  browserName: 'electron';
  'wdio:electronServiceOptions': ElectronServiceOptions;
};

function getSampleAppBinaryPath(): string {
  if (process.platform === 'darwin') {
    return path.resolve(
      process.cwd(),
      'dist/electron-smoke-app/Electron.app/Contents/MacOS/Electron',
    );
  }

  if (process.platform === 'win32') {
    return path.resolve(process.cwd(), 'dist/electron-smoke-app/electron.exe');
  }

  return path.resolve(process.cwd(), 'dist/electron-smoke-app/electron');
}

function getSampleAppDirectory(): string {
  if (process.platform === 'darwin') {
    return path.resolve(
      process.cwd(),
      'dist/electron-smoke-app/Electron.app/Contents/Resources/app',
    );
  }

  return path.resolve(process.cwd(), 'dist/electron-smoke-app/resources/app');
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

export function getElectronServiceOptions(): ElectronServiceOptions {
  const appBinaryPath = getEnv('ELECTRON_APP_BINARY_PATH');
  const appArgs = getListEnv('ELECTRON_APP_ARGS');

  if (appBinaryPath) {
    return {
      appBinaryPath: normalizePathForCurrentHost(appBinaryPath),
      appArgs,
    };
  }

  return {
    appBinaryPath: getSampleAppBinaryPath(),
    appArgs: [getSampleAppDirectory(), ...appArgs],
  };
}

export function buildElectronCapability(): ElectronCapability {
  return {
    browserName: 'electron',
    'wdio:electronServiceOptions': getElectronServiceOptions(),
  };
}

export function isUsingPackagedBinary(): boolean {
  return getEnv('ELECTRON_APP_BINARY_PATH') !== '';
}
