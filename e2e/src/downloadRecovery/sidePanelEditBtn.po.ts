
/* tslint:disable */
import { reject } from 'q';
import { MatButton } from "../matButton";
import { allure } from '../allure/allure';

export class sidePanelEditBtn extends MatButton {

    constructor(app: WebdriverIO.Browser, selector: string, private dialogSelector: string) {
        super(app, selector, "Side Panel Edit button");
    }

    public async click(): Promise<void> {
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            await super.click();
        });
        await allure.screenshot(this.app, "After");
    }

    public async doubleClick(): Promise<void> {
        await browser.$(this.selector).doubleClick();
    }


    public async isClickable(): Promise<boolean> {
        let elementState: boolean = false;
        await allure.step(`Set the value of ${this.name} input to`, async () => {
            await allure.screenshot(this.app, "Before");
            elementState = await browser.$(this.selector).isEnabled();
            await console.log(await browser.$(this.selector).getAttribute('style'));
            elementState = true;
        });
        await allure.screenshot(this.app, "After");
        return elementState;
    };

    public async isDisabled(): Promise<boolean> {
        let elementState: boolean = false;
        await allure.step(`Set the value of ${this.name} input to`, async () => {
            await allure.screenshot(this.app, "Before");
            await browser.pause(5000);
            const a = await browser.$(this.selector).getAttribute('disabled');
            await expect(a).toEqual('true');
            elementState = true;
            await allure.screenshot(this.app, "After");
        }).catch((err: Error) => {
            console.log("Exception caught: " + `${err}`);
            reject(err);
            throw err;
        });
        await allure.screenshot(this.app, "After");
        return elementState;
    };

}