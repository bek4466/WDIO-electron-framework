/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from '../matButton';
import { allure } from "../allure/allure";
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const inputData = fs.readJsonSync(path.join(__dirname, "..", "JSON", "dataTool.json"));
export class TraceSpinner extends MatButton {
    constructor(browser: WebdriverIO.Browser , selector: string) {
        super(browser, selector, "TraceSpinner");
    }

    public async click(): Promise<void> {
        await super.click();
    }

    //will return true if spinner is spinning and false otherwise
    public async checkSpinner(): Promise<boolean> {
        var result;
        await allure.step(`Check if Spinner is Spinning`, async () => {
            await allure.screenshot(this.app, "Before");
            await await browser.$(this.selector)
                .isClickable().then(async (exists: boolean) => {
                    result = exists;
                }).catch(err => {
                    console.log('Exception in traceSpinner.po.ts' + err);
                    //result = false;
                });

            await allure.screenshot(this.app, "After");
        });
        return result;
    }
    //will return true if spinner is spinning and false otherwise
    public async checkSpinnerState(): Promise<boolean> {
        var result = true;
        await allure.step(`Check if Spinner is Spinning`, async () => {
            await allure.screenshot(this.app, "Before");
            await browser.$(locators.traceSpinnerImg)
                .isExisting().then(async (exists: boolean) => {
                    await expect(true).toBe(exists);
                }).catch(err => {
                    console.log('Exception in traceSpinner.po.ts' + err);
                    result = false;
                });

            await allure.screenshot(this.app, "After");
        });
        return result;
    }
}
