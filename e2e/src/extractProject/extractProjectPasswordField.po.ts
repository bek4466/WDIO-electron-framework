/* tslint:disable */

import { MatButton } from "../matButton";
import { allure } from "../allure/allure";
import * as fs from "fs-extra";
import * as path from "path";
import { Key } from "webdriverio";

export class ExtractProjectPasswordField extends MatButton {
  constructor(
    app: WebdriverIO.Browser,
    selector: string,
    private dialogSelector: string
  ) {
    super(app, selector, "Extract Project Password Field");
  }

  public async click(): Promise<void> {
    await allure.step(
      `Set the value of ${this.name} input to ${this.app}`,
      async () => {
        await allure.screenshot(
          this.app,
          "Extract Project Password Field before click action "
        );
        await super.click();
      }
    );
    await allure.screenshot(
      this.app,
      "After Extract Project Password Field was clicked"
    );
  }

  public async clearPassword() {
    await (await browser.$(this.selector)).click();
    await browser.action('key')
      .down(Key.Ctrl).down('a')
      .pause(10)
      .up(Key.Ctrl).up('a')
      .down(Key.Backspace).up(Key.Backspace)
      .perform()
  }

  public async setPassword(password: string): Promise<void> {
    //if we find this locator put the stuff

    let passwordFieldExists = await (await browser.$(this.selector)).isExisting();
    try {
      if (passwordFieldExists) {
        await browser.$(this.selector).setValue(password).catch((err: Error) => { });
      } else {
        return Promise.resolve()
      }
    } catch (error) {
      console.warn("setPassword: failed in catch block");
      return Promise.resolve()
    }
  }

  public async verifyPassword(password: string): Promise<boolean> {
    let passwordMatch = false
    await browser.$(this.selector).getValue().then(async (text: string) => {
      if(text == password){
        passwordMatch = true
      }
    });

    return passwordMatch
  }

  public async checkObfuscated(): Promise<boolean> {
    let a = false;
    await browser.$(this.selector).waitForExist()
      .then(async (val) => {
        a = val;
        const type = await browser.$(this.selector).getAttribute('type');
        if (type == 'password') {
          a = true
        }
      })
    await allure.screenshot(this.app, "After");
    return a;
  }
}
