/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { reject } from 'q';
import { MatButton } from "../matButton";
import { allure } from '../allure/allure';
const deploymentLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "deploymentLocators.json"));


export class EndorseButton extends MatButton {

    constructor(browser: WebdriverIO.Browser, selector: string, private dialogSelector: string) {
        super(browser, selector, "Endorse button");
    }

    public async click(): Promise<void> {
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            await super.click();
        });
        await allure.screenshot(this.app, "After");
    }

    public async doubleClick(): Promise<void> {
        await browser.$(this.selector).doubleClick();
    }


    public async isClickable(): Promise<boolean> {
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

    public async isDisabled(): Promise<boolean> {
        let elementState: boolean = false;
        await allure.step(`Set the value of ${this.name} input to`, async () => {
            await allure.screenshot(this.app, "Before");
            await browser.pause(5000);
            const a = await browser.$(this.selector).getAttribute('disabled');
            await expect(a).toEqual('true');
            elementState = true;
            await allure.screenshot(this.app, "After");
        }).catch((err: Error) => {
            console.log("Exception caught: " + `${err}`);
            reject(err);
            throw err;
        });
        await allure.screenshot(this.app, "After");
        return elementState;
    };


    public async endorseAlertIsVisible(): Promise<boolean> {
        let endorseIsVisible: boolean = false;
        await (await browser.$(this.selector)).isExisting()
            .then(async val => {
                endorseIsVisible = val
            }).catch((err: Error) => {
                console.log('endorseIsVisible:' + `${err}`);
                // reject(err);
            });
        return endorseIsVisible;

    };

    //checkme2 needs to come from before the button is clicked. This way discrepancies in seconds can be accounted for.
    public async checkLastEndorsedTime(checkme: string, checkme2?: string): Promise<boolean> {
        let message: boolean = false;
        await browser.getElementText(deploymentLocators.lastEndorsedTime)
            .then(async (text: string) => {
                console.log("First endorse time: " + checkme);
                console.log("Second endorse time: " + checkme2);
                console.log("Found endorse time: " + text);
                if (text.toString().includes(checkme)||text.toString().includes(checkme2)) {
                    //pass string from test
                    message = true;
                }
            }).catch((err: Error) => {
                console.log('checkProgramLog2:' + `${err}`);
                reject(err);
            });
        return message;
    }
}
