/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from '../allure/allure';
import { MatButton } from '../matButton';
import { reject } from 'q';
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const systemInfoFilePath = path.join(__dirname, "..", "..", "resources", "ProgramLogProject", "systeminfoT25.json");
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const controllerLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "controllerLocators.json"));
const progLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "startStopProgramLocators.json"));
export class StopProgramButton extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "Destiny InputPath Field");
    }

    public async click(): Promise<void> {
        await super.click();
    }
    public async checkStopProgramButtonPresent1(): Promise<boolean> {
        await browser.pause(timeout.medium);
        const stopProgramButton = await browser.$(locators.stopProgramButton).waitForExist();
        return stopProgramButton;
    }
    public async checkStopProgramButtonPresent3(): Promise<boolean> {
        let stopProgramButton: any = false;
        await (await browser.$(progLocators.stopProgramButton)).waitForExist().then(async (value: boolean)=>{
            await expect(value).toEqual(true);
        }).catch((err: Error)=>{
            console.log(err);
        });
        return stopProgramButton;
    }

    public async checkStopProgramButtonPresent(): Promise<boolean> {
        await allure.screenshot(this.app, "Before");
        await browser.pause(timeout.medium);
        let a;
        await browser.$( this.selector).waitForExist()
        .then(async (val) => {
            a = val;
        }).catch((err: Error) => {
            console.log("From checkStopProgramButtonPresent: " + `${err}`);
            a = false;

        });
        await allure.screenshot(this.app, "After");
        return a;
    }

    public async xcheckStopProgramButtonPresent(): Promise<boolean> {
        await allure.screenshot(this.app, "Before");
        await browser.pause(timeout.medium);
        let a;
        await browser.$(this.selector).waitForExist()
        .then(async (val) => {
            a = val;
        }).catch((err: Error) => {
            console.log("From checkStopProgramButtonPresent: " + `${err}`);
            a = false;

        });
        await allure.screenshot(this.app, "After");
        return a;
    }


    public async checkProgramGotStopped(ipAddress: any, userName: any, password: any, vtlpGui: any, vtlpMessage: any): Promise<boolean> {
        let message: boolean = false;
        await browser.newWindow("https://" + ipAddress + "/web/vtlp/" + vtlpGui + "/index.html#/main", {windowName: "vtlpWindow", windowFeatures: "width=1024,height=770,resizable,scrollbars=yes,status=1"});
        await browser.pause(timeout.medium);
        await browser.$(controllerLocators.userName).setValue(userName);
        await browser.$(controllerLocators.password).setValue(password);
        await browser.pause(timeout.medium);
        await browser.$(controllerLocators.signIn).click();
        await browser.pause(timeout.medium);
        await (await browser.$(locators.programNotRunning)).waitForExist().then(async (value: boolean) => {
            if (value===true) {
                await browser.$(controllerLocators.programNotRunning)
                    .getText().then(async (text: string) => {
                        console.log("LOCATOR FOR STOP PROGRAM STATE: " + `${text}`);
                        await browser.pause(timeout.medium);
                        if (await text.includes(vtlpMessage)) {
                            message = true;
                        }
                    });
            } else {
                console.log("FALSE "+ value);
            }
        }).catch((err: any)=>{
            console.log(err);
        });
        return message;
    }
    public async checkStopProgramTextPresent1(): Promise<boolean> {
        await browser.pause(timeout.medium);
        const stopProgramText = await browser.$(locators.stopProgramText).waitForExist();
        return stopProgramText;
    }

    /**
     * use this
     */
    public async checkStopProgramTextPresent(): Promise<boolean> {
        await allure.screenshot(this.app, "Before");
        await browser.pause(timeout.medium);
        let a;
        await browser.$(this.selector).waitForExist()
        .then(async (val) => {
            a = val;
        }).catch((err: Error) => {
            console.log("From checkStopProgramTextPresent: " + `${err}`);
            a = false;

        });
        await allure.screenshot(this.app, "After");
        return a;
    }

    public async checkStopProgramTextPresentUpdatedMaster(): Promise<boolean> {
        await allure.screenshot(this.app, "Before");
        await browser.pause(timeout.medium);
        let a
        await browser.$(this.selector).waitForExist()
        .then(async (val) => {
            expect(val).toBe(true)
        }).catch((err: Error) => {
            console.log("From checkStopProgramTextPresent: " + `${err}`);
        });
        await browser.$(locators.stopProgmButtonSpan)
                    .getText()
                    .then(async(text) => {
                      
                        if (text == "STOP" ){ 
                            a = true }
                        else{ 
                            a =  false};
                    })
        return a;
    }


    public async matchStopProgramText(myStopProgramText: string): Promise<boolean> {
        let message: boolean = false;
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            await allure.step(`Set the value of ${this.name} input to ${myStopProgramText}`, async () => {
                await browser.pause(timeout.medium);
                const a = await browser.$( this.selector).waitForExist()
                .then(async () => {
                    return a;
                }).catch((err: Error) => {
                    console.log("From matchStopProgramText: " + `${err}`);
                    // reject(err);
                });
                await browser.$(this.selector)
                    .getText()
                    .then(async (text: string) => {
                        await browser.pause(timeout.medium);
                        if (text.includes(myStopProgramText)) {

                            message = true;
                        }
                        await allure.screenshot(this.app, "After");
                    }).catch((err: Error) => {
                        console.log('checkProgramLog:' + `${err}`);
                        // reject(err);
                    });
            });
        });
        await allure.screenshot(this.app, "After");
        return message;
    }

    public async isDisabled():Promise<boolean> {
        let elementState: boolean = false;
        await allure.step(`Set the value of ${this.name} input to`, async () => {
            elementState = await (await browser.$(this.selector)).isEnabled()
        }).catch((err: Error)=>{
            console.log("Exception caught: " + `${this.isEnabled}` + `${err}`);
            reject(err);
            throw err;
        });
        return elementState == false;
    }
}
