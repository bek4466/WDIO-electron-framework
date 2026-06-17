

/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from "../matButton";
import { allure } from '../allure/allure';
import { reject } from 'q';
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "downloadRecoveryLocators.json"));


export class UsernameField extends MatButton{
    constructor(app: WebdriverIO.Browser, selector: string, private dialogSelector: string) {
        super(app, selector, "Username Field");
    }

    public async click(): Promise<void> {
        await super.click().then(async () => {
            const a = await browser.$(this.dialogSelector)
            .waitForExist();
            return a;
        });
    };

    public async setUsername(password: string): Promise<boolean> {
        let a;
        await browser.$(locators.downloadUsernameText).waitForExist()
        .then(async (val) => {
            a = val;
            await browser.$(locators.downloadUsernameText).setValue(password);
        }).catch((err: Error) => {
            console.log("Username " + `${err}`);
            a = false;
        });
        await allure.screenshot(this.app, "After");
        return a;
    }
    public async checkObfuscated(): Promise<boolean> {
        let a;
        await browser.$(locators.downloadUsernameText)
        .waitForExist()
        .then(async (val) => {
            a = val;
            const type = await browser.$(this.selector).getAttribute('type');
            await expect(type)
                .toEqual('password');
        }).catch((err: Error) => {
            console.log("From FilePathEditable: " + `${err}`);
            a = false;
        });
        await allure.screenshot(this.app, "After");
        return a;
    }
    public async inputFilePathEditable(destinyFilePathInput: string): Promise<boolean> {
        let a;
        await browser.$(locators.downloadUsernameText).waitForExist()
        .then(async (val) => {
            a = val;
            await browser.$(locators.downloadUsernameText).setValue(destinyFilePathInput);
        }).catch((err: Error) => {
            console.log("From FilePathEditable: " + `${err}`);
            a = false;
        });
        await allure.screenshot(this.app, "After");
        return a;
    }

};