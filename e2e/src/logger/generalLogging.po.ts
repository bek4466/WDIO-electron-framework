// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from '../allure/allure';

import { MatButton } from "../matButton";
import { reject } from 'q';
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const locators2 = fs.readJsonSync(path.join(__dirname, "..", "JSON", "messagePaneLocators.json"));
const data = fs.readJsonSync(path.join(__dirname, "..", "JSON", "dataTool.json"));
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:GeneralLogging");
export class GeneralLogging extends MatButton{

    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "GeneralLogging");
    }
    public async click(): Promise<void> {
        await super.click();
    }

    public async turnOnGenLogs(): Promise<boolean> {
        let flag: boolean;
        await browser.$(this.selector)
            .click()
            .then(async (res:any) => {
                if (res){
                    const a = browser
                        .$("[class='mat-slide-toggle mat-accent mat-checked']")
                        .getAttribute("class");
                    await expect(a)
                        .toEqual(true);
                    flag = true;
                }else{
                    flag = false;
                }
            })
            .catch((err: any) => {
                logClient.error(err);
            });
        return flag;
    }

    public async turnOffGenLogs(): Promise<boolean> {
        let flag: boolean;
        await browser.$(this.selector)
            .click()
            .then(async (res:any) => {
                if (res){
                    const a = browser
                        .$("[class='mat-slide-toggle mat-accent mat-checked']")
                        .getAttribute("class");
                    await expect(a)
                        .toEqual(true);
                    flag = true;
                }else{
                    flag = false;
                }
            })
            .catch((err: any) => {
                logClient.error(err);
            });
        return flag;
    }

}
