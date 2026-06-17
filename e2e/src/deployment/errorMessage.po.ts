
/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";

import { MatButton } from "../matButton";
import { allure } from '../allure/allure';
import { browser } from '@wdio/globals';
import { reject } from 'q';
const deploymentLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "deploymentLocators.json"));
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
export class ErrorMessage extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string, private dialogSelector: string) {
        super(app, selector, "Error Message");
    }

    public async click(): Promise<void> {
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            await super.click().then(async () => {
                const a = await browser
                    .$(this.dialogSelector).waitForExist();
                return a;
            });
        });
        await allure.screenshot(this.app, "After");
    };

    public async invalidFileErrorValidation(data: any): Promise<boolean> {
        let flag: boolean = false;
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            //getting validation message text

            await browser
                .$(this.selector)
                .getText().then(async (text: string) => {
                    if (text.match(new RegExp(data))) flag = true;
                }).catch((err) => {
                    console.log("messageLogTable.po.ts->verifyErrorMessage: " + `${err}`);
                });
        });
        await allure.screenshot(this.app, "After");
        return flag;
    }

    // takes the mouse object and emulates hovering over the info icon of the Browse label bar
    public async hoverMouseOverInfoIcon(data: any) {
        const browseLabelInfoIcon = await browser.$(deploymentLocators.toolTip);
        // create mouse pointer object 
        await browser.action('pointer', {
            parameters: { pointerType: 'mouse' }
        })
            .move({ duration: 0, origin: browseLabelInfoIcon, x: 0, y: 0 })
            .down({ button: 0 })
            .perform()
    }

    // returns true or false if the hover box appears or not when mouse is over the info icon of the Browse label bar
    public async doesInfoHoverBoxAppear() : Promise<boolean> {
        return await (await browser.$(deploymentLocators.tooltipText)).isExisting()
    }


    // performs the hover mouse and checks that the text in the hover box matches the given 'data'
    public async checkMessageToolTip(data: any): Promise<boolean> {
        let flag: boolean = false;

        await allure.screenshot(this.app, "Before ToolTip Check");
        //getting validation message text
        // (await browser.$(deploymentLocators.toolTip)).action("pointer").pause(2000);
        const browseLabelInfoIcon = await browser.$(deploymentLocators.toolTip);
        const locationOfBrowseLabelInfoIcon = await browseLabelInfoIcon.getLocation();
        // create mouse pointer object 
        await browser.action('pointer', {
            parameters: { pointerType: 'mouse' }
        })
            .move({ duration: 0, origin: browseLabelInfoIcon, x: 0, y: 0 })
            .down({ button: 0 })
            .perform()
        await browser.pause(2000)

        await browser.$(deploymentLocators.tooltipText)
            .getText().then(async (text: string) => {
                if (text === data) flag = true;
            }).catch((err) => {
                console.log("messageLogTable.po.ts->verifyErrorMessage: " + `${err}`);
            });
        await allure.screenshot(this.app, "After ToolTip Check");
        return flag;
    }

    public async invalidFileErrorValidation2(data: any): Promise<boolean> {
        let flag: boolean = false;
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            //getting validation message text
            await browser
                .$(this.selector)
                .getText().then(async (text: string) => {

                    if (text.match(new RegExp(data)) != undefined) {
                        flag = true;
                        return flag;
                    }
                }).catch((err) => {
                    console.log("messageLogTable.po.ts->verifyErrorMessage: " + `${err}`);
                });
        });
        await allure.screenshot(this.app, "After");
        return flag;
    }

    public async invalidFileErrorValidation1(data: any): Promise<boolean> {
        let flag: boolean = false;
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            //getting validation message text

            await browser
                .$(this.selector)
                .getText().then(async (text: string) => {
                    if (text.includes(data)) flag = true;
                }).catch((err) => {
                    console.log("messageLogTable.po.ts->verifyErrorMessage: " + `${err}`);
                });
        });
        await allure.screenshot(this.app, "After");
        return flag;
    }
};
