import { LogClient } from '@extron/winston-logger';
import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from "../matButton";
import { allure } from '../allure/allure';
const logClient = new LogClient("e2e:partNumber");


export class PartNumber extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "partNumber");
    }

    public async click(): Promise<void> {
        await super.click();
    }
    public async verifyText(checkme: string): Promise<void> {
        await allure.step(`Check partNumber on about page`, async () => {
            await allure.screenshot(this.app, "verifyText");
            await this.app
                .$(this.selector)
                .getText()
                .then(async (text: string) => {
                    await expect(text.includes(checkme)).toEqual(true)
                }).catch((err: Error) => {
                    logClient.error("Exception Caught: " + `${err}`);
                });

        });
    }

    public async doesTextContain(checkme: string): Promise<boolean> {
        let containsText = false
        await this.app.$(this.selector).getText().then(async (text: string) => {
                containsText = text.includes(checkme)
            }).catch((err: Error) => {
                logClient.error("Exception Caught: " + `${err}`);
            });
        
        return containsText
    }
}
