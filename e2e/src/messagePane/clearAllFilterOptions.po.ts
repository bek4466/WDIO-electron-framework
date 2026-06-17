// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from '../allure/allure';
import { MatButton } from "../matButton";
import { reject } from 'q';
import { WebDriver } from "@wdio/types/build/Options";
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const locators2 = fs.readJsonSync(path.join(__dirname, "..", "JSON", "messagePaneLocators.json"));
const data = fs.readJsonSync(path.join(__dirname, "..", "JSON", "dataTool.json"));

export class ClearAllFilterOptions extends MatButton{
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "ClearAllFilterOptions");

    }
    public async click(): Promise<void> {
        await super.click();
    }

}
