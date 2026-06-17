
/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from "../matButton";
import { allure } from '../allure/allure';
import { reject } from 'q';
const deploymentLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "deploymentLocators.json"));
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
export class EditPopUpIpError extends MatButton{
    constructor(app: WebdriverIO.Browser, selector: string, private dialogSelector: string) {
        super(app, selector, "Error Message");
    }

    public async invalidIpErrorValidation(data: any): Promise<boolean> {
        let flag:boolean= false;
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
        //getting validation message text
        await browser.$(this.selector)
        .getText().then(async (text: string) => {
                expect(text).toEqual(data);
                flag = true;
            }).catch((err) => {
                console.log("editPopUpIpError.po.ts" + `${err}`);
            });
        });
        await allure.screenshot(this.app, "After");
        return flag;
    }
};
