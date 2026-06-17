import { browser } from '@wdio/globals';
import { expect } from 'chai';
import { annotateTest, allureStep, attachJson } from '../../support/allure.js';

describe('Electron window state', () => {
  it('keeps the active renderer reachable', async () => {
    await annotateTest({
      suite: 'Regression',
      epic: 'Renderer stability',
      feature: 'Window state',
      story: 'Active renderer remains reachable',
      severity: 'critical',
      owner: 'QA Automation',
      tags: ['regression', 'electron', 'renderer'],
      description: 'Ensures the active renderer context remains reachable after Electron startup.',
    });

    const handles = await allureStep('Collect renderer window handles', () =>
      browser.getWindowHandles(),
    );
    const readyState = await allureStep('Read renderer document ready state', () =>
      browser.execute(() => document.readyState),
    );

    await attachJson('Renderer state', {
      handles,
      readyState,
    });

    expect(handles.length).to.be.greaterThan(0);
    expect(['interactive', 'complete']).to.include(readyState);
  });
});
