/* tslint:disable */
// @ts-nocheck
import { MatButton } from '../matButton';
import { allure } from '../allure/allure';

export class BannerExitButton extends MatButton {
    constructor(browser: WebdriverIO.Browser, selector: string) {
        super(browser, selector, "Banner Text");
    }

    public async click(): Promise<void> {
        await super.click();
    }

    public async checkElementPresent(): Promise<boolean> {
        let a;
        await allure.screenshot(browser, "Before");
        
        try {
            a = await browser.$(this.selector).waitForExist();
        } catch (err) {
            console.log("From checkElementPresent: " + `${err}`);
            a = false;
        }
        
        await allure.screenshot(browser, "After");
        return a;
    }
}

