import { browser } from '@wdio/globals';
import { expect } from 'chai';
import { appExpectations } from '../../test-data/app-expectations.js';

describe('Electron application launch', () => {
  it('opens at least one renderer window', async () => {
    const handles = await browser.getWindowHandles();

    expect(handles.length).to.be.greaterThan(0);
  });

  for (const expectedTitle of appExpectations.expectedWindowTitles) {
    it(`shows expected window title: ${expectedTitle}`, async () => {
      await browser.waitUntil(async () => (await browser.getTitle()).includes(expectedTitle), {
        timeoutMsg: `Expected window title to include ${expectedTitle}`,
      });

      expect(await browser.getTitle()).to.contain(expectedTitle);
    });
  }
});
