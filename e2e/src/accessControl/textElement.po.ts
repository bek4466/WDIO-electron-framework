/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from "../matButton";
import { allure } from '../allure/allure';
import { reject } from 'q';
import { MessagePaneComponent } from '../messagePaneComponent/messagePaneComponent.po';
//import { error } from '@angular/compiler/src/util';
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const inputData = fs.readJsonSync(path.join(__dirname, "..", "JSON", "dataTool.json"));
const deploymentLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "deploymentLocators.json"));
export class TextElement extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "TextSelector");
    }

    public async click(): Promise<void> {
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            await super.click();
        });
        await allure.screenshot(this.app, "After");
    }

    public async commandClick(wait: () => Promise<boolean> = async () => true): Promise<any> {
        this.app.addCommand("waitAndClick", async function (timeout) {
            await browser.waitUntil(deploymentLocators.statusTxt);
            return browser.waitUntil(wait);
        }, true)
    }

}
