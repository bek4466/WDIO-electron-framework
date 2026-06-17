/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from "../matButton";
const messagePaneLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "messagePaneLocators.json"));

export class ExportMessageButton extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "export Message button");
    }

    public async click(): Promise<void> {
        await super.click();
    }

    public async isEnabled(): Promise<boolean> {
        const state = await browser.$(messagePaneLocators.exportMessageButton).getAttribute('class');
        if(state == "disabled")
            return false;
        else
            return true;
    }
}
