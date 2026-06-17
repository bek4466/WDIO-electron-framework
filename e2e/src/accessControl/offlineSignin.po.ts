/* tslint:disable */
// @ts-nocheck
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
import { browser } from "@wdio/globals";
const logClient = new LogClient("e2e:OfflinesignIn POM");
export class OfflineSignin extends MatButton {

    constructor(browser: WebdriverIO.Browser, selector: string, private dialogSelector: string) {
        super(browser, selector, "Sign in button");
    }

    public async click(): Promise<void> {
        await allure.step(`Set the value of ${this.name} input to ${browser}`, async () => {
            await allure.screenshot(browser, "Before");
            await super.click();
        });
        await allure.screenshot(browser, "After");
    }
    public async offlineSignInClick() {
        await browser
            .$(accessLocators.offlineSignInBtn)
            .click()
            .catch((err: Error) => {
                logClient.error(err);
                reject(err);
            });
    }
    public async offlineSignInClick1() {
        let flag: any;
        await browser
            .$(accessLocators.offlineSignInBtn).isDisplayed().then(async (value: boolean) => {
                flag = value;
                console.log(flag);
                console.log(value)
            }).catch((err: Error) => {

                //fail("offlineSignInBtn");
            });
        if (flag) {
            await browser
                .$(accessLocators.offlineSignInBtn)
                .click()
                .catch((err: Error) => {
                    logClient.error(err);
                    reject(err);
                });
        }
        if (!flag) {
            await browser
                .$(accessLocators.logOutBtn)
                .click()
                .catch((err: Error) => {
                    logClient.error(err);
                    reject(err);
                });
            await browser
                .$(accessLocators.offlineSignInBtn)
                .click()
                .catch((err: Error) => {
                    logClient.error(err);
                    reject(err);
                });

        }
    }

    public async sendResponseKey(responseKey: string): Promise<boolean> {
        let flag: any = false;
        // give little time to load the DOM
        await (await browser.$(accessLocators.offlineResponseKeyInputField)).waitForExist({ timeout: timeout.slow })
            .then(async (value: boolean) => {
                if (value) {
                    await (await browser.$(accessLocators.offlineResponseKeyInputField)).setValue(responseKey).then(async () => {
                        flag = true;
                    }).catch((err: Error) => {

                        //fail("INPUT responseKey");
                    });
                    //await browser.$(accessLocators.checkBox).click().pause(2000);
                }
            });
        return flag;
    }


    public async backtoSignIsVisible(): Promise<boolean> {
        let isVisible: boolean;
        await allure.step(`Set the value of ${this.name} input to ${browser}`, async () => {
            await allure.screenshot(browser, "Before");
            await (await browser.$(accessLocators.backToSignin)).isDisplayed().then(async (value: boolean) => {
                isVisible = value;
            }).catch((err: Error) => {
            });
        });
        await allure.screenshot(browser, "After");
        return isVisible;
    }
    public async invalidActivationMessageIsVisible(messageHeader: string, message: string): Promise<boolean> {
        let isVisible: boolean;
        let messageHeaderVisible: boolean
        let messageVisible: boolean
        await allure.step(`Set the value of ${this.name} input to ${browser}`, async () => {
            await allure.screenshot(browser, "Before");
            await (await browser.$(accessLocators.dialogBox)).isDisplayed().then(async (value: boolean) => {
                isVisible = value;
                if (isVisible) {
                    await browser.$(accessLocators.invalidActivationHeader).getText().then(async (text: string) => {
                        if (await text.match(messageHeader)) {
                            //pass string from test
                            messageHeaderVisible = true;
                            if (messageHeaderVisible) {
                                await browser.$(accessLocators.invalidActivationMessage).getText().then(async (text1: string) => {
                                    if (await text1.match(message)) {
                                        //pass string from test
                                        messageVisible = true;
                                    }
                                }).catch((err: Error) => {
                                });

                            }

                        }
                    }).catch((err: Error) => {
                    });

                }
            }).catch((err: Error) => {
            });
        });
        await allure.screenshot(browser, "After");
        return messageVisible;
    }
    public async clickVerify() {
        await browser
            .$(accessLocators.offlineVerifyBtn)
            .click()
            .catch((err: Error) => {
                logClient.error(err);
                reject(err);
            });
    }

    public async closeActivationPopup() {
        await browser
            .$(accessLocators.okButton)
            .click()
            .catch((err: Error) => {
                logClient.error(err);
                reject(err);
            });
    }

}
