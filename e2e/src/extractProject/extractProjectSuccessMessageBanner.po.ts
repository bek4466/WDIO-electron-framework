
/* tslint:disable */

import { MatButton } from "../matButton";
import { allure } from "../allure/allure";

export class ExtractProjectSuccessMessageBanner extends MatButton {
  constructor(
    app: WebdriverIO.Browser,
    selector: string,
    private dialogSelector: string
  ) {
    super(app, selector, "Extract Project Success Message Banner");
  }

  public async click(): Promise<void> {
    await allure.step(
      `Set the value of ${this.name} input to ${this.app}`,
      async () => {
        await allure.screenshot(
          this.app,
          "Extract Project Success Message Banner before click action "
        );
        await super.click();
      }
    );
    await allure.screenshot(
      this.app,
      "After Extract Project Success Message Banner was clicked"
    );
  }

  public async textMatches(textToCheck : string): Promise<boolean> {
    let successLink = await browser.$(this.selector)
    let elementText = await successLink.getText()
    return elementText.match(textToCheck) != null
  }
}
