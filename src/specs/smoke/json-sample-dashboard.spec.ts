import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect } from 'chai';
import { sampleDashboardScreen } from '../../screens/sample-dashboard.screen.js';
import { expectTextToContain } from '../../support/assertions.js';
import {
  type JsonFlowFile,
  type JsonFlowStep,
  type JsonFlowTest,
  runJsonFlowTest,
} from '../../support/json-flow-runner.js';

type SampleDashboardAction =
  | 'openDashboard'
  | 'waitForDashboard'
  | 'expectWindowTitle'
  | 'expectHeading'
  | 'expectStatusContains'
  | 'expectCounter'
  | 'incrementCounter';

const dataFilePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../test-data/json/sample-dashboard.flow.json',
);

const jsonFlow = JSON.parse(
  fs.readFileSync(dataFilePath, 'utf8'),
) as JsonFlowFile<SampleDashboardAction>;

function expectedValue<T>(step: JsonFlowStep<SampleDashboardAction>): T {
  return step.expected as T;
}

const handlers: Record<
  SampleDashboardAction,
  (
    step: JsonFlowStep<SampleDashboardAction>,
    testCase: JsonFlowTest<SampleDashboardAction>,
  ) => Promise<void>
> = {
  openDashboard: async () => {
    await sampleDashboardScreen.open();
  },
  waitForDashboard: async () => {
    await sampleDashboardScreen.waitForLoaded();
  },
  expectWindowTitle: async (step) => {
    expect(await sampleDashboardScreen.getWindowTitle()).to.equal(expectedValue<string>(step));
  },
  expectHeading: async (step) => {
    expect(await sampleDashboardScreen.heading.getText()).to.equal(expectedValue<string>(step));
  },
  expectStatusContains: async (step) => {
    await expectTextToContain(sampleDashboardScreen.status.getText(), expectedValue<string>(step));
  },
  expectCounter: async (step) => {
    expect(await sampleDashboardScreen.getCounterValue()).to.equal(expectedValue<number>(step));
  },
  incrementCounter: async () => {
    await sampleDashboardScreen.incrementCounter();
  },
};

describe(jsonFlow.suiteName, () => {
  for (const testCase of jsonFlow.tests) {
    it(`${testCase.id}: ${testCase.title}`, async () => {
      await runJsonFlowTest(testCase, handlers);
    });
  }
});
