/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from '../allure/allure';
import { MatButton } from "../matButton";
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const locators2 = fs.readJsonSync(path.join(__dirname, "..", "JSON", "messagePaneLocators.json"));
export class CloseMessagePane extends MatButton{
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "close Message pane ");
    }

    public async click(): Promise<void> {
        await super.click();
    }

    public async errorMessageIconIsVisible():Promise<boolean>{
        await allure.screenshot(this.app, "Before");
        await browser.pause(timeout.medium);
        let a;
        await browser.getElementLocationInView(this.selector)
        .then(async (val) => {
            console.log("val"+val);
            a=val;
        }).catch((err: Error) => {
            console.log("From messageIconVisible: " + `${err}`);
            a=false;
        });
        await allure.screenshot(this.app, "After");
        console.log("a"+a);
        return a;
    }

    public async closeIconIsVisible():Promise<boolean>{
        await allure.screenshot(this.app, "Before");
        await browser.pause(timeout.medium);
        let a;
        await browser.$(this.selector).waitForExist()
        .then(async (val) => {
            a=val;
        }).catch((err: Error) => {
            console.log("From closeIconIsVisible: " + `${err}`);
            a=false;
        });
        await allure.screenshot(this.app, "After");
        return a;
    }

      

    public async messagePaneIsHidden():Promise<boolean>{
        await allure.screenshot(this.app, "Before");
        await browser.pause(timeout.medium);
        let a;
      await browser.$(locators2.messagePaneHidden).waitForExist()
      .then(async (val) => {
            a=val;
        }).catch((err: Error) => {
            console.log("From messagePaneIsHidden Close message pane class: " + `${err}`);
            a=false;
        });
        await allure.screenshot(this.app, "After");
        return a;
    }
}
