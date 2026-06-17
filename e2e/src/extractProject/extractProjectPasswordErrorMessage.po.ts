
/* tslint:disable */

import { MatButton } from "../matButton";
import { allure } from "../allure/allure";

export class ExtractProjectPasswordErrorMessage extends MatButton {
  constructor(
    app: WebdriverIO.Browser,
    selector: string,
    private dialogSelector: string
  ) {
    super(app, selector, "Extract Project Password Error Message");
  }

  public async click(): Promise<void> {
    await allure.step(
      `Set the value of ${this.name} input to ${this.app}`,
      async () => {
        await allure.screenshot(
          this.app,
          "Extract Project Password Error Message before click action "
        );
        await super.click();
      }
    );
    await allure.screenshot(
      this.app,
      "After Extract Project Password Error Message was clicked"
    );
  }

  public async doesTextMatch(expectedText: string): Promise<boolean> {
    let textMatches = false;

    const actualText = await (await browser.$(this.selector)).getText()
    if (actualText.match(expectedText) || actualText == expectedText) textMatches = true;

    return textMatches
  }
}
