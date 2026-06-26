import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { Capabilities, Options } from '@wdio/types';
import { buildElectronCapability, ELECTRON_VERSION } from './config/electron.config.js';
import { getNumberEnv } from './config/env.js';
import { ensureReportDirectories, reportPaths } from './config/reporting.config.js';
import { attachEvidence, startEvidenceCapture } from './src/support/evidence.js';

const waitTimeout = getNumberEnv('WAIT_TIMEOUT_MS', 10000);
const mochaTimeout = getNumberEnv('MOCHA_TIMEOUT_MS', 600000);
const connectionRetryTimeout = getNumberEnv('WDIO_CONNECTION_RETRY_TIMEOUT_MS', 180000);
const connectionRetryCount = getNumberEnv('WDIO_CONNECTION_RETRY_COUNT', 1);
const lifecycleLogPath = path.join(reportPaths.wdioLogs, 'wdio-lifecycle.log');
const debugCommands = process.env.E2E_DEBUG_COMMANDS === 'true';

function lifecycleLog(message: string, details?: Record<string, unknown>): void {
  const line = `[WDIO LIFECYCLE][${new Date().toISOString()}] ${message}${
    details ? ` ${JSON.stringify(details)}` : ''
  }`;

  console.info(line);
  fs.mkdirSync(reportPaths.wdioLogs, { recursive: true });
  fs.appendFileSync(lifecycleLogPath, `${line}\n`);
}

function writeDiagnosticJson(fileName: string, value: unknown): void {
  fs.mkdirSync(reportPaths.wdioLogs, { recursive: true });
  fs.writeFileSync(
    path.join(reportPaths.wdioLogs, fileName),
    `${JSON.stringify(value, null, 2)}\n`,
  );
}

async function logAttachedElectronWindows(): Promise<void> {
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

  writeDiagnosticJson('electron-attached-windows.json', diagnostics);
  lifecycleLog('attached Electron windows', {
    windowCount: diagnostics.length,
    windows: diagnostics.map(({ index, title, url, error }) => ({
      index,
      title,
      url,
      error,
    })),
  });
}

type WdioTestrunnerConfig = Options.Testrunner & {
  capabilities: Capabilities.TestrunnerCapabilities;
};

export const config: WdioTestrunnerConfig = {
  runner: 'local',
  outputDir: reportPaths.wdioLogs,
  specs: ['./src/specs/**/*.spec.ts'],
  suites: {
    smoke: ['./e2e/tests/regression/NEWMASTERSPEC/UpdatedMaster.e2e-spec.ts'],
    regression: ['./src/specs/regression/**/*.spec.ts'],
    e2eJson: [
      './e2e/tests/regression/NEWMASTERSPEC/UpdatedMaster.e2e-spec.ts',
      './e2e/tests/regression/NBP/TestMaster.e2e-spec.ts',
      './e2e/tests/regression/hardwareSupport-tests/master.e2e-spec.ts',
    ],
    e2eJsonNewMaster: ['./e2e/tests/regression/NEWMASTERSPEC/UpdatedMaster.e2e-spec.ts'],
    e2eJsonNbp: ['./e2e/tests/regression/NBP/TestMaster.e2e-spec.ts'],
    e2eJsonHardware: ['./e2e/tests/regression/hardwareSupport-tests/master.e2e-spec.ts'],
  },
  exclude: [],
  maxInstances: 1,
  capabilities: [buildElectronCapability() as WebdriverIO.Capabilities],
  logLevel: 'info',
  bail: 0,
  baseUrl: '',
  waitforTimeout: waitTimeout,
  connectionRetryTimeout,
  connectionRetryCount,
  services: ['electron'],
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
          'Target app': 'Packaged Electron binary',
          'Electron version': ELECTRON_VERSION,
          'Node version': process.version,
          Platform: `${process.platform} ${os.release()}`,
          Architecture: process.arch,
          Worker: 'local',
        },
      },
    ],
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: mochaTimeout,
  },
  onPrepare: () => {
    ensureReportDirectories();
    fs.writeFileSync(lifecycleLogPath, '');
    lifecycleLog('onPrepare', {
      specs: config.specs,
      suites: Object.keys(config.suites ?? {}),
      allureResults: reportPaths.allureResults,
      wdioLogs: reportPaths.wdioLogs,
      connectionRetryTimeout,
      connectionRetryCount,
    });
  },
  onWorkerStart: (cid, _capabilities, specs, args) => {
    const suiteArg = (args as { suite?: unknown }).suite;
    const selectedSuite = Array.isArray(suiteArg) ? String(suiteArg[0]) : undefined;

    if (selectedSuite) {
      process.env.TESTTYPE = selectedSuite;
    }

    if (selectedSuite === 'smoke' && !process.env.E2E_JSON_EXECUTION_MODE) {
      process.env.E2E_JSON_EXECUTION_MODE = 'live';
    }

    lifecycleLog('onWorkerStart', {
      cid,
      specs,
      selectedSuite,
      testType: process.env.TESTTYPE,
      jsonExecutionMode: process.env.E2E_JSON_EXECUTION_MODE,
    });
  },
  beforeSession: (_config, capabilities, specs, cid) => {
    writeDiagnosticJson('electron-capability-before-session.json', capabilities);
    lifecycleLog('beforeSession', {
      cid,
      specs,
      browserName: (capabilities as WebdriverIO.Capabilities).browserName,
      browserVersion: (capabilities as WebdriverIO.Capabilities).browserVersion,
      enforceWebDriverClassic: Boolean(
        (capabilities as WebdriverIO.Capabilities)['wdio:enforceWebDriverClassic'],
      ),
      hasWebSocketUrl: Object.prototype.hasOwnProperty.call(capabilities, 'webSocketUrl'),
      chromeArgs: (capabilities as WebdriverIO.Capabilities)['goog:chromeOptions']?.args,
    });
  },
  before: async (_capabilities, specs) => {
    lifecycleLog('before framework hook', {
      specs,
      sessionId: browser.sessionId,
    });
    await logAttachedElectronWindows();
  },
  beforeSuite: (suite) => {
    lifecycleLog('beforeSuite', {
      title: suite.title,
      fullTitle: suite.fullTitle,
    });
  },
  beforeTest: async (test) => {
    lifecycleLog('beforeTest', {
      title: test.title,
      fullTitle: test.fullTitle,
    });
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
  afterSession: (_config, capabilities, specs) => {
    lifecycleLog('afterSession', {
      specs,
      browserName: capabilities.browserName,
      browserVersion: capabilities.browserVersion,
    });
  },
  onWorkerEnd: (cid, exitCode, specs) => {
    lifecycleLog('onWorkerEnd', {
      cid,
      exitCode,
      specs,
    });
  },
  onComplete: (exitCode) => {
    lifecycleLog('onComplete', {
      exitCode,
    });
  },
  beforeCommand: (commandName, args) => {
    if (!debugCommands) {
      return;
    }

    lifecycleLog('beforeCommand', {
      commandName,
      argsLength: args.length,
    });
  },
  afterCommand: (commandName, _args, _result, error) => {
    if (!debugCommands && !error) {
      return;
    }

    lifecycleLog('afterCommand', {
      commandName,
      error: error?.message,
    });
  },
};
