/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from '../matButton';
import { allure } from '../allure/allure';
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const inputData = fs.readJsonSync(path.join(__dirname, "..", "JSON", "dataTool.json"));
export class ClearTraceButton extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "Clear Trace Button Field");
    }

    public async click(): Promise<void> {
        await super.click();
    }

    public async clearLogs(clearTxt: string): Promise<boolean> {
        await allure.step(`Set the value of ${this.name} input to ${clearTxt}`, async () => {
            await allure.screenshot(this.app, "Before");
        let message: boolean = false;
        await browser.$(locators.clearTraceBtn).getText().then(async (text: string) => {
            await expect(text).toEqual('Clear All');
            if (text.includes(clearTxt)) {
                message = true;
            }
            await browser.$(locators.clearTraceBtn).click();
            await allure.screenshot(this.app, "After");
            return message;
        });
    });
    return true;
    }
}
