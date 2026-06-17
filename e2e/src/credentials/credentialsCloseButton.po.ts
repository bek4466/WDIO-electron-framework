/* tslint:disable */

import { MatButton } from '../matButton';
import { allure } from '../allure/allure';
import { reject } from 'q';

export class CredentialsCloseButton extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "Credentials Close Button");
    }

    public async click(): Promise<void> {
        await super.click();
    }
}
