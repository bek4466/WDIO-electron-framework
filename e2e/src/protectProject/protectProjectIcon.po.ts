/* tslint:disable */

import { MatButton } from "../matButton";
import { allure } from "../allure/allure";

export class ProtectProjectIcon extends MatButton {

  constructor(app: WebdriverIO.Browser, selector: string, private dialogSelector: string) {
    super(app, selector, "Protect Project Button Icon");
  }

  public async verifyIconEnabled(): Promise < void > {
    browser.$(this.selector).waitForExist({
        timeout: 2000
    }).catch((err: Error) => {
        console.log("Exception Caught: " + `${err}`);
    });
  }

}
