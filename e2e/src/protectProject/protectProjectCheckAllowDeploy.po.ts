/* tslint:disable */

import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from "../matButton";
import { allure } from "../allure/allure";

const protectProjectLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "protectProject.json"));

export class ProtectProjectCheckAllowDeployTroubleshooting extends MatButton {
  constructor(
    app: WebdriverIO.Browser,
    selector: string,
    private dialogSelector: string
  ) {
    super(app, selector, "Protect Project Allow Check for Deployment and Troubleshooting");
  }

  public async click(): Promise<void> {
    await allure.step(
      `Set the value of ${this.name} input to ${this.app}`,
      async () => {
        await allure.screenshot(
          this.app,
          "Protect Project Allow Check for Deployment and Troubleshooting before click action "
        );
        await super.click();
      }
    );
    await allure.screenshot(
      this.app,
      "After Protect Project Allow Check for Deployment and Troubleshooting was clicked"
    );
  }

  // returns true is box is checked, false if it is not.
  public async isChecked(): Promise<boolean> {
    let boxIsChecked = false;
    let actualCheckBox = await browser.$(protectProjectLocators.actualCheckbox)
    let svgIconAttributeValue = await actualCheckBox.getAttribute('svgicon');
    
    if(svgIconAttributeValue.match("sync_checkbox_checked_2")){
      boxIsChecked = true;
    }
    // unchecked ---> svgicon="sync_checkbox_unchecked_2"
    return boxIsChecked;
  }
}
