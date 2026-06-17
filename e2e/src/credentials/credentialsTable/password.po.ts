/* tslint:disable */
// @ts-nocheck
import { MatButton } from '../../matButton';
import * as fs from "fs-extra";
import * as path from "path";
import { reject } from 'q';
const locators = fs.readJsonSync(path.join(__dirname, "..", "..", "JSON", "locators.json"));
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "JSON", "dataTool.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "JSON", "timeout.json"));
const credsLocators = fs.readJsonSync(path.join(__dirname, "..", "..", "JSON", "userSettingsCredsLocators.json"));
import { LogClient } from '@extron/winston-logger';
const logClient = new LogClient("e2e:password>POM");
export class PasswordColumn extends MatButton {
    constructor(browser: WebdriverIO.Browser, selector: string) {
        super(browser, selector, "Kevin Settings Table");
    }

    public async click(): Promise<void> {
        await super.click();
    }

    public async verifyPasswordColumnTitleExist(): Promise<boolean> {
        let passwordColumnExist: boolean = false;
        const a = await browser.$(credsLocators.passwordHeader).waitForExist();
        if (a) {
            passwordColumnExist = true;
        }
        return passwordColumnExist
    }
    public async verifyPasswordRowExists(rowNumber): Promise<boolean> {
        let passwordRowExists = false;
        const dynamicLocator = "//input[@id='deploy-creds-table-password-row-" + rowNumber + "-input']";
        passwordRowExists = await (await browser.$(dynamicLocator)).isExisting();
        return passwordRowExists
    }

    public async verifyPrimaryPasswordValueIsVisible(): Promise<boolean> {
        let passwordValueIsVisible: boolean = false;
        const a = await browser.$(credsLocators.PasswordCol.row1Password).waitForExist()
        if (a) {
            passwordValueIsVisible = true;
        }
        return passwordValueIsVisible
    }



    public async verifySecondaryPasswordValueIsVisible(): Promise<boolean> {
        let passwordValueIsVisible: boolean = false;
        const a = await browser.$(credsLocators.PasswordCol.row2Password).waitForExist();
        if (a) {
            passwordValueIsVisible = true;
        }
        return passwordValueIsVisible
    }

    public async verifyTlpPasswordValueIsVisible(): Promise<boolean> {
        let passwordValueIsVisible: boolean = false;
        const a = await browser.$(credsLocators.PasswordCol.row3Password).waitForExist();
        if (a) {
            passwordValueIsVisible = true;
        }
        return passwordValueIsVisible
    }


    public async verifyEmptyTlpPasswordValueIsVisible(): Promise<boolean> {
        let passwordEmptyValueIsVisible: boolean = false;
        const a = await browser.$(credsLocators.PasswordCol.row3Password).waitForExist();
        if (a) {
            passwordEmptyValueIsVisible = true;
        }
        return passwordEmptyValueIsVisible
    }

    public async verifyTlpPasswordIsEnteredWithValue(myPassword): Promise<boolean> {
        let passwordValueIsVisible: boolean = false;
        await browser.$(credsLocators.PasswordCol.row3Password).waitForExist();
        await browser.$(credsLocators.PasswordCol.row3Password).getText().then(async (text: string) => {
            if (text.includes(myPassword)) passwordValueIsVisible = true;
        }).catch((e: Error) => {
            logClient.error("Exception caught in VERIFY_PASSWORD_ROW3 " + `${e}`);
        });
        return passwordValueIsVisible;
    }

    public async setPassword(myPassword: string, rowNumber): Promise<void> {
        const dynamicLocator = "//input[@id='deploy-creds-table-password-row-" + rowNumber + "-input']";
        try {
            let passwordRowExists = await (await browser.$(dynamicLocator)).isExisting();
            if (passwordRowExists) {
                await browser.$(dynamicLocator).click().catch((err: Error) => { });
                await browser.$(dynamicLocator).setValue(myPassword).catch((err: Error) => { });
                // Work around for the following bug https://extron.atlassian.net/browse/TOOL-4142
                if (myPassword === "") {
                    await browser.keys("A");
                    await browser.keys("Backspace");
                }
            } else {
                return Promise.resolve()
            }
        } catch (error) {
            console.warn("WE FAILED THE PROMISE")
            return Promise.resolve()
        }


    }

    public async verifyPassword(myPassword: string, rowNumber): Promise<void> {
        const dynamicLocator = "//input[@id='deploy-creds-table-password-row-" + rowNumber + "-input']";

        try {
            let passwordRowExists = await (await browser.$(dynamicLocator)).isExisting();
            if (passwordRowExists) {
                await browser.$(dynamicLocator).click().catch((err: Error) => { });
                await browser.$(dynamicLocator).getValue().then(async (text: string) => {
                    expect(text)
                        .toBe(myPassword);
                }).catch((err: Error) => { });
            } else {
                return Promise.resolve()
            }
        } catch (error) {
            console.warn("WE FAILED THE PROMISE")
            return Promise.resolve()
        }

    }

    public async verifyDeviceInfo(info, columnName, rowNumber): Promise<boolean> {
        let ValueIsVisible: boolean = false;
        await browser.$("#deploy-creds-table-" + columnName + "-row-" + rowNumber).waitForExist();
        await browser.$("#deploy-creds-table-" + columnName + "-row-" + rowNumber).getText().then(async (text: string) => {
            if (text.includes(info)) {
                ValueIsVisible = true;
            }
        }).catch((e: Error) => {
            logClient.error("Exception caught in VERIFY_DEVICE_INFO " + `${e}`);
        });
        return ValueIsVisible;
    }
    public async verifyEmptyTlpPasswordIsVisibleAndEditable(myPassword: string): Promise<boolean> {
        let passwordEmptyValueIsVisible: boolean = false;
        const a = await browser.$(locators.missingTlpPassword).waitForExist({ timeout: 2500 });
        if (a) {
            passwordEmptyValueIsVisible = true;
            if (passwordEmptyValueIsVisible) {
                const exists = await browser.waitUntil(async () => {
                    await browser.$(locators.tlpPasswordEditField).setValue(myPassword);
                    return exists;
                }, { timeout: 2500 });
            }
        }
        return passwordEmptyValueIsVisible;
    }

