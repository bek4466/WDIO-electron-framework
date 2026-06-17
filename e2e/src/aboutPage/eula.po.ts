import allureReporter from '@wdio/allure-reporter'
import { LogClient } from '@extron/winston-logger';
import { allure } from "../allure/allure";
import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from "../matButton";
const aboutLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "aboutLocators.json"));
const logClient = new LogClient("e2e:eula");


export class EULA extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "eula");
    }

    public async close(): Promise<void> {
        console.log(JSON.stringify(aboutLocators.eulaClose));
        await this.app.$(aboutLocators.eulaClose).click()
            .catch((err: Error) => {
                logClient.error("Exception Caught: " + `${err}`);
            });
    }
    public async verifyText(checkme: string, expectation: boolean): Promise<void> {
        await allure.step(`Check eula on about page`, async () => {
            await allure.screenshot(browser, "inside the verifyText EULA object");
            await this.app
                .$(this.selector)
                .getText()
                .then(async (text: string) => {
                    await expect(text.includes(checkme)).toEqual(expectation)
                }).catch((err: Error) => {
                    logClient.error("Exception Caught: " + `${err}`);
                });

        });
    }
}
