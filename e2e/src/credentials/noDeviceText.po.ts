/* tslint:disable */
// @ts-nocheck
import { MatButton } from '../matButton';
import { allure } from '../allure/allure';
import { LogClient } from '@extron/winston-logger';
import { reject } from 'q';
const logClient = new LogClient("e2e:noDeviceText");

export class NoDeviceText extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "NoDevice Text");
    }

    public async checkElementPresent(): Promise<boolean> {
        await allure.screenshot(this.app, "Before");
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

    public async verifyText(text: string): Promise<boolean> {
        let returnVal = false;
        await allure.step(`Verifying existance of message`, async () => {
            await allure.screenshot(this.app, "Message");
            await browser.$(this.selector).getText()
                .then(async (value: string) => {
                    expect(value)
                        .toBe(text);
                    if(value === text) returnVal = true;
                })
                .catch((err: Error) => {
                    logClient.error("Error with determining Text" + `${err}`);
                });
        });
        return returnVal;
    }
}

