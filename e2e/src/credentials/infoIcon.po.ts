/* tslint:disable */
// @ts-nocheck
import { MatButton } from '../matButton';
import { allure } from '../allure/allure';
import { LogClient } from '@extron/winston-logger';
import { reject } from 'q';
const logClient = new LogClient("e2e:InfoIcon");

export class InfoIcon extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "Info Icon");
    }

    public async checkElementPresent(): Promise<boolean> {
        await allure.screenshot(this.app, "Before");
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
}

