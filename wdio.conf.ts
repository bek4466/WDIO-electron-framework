import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import allureReporter from '@wdio/allure-reporter';
import type { Capabilities, Options } from '@wdio/types';
import {
  buildElectronCapability,
  ELECTRON_VERSION,
  isUsingPackagedBinary,
} from './config/electron.config.js';
import { getNumberEnv } from './config/env.js';
import { ensureReportDirectories, reportPaths } from './config/reporting.config.js';

const waitTimeout = getNumberEnv('WAIT_TIMEOUT_MS', 10000);
const isPackagedBinaryRun = isUsingPackagedBinary();

type WdioTestrunnerConfig = Options.Testrunner & {
  capabilities: Capabilities.TestrunnerCapabilities;
};

function sanitizeFileName(value: string): string {
  return value
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

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
  afterTest: async (test, _context, result) => {
    if (result.error) {
      const screenshot = await browser.takeScreenshot();
      const screenshotBuffer = Buffer.from(screenshot, 'base64');
      const fileName = `${Date.now()}-${sanitizeFileName(test.title)}-failure.png`;
      const screenshotPath = path.join(reportPaths.screenshots, fileName);

      fs.writeFileSync(screenshotPath, screenshotBuffer);

      await allureReporter.addAttachment('Failure screenshot', screenshotBuffer, 'image/png');
      await allureReporter.addAttachment(
        'Failure details',
        JSON.stringify(
          {
            title: test.title,
            fullTitle: test.fullTitle,
            error: {
              message: result.error.message,
              stack: result.error.stack,
            },
          },
          null,
          2,
        ),
        'application/json',
      );
    }
  },
};
