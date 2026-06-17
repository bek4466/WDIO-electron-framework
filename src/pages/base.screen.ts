import { $, browser } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';
import { byTestId } from '../support/selectors.js';
import { defaultTimeout, type WaitOptions } from '../support/waits.js';

export abstract class BaseScreen {
  protected constructor(private readonly rootSelector: string) {}

  protected get root(): ChainablePromiseElement {
    return $(this.rootSelector);
  }

  protected byTestId(testId: string): ChainablePromiseElement {
    return $(byTestId(testId));
  }

  async waitForLoaded(options: WaitOptions = {}): Promise<void> {
    await this.root.waitForDisplayed({
      timeout: options.timeout ?? defaultTimeout,
      timeoutMsg: options.timeoutMsg ?? `Expected ${this.rootSelector} to be displayed`,
    });
  }

  async getWindowTitle(): Promise<string> {
    return browser.getTitle();
  }
}
