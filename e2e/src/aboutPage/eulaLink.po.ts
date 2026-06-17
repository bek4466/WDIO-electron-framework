

import { LogClient } from '@extron/winston-logger';
import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from "../matButton";
import { allure } from "../allure/allure";
import { browser } from "@wdio/globals";
const logClient = new LogClient("e2e:eulaLink");


export class EULALink extends MatButton {
    constructor(browser: WebdriverIO.Browser, selector: string) {
        super(browser, selector, "eulaLink");
    }

    public async click(): Promise<void> {
        await super.click();
    }
    public async verifyText(checkme: string): Promise<void> {
        await allure.step(`Check eulaLink on about page`, async () => {
            await allure.screenshot(browser, "verifyText");
            await browser
                .$(this.selector)
                .getText()
                .then(async (text: string) => {
                    console.log("We found... " + text + " instead of... " + checkme);
                    await expect(text.includes(checkme)).toEqual(true)
                }).catch((err: Error) => {
                    logClient.error("Exception Caught: " + `${err}`);
                });

        });
    }
}
