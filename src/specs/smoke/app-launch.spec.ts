import { browser } from '@wdio/globals';
import { expect } from 'chai';
import { annotateTest, allureStep, attachJson } from '../../support/allure.js';
import { appExpectations } from '../../test-data/app-expectations.js';

describe('Electron application launch', () => {
  it('opens at least one renderer window', async () => {
    await annotateTest({
      suite: 'Smoke',
      epic: 'Application launch',
      feature: 'Renderer windows',
      story: 'Launch packaged Electron application',
      severity: 'critical',
      owner: 'QA Automation',
      tags: ['smoke', 'electron', 'launch'],
      description: 'Confirms the Electron process starts and exposes at least one renderer window.',
    });

    const handles = await allureStep('Collect renderer window handles', () =>
      browser.getWindowHandles(),
    );

    await attachJson('Renderer window handles', handles);

    expect(handles.length).to.be.greaterThan(0);
  });

  for (const expectedTitle of appExpectations.expectedWindowTitles) {
    it(`shows expected window title: ${expectedTitle}`, async () => {
      await annotateTest({
        suite: 'Smoke',
        epic: 'Application launch',
        feature: 'Window title',
        story: 'Validate configured title expectation',
        severity: 'normal',
        owner: 'QA Automation',
        tags: ['smoke', 'electron', 'window-title'],
        description: `Validates that the active Electron window title includes \`${expectedTitle}\`.`,
      });

      await allureStep(`Wait for window title to include "${expectedTitle}"`, async () => {
        await browser.waitUntil(async () => (await browser.getTitle()).includes(expectedTitle), {
          timeoutMsg: `Expected window title to include ${expectedTitle}`,
        });
      });

      const actualTitle = await allureStep('Read active window title', () => browser.getTitle());

      expect(actualTitle).to.contain(expectedTitle);
    });
  }
});
