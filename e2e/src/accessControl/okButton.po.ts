/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
import { reject } from 'q';
import { MatButton } from "../matButton";
import { allure } from '../allure/allure';
import { LogClient } from '@extron/winston-logger';
const logClient = new LogClient("e2e:OK Button POM");
export class OkButton extends MatButton {

    constructor(app: WebdriverIO.Browser, selector: string, private dialogSelector: string) {
        super(app, selector, "OkButton selector");
    }

    public async click(): Promise<void> {
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            await super.click();
        });
        await allure.screenshot(this.app, "After");
    }


    public async isClickable(): Promise<boolean> {
        let elementState: boolean = false;
        await allure.step(`Set the value of ${this.name} input to`, async () => {
            await allure.screenshot(this.app, "Before");
            elementState = await this.app.$(this.selector).isEnabled();
            await console.log(await this.app.$(this.selector).getAttribute('style'));
            elementState = true;
        }).catch((err: Error) => {
            logClient.error("Exception caught: " + `${err}`);
        });
        await allure.screenshot(this.app, "After");
        return elementState;
    };


    public async buttonText(): Promise<void> {
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            await this.app
                .$(this.selector)
                .getText()
                .then(async (text: string) => {
                    await expect(text).toContain("Ok button Text")
                }).catch((err: Error) => {
                    logClient.error("Exception Caught: " + this.buttonText() + `${err}`);
                });
        });
        await allure.screenshot(this.app, "After");
    }

}
