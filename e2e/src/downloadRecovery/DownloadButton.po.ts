
/* tslint:disable */
// @ts-nocheck
import * as robot from "@jitsi/robotjs";
import * as Jimp from "jimp";
import * as fs from "fs-extra";
import * as path from "path";
import { reject } from 'q';
import { MatButton } from "../matButton";
import { allure } from '../allure/allure';
import { CommonMethods } from "../../tests/commonMethods.po";
import { WinExplorer } from "../../src/WindowsExplorer/WindowsExplorer.po";
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));

export class DownloadButton extends MatButton{

constructor(app: WebdriverIO.Browser, selector: string, private dialogSelector: string) {
    super(app, selector, "Cancel button");
}

public async click(): Promise<void> {
    let common = new CommonMethods();

    await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
    await allure.screenshot(this.app, "Before");
    const winExplorer = new WinExplorer(this.app);
    await browser.pause(timeout.fast);
    await winExplorer.clickCenter();
    await super.click();
    await browser.pause(timeout.fast);
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

    public async clickWithValidPath(dlPath: string): Promise<void> {
        await browser.pause(timeout.fast);
        const winExplorer = new WinExplorer(this.app);
        await browser.pause(timeout.fast);
        await winExplorer.clickCenter();
        await super.click();
        robot.typeString(dlPath);
        await browser.pause(timeout.fast);
        robot.keyTap('enter');
        robot.keyTap('tab');
        robot.keyTap('enter');
        return Promise.resolve()
    };
}


