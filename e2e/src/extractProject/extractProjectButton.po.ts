
/* tslint:disable */

import { MatButton } from "../matButton";
import { allure } from "../allure/allure";

export class ExtractProjectButton extends MatButton {
  constructor(
    app: WebdriverIO.Browser,
    selector: string,
    private dialogSelector: string
  ) {
    super(app, selector, "Extract Project Button");
  }

  public async click(): Promise<void> {
    await allure.step(
      `Set the value of ${this.name} input to ${this.app}`,
      async () => {
        await allure.screenshot(
          this.app,
          "Extract Project Button before click action "
        );
        await super.click();
      }
    );
    await allure.screenshot(
      this.app,
      "After Extract Project Button was clicked"
    );
  }
  
  public async isDisabled(): Promise<boolean> {
    let ele = await browser.$(this.selector)
    let parentEle = await ele.parentElement() //button
    let res = await parentEle.isEnabled()
    return !res
  }
}
