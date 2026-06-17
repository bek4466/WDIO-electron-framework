/* tslint:disable */
import { MatButton } from '../matButton';
import * as fs from "fs-extra";
import * as path from "path";
import { browser } from '@wdio/globals';
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const inputData = fs.readJsonSync(path.join(__dirname, "..", "JSON", "dataTool.json"));
const programLogLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "programLogLocators.json"));

export class ClearProgramLogButton extends MatButton{
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "Program Log Clear Button");
    }

    public async click(): Promise<void> {
        await super.click();
    }


    public async checkClearProgramLogPresent(): Promise<boolean> {
        let clearIsVisible: boolean = false;
        const clearButton = await browser.$(programLogLocators.clearBtn);
        clearButton.waitForExist({timeout: 5000}).then((eleExists) => {
            if (eleExists) { clearIsVisible = true; }
            return clearIsVisible
        }).catch(err => {
            return false
        })
        return false
    }
}
