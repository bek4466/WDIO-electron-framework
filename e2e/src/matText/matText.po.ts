import { allure } from "../allure/allure";
import { Element } from "../lib/element";
import { reject } from 'q';
import { browser } from "@wdio/globals";
export class MatText extends Element {
    constructor(browser: WebdriverIO.Browser, selector: string, protected name: string, parent?: Element) {
        super(browser, selector, parent);
    }

    public async click(): Promise<void> {
        await allure.step(`Clicking on ${this.name}`, async () => {
            await allure.screenshot(browser, "Before");
            await this.getElement()
                .click()
            await allure.screenshot(browser, "After");
        }).catch((err: Error) => {
            console.log(err);
        });
    }

    public async verifyTextMatches(expectedText: string): Promise<boolean> {
        let textMatches = false;
    
        const actualText = await (await browser.$(this.selector)).getText()
        if (actualText.match(expectedText)) textMatches = true;
        return textMatches
    }
}