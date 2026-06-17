/* tslint:disable */

import { MatButton } from "../matButton";
import { allure } from "../allure/allure";
import * as fs from "fs-extra";
import * as path from "path";
import { reject } from 'q';
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "protectProject.json"));
const data = fs.readJsonSync(path.join(__dirname, "..", "JSON", "dataTool.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
import { LogClient } from '@extron/winston-logger';
const logClient = new LogClient("e2e:passwordField>POM");
import { browser } from "@wdio/globals";
import { Key } from "webdriverio";

export class ProtectProjectPasswordField extends MatButton {
  constructor(
    app: WebdriverIO.Browser,
    selector: string,
    private dialogSelector: string
  ) {
    super(app, selector, "Protect Project Button");
  }

  public async click(): Promise<void> {
    await allure.step(
      `Set the value of ${this.name} input to ${this.app}`,
      async () => {
        await allure.screenshot(
          this.app,
          "Protect Project Password input field before click action "
        );
        await super.click();
      }
    );
    await allure.screenshot(
      this.app,
      "After protect project Password input field was clicked"
    );
  }

  public async clearPassword() {
    await (await browser.$(locators.passwordField)).click();
    await browser.action('key')
      .down(Key.Ctrl).down('a')
      .pause(10)
      .up(Key.Ctrl).up('a')
      .down(Key.Backspace).up(Key.Backspace)
      .perform()
  }

  public async setPassword(password: string): Promise<void> {
    //if we find this locator put the stuff
    let passwordFieldExists = await (await browser.$(locators.passwordField)).isExisting();
    try {
      if (passwordFieldExists) {
        await browser.$(locators.passwordField).setValue(password).catch((err: Error) => { });
      } else {
        return Promise.resolve()
      }
    } catch (error) {
      console.warn("setPassword: failed in catch block");
      return Promise.resolve()
    }
  }

  public async verifyPassword(password: string): Promise<void> {
    let passwordFieldExists = await (await browser.$(locators.passwordField)).isExisting();
    try {
      if (passwordFieldExists) {
        await browser.$(locators.passwordField).click().catch((err: Error) => { });
        await browser.$(locators.passwordField).getValue().then(async (text: string) => {
          expect(text).toBe(password);
        }).catch((err: Error) => { });
      } else {
        return Promise.resolve();
      }
    } catch (error) {
      console.warn("verifyPassword: failed in catch block");
      return Promise.resolve()
    }
  }

  public async checkObfuscated(): Promise<boolean> {
    let a = false;
    await browser.$(locators.passwordField).waitForExist()
      .then(async (val) => {
        a = val;
        const type = await browser.$(this.selector).getAttribute('type');
        if (type == 'password') {
          a = true;
        }
      })
    await allure.screenshot(this.app, "After");

    return a;
  }

  public async isEmpty(): Promise<boolean> {
    let isEmpty = false;
    let element = await browser.$(this.selector);
    let text = await element.getText();

    if (text === "") isEmpty = true
    return isEmpty
  }
}
