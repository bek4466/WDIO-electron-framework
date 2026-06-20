import childProcess from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { Capabilities, Options } from '@wdio/types';
import {
  ELECTRON_VERSION,
  getChromedriverOptions,
  getElectronServiceOptions,
} from './config/electron.config.js';
import { getEnv, getListEnv, getNumberEnv } from './config/env.js';
import { ensureReportDirectories, reportPaths } from './config/reporting.config.js';
import { attachEvidence, startEvidenceCapture } from './src/support/evidence.js';

let electronProcess: childProcess.ChildProcess | undefined;

const waitTimeout = getNumberEnv('WAIT_TIMEOUT_MS', 10000);
const connectionRetryTimeout = getNumberEnv('WDIO_CONNECTION_RETRY_TIMEOUT_MS', 300000);
const connectionRetryCount = getNumberEnv('WDIO_CONNECTION_RETRY_COUNT', 1);
const attachPort = getNumberEnv('ELECTRON_ATTACH_DEBUG_PORT', 9229);
const attachTimeout = getNumberEnv('ELECTRON_ATTACH_TIMEOUT_MS', 300000);
const debuggerAddress = getEnv('ELECTRON_DEBUGGER_ADDRESS', `127.0.0.1:${attachPort}`);
const attachLifecycleLogPath = path.join(reportPaths.wdioLogs, 'wdio-attach-lifecycle.log');

type WdioTestrunnerConfig = Options.Testrunner & {
  capabilities: Capabilities.TestrunnerCapabilities;
};

function lifecycleLog(message: string, details?: Record<string, unknown>): void {
  const line = `[WDIO ATTACH][${new Date().toISOString()}] ${message}${
    details ? ` ${JSON.stringify(details)}` : ''
  }`;

  console.info(line);
  fs.mkdirSync(reportPaths.wdioLogs, { recursive: true });
  fs.appendFileSync(attachLifecycleLogPath, `${line}\n`);
}

function isWindowsAbsolutePath(value: string): boolean {
  return /^[a-zA-Z]:[\\/]/u.test(value) || /^\\\\/u.test(value);
}

function dirnameForCurrentHost(value: string): string {
  return isWindowsAbsolutePath(value) ? path.win32.dirname(value) : path.dirname(value);
}

function killProcessTree(child: childProcess.ChildProcess): void {
  if (!child.pid) {
    return;
  }

  try {
    if (process.platform === 'win32') {
      childProcess.execFileSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], {
        stdio: 'ignore',
      });
      return;
    }

    process.kill(-child.pid, 'SIGTERM');
  } catch {
    child.kill();
  }
}

async function waitForDevToolsEndpoint(timeoutMs: number): Promise<Record<string, unknown>> {
  const startedAt = Date.now();
  let lastError = '';

  while (Date.now() - startedAt <= timeoutMs) {
    try {
      const response = await fetch(`http://${debuggerAddress}/json/version`);

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      return (await response.json()) as Record<string, unknown>;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    }
  }

  throw new Error(
    `Timed out waiting for Electron DevTools at ${debuggerAddress} after ${timeoutMs}ms. Last error: ${lastError}`,
  );
}

function writeDiagnosticJson(fileName: string, value: unknown): void {
  fs.mkdirSync(reportPaths.wdioLogs, { recursive: true });
  fs.writeFileSync(
    path.join(reportPaths.wdioLogs, fileName),
    `${JSON.stringify(value, null, 2)}\n`,
  );
}

