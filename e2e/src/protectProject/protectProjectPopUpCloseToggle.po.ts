/* tslint:disable */

import { MatButton } from "../matButton";
import { allure } from "../allure/allure";

export class ProtectProjectPopUpCloseToggle extends MatButton {
  constructor(
    app: WebdriverIO.Browser,
    selector: string,
    private dialogSelector: string
  ) {
    super(app, selector, "Protect Project Pop Up Close Toggle");
  }

  public async click(): Promise<void> {
    await allure.step(
      `Set the value of ${this.name} input to ${this.app}`,
      async () => {
        await allure.screenshot(
          this.app,
          "Protect Project Pop Up Close Toggle before click action "
        );
        await super.click();
      }
    );
    await allure.screenshot(
      this.app,
      "After Protect Project Pop Up Close Toggle was clicked"
    );
  }
}
