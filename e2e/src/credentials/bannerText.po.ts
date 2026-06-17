/* tslint:disable */
import { MatButton } from '../matButton';
import { allure } from '../allure/allure';
import { LogClient } from '@extron/winston-logger';
const logClient = new LogClient("e2e:bannerText");

export class BannerText extends MatButton {
    constructor(browser: WebdriverIO.Browser, selector: string) {
        super(browser, selector, "Banner Text");
    }

    public async checkElementPresent(): Promise<boolean> {
        await allure.screenshot(browser, "Before");

        let a;
        try {
            a = await (await browser.$(this.selector)).isExisting();
        } catch (err) {
            console.log("From checkElementPresent: " + `${err}`);
            a = false;
        }
        
        await allure.screenshot(browser, "After");
        return a;
    }

    public async verifyText(text: string): Promise<boolean> {
        let a = false
        await browser.$(this.selector).getText().then(async (value: string) => {
            if (value.match(text)){
                a = true
            }
        })
        return a;
    }

}

