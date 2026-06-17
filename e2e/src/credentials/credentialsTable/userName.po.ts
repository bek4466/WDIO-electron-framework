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
const logClient = new LogClient("e2e:userName>POM");
export class UsernameColumn extends MatButton {
    constructor(browser: WebdriverIO.Browser, selector: string) {
        super(browser, selector, "Kevin Settings Table");
    }
    // ============= come back to this one ===========================
    public async tableCellValidation(credsString: string): Promise<boolean> {
        let cellState: boolean = false;
        // await browser.$(credsLocators.UserNameCol.row1UserName).scroll(credsLocators.UserNameCol.row1UserName).then(async () => {
        //     await browser.$(credsLocators.UserNameCol.row1UserName).click();
        //     await browser.keys(credsString);
        //     await browser.pause(5000);
        //     await browser.keys('Enter')
        //         .then(async () => {
        //             await browser.pause(timeout.fast);
        //             await browser.$(credsLocators.UserNameCol.row1UserName).scroll();
        //             await browser.getElementText(credsLocators.UserNameCol.row1UserName).then(async (text: string) => {
        //                 if (text.includes(credsString)) {
        //                     logClient.error(text);
        //                     logClient.error("whatever");
        //                     expect(text).toEqual(credsString);
        //                     cellState = true;
        //                 }
        //             }).catch((e: Error) => {
        //                 logClient.error("Exception caught in VERIFY_USERNAME_ROW1: " + `${e}`);
        //             });
        //             await browser.pause(timeout.medium);
        //             await browser.getElementText(credsLocators.UserNameCol.row1UserName)
        //                 .then(async (value) => {
        //                     expect(value).toEqual('');
        //                 }).catch((err: Error) => {
        //                     logClient.error(`${err}`);
        //                     reject(err);
        //                 });
        //             await browser.$(credsLocators.UserNameCol.row1UserName).setValue(credsString)
        //                 .catch((err: Error) => {
        //                     logClient.error(`${err}`);
        //                     reject(err);
        //                 });
        //         }).catch((err: Error) => {
        //             logClient.error(`${err}`);
        //             reject(err);
        //         });
        //     await browser.getElementText(credsLocators.UserNameCol.row1UserName).then(async (text: string) => {
        //         expect(text).toEqual(credsString);
        //     }).catch((e: Error) => {
        //         logClient.error("Exception caught in VERIFY_USERNAME_ROW1: " + `${e}`);
        //     });
        // }).catch((err: Error) => {
        //     logClient.error("Exception caught: " + `${err}`);
        //     reject(err);
        // });
        return cellState;
    }

    public async click(): Promise<void> {
        await super.click();
    }


    public async verifyUserNameColumnTitleExist(): Promise<boolean> {
        let userNameColumnExist: boolean = false;
        const a = await browser.$(credsLocators.usernameHeader).waitForExist();
        if (a) {
            userNameColumnExist = true;
        }
        return userNameColumnExist
    }

    public async verifyUsernameRowExists(rowNumber, expectedResult): Promise<void> {
        const dynamicLocator = "//input[@id='deploy-creds-table-username-row-" + rowNumber + "-input']";

        let userNameRowExists = await (await browser.$(dynamicLocator)).isExisting();
        expect(userNameRowExists).toBe(expectedResult)
    }

    public async verifyPrimaryUserNameValueIsEntered(): Promise<boolean> {
        let userNameValueIsEntered: boolean = false;
        const a = await browser.$(credsLocators.UserNameCol.row1UserName).waitForExist()
        await browser.$(credsLocators.UserNameCol.row1UserName).getText().then(async (text) => {
            if (text === data.primaryUserName) userNameValueIsEntered = true;
        });
        return userNameValueIsEntered
    }

    public async verifyPrimaryUserNameValueIsVisible(): Promise<boolean> {
        let userNameValueIsVisible: boolean = false;
        const a = await browser.$(credsLocators.UserNameCol.row1UserName).waitForExist()
        await browser.pause(timeout.medium);
        if (a) {
            userNameValueIsVisible = true;
        }
        return userNameValueIsVisible
    }

    public async verifySecondaryUserNameValueIsVisible(): Promise<boolean> {
        let userNameValueIsVisible: boolean = false;
        const a = await browser.$(credsLocators.UserNameCol.row2UserName).waitForExist();
        if (a) {
            userNameValueIsVisible = true;
        }
        return userNameValueIsVisible
    }


