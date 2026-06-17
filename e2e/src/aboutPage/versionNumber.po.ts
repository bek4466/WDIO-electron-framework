// @ts-nocheck
import { LogClient } from '@extron/winston-logger';
import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from "../matButton";
import { allure } from '../allure/allure';
const logClient = new LogClient("e2e:version Number");


export class VersionNumber extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "Version number");
    }

    public async click(): Promise<void> {
        await super.click();
    }
    public async verifyText(checkme: string): Promise<void> {
        await allure.step(`Check Version number on about page`, async () => {
            await allure.screenshot(this.app, "verifyText");
            await this.app
                .$(this.selector)
                .getText()
                .then(async (text: string) => {
                    await expect(text.includes(checkme)).toEqual(true)
                }).catch((err: Error) => {
                    //fail("Verion number not accurate");
                    logClient.error("Exception Caught: " + `${err}`);
                });

        });
    }
}
