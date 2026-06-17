/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from "../matButton";
import { allure } from "../allure/allure";
import * as robot from "@jitsi/robotjs";

const extractLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "extractProject.json"));

export class ExtractProjectSelectLocationButton extends MatButton {
  constructor(
    app: WebdriverIO.Browser,
    selector: string,
    private dialogSelector: string
  ) {
    super(app, selector, "Extract Project Select Location Button");
  }

  public async click(): Promise<void> {
    await allure.step(
      `Set the value of ${this.name} input to ${this.app}`,
      async () => {
        await allure.screenshot(
          this.app,
          "Extract Project Select Location Button before click action "
        );
        await super.click();
      }
    );
    await allure.screenshot(
      this.app,
      "After Extract Project Select Location Button was clicked"
    );
  }

  public async setPath(path: string) {
    await this.click();

    //robot js type the 'path'
    robot.typeString(path)
    //robot js send 'enter' --> navigates to file explorer
    robot.keyTap("enter")
    //robot js send 'tab' --> goes to the 'open' button on window explorer
    robot.keyTap("tab")
    //robot js send 'enter' --> presses the 'open' button 
    robot.keyTap("enter")
  }

  public async isEmpty(): Promise<boolean> {
    let inputBoxExists = await (await browser.$(extractLocators.extractLocationBox)).isExisting()
    return inputBoxExists == false
  }
}
