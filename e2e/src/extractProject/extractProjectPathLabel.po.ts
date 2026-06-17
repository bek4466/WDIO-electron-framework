/* tslint:disable */

import { browser } from '@wdio/globals';
import { MatButton } from "../matButton";
import { allure } from "../allure/allure";

export class ExtractProjectPathLabel extends MatButton {
  constructor(
    app: WebdriverIO.Browser,
    selector: string,
    private dialogSelector: string
  ) {
    super(app, selector, "Extract Project Select Location Button");
  }

  public async click(): Promise<void> {
    await allure.step(
      `Set the value of ${this.name} input to ${this.app}`,
      async () => {
        await allure.screenshot(
          this.app,
          "Extract Project select location button before click action "
        );
        await super.click();
      }
    );
    await allure.screenshot(
      this.app,
      "After extract project select location button was clicked"
    );
  }

  public async verifyPathMatches(fpath: string) : Promise<boolean> {
    let doesPathMatch = false;
    const extractProjectPathLabel = await browser.$(this.selector);
    await extractProjectPathLabel.getText().then((text) => {
      if(text === fpath) {
        doesPathMatch = true;
      }
    });
    return doesPathMatch;
  }
}
