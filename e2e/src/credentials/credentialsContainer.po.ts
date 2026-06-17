/* tslint:disable */
// @ts-nocheck
import { MatButton } from '../matButton';
import { allure } from '../allure/allure';
import * as fs from "fs-extra";
import * as path from "path";

const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const kevinSettingsLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "userSettingsCredsLocators.json"));

export class CredentialsContainer extends MatButton{
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "Credentials Container Element");
    }

    public async click(): Promise<void> {
        await super.click();
    }


    public async checkElementPresent(): Promise<boolean> {
        await allure.screenshot(this.app, "Before");
        await browser.pause(timeout.medium);

        let a;
        await browser.$(this.selector).waitForExist().then(async (val) => {
            a = val;
        }).catch((err: Error) => {
            console.log("From checkElementPresent: " + `${err}`);
            a = false;

        });
        await allure.screenshot(this.app, "After");
        return a;
    }
    public async scrollToView() {
        await allure.screenshot(this.app, "Before");
        let a;
        await browser.$(this.selector).waitForExist().then(async (val) => {

            // await browser.scroll(this.selector);
        //     debugger;
        // await browser.debug();
            a = val;
            console.log("a"+a);
        }).catch((err: Error) => {
            console.log("From scrollToView: " + `${err}`);
            a = false;

        });
        await allure.screenshot(this.app, "After");
        return a;
    }
}