async function logAttachedWindows(): Promise<void> {
  const diagnostics: Array<{
    index: number;
    handle: string;
    title?: string;
    url?: string;
    error?: string;
  }> = [];
  const originalHandle = await browser.getWindowHandle().catch(() => undefined);
  const handles = await browser.getWindowHandles();

  for (const [index, handle] of handles.entries()) {
    try {
      await browser.switchToWindow(handle);
      diagnostics.push({
        index,
        handle,
        title: await browser.getTitle(),
        url: await browser.getUrl(),
      });
    } catch (error) {
      diagnostics.push({
        index,
        handle,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (originalHandle) {
    await browser.switchToWindow(originalHandle).catch(() => undefined);
  }

  writeDiagnosticJson('electron-attach-windows.json', diagnostics);
  lifecycleLog('attached windows', {
    windowCount: diagnostics.length,
    windows: diagnostics.map(({ index, title, url, error }) => ({ index, title, url, error })),
  });
}

function buildAttachCapability(): WebdriverIO.Capabilities {
  const windowTypes = getListEnv('ELECTRON_CHROME_WINDOW_TYPES');
  const chromedriverOptions = getChromedriverOptions();

  return {
    browserName: 'chrome',
    'wdio:enforceWebDriverClassic': true,
    'goog:chromeOptions': {
      debuggerAddress,
      windowTypes: windowTypes.length > 0 ? windowTypes : ['tab', 'page', 'app', 'webview'],
    },
    ...(chromedriverOptions ? { 'wdio:chromedriverOptions': chromedriverOptions } : {}),
  };
}

export const config: WdioTestrunnerConfig = {
  runner: 'local',
  outputDir: reportPaths.wdioLogs,
  specs: ['./src/specs/**/*.spec.ts'],
  suites: {
    smoke: ['./src/specs/smoke/**/*.spec.ts'],
    regression: ['./src/specs/regression/**/*.spec.ts'],
    e2eJsonNewMaster: ['./e2e/tests/regression/NEWMASTERSPEC/UpdatedMaster.e2e-spec.ts'],
    e2eJsonNbp: ['./e2e/tests/regression/NBP/TestMaster.e2e-spec.ts'],
    e2eJsonHardware: ['./e2e/tests/regression/hardwareSupport-tests/master.e2e-spec.ts'],
  },
  maxInstances: 1,
  capabilities: [buildAttachCapability()],
  logLevel: 'info',
  bail: 0,
  baseUrl: '',
  waitforTimeout: waitTimeout,
  connectionRetryTimeout,
  connectionRetryCount,
  services: [],
  framework: 'mocha',
  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: reportPaths.allureResults,
        disableMochaHooks: process.env.ALLURE_DISABLE_MOCHA_HOOKS === 'true',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
        reportedEnvironmentVars: {
          Framework: 'WDIO Electron Framework',
          'Target app': 'Packaged Electron binary attached by debuggerAddress',
          'Electron version': ELECTRON_VERSION,
          'Node version': process.version,
          Platform: `${process.platform} ${os.release()}`,
          Architecture: process.arch,
          Worker: 'local-attach',
        },
      },
    ],
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: 120000,
  },
  onPrepare: async () => {
    ensureReportDirectories();
    fs.writeFileSync(attachLifecycleLogPath, '');

    const serviceOptions = getElectronServiceOptions();
    const appBinaryPath = serviceOptions.appBinaryPath;

    if (!appBinaryPath) {
      throw new Error('CSDU_EXE_LOCATION or ELECTRON_APP_BINARY_PATH is required.');
    }

    const appArgs = [
      ...(serviceOptions.appArgs ?? []),
      ...getListEnv('ELECTRON_CHROME_ARGS'),
      `--remote-debugging-port=${attachPort}`,
    ];

    lifecycleLog('spawning Electron app', {
      appBinaryPath,
      cwd: dirnameForCurrentHost(appBinaryPath),
      appArgs,
      debuggerAddress,
      attachTimeout,
      connectionRetryTimeout,
    });

    electronProcess = childProcess.spawn(appBinaryPath, appArgs, {
      cwd: dirnameForCurrentHost(appBinaryPath),
      detached: process.platform !== 'win32',
      stdio: 'ignore',
      windowsHide: false,
    });

    const version = await waitForDevToolsEndpoint(attachTimeout);
    writeDiagnosticJson('electron-attach-devtools-version.json', version);
    lifecycleLog('Electron DevTools endpoint is ready', {
      Browser: version.Browser,
      'Protocol-Version': version['Protocol-Version'],
      'User-Agent': version['User-Agent'],
    });
  },
  onWorkerStart: (cid, _capabilities, specs, args) => {
    const suiteArg = (args as { suite?: unknown }).suite;
    const selectedSuite = Array.isArray(suiteArg) ? String(suiteArg[0]) : undefined;

    if (selectedSuite) {
      process.env.TESTTYPE = selectedSuite;
    }

    lifecycleLog('onWorkerStart', { cid, specs, selectedSuite, testType: process.env.TESTTYPE });
  },
  beforeSession: (_config, capabilities, specs, cid) => {
    writeDiagnosticJson('electron-attach-capability-before-session.json', capabilities);
    lifecycleLog('beforeSession', {
      cid,
      specs,
      browserName: (capabilities as WebdriverIO.Capabilities).browserName,
      chromeOptions: (capabilities as WebdriverIO.Capabilities)['goog:chromeOptions'],
    });
  },
  before: async (_capabilities, specs) => {
    lifecycleLog('before framework hook', { specs, sessionId: browser.sessionId });
    await logAttachedWindows();
  },
  beforeTest: async (test) => {
    lifecycleLog('beforeTest', { title: test.title, fullTitle: test.fullTitle });
    await startEvidenceCapture(test);
  },
  afterTest: async (test, _context, result) => {
    lifecycleLog('afterTest', {
      title: test.title,
      fullTitle: test.fullTitle,
      passed: result.passed,
      error: result.error?.message,
    });
    await attachEvidence(test, result);
  },
  onWorkerEnd: (cid, exitCode, specs) => {
    lifecycleLog('onWorkerEnd', { cid, exitCode, specs });
  },
  onComplete: (exitCode) => {
    lifecycleLog('onComplete', { exitCode });

    if (electronProcess) {
      killProcessTree(electronProcess);
    }
  },
};