    public async verifyTlpUserNameValueIsVisible(): Promise<boolean> {
        let userNameValueIsVisible: boolean = false;
        const a = await browser.$(credsLocators.UserNameCol.row3UserName).waitForExist();
        if (a) {
            userNameValueIsVisible = true;
        }
        return userNameValueIsVisible
    }

    public async verifyEmptyTlpUserNameValueIsVisible(): Promise<boolean> {
        let userNameEmptyValueIsVisible: boolean = false;
        const a = await browser.$(credsLocators.UserNameCol.row3UserName).waitForExist();
        if (a) {
            userNameEmptyValueIsVisible = true;
        }
        return userNameEmptyValueIsVisible
    }

    // public async verifyEmptyPrimaryUserNameIsVisibleAndEditable(myUserName): Promise<boolean> {
    //     let userNameEmptyValueIsVisible: boolean = false;
    //     const exists = await browser
    //         .$(credsLocators.UserNameCol.row1UserName).click().then(async(text)=>{
    //             await browser.pause(timeout.fast);
    //             await browser.$(credsLocators.UserNameCol.row1UserName).keys(myUserName).keys("Enter").then(async()=>{
    //             }).catch((err: Error)=>{
    //                 logClient.error("Exception caught: " + `${err}`);
    //                 reject(err);
    //             });
    //             await browser.pause(2000);
    //             await browser.waitForExist(credsLocators.UserNameCol.row1UserName).getText(credsLocators.UserNameCol.row1UserName).then(async (text) => {
    //                 await expect(text).toEqual('admin');
    //                 userNameEmptyValueIsVisible = true;
    //                 return exists
    //             }).catch((err: Error)=>{
    //                 logClient.error("Exception verifyEmptyPrimaryUserNameIsVisibleAndEditable: " +`${err}`);
    //                 reject(err);
    //             })
    //         }).catch((err: Error)=>{
    //             logClient.error("Exception caught: " + `${err}`);
    //             reject(err);
    //         });
    //         return userNameEmptyValueIsVisible;
    // }

    public async verifyEmptyPrimaryUserNameIsVisibleAndEditable(myUserName): Promise<boolean> {
        let userNameEmptyValueIsVisible: boolean = false;
        const a = await browser.$(locators.missingPrimaryUserName).waitForExist({ timeout: 2500 });
        if (a) {
            userNameEmptyValueIsVisible = true;
            if (userNameEmptyValueIsVisible) {
                try {
                    const exists = await browser.waitUntil(async () => {
                        await browser.$(locators.primaryUserNameEditField).clearValue();
                        await browser.$(locators.primaryUserNameEditField).setValue(myUserName);
                        return exists;
                    }, { timeout: 2500 });
                } catch (err) {
                    logClient.error("Exception caught: " + `${err}`);
                    reject(err);
                }
            }
        }
        return userNameEmptyValueIsVisible
    }

