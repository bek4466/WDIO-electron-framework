

/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from "../matButton";
import { allure } from '../allure/allure';
import { reject } from 'q';
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "downloadRecoveryLocators.json"));


export class SidePanelAddressField extends MatButton{
    constructor(app: WebdriverIO.Browser, selector: string, private dialogSelector: string) {
        super(app, selector, "Password Field");
    }

    public async click(): Promise<void> {
        await super.click().then(async () => {
            const a = await browser.$(this.dialogSelector)
            .waitForExist();
            return a;
        });
    };

    public async getAddress(): Promise<string> {
        let a;
        await browser.$(this.selector).waitForExist()
        .then(async () => {
            a = browser.$(this.selector).getText();
            // getAttribute('ng-reflect-model');
        }).catch((err: Error) => {
            console.log("Error in sidepanel address field: " + `${err}`);
            a = '';
        });
        await allure.screenshot(this.app, "After");
        return a;
    }


};