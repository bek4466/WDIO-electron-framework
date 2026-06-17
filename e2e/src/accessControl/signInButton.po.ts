/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
import { reject } from 'q';

import { MatButton } from "../matButton";
import { allure } from '../allure/allure';
const accessKeys = fs.readJsonSync(path.join(__dirname, "..", "JSON", "keys.json"));
const data = fs.readJsonSync(path.join(__dirname, "..", "JSON", "dataTool.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const accessLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "accessControlLocators.json"));
const dataKeys = fs.readJsonSync(path.join(__dirname, "..", "JSON", "accessKeysData.json"));
import { LogClient } from '@extron/winston-logger';
import { PasswordColumn } from "../credentials";
const logClient = new LogClient("e2e:SignIn POM");
export class SignInButton extends MatButton {

    constructor(app: WebdriverIO.Browser, selector: string, private dialogSelector: string) {
        super(app, selector, "Sign in button");
    }

    public async click(): Promise<void> {
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            await super.click();
        });
        await allure.screenshot(this.app, "After");
    }


    public async isClickable(): Promise<boolean> {
        let elementState: boolean = false;
        await allure.step(`Set the value of ${this.name} input to`, async () => {
            await allure.screenshot(this.app, "Before");
            elementState = await this.app.$(this.selector).isEnabled();
            await console.log(await this.app.$(this.selector).getAttribute('style'));
            elementState = true;
        }).catch((err: Error) => {
            logClient.error("Exception caught: " + `${err}`);
        });
        await allure.screenshot(this.app, "After");
        return elementState;
    };

    public async isDisabled(): Promise<boolean> {
        let elementState: boolean = false;
        await allure.step(`Set the value of ${this.name} input to`, async () => {
            await allure.screenshot(this.app, "Before");
            await this.app.pause(timeout.fast);
            const a = await this.app.$(this.selector).getAttribute('disabled');
            await expect(a).toEqual('true');
            elementState = true;
            await allure.screenshot(this.app, "After");
        }).catch((err: Error) => {
            logClient.error("Exception caught: " + `${err}`);
        });
        await allure.screenshot(this.app, "After");
        return elementState;
    };


    public async signInClick() {
        await this.app
            .$(accessLocators.signInBtn)
            .click()
            .catch((err: Error) => {
                logClient.error(err);
                reject(err);
            });
    }


    public async loginToSSO(username: string, password: string): Promise<boolean> { //
        let flag: any = false;
        // give little time to load the DOM
        await this.app.$(accessLocators.emailInputField)
            .waitForExist({ timeout: timeout.slow })
            .then(async (value: boolean) => {
                if (value) {
                    await (await this.app.$(accessLocators.emailInputField)).click();
                    await (await this.app.$(accessLocators.emailInputField)).setValue(username)
                        .then(async () => {
                        }).catch((err: Error) => {

                            //fail("INPUT username");
                        });
                    await (await this.app.$(accessLocators.passwordInputField)).setValue(password).then(async () => {
                    }).catch((err: Error) => {

                        //fail("INPUT password");
                    });
                    await this.app.$(accessLocators.checkBox).click()
                    await this.app.pause(2000);
                    await this.app.$(accessLocators.loginBtn).click().then(async () => {
                        // await this.app.windowByIndex(1);
                        await this.app.pause(5000);
                        flag = true;
                    }).catch((err: Error) => {
                        logClient.error(`${err}`);
                        //fail("login");
                    });

                }
            });
        return flag;
    }

    public async enterSSOCredentials(username: string, password: string): Promise<boolean> {
        let flag: any = false;
        // give little time to load the DOM
        await (await this.app.$(accessLocators.emailInputField)).waitForExist({timeout: timeout.slow})
            .then(async (value: boolean) => {
                if (value) {
                    await (await this.app.$(accessLocators.emailInputField)).setValue(username).then(async () => {
                    }).catch((err: Error) => {

                        //fail("INPUT username");
                    });
                    await (await this.app.$(accessLocators.passwordInputField)).setValue(password).then(async () => {
                        flag = true;
                    }).catch((err: Error) => {

                        //fail("INPUT password");
                    });
                    /* await browser.$(accessLocators.checkBox).click().pause(2000);
                    await browser.$(accessLocators.loginBtn).click().then(async() => {
                    await browser.windowByIndex(1);
                    await browser.pause(5000);
                    flag = true;
                }).catch((err: Error)=>{
                    logClient.error(`${err}`);
                    //fail("login");
                }); */

                }
            });
        return flag;
    }

    /**
        * Only if the checkme string is present in the message log this function returns true
        * @param checkme :string
        */
    public async checkVersionInfo(checkme: string): Promise<boolean> {
        let message: boolean = false;
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            await allure.step(`Set the value of ${this.name} input to ${checkme}`, async () => {
                await allure.screenshot(this.app, "Before");
                await this.app
                    .$(accessLocators.versionInformation)
                    .getText()
                    .then(async (text: any) => {
                        await this.app.pause(timeout.fast);
                        if (text === checkme) {
                            //pass string from test
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
}
