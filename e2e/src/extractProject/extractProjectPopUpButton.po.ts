/* tslint:disable */

import { MatButton } from "../matButton";
import { allure } from "../allure/allure";

export class ExtractProjectPopUpButton extends MatButton {
  constructor(
    app: WebdriverIO.Browser,
    selector: string,
    private dialogSelector: string
  ) {
    super(app, selector, "Extract Project PopUp Button");
  }

  public async click(): Promise<void> {
    await allure.step(
      `Set the value of ${this.name} input to ${this.app}`,
      async () => {
        await allure.screenshot(
          this.app,
          "Extract Project PopUp Button before click action "
        );
        await super.click();
      }
    );
    await allure.screenshot(
      this.app,
      "After Extract Project PopUp Button was clicked"
    );
  }
}
