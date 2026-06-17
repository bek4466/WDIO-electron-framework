
/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
import { reject } from 'q';
import { MatButton } from "../matButton";
import { allure } from '../allure/allure';
import { browser } from "@wdio/globals";

export class DeployButton extends MatButton{

constructor(browser: WebdriverIO.Browser, selector: string, private dialogSelector: string) {
    super(browser, selector, "Deploy button");
}

public async click(): Promise<void> {
    await allure.step(`Set the value of ${this.name} input to `, async () => {
    await allure.screenshot(browser, "Before");
    await super.click();
    });
    await allure.screenshot(browser, "After");
}

public async doubleClick():Promise<void>{
    await browser.$(this.selector).doubleClick();
}


public async isClickable():Promise<boolean>{
    let elementState: boolean = false;
    await allure.step(`Set the value of ${this.name} input to`, async () => {
    await allure.screenshot(browser, "Before");
        elementState = await browser.$(this.selector).isEnabled();
        await console.log(await browser.$(this.selector).getAttribute('style'));
        elementState = true;
    });
    await allure.screenshot(browser, "After");
    return elementState;
};

public async isDisabled():Promise<boolean> {
    let elementState: boolean = false;
    await allure.step(`Set the value of ${this.name} input to`, async () => {
    await allure.screenshot(browser, "Before");
    await browser.pause(5000);
    const a =  await browser.$(this.selector).getAttribute('disabled');
        await expect(a).toEqual('true');
        elementState = true;
        await allure.screenshot(browser, "After");
    }).catch((err: Error)=>{
        console.log("Exception caught: " + `${err}`);
        reject(err);
        throw err;
    });
await allure.screenshot(browser, "After");
return elementState;
};
}
