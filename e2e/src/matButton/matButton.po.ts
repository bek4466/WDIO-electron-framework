/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../allure/allure";
import { Element } from "../lib/element";
import { reject } from 'q';
import { browser } from "@wdio/globals";
const deployLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "deploymentLocators.json"));

export class MatButton extends Element {
    constructor(browser: WebdriverIO.Browser, selector: string, protected name: string, parent?: Element) {
        super(browser, selector, parent);
    }

    public async click(): Promise<void> {
        const clickLogMsg = `Clicking on ${this.name} button`
        await allure.step(clickLogMsg, async () => {
            await allure.screenshot(browser, `Before ${clickLogMsg}`);
            await this.getElement()
                .click()
            await allure.screenshot(browser, `After ${clickLogMsg}`);
        }).catch((err: Error) => {
            console.log(err);
        });
    }

    // will not console log in case of issues
    public async silentClick(): Promise<void> {
        const silentClickLogMsg = `Silent Clicking on ${this.name} button`
        await allure.step(silentClickLogMsg, async () => {
            await allure.screenshot(browser, `Before ${silentClickLogMsg}`);
            try {
                await this.getElement()
                    .click();
            } catch (error) {
                // intended behaviour
                console.log("Click Intercepted");
            }
            await allure.screenshot(browser, `After ${silentClickLogMsg}`);
        }).catch((err: Error) => {
        });
    }

    public async isEnabled(): Promise<boolean> {
        const isEnabled = await browser.$(this.selector)
            .isEnabled();

        return isEnabled;
    }

    // performs the hover mouse and checks that the text in the hover box matches the given 'data'
    public async verifyHoverToolTip(data: any): Promise<boolean> {
        let flag: boolean = false;

        await allure.screenshot(this.app, "Before ToolTip Check");
        //getting validation message text
        const protectButton = await browser.$(this.selector);

        // create mouse pointer object 
        await browser.action('pointer', {
        parameters: { pointerType: 'mouse' }
        })
        .move({ duration: 0, origin: protectButton, x: 0, y: 0 })
        .perform()
        await browser.pause(2000)

        if (data === "") {
        let hoverToolTip = await browser.$(deployLocators.HoverTooltip)
        let hoverToolTipExists = await hoverToolTip.isExisting()
        if (hoverToolTipExists === false) flag = true
        } else {
        await browser.$(deployLocators.HoverTooltip)
            .getText().then(async (text: string) => {
            if (text === data || text.match(data) || data.match(text)) flag = true;
            }).catch((err) => {
            console.log("messageLogTable.po.ts->verifyErrorMessage: " + `${err}`);
            });
        }

        await allure.screenshot(this.app, "After ToolTip Check");
        return flag;
    }

}
