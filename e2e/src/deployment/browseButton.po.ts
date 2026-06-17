
/* tslint:disable */

import { MatButton } from "../matButton";
import { allure } from '../allure/allure';

export class BrowseButton extends MatButton{
    constructor(app: WebdriverIO.Browser, selector: string, private dialogSelector: string) {
        super(app, selector, "browse button");
    }

    public async click(): Promise<void> {
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
        await allure.screenshot(this.app, "Before");
        await super.click();
    });
    await allure.screenshot(this.app, "After");
    }
}
