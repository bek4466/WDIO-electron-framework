import { browser } from '@wdio/globals';
import { expect } from 'chai';

describe('Electron window state', () => {
  it('keeps the active renderer reachable', async () => {
    const handles = await browser.getWindowHandles();
    const readyState = await browser.execute(() => document.readyState);

    expect(handles.length).to.be.greaterThan(0);
    expect(['interactive', 'complete']).to.include(readyState);
  });
});
