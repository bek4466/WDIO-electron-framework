
/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from "../matButton";
import { allure } from '../allure/allure';
import { reject } from 'q';
const deploymentLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "deploymentLocators.json"));
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
export class CredErrorMessage extends MatButton{
    constructor(app: WebdriverIO.Browser, selector: string, private dialogSelector: string) {
        super(app, selector, "Error Message");
    }

    public async click(): Promise<void> {
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
        await allure.screenshot(this.app, "Before");
        await super.click().then(async () => {
            const a = await browser.$(this.dialogSelector).waitForExist();
            return a;
        });
    });
    await allure.screenshot(this.app, "After");
    };

    // public async invalidFileErrorValidation(data: any): Promise<boolean>{
    //     let errMsg: boolean = false;
    //     await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
    //     await allure.screenshot(this.app, "Before");
    //         await browser.$(deploymentLocators.errorMsg).getText().then(async (errorMessage: any)=>{
    //             console.log(errorMessage);
    //         await expect(errorMessage).toEqual(data);
    //          errMsg = true;
    //         }).catch((err: Error)=>{
    //             console.log("Exception caught:" +`${err}`);
    //             reject(err);
    //         });
    //     });
    //     await allure.screenshot(this.app, "After");
    //     return errMsg;
    // };

    public async invalidFileErrorValidation(data: any): Promise<boolean> {
        let flag:boolean= false;
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
        //getting validation message text
        await browser.$(this.selector)
        .getText().then(async (text: string) => {
                expect(text).toEqual(data);
                flag = true;
            }).catch((err) => {
                console.log("messageLogTable.po.ts->verifyErrorMessage: " + `${err}`);
            });
        });
        await allure.screenshot(this.app, "After");
        return flag;
    }

    public async invalidFileErrorValidation1(data: any): Promise<boolean> {
        let flag:boolean= false;
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
        //getting validation message text
        await browser.$(this.selector)
        .getText().then(async (text: string) => {
                await expect(text).toEqual(data);
                flag = true;
            }).catch((err) => {
                console.log("messageLogTable.po.ts->verifyErrorMessage: " + `${err}`);
            });
        });
        await allure.screenshot(this.app, "After");
        return flag;
    }
};
