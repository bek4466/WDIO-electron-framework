/* tslint:disable */

import { MatButton } from '../matButton';
//import { error } from '@angular/compiler/src/util';
import { allure } from '../allure/allure';
import { throwError } from 'rxjs';
import { reject } from 'q';
import * as fs from "fs-extra";
import * as path from "path";
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const inputData = fs.readJsonSync(path.join(__dirname, "..", "JSON", "dataTool.json"));
const programLogLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "programLogLocators.json"));

export class RefreshProgramLogButton extends MatButton{
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "Program Log Refresh Button");
    }

    public async click(): Promise<void> {
        await super.click();
    }

    public async checkRefreshProgramLogPresent(): Promise<boolean> {
        let refreshIsVisible: boolean = false;
        const refreshButton = await browser.$(programLogLocators.refreshBtn).waitForExist();
        if (refreshButton) {
            refreshIsVisible = true;
        }
        return refreshIsVisible;
    }


    public async verifyRefreshisClickable(): Promise<boolean> {
        let refreshIsVisible: boolean = false;
        const refreshButton = await browser.$(programLogLocators.refreshBtn).waitForExist();
        if (refreshButton) {
            refreshIsVisible = true;
        }
        return refreshIsVisible;
    }


public async isEnabled():Promise<boolean> {
    let elementState: boolean = false;
    await allure.step(`Set the value of ${this.name} input to`, async () => {
    await allure.screenshot(this.app, "Before"); 
    const a = await browser.$(this.selector).isEnabled();
        if (a){
            elementState = true;}
        await allure.screenshot(this.app, "After");
    }).catch((err: Error)=>{
        console.log("Exception caught: " + `${this.isEnabled}` + `${err}`);
        reject(err);
        throw err;
    });
await allure.screenshot(this.app, "After");
return elementState;
};

public async isDisabled():Promise<boolean> {
    let elementState: boolean = false;
    await allure.step(`Set the value of ${this.name} input to`, async () => {
    await allure.screenshot(this.app, "Before");
    const a =  await browser.$(this.selector).getAttribute('class');
    let res = false;
    if(a == 'ng-star-inserted' || a.match('ng-star-inserted') || 'ng-star-inserted'.match(a)) res = true;
    if(a == 'sync-icon-btn disabled-btn' || a.match('sync-icon-btn disabled-btn') || 'sync-icon-btn disabled-btn'.match(a)) res = true;

        await expect(res).toBe(true);
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

};
