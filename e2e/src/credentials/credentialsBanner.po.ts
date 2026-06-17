/* tslint:disable */
import { MatButton } from '../matButton';
import { allure } from '../allure/allure';
import * as fs from "fs-extra";
import * as path from "path";

const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const kevinSettingsLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "userSettingsCredsLocators.json"));

export class CredentialsBanner extends MatButton {
    constructor(browser: WebdriverIO.Browser, selector: string) {
        super(browser, selector, "Credentials Banner Element");
    }

    public async click(): Promise<void> {
        await super.click();
    }

    public async checkElementPresent(): Promise<boolean> {
        await allure.screenshot(browser, "Before");

        let a;
        try {
            a = await browser.$(this.selector).waitForExist();
        } catch (err) {
            console.log("From checkElementPresent: " + `${err}`);
            a = false;
        }
        
        await allure.screenshot(browser, "After");
        return a;
    }
}
