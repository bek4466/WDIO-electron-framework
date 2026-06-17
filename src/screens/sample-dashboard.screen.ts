import fs from 'node:fs';
import path from 'node:path';
import { browser } from '@wdio/globals';
import { BaseScreen } from '../pages/base.screen.js';

class SampleDashboardScreen extends BaseScreen {
  constructor() {
    super('[data-testid="sample-dashboard"]');
  }

  get heading() {
    return this.byTestId('dashboard-heading');
  }

  get status() {
    return this.byTestId('automation-status');
  }

  get counter() {
    return this.byTestId('counter-value');
  }

  get incrementButton() {
    return this.byTestId('increment-button');
  }

  async open(): Promise<void> {
    const sampleHtmlPath = path.resolve(
      process.cwd(),
      'src/fixtures/electron-smoke-app/index.html',
    );
    const sampleHtml = fs.readFileSync(sampleHtmlPath, 'utf8');

    await browser.execute((html) => {
      document.open();
      document.write(html);
      document.close();

      const counter = document.querySelector('[data-testid="counter-value"]');
      const button = document.querySelector('[data-testid="increment-button"]');

      button?.addEventListener('click', () => {
        if (counter) {
          counter.textContent = String(Number(counter.textContent) + 1);
        }
      });
    }, sampleHtml);
  }

  async incrementCounter(): Promise<void> {
    await this.incrementButton.click();
  }

  async getCounterValue(): Promise<number> {
    return Number(await this.counter.getText());
  }
}

export const sampleDashboardScreen = new SampleDashboardScreen();
