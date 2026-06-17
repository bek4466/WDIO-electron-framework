/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from "../matButton";
import { allure } from '../allure/allure';
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const locators2 = fs.readJsonSync(path.join(__dirname, "..", "JSON", "messagePaneLocators.json"));
export class OpenMessagePane extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "open message pane");
    }

    public async verifyMessageTableLength() {
        let list = await browser.$$(locators2.messagepanerows);
        return list.length;
    }

    public async click(): Promise<void> {
        await super.click();
    }

    public async messagePaneIsVisible1(): Promise<boolean> {
        await browser.pause(timeout.medium);
        const a =  await browser.$(this.selector)
        .waitForExist().then(async ()=>{
            return a;
        }).catch((err: Error) =>{
            console.log("From messagePaneIsVisible: " + `${err}`);
            return false;
        });
    return a;
    }

    public async messagePaneIsVisible(): Promise<boolean> {
        await allure.screenshot(this.app, "Before");
        await browser.pause(timeout.medium);
        let a;
        await browser.$(locators.messagePaneVisibleDeployView).waitForExist()
        .then(async (val) => {
            a = val;
        }).catch((err: Error) => {
            console.log("From messagePaneIsVisible: " + `${err}`);
            a = false;
        });
        await allure.screenshot(this.app, "After");
        return a;
    }

    public async messagePaneIsVisibleTroubleshootingView(): Promise<boolean> {
        await allure.screenshot(this.app, "Before");
        await browser.pause(timeout.medium);
        let a;
        await browser.$(locators2.messagePaneVisible2).waitForExist()
       .then(async (val) => {
            a = val;
        }).catch((err: Error) => {
            console.log("From messagePaneIsVisible: " + `${err}`);
            a = false;
        });
        await allure.screenshot(this.app, "After");
        return a;
    }

    public async openMessagePaneIconIsVisible(): Promise<boolean> {
        await allure.screenshot(this.app, "Before");
        await browser.pause(timeout.medium);
        let openMessagePaneButton;
         await browser.$(this.selector)
            .waitForExist()
            .then(async val => {
                openMessagePaneButton=val;
                //return val;
            })
            .catch(err => {
                console.log(
                    "openMessagePaneIconIsVisible: Exception Error: " + `${err}`
                );
                openMessagePaneButton=false;
            });
            await allure.screenshot(this.app, "After");
        return openMessagePaneButton;
    }
}
