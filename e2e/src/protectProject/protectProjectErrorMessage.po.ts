/* tslint:disable */

import { MatButton } from "../matButton";
import { allure } from "../allure/allure";

export class ProtectProjectErrorMessage extends MatButton {
  constructor(
    app: WebdriverIO.Browser,
    selector: string,
    private dialogSelector: string
  ) {
    super(app, selector, "Protect Project Error message");
  }

  public async click(): Promise<void> {
    await allure.step(
      `Set the value of ${this.name} input to ${this.app}`,
      async () => {
        await allure.screenshot(
          this.app,
          "Protect Project Error message before click action "
        );
        await super.click();
      }
    );
    await allure.screenshot(
      this.app,
      "After Protect Project Error message was clicked"
    );
  }

  public async doesTextMatch(expectedText: string) : Promise<boolean> {
    let textMatches = false;

    const actualText = await (await browser.$(this.selector)).getText()

    if(actualText === expectedText) textMatches = true;

    return textMatches
  }
}
