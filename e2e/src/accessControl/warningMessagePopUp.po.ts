/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
import { reject } from 'q';
import { MatButton } from "../matButton";
import { allure } from '../allure/allure';
import { LogClient } from '@extron/winston-logger';
const logClient = new LogClient("e2e:Warning Message Pop up");
export class WarningMessagePopUp extends MatButton {

    constructor(app: WebdriverIO.Browser, selector: string, private dialogSelector: string) {
        super(app, selector, "Warning Message Pop up");
    }

    public async click(): Promise<void> {
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            await super.click();
        });
        await allure.screenshot(this.app, "After");
    }

    public async warningMsgGetter(checkme: string): Promise<void> {
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            await this.app
                .$(this.selector)
                .getText()
                .then(async (text: string) => {
                    await expect(text.includes(checkme)).toEqual(true)
                }).catch((err: Error) => {
                    logClient.error("Exception Caught: " + this.warningMsgGetter(checkme) + `${err}`);
                });

        });

        await allure.screenshot(this.app, "After");

    }

}
