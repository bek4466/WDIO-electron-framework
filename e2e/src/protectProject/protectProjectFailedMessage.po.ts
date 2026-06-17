/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from "../matButton";
import { allure } from "../allure/allure";

const protectProjectLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "protectProject.json"));

export class ProtectProjectFailedMessage extends MatButton {
  constructor(
    app: WebdriverIO.Browser,
    selector: string,
    private dialogSelector: string
  ) {
    super(app, selector, "Protect Project Failed message for wrong password ");
  }

  public async click(): Promise<void> {
    await allure.step(
      `Set the value of ${this.name} input to ${this.app}`,
      async () => {
        await allure.screenshot(
          this.app,
          "Protect Failed message was shown for wrong password before click action "
        );
        await super.click();
      }
    );
    await allure.screenshot(
      this.app,
      "After Protect Project Failed message was shown for wrong password "
    );
  }

  public async close() {
    await browser.$(protectProjectLocators.failBannerCloseBtn)
  }
}
