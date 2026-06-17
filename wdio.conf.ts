import type { Capabilities, Options } from '@wdio/types';
import { buildElectronCapability } from './config/electron.config.js';
import { getNumberEnv } from './config/env.js';
import { ensureReportDirectories, reportPaths } from './config/reporting.config.js';

const waitTimeout = getNumberEnv('WAIT_TIMEOUT_MS', 10000);

type WdioTestrunnerConfig = Options.Testrunner & {
  capabilities: Capabilities.TestrunnerCapabilities;
};

export const config: WdioTestrunnerConfig = {
  runner: 'local',
  specs: ['./src/specs/**/*.spec.ts'],
  suites: {
    smoke: ['./src/specs/smoke/**/*.spec.ts'],
    regression: ['./src/specs/regression/**/*.spec.ts'],
  },
  exclude: [],
  maxInstances: 1,
  capabilities: [buildElectronCapability() as WebdriverIO.Capabilities],
  logLevel: 'info',
  bail: 0,
  baseUrl: '',
  waitforTimeout: waitTimeout,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 1,
  services: ['electron'],
  framework: 'mocha',
  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: reportPaths.allureResults,
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: 120000,
  },
  onPrepare: () => {
    ensureReportDirectories();
  },
  afterTest: async (_test, _context, result) => {
    if (result.error) {
      await browser.saveScreenshot(`${reportPaths.screenshots}/${Date.now()}-failure.png`);
    }
  },
};
