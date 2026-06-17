/* tslint:disable */

import { MatButton } from "../matButton";
import { allure } from "../allure/allure";
import * as robot from "@jitsi/robotjs";

export class ProtectProjectSelectLocationButton extends MatButton {
  constructor(
    app: WebdriverIO.Browser,
    selector: string,
    private dialogSelector: string
  ) {
    super(app, selector, "Protect Project Select Location Button");
  }

  public async click(): Promise<void> {
    await allure.step(
      `Set the value of ${this.name} input to ${this.app}`,
      async () => {
        await allure.screenshot(
          this.app,
          "Protect Project select location button before click action "
        );
        await super.click();
      }
    );
    await allure.screenshot(
      this.app,
      "After protect project select location button was clicked"
    );
  }

  public async setPath(path: string){
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
}
