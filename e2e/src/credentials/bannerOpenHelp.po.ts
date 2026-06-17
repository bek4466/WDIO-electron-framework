/* tslint:disable */
import { MatButton } from '../matButton';
import { allure } from '../allure/allure';

export class OpenHelpButton extends MatButton {
    constructor(browser: WebdriverIO.Browser, selector: string) {
        super(browser, selector, "Banner Open Help Button");
    }

    public async click(): Promise<void> {
        await super.click();
    }

    public async checkElementPresent(): Promise<boolean> {
        let a;
        await allure.screenshot(browser, "Before");

        try {
            a = await (await browser.$(this.selector)).isExisting();
                
        } catch (err) {
            console.log("From checkElementPresent: " + `${err}`);
            a = false;
        }

        await allure.screenshot(browser, "After");
        return a;
    }
}
