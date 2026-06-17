/* tslint:disable */

import { MatButton } from "../matButton";
import { allure } from "../allure/allure";

export class ProtectProjectSuccessBanner extends MatButton {
  constructor(
    app: WebdriverIO.Browser,
    selector: string,
    private dialogSelector: string
  ) {
    super(app, selector, "Protect Project Success message banner");
  }

  public async click(): Promise<void> {
    await allure.step(
      `Set the value of ${this.name} input to ${this.app}`,
      async () => {
        await allure.screenshot(
          this.app,
          "Protect Project Success message banner was shown before "
        );
        await super.click();
      }
    );
    await allure.screenshot(
      this.app,
      "After Protect Project Success message banner was shown"
    );
  }

  public async verifyMessageMatches(expectedMessage: string): Promise<boolean> {
    let matches = false;
    let element = await browser.$(this.selector);
    let elementText = await element.getText();

    if (elementText === expectedMessage){
      matches = true;
    }
    return matches
  }
}
