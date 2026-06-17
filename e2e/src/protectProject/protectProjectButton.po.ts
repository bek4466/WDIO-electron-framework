/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";

import { MatButton } from "../matButton";
import { allure } from "../allure/allure";
const protectLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "protectProject.json"));

export class ProtectProjectButton extends MatButton {
  constructor(app: WebdriverIO.Browser, selector: string, private dialogSelector: string) {
    super(app, selector, "Protect Project Button");
  }

  public async click(): Promise<void> {
    await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
      await allure.screenshot(this.app, "Protect Project button before click action ");
      await super.click();
    }
    );
    await allure.screenshot(this.app, "After protect project button was clicked");
  }

  public async isEnabled(): Promise<boolean> {
    const protectText = await browser.$(this.selector);
    const protectBtn = await protectText.parentElement()
    let isEnabled = await protectBtn.isEnabled();
    let otherThing = await protectBtn.isClickable()
    return isEnabled;
  }

  // performs the hover mouse and checks that the text in the hover box matches the given 'data'
  public async verifyHoverToolTip(data: any): Promise<boolean> {
    let flag: boolean = false;

    await allure.screenshot(this.app, "Before ToolTip Check");
    //getting validation message text
    const protectButton = await browser.$(protectLocators.protectProjectButton);

    // create mouse pointer object 
    await browser.action('pointer', {
      parameters: { pointerType: 'mouse' }
    })
      .move({ duration: 0, origin: protectButton, x: 0, y: 0 })
      .perform()
    await browser.pause(2000)

    if (data === "") {
      let hoverToolTip = await browser.$(protectLocators.protectProjectBtnHoverTooltip)
      let hoverToolTipExists = await hoverToolTip.isExisting()
      if (hoverToolTipExists === false) flag = true
    } else {
      await browser.$(protectLocators.protectProjectBtnHoverTooltip)
        .getText().then(async (text: string) => {
          if (text === data) flag = true;
        }).catch((err) => {
          console.log("messageLogTable.po.ts->verifyErrorMessage: " + `${err}`);
        });
    }

    await allure.screenshot(this.app, "After ToolTip Check");
    return flag;
  }
}
