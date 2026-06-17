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

  if (!appBinaryPath) {
    throw new Error(
      'ELECTRON_APP_BINARY_PATH is required. Set it to the packaged Electron app binary, for example C:\\Apps\\YourElectronApp\\YourElectronApp.exe on Windows.',
    );
  }

  return {
    appBinaryPath: normalizePathForCurrentHost(appBinaryPath),
    appArgs,
  };
}

export function buildElectronCapability(): ElectronCapability {
  return {
    browserName: 'electron',
    'wdio:electronServiceOptions': getElectronServiceOptions(),
  };
}
