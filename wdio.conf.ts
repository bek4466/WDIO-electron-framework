import os from 'node:os';
import type { Capabilities, Options } from '@wdio/types';
import {
  buildElectronCapability,
  ELECTRON_VERSION,
  isUsingPackagedBinary,
} from './config/electron.config.js';
import { getNumberEnv } from './config/env.js';
import { ensureReportDirectories, reportPaths } from './config/reporting.config.js';
import { attachEvidence, startEvidenceCapture } from './src/support/evidence.js';

const waitTimeout = getNumberEnv('WAIT_TIMEOUT_MS', 10000);
const isPackagedBinaryRun = isUsingPackagedBinary();

type WdioTestrunnerConfig = Options.Testrunner & {
  capabilities: Capabilities.TestrunnerCapabilities;
};

export const config: WdioTestrunnerConfig = {
  runner: 'local',
  outputDir: reportPaths.wdioLogs,
  specs: ['./src/specs/**/*.spec.ts'],
  suites: {
    smoke: ['./src/specs/smoke/**/*.spec.ts'],
    regression: ['./src/specs/regression/**/*.spec.ts'],
    sampleJson: ['./src/specs/smoke/json-sample-dashboard.spec.ts'],
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
        disableMochaHooks: true,
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
        reportedEnvironmentVars: {
          Framework: 'WDIO Electron Framework',
          'Target app': isPackagedBinaryRun
            ? 'Packaged Electron binary'
            : 'Included Electron sample app',
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
    timeout: 120000,
  },
  onPrepare: () => {
    ensureReportDirectories();
  },
  beforeTest: async (test) => {
    await startEvidenceCapture(test);
  },
  afterTest: async (test, _context, result) => {
    await attachEvidence(test, result);
  },
};
