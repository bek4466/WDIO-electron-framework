/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from "../matButton";
import { allure } from '../allure/allure';
import { LogClient } from '@extron/winston-logger';
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const toastLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "toastLocators.json"));
const logClient = new LogClient("e2e:toast");

export class Toast extends MatButton {

    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "toast selector");
    }

    public async checkElementPresent(): Promise<boolean> {
        await allure.screenshot(this.app, "Before");
        await this.app.pause(timeout.medium);

        let a: boolean;
        await this.app.$(this.selector).waitForExist({timeout:10000})
            .then(async (val) => {
                a = val;
            })
            .catch((err: Error) => {
                console.log("From checkElementPresent: " + `${err}`);
                a = false;
            });
        await allure.screenshot(this.app, "After");
        return a;
    }
    public async verifyText(text: string): Promise<void> {
        await allure.step(`Verifying existance of Toast message`, async () => {
            await allure.screenshot(this.app, "Toast Message");
            await this.app.$(this.selector).getText()
                .then(async (value: string) => {
                    expect(value)
                        .toBe(text);
                })
                .catch((err: Error) => {
                    logClient.error("Error with determining Toast Text" + `${err}`);
                });
        });
    }

    public async click(): Promise<void> {
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            await super.click();
        });
        await allure.screenshot(this.app, "After");
    }

}
