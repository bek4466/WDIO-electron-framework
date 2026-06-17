/* tslint:disable */

import { browser } from '@wdio/globals';
import { MatButton } from "../matButton";
import { allure } from "../allure/allure";

export class ProtectProjectPathLabel extends MatButton {
  constructor(
    app: WebdriverIO.Browser,
    selector: string,
    private dialogSelector: string
  ) {
    super(app, selector, "Protect Project Select Location Button");
  }

  public async click(): Promise<void> {
    await allure.step(
      `Set the value of ${this.name} input to ${this.app}`,
      async () => {
        await allure.screenshot(
          this.app,
          "Protect Project select location button before click action "
        );
        await super.click();
      }
    );
    await allure.screenshot(
      this.app,
      "After protect project select location button was clicked"
    );
  }

  public async verifyPathMatches(fpath: string) : Promise<boolean> {
    let doesPathMatch = false;
    const protectProjectPathLabel = await browser.$(this.selector);
    await protectProjectPathLabel.getText().then((text) => {
      if (text === fpath) {
        doesPathMatch = true;
      }
    });
    return doesPathMatch;
  }
}