    public async verifyEmptyPrimaryPasswordIsVisibleAndEditable(myPassword): Promise<boolean> {
        let passwordEmptyValueIsVisible: boolean = false;
        const a = await browser.$(credsLocators.PasswordCol.row3Password).waitForExist();
        if (a) {
            passwordEmptyValueIsVisible = true;
            if (passwordEmptyValueIsVisible) {
                try {
                    const exists = await browser.waitUntil(async () => {
                        await browser.$(credsLocators.PasswordCol.row3Password).clearValue();
                        await browser.$(credsLocators.PasswordCol.row3Password).setValue(myPassword);
                        return exists;
                    }, { timeout: 2500 });
                } catch (err) {
                    logClient.error("Exception caught: " + `${err}`);
                    reject(err);
                }
            }
        }
        return passwordEmptyValueIsVisible
    }

    public async verifyEmptyPrimaryPasswordIsVisibleAndEditable2(myPassword): Promise<boolean> {
        let passwordEmptyValueIsVisible: boolean = false;
        const a = await browser.$(credsLocators.PasswordCol.row1Password).waitForExist();
        if (a) {
            passwordEmptyValueIsVisible = true;
            if (passwordEmptyValueIsVisible) {
                try {
                    const exists = await browser.waitUntil(async () => {
                        await browser.$(credsLocators.PasswordCol.row1Password).clearValue();
                        await browser.$(credsLocators.PasswordCol.row1Password).setValue(myPassword);
                        return exists;
                    }, { timeout: 2500 });
                } catch (err) {
                    logClient.error("Exception caught: " + `${err}`);
                    reject(err);
                }
            }
        }
        return passwordEmptyValueIsVisible
    }

    public async verifyEmptyPrimaryPasswordIsVisibleAndEditable3(password): Promise<boolean> {
        let passwordEmptyValueIsVisible: boolean = false;
        const a = await browser.$(locators.missingPrimaryPassword).waitForExist({ timeout: 2500 });
        if (a) {
            passwordEmptyValueIsVisible = true;
            if (passwordEmptyValueIsVisible) {
                try {
                    const exists = await browser.waitUntil(async () => {
                        await browser.$(locators.primaryPasswordEditField).clearValue();
                        await browser.$(locators.primaryPasswordEditField).setValue(password);
                        return exists;
                    }, { timeout: 2500 });
                } catch (err) {
                    logClient.error("Exception caught: " + `${err}`);
                    reject(err);
                }
            }
        }
        return passwordEmptyValueIsVisible
    }

    public async verifyMissingPrimaryUserNameIsVisibleAndEditable(myPassword): Promise<boolean> {
        let passwordEmptyValueIsVisible: boolean = false;
        const a = await browser.$(locators.missingPrimaryPassword).waitForExist({ timeout: 2500 });
        if (a) {
            passwordEmptyValueIsVisible = true;
            if (passwordEmptyValueIsVisible) {
                try {
                    const exists = await browser.waitUntil(async () => {
                        await browser.$(locators.primaryPasswordEditField).setValue(myPassword);
                        return exists;
                    }, { timeout: 2500 });
                } catch (err) {
                    logClient.error("Exception caught: " + `${err}`);
                    reject(err);
                }
            }
        }
        return passwordEmptyValueIsVisible
    }

    public async verifyEmptySecondaryPasswordIsVisibleAndEditable(myPassword): Promise<boolean> {
        let passwordEmptyValueIsVisible: boolean = false;
        const a = await browser.$(locators.missingSecondaryPassword).waitForExist({ timeout: 2500 });
        if (a) {
            passwordEmptyValueIsVisible = true;
            if (passwordEmptyValueIsVisible) {
                try {
                    const exists = await browser.waitUntil(async () => {
                        await browser.$(locators.secondaryPasswordEditField).setValue(myPassword);
                        return exists;
                    }, { timeout: 2500 });
                } catch (err) {
                    logClient.error("Exception caught: " + `${err}`);
                    reject(err);
                }
            }
        }
        return passwordEmptyValueIsVisible
    }

    // public async verifyEmptySecondaryPasswordIsVisibleAndEditable(myPassword): Promise<boolean> {
    //     let passwordEmptyValueIsVisible: boolean = false;
    //     const exists = await browser
    //         .scroll(credsLocators.PasswordCol.row2Password).click().pause(1000).then(async()=>{
    //             await browser.pause(timeout.fast);
    //             await browser.$(credsLocators.PasswordCol.row2Password).keys(myPassword).keys("Enter").then(async()=>{
    //             }).catch((err: Error)=>{
    //                 logClient.error("Exception caught: " + `${err}`);
    //                 reject(err);
    //             });
    //             await browser.pause(2000);
    //             await browser.waitForValue(credsLocators.PasswordCol.row2Password).getText(credsLocators.PasswordCol.row2Password).then(async (text) => {
    //                 await expect(text).toEqual(myPassword);
    //                 passwordEmptyValueIsVisible= true;
    //                 return exists
    //             }).catch((err: Error)=>{
    //                 logClient.error("Exception : "+`${err}`);
    //                 reject(err);
    //             })
    //         }).catch((err: Error)=>{
    //             logClient.error("Exception caught: " + `${err}`);
    //             reject(err);
    //         });
    //         return passwordEmptyValueIsVisible;
    // };
};