    public async setUsername(myUsername: string, rowNumber): Promise<void> {
        const dynamicLocator = "//input[@id='deploy-creds-table-username-row-" + rowNumber + "-input']";

        //if we find this locator put the stuff
        let userNameRowExists = await (await browser.$(dynamicLocator)).isExisting();
        try {
            if (userNameRowExists) {
                await browser.$(dynamicLocator).click().catch((err: Error) => { });
                await browser.$(dynamicLocator).setValue(myUsername).catch((err: Error) => { });
                // Work around for the following bug https://extron.atlassian.net/browse/TOOL-4142
                if (myUsername === "") {
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


        //we cannot find the element so we leave
    }

    public async verifyUsername(myUsername: string, rowNumber): Promise<boolean> {
        const dynamicLocator = "//input[@id='deploy-creds-table-username-row-" + rowNumber + "-input']";
        let isMatch = false;

        let userNameRowExists = await (await browser.$(dynamicLocator)).isExisting();
        try {
            if (userNameRowExists) {
                await browser.$(dynamicLocator).click().catch((err: Error) => { });
                await browser.$(dynamicLocator).getValue().then(async (text: string) => {
                    if(myUsername == text || text.match(myUsername)|| myUsername.match(text)) isMatch = true;
                }) 
            }
        } catch (error) {
            console.warn("WE FAILED THE PROMISE")
            return isMatch

        }
        return isMatch
    }

    public async verifyNotUsername(myUsername: string, rowNumber): Promise<void> {
        const dynamicLocator = "//input[@id='deploy-creds-table-username-row-" + rowNumber + "-input']";
        let userNameRowExists = await (await browser.$(dynamicLocator)).isExisting();
        try {
            if (userNameRowExists) {
                await browser.$(dynamicLocator).click().catch((err: Error) => { });
                await browser.$(dynamicLocator).getValue().then(async (text: string) => {
                    expect(text).not.toBe(myUsername);
                }).catch((err: Error) => { });
            }
            else {
                return Promise.resolve()
            }
        } catch (error) {
            console.warn("WE FAILED THE PROMISE")
            return Promise.resolve()
        }

    }

    public async verifyEmptyPrimaryUserNameIsVisibleAndEditable2(myUserName): Promise<boolean> {
        let userNameEmptyValueIsVisible: boolean = false;

        const exists = await browser.$(credsLocators.UserNameCol.row1UserName).getValue()
            .then(async (text) => {
                await browser.pause(timeout.medium);
                await browser.$(credsLocators.UserNameCol.row1UserName).getText().then(async (text) => {
                    expect(text).toEqual('admin');
                    userNameEmptyValueIsVisible = true;
                    return exists
                }).catch((err: Error) => {
                    logClient.error("Exception verifyEmptyPrimaryUserNameIsVisibleAndEditable2: " + `${err}`);
                    reject(err);
                })
            }).catch((err: Error) => {
                logClient.error("Exception caught: " + `${err}`);
                reject(err);
            });
        return userNameEmptyValueIsVisible;
    }


    public async verifyEmptyTlpUserNameIsVisibleAndEditable(myUserName): Promise<boolean> {
        let userNameEmptyValueIsVisible: boolean = false;
        const a = await browser.$(credsLocators.UserNameCol.row3UserName).waitForExist();
        if (a) {
            userNameEmptyValueIsVisible = true;
            if (userNameEmptyValueIsVisible) {
                const exists = await browser.$(credsLocators.UserNameCol.row3UserName).setValue(myUserName)
                    .then(async (text) => {
                        logClient.error(text);
                        return exists;
                    }).catch((err: Error) => {
                        logClient.error("Exception verifyEmptyTlpUserNameIsVisibleAndEditable: " + `${err}`);
                        reject(err);
                    })
            }
        }
        return userNameEmptyValueIsVisible
    }


    public async verifyPrimaryUserNameIsEnteredWithValue(myUserName): Promise<boolean> {
        let userNameValueIsVisible: boolean = false;
        await browser.$(credsLocators.UserNameCol.row1UserName).waitForExist();
        await browser.$(credsLocators.UserNameCol.row1UserName).getText()
            .then(async (text: string) => {
                if (text == myUserName || text.match(myUserName)) {
                    userNameValueIsVisible = true;
                }
            }).catch((e: Error) => {
                console.warn("Exception caught in VERIFY_USERNAME_ROW1: " + `${e}`);
            });
        return userNameValueIsVisible;
    }


    public async verifyEmptySecondaryUserNameIsVisibleAndEditable(myUserName): Promise<boolean> {
        let userNameEmptyValueIsVisible: boolean = false;
        const a = await browser.$(locators.missingSecondaryUserName).waitForExist({ timeout: 2500 });
        if (a) {
            userNameEmptyValueIsVisible = true;
            if (userNameEmptyValueIsVisible) {
                try {
                    const exists = await browser.waitUntil(async () => {
                        await browser.$(locators.secondaryUserNameEditField).setValue(myUserName);
                        return exists
                    }, { timeout: 2500 });
                } catch (err) {
                    logClient.error("Exception caught: " + `${err}`);
                    reject(err);
                }
            }
        }
        return userNameEmptyValueIsVisible
    }


    public async systemCredentialsCarriedForwardText(myText: string, index: number): Promise<boolean> {
        let columnText: boolean = false;
        await browser.pause(timeout.medium);
        await browser.$(locators.carriedForwardInformation + '[' + index + ']').waitForExist();
        await browser.getElementText(locators.carriedForwardInformation + '[' + index + ']')
            .then(async (text: string) => {
                await browser.pause(timeout.medium);
                if (text.includes(myText)) {
                    columnText = true;
                }
            }).catch((err) => {
                logClient.error("primaryUserNameIncludedText: Exception Error: " + `${err}`);
                return false;
            });
        return columnText;
    }



    public async verifyCarriedForwardSystemInformationIsEditable(myCredentials, index: number): Promise<boolean> {
        const a = await browser.$(locators.carriedForwardInformation + '[' + index + ']').waitForExist();
        if (a) {
            await browser.$(locators.carriedForwardInformation + '[' + index + ']').click()
                .then(async () => {
                    await browser.$(locators.carriedForwardInformation + '[' + index + ']//input').setValue(myCredentials);
                }).catch((e) => {
                    logClient.error("Exception caught: " + `${e}`);
                });
        }
        return a;
    }
};
