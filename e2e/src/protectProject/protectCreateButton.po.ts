/* tslint:disable */

import { MatButton } from "../matButton";
import { allure } from "../allure/allure";

export class ProtectCreateButton extends MatButton {
  constructor(
    app: WebdriverIO.Browser,
    selector: string,
    private dialogSelector: string
  ) {
    super(app, selector, "Protect Create Button");
  }

  public async click(): Promise<void> {
    await allure.step(
      `Set the value of ${this.name} input to ${this.app}`,
      async () => {
        await allure.screenshot(
          this.app,
          "Protect Create Button before click action "
        );
        await super.click();
      }
    );
    await allure.screenshot(
      this.app,
      "After Protect Create Button was clicked"
    );
  }
}
