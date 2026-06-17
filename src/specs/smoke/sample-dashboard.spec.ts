import { expect } from 'chai';
import { isUsingPackagedBinary } from '../../../config/electron.config.js';
import { sampleDashboardScreen } from '../../screens/sample-dashboard.screen.js';
import { annotateTest, allureStep, attachJson } from '../../support/allure.js';
import { sampleDashboardData } from '../../test-data/sample-dashboard.data.js';

const describeSampleOnly = isUsingPackagedBinary() ? describe.skip : describe;

describeSampleOnly('Sample Electron app dashboard', () => {
  beforeEach(async () => {
    await sampleDashboardScreen.open();
  });

  it('loads using the page object model', async () => {
    await annotateTest({
      suite: 'Smoke',
      epic: 'Sample application',
      feature: 'Dashboard',
      story: 'Load dashboard through page object model',
      severity: 'critical',
      owner: 'QA Automation',
      tags: ['smoke', 'pom', 'sample-app'],
      description: 'Validates the sample Electron dashboard through reusable screen objects.',
    });

    await allureStep('Wait for dashboard screen to be loaded', () =>
      sampleDashboardScreen.waitForLoaded(),
    );

    expect(await sampleDashboardScreen.getWindowTitle()).to.equal(sampleDashboardData.title);
    expect(await sampleDashboardScreen.heading.getText()).to.equal(sampleDashboardData.heading);
    expect(await sampleDashboardScreen.status.getText()).to.equal(sampleDashboardData.readyStatus);
  });

  it('supports data-driven state validation', async () => {
    await annotateTest({
      suite: 'Smoke',
      epic: 'Sample application',
      feature: 'Dashboard counter',
      story: 'Validate data-driven counter behavior',
      severity: 'normal',
      owner: 'QA Automation',
      tags: ['smoke', 'data-driven', 'sample-app'],
      description:
        'Uses external test data to verify dashboard counter state before and after action.',
    });

    await attachJson('Counter expectations', sampleDashboardData.counter);
    await allureStep('Wait for dashboard screen to be loaded', () =>
      sampleDashboardScreen.waitForLoaded(),
    );

    expect(await sampleDashboardScreen.getCounterValue()).to.equal(
      sampleDashboardData.counter.initialValue,
    );

    await allureStep('Increment dashboard counter', () => sampleDashboardScreen.incrementCounter());

    expect(await sampleDashboardScreen.getCounterValue()).to.equal(
      sampleDashboardData.counter.valueAfterIncrement,
    );
  });
});
