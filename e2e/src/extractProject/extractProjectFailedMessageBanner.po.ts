
/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from "../matButton";
import { allure } from "../allure/allure";

const extractProjectLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "protectProject.json"));

export class ExtractProjectFailedMessageBanner extends MatButton {
  constructor(
    app: WebdriverIO.Browser,
    selector: string,
    private dialogSelector: string
  ) {
    super(app, selector, "Extract Project Failed Message Banner");
  }

  public async click(): Promise<void> {
    await allure.step(
      `Set the value of ${this.name} input to ${this.app}`,
      async () => {
        await allure.screenshot(
          this.app,
          "Extract Project Failed Message Banner before click action "
        );
        await super.click();
      }
    );
    await allure.screenshot(
      this.app,
      "After Extract Project Failed Message Banner was clicked"
    );
  }

  public async close() {
    await browser.$(extractProjectLocators.failBannerCloseBtn)
  }
}
