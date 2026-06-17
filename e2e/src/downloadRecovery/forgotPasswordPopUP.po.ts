/* tslint:disable */
// @ts-nocheck
import { MatButton } from '../matButton';
import { LogClient } from '@extron/winston-logger';
import { allure } from '../allure/allure';
import * as fs from "fs-extra";
import * as path from "path";
const logClient = new LogClient("e2e:downloadRecovery");
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "downloadRecoveryLocators.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));

export class ForgotPasswordPopUP extends MatButton{
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
        await browser.$(this.selector).waitForExist()
        .then(async (val) => {
            a = val;
        }).catch((err: Error) => {
            console.log("From checkElementPresent: " + `${err}`);
            a = false;

        });
        await allure.screenshot(this.app, "After");
        return a;
    }

    public async verifyText(checkme: string): Promise<void> {
        await allure.step(`Check Forgot Password Pop-Up`, async () => {
            await allure.screenshot(this.app, "Forgot Password");
            await browser
                .$(locators.forgotCredsText)
                .getText()
                .then(async (text: string) => {
                    await expect(text.includes(checkme)).toEqual(true)
                }).catch((err: Error) => {
                    logClient.error("Exception Caught: " + `${err}`);
                });

        });
    }
}
