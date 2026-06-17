import { expect } from 'chai';
import { isUsingPackagedBinary } from '../../../config/electron.config.js';
import { sampleDashboardScreen } from '../../screens/sample-dashboard.screen.js';
import { sampleDashboardData } from '../../test-data/sample-dashboard.data.js';

const describeSampleOnly = isUsingPackagedBinary() ? describe.skip : describe;

describeSampleOnly('Sample Electron app dashboard', () => {
  beforeEach(async () => {
    await sampleDashboardScreen.open();
  });

  it('loads using the page object model', async () => {
    await sampleDashboardScreen.waitForLoaded();

    expect(await sampleDashboardScreen.getWindowTitle()).to.equal(sampleDashboardData.title);
    expect(await sampleDashboardScreen.heading.getText()).to.equal(sampleDashboardData.heading);
    expect(await sampleDashboardScreen.status.getText()).to.equal(sampleDashboardData.readyStatus);
  });

  it('supports data-driven state validation', async () => {
    await sampleDashboardScreen.waitForLoaded();

    expect(await sampleDashboardScreen.getCounterValue()).to.equal(
      sampleDashboardData.counter.initialValue,
    );

    await sampleDashboardScreen.incrementCounter();

    expect(await sampleDashboardScreen.getCounterValue()).to.equal(
      sampleDashboardData.counter.valueAfterIncrement,
    );
  });
});
