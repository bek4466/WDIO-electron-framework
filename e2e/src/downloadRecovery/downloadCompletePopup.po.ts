
/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { reject } from 'q';
import { MatButton } from "../matButton";
import { allure } from '../allure/allure';
import { app } from "electron";
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));


export class DownloadCompletePopup extends MatButton{

constructor(app: WebdriverIO.Browser, selector: string, private dialogSelector: string) {
    super(app, selector, "Cancel button");
}

public async checkElementPresent(): Promise<boolean> {
    await allure.screenshot(this.app, "Before");
    await browser.pause(timeout.medium);

    let a;
    await browser.$(this.selector).waitForExist(
       {timeout : 10000}
    ).then(async (val) => {
        a = val;
    }).catch((err: Error) => {
        console.log("From checkElementPresent: " + `${err}`);
        a = false;

    });
    await allure.screenshot(this.app, "After");
    return a;
}

public async click(): Promise<void> {
    await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
    await allure.screenshot(this.app, "Before");
    await super.click();
    });
    await allure.screenshot(this.app, "After");
}

public async doubleClick():Promise<void>{
    await browser.$(this.selector).doubleClick();
}


public async isClickable():Promise<boolean>{
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

public async isDisabled():Promise<boolean> {
    let elementState: boolean = false;
    await allure.step(`Set the value of ${this.name} input to`, async () => {
    await allure.screenshot(this.app, "Before");
    await browser.pause(5000);
    const a =  await browser.$(this.selector).getAttribute('disabled');
        await expect(a).toEqual('true');
        elementState = true;
        await allure.screenshot(this.app, "After");
    }).catch((err: Error)=>{
        console.log("Exception caught: " + `${err}`);
        reject(err);
        throw err;
    });
await allure.screenshot(this.app, "After");
return elementState;
};
}
