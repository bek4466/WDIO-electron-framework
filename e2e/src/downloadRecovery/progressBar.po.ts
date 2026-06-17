/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from "../matButton";
import { allure } from '../allure/allure';
import { reject } from 'q';
import { DeployComponent } from '../deployComponent';
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const inputData = fs.readJsonSync(path.join(__dirname, "..", "JSON", "dataTool.json"));
const deploymentLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "deploymentLocators.json"));
export class ProgressBar extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "Progress Bar");
    }

    public async verifyProgressBarExist(): Promise<boolean> {
        let disabled: boolean = false;
        const a = await browser.$(deploymentLocators.progressBar).waitForExist();
        if (a) {
            disabled = true;
        }
        return disabled;
    }

    public async verifyProgressBarVisible(): Promise<boolean> {
        let disabled: boolean = true;
        const a = await browser.$(deploymentLocators.progressBar).isClickable();
        if (a == false) {
            disabled = false;
        }
        return disabled;
    }
}
