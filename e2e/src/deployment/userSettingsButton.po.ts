/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";

import { MatButton} from "../matButton";
import {LogClient} from "@extron/winston-logger";
import {reject} from 'q';
const data = fs.readJsonSync(path.join(__dirname, "..", "JSON", "dataTool.json"));
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const logClient = new LogClient("e2e:UserSettingsButton.po");

export class UserSettingsButton extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "Kevin user settings button");
    }

    public async click(): Promise < void > {
        await super.click();
    }

    // use without an await before clicking on Project Credentials Button
    public async verifySpinner(): Promise < void > {
        browser.$(this.selector).waitForExist({
            timeout: 10000
        }).catch((err: Error) => {
            console.log("Exception Caught: " + `${err}`);
        });
    }

    public async verifyKevinSettingsDisabled(): Promise < boolean > {
        let disabled: boolean = false;
        const a = await browser.$(locators.KevinDisable).waitForExist();
        if (a) {
            disabled = true;
        }
        return disabled;
    }

    /**
     * used with locators.KevinEnable
     */
    public async verifyKevinSettingsEnabled(): Promise < boolean > {
        let enabled: boolean = false;
        // const a = await browser.waitForExist(locators.KevinEnable).isEnabled();
        await browser.$(this.selector).waitForExist().then(async val => {
            if (val) {
                //if we are true
                enabled = await browser.$(this.selector).isEnabled();
            } else {
                return false;
            }
        });
        // if (a) {
        //     enabled = true;
        // }
        return enabled;
    }

    public async kevinBtnEnabled(): Promise < boolean > {
        let enabled: boolean = false;
        let isEnabled: any = await browser.$(locators.KevinEnable).isEnabled().then(async (value) => {
            if (value === true) {
                logClient.info("Return value: " + true + `${value}`);
                await browser.$(locators.KevinEnable).getValue().then(async (value2) => {
                    await expect(value2).toEqual("true");
                });
                return enabled = true;

            } else if (value === false) {
                logClient.info("Return value: " + false + `${value}`);
            } else {}
            return isEnabled;
        }).catch((Error: any) => {
            logClient.info("Exception caught : " + `${Error}`);
        });
        return enabled;
        // let enabled: boolean = false;
        // const a = await browser.waitForExist(locators.KevinEnable);
        // if (a) {
        //     enabled = true;
        // }
        // return enabled;
    };


    public async verifyKevinisClickable(): Promise < boolean > {
        let clickable: boolean = false;
        const a = await browser.$(locators.KevinEnable)
            .waitForExist().then(async (value) => {
                await browser.pause(timeout.fast);
                await expect(value).toBe(true);
                clickable = true;
            }).catch((err) => {
                logClient.info("Exception" + `${err}`);
            });
        return clickable;
    };

    public async verifyKevinInTabularForm(): Promise < boolean > {
        let kevinInTabularForm: boolean = false;
        const a = await browser.$(locators.kevinTable).waitForExist({
            timeout: timeout.medium
        });
        if (a) {
            kevinInTabularForm = true;
        }
        return kevinInTabularForm
    };

    /**
     * This function returns true if the Kevin Window is open, by checking if the Kevin drawer element is open
     */
    public async verifyKevinIsPrompted(): Promise < boolean > {
        let kevinWindowOpen: boolean = false;
        const a = await browser.$(locators.kevinTableEntries).isClickable();
        if (a) {
            kevinWindowOpen = true;
        }
        return kevinWindowOpen
    };

    /**
     * This function tests if the string "Extron Control for Web" is present as an entry in the Kevin table.
     * For example, if a device has the name "Extron Control for Web", this function will return true.
     */
    public async isPrimaryEcwPresent(): Promise < boolean > {
        let primaryEcwisPresent: boolean;
        await browser.isElementDisplayed(locators.primaryEcwKevinEntry).then(async (val) => {
            primaryEcwisPresent = val;
        }).catch((err) => {
            logClient.info("userSettingsButton.po.ts->isPrimaryEcwPresent: " + err);
            primaryEcwisPresent = false;
        });
        return primaryEcwisPresent;
    };

    public async verifyTableLength() {
        let list = await browser.$$(locators.kevinTableEntries);
        let tableLength: number = await browser.$$(locators.kevinTableEntries).length;
        await expect(list.length).toBe(data.kevinEntriesCount);
    };

    public async verifyDeviceNameColumnExist(): Promise < boolean > {
        let deviceNameColumnExist: boolean = false;
        const a = await browser.$(locators.deviceNameColumn).waitForExist();
        if (a) {
            deviceNameColumnExist = true;
        }
        return deviceNameColumnExist
    };

    public async verifyIpAddressColumnExist(): Promise < boolean > {
        let ipAddressColumnExist: boolean = false;
        const a = await browser.$(locators.ipAddressColumn).waitForExist();
        if (a) {
            ipAddressColumnExist = true;
        }
        return ipAddressColumnExist
    };

    public async verifyUserNameColumnExist(): Promise < boolean > {
        let userNameColumnExist: boolean = false;
        const a = await browser.$(locators.userNameColumn).waitForExist();
        if (a) {
            userNameColumnExist = true;
        }
        return userNameColumnExist
    };

    public async verifyPasswordColumnExist(): Promise < boolean > {
        let passwordColumnExist: boolean = false;
        const a = await browser.$(locators.passwordColumn).waitForExist();
        if (a) {
            passwordColumnExist = true;
        }
        return passwordColumnExist
    };


    public async verifyPrimaryUserNameValueIsEntered(): Promise < boolean > {
        let userNameValueIsEntered: boolean = false;
        const a = await browser.$(locators.primaryUserNameEditField)
        await browser.$(locators.primaryUserNameEditField).getText().then(async (text) => {
            if (text === data.primaryUserName) userNameValueIsEntered = true;
        });
        return userNameValueIsEntered
    };

    public async verifyPrimaryUserNameValueIsVisible(): Promise < boolean > {
        let userNameValueIsVisible: boolean = false;
        const a = await browser.$(locators.primaryUserNameValue).waitForExist()
        await browser.isElementDisplayed(locators.primaryUserNameValue);
        await browser.pause(timeout.medium);
        if (a) {
            userNameValueIsVisible = true;
        }
        return userNameValueIsVisible
    };

    public async verifyPrimaryPasswordValueIsVisible(): Promise < boolean > {
        let passwordValueIsVisible: boolean = false;
        const a = await browser.$(locators.primaryPasswordValue).waitForExist(locators.primaryPasswordValue);
        if (a) {
            passwordValueIsVisible = true;
        }
        return passwordValueIsVisible
    };

    public async verifySecondaryUserNameValueIsVisible(): Promise < boolean > {
        let userNameValueIsVisible: boolean = false;
        const a = await browser.$(locators.secondaryUserNameValue).waitForExist();
        if (a) {
            userNameValueIsVisible = true;
        }
        return userNameValueIsVisible
    };

    public async verifySecondaryPasswordValueIsVisible(): Promise < boolean > {
        let passwordValueIsVisible: boolean = false;
        const a = await browser.$(locators.secondaryPasswordValue).waitForExist();
        if (a) {
            passwordValueIsVisible = true;
        }
        return passwordValueIsVisible
    };


    public async verifyTlpUserNameValueIsVisible(): Promise < boolean > {
        let userNameValueIsVisible: boolean = false;
        const a = await browser.$(locators.tlpUserNameValue).waitForExist();
        if (a) {
            userNameValueIsVisible = true;
        }
        return userNameValueIsVisible
    };

    public async verifyTlpPasswordValueIsVisible(): Promise < boolean > {
        let passwordValueIsVisible: boolean = false;
        const a = await browser.$(locators.tlpPasswordValue).waitForExist();
        if (a) {
            passwordValueIsVisible = true;
        }
        return passwordValueIsVisible
    };

    public async verifyEmptyTlpUserNameValueIsVisible(): Promise < boolean > {
        let userNameEmptyValueIsVisible: boolean = false;
        const a = await browser.$(locators.tlpEmptyUserNameValue).waitForExist();
        if (a) {
            userNameEmptyValueIsVisible = true;
        }
        return userNameEmptyValueIsVisible
    };

    public async verifyEmptyTlpPasswordValueIsVisible(): Promise < boolean > {
        let passwordEmptyValueIsVisible: boolean = false;
        const a = await browser.$(locators.tlpEmptyPasswordValue).waitForExist();
        if (a) {
            passwordEmptyValueIsVisible = true;
        }
        return passwordEmptyValueIsVisible
    };

    public async verifyEmptyPrimaryUserNameIsVisibleAndEditable(myUserName): Promise < boolean > {
        let userNameEmptyValueIsVisible: boolean = false;
        const a = await browser.$(locators.missingPrimaryUserName).waitForExist({
            timeout: 2500
        });
        if (a) {
            userNameEmptyValueIsVisible = true;
            if (userNameEmptyValueIsVisible) {
                const exists = await browser.$(locators.primaryUserNameEditField,)
                    .waitForExist({timeout: 2500});
                await browser.$(locators.primaryUserNameEditField).setValue(myUserName);
                return exists
            }
        }
        return userNameEmptyValueIsVisible
    };

    public async verifyPrimaryUserNameIsEnteredWithValue(myUserName): Promise < boolean > {
        let userNameValueIsVisible: boolean = false;
        await browser.$(locators.primaryUserNameEditFieldRead).waitForExist()
        .catch(async (err: any) => {
            logClient.error(err);
            await reject(err);
        })
        .catch(async (err: any) => {
            logClient.error(err);
            await reject(err);
        });
        await browser
        .$(locators.primaryUserNameEditFieldRead)
        .getText()
        .then(async (text: string) => {
            if (text == myUserName || text.includes(myUserName)) {
                userNameValueIsVisible = true;
            }
        }).catch((e: Error) => {
            logClient.error("Exception caught in verifyPrimaryUserNameIsEnteredWithValue: " + `${e}`);
            reject(e);
        });
        return true;
    }

    public async verifyEmptyPrimaryPasswordIsVisibleAndEditable(myPassword): Promise < boolean > {
        let passwordEmptyValueIsVisible: boolean = false;
        const a = await browser.$(locators.missingPrimaryPassword).waitForExist({
            timeout: 2500
        });
        if (a) {
            passwordEmptyValueIsVisible = true;
            if (passwordEmptyValueIsVisible) {
                const exists = await browser.$(locators.primaryPasswordEditField)
                    .waitForExist({timeout: 2500})
                //  await this.keysByCharactor(myPassword);
                await browser.$(locators.primaryPasswordEditField).setValue(myPassword);
                return exists
            }
        }
        return passwordEmptyValueIsVisible
    }

    public async verifyEmptySecondaryUserNameIsVisibleAndEditable(myUserName): Promise < boolean > {
        let userNameEmptyValueIsVisible: boolean = false;
        const a = await browser.$(locators.missingSecondaryUserName).waitForExist({
            timeout: 2500
        });
        if (a) {
            userNameEmptyValueIsVisible = true;
            if (userNameEmptyValueIsVisible) {
                const exists = await browser.$(locators.secondaryUserNameEditField)
                    .waitForExist();
                await browser.$(locators.secondaryUserNameEditField).setValue(myUserName);
                return exists
            }
        }
        return userNameEmptyValueIsVisible
    }

    public async verifyEmptySecondaryPasswordIsVisibleAndEditable(myPassword): Promise < boolean > {
        let passwordEmptyValueIsVisible: boolean = false;
        const a = await browser.$(locators.missingSecondaryPassword).waitForExist({
            timeout: 2500
        });
        if (a) {
            passwordEmptyValueIsVisible = true;
            if (passwordEmptyValueIsVisible) {
                const exists = await browser.$(locators.secondaryPasswordEditField)
                    .waitForExist({
                        timeout: 2500
                    });
                await browser.$(locators.secondaryPasswordEditField).setValue(myPassword);
                return exists
            }
        }
        return passwordEmptyValueIsVisible
    }

    public async verifyEmptyTlpUserNameIsVisibleAndEditable(myUserName): Promise < boolean > {
        let userNameEmptyValueIsVisible: boolean;
        const a = await browser.$(locators.missingTlpUserName).waitForExist({
            timeout: 2500
        });
        if (a) {
            userNameEmptyValueIsVisible = true;
            if (userNameEmptyValueIsVisible) {
                const exists = await browser.$(locators.tlpUserNameEditField)
                    .waitForExist({
                        timeout: 2500
                    })
                //  await this.keysByCharactor(myPassword);
                await browser.$(locators.tlpUserNameEditField).setValue(myUserName);
                return exists
            }
        }
        return userNameEmptyValueIsVisible
    }

    public async verifyTlpPasswordIsEnteredWithValue(myPassword): Promise < boolean > {
        let passwordValueIsVisible: boolean;
        const a = await browser.$(locators.tlpPasswordEditField).waitForExist({
            timeout: 2500
        });
        if (a) {
            passwordValueIsVisible = true;
            if (passwordValueIsVisible) {
                const exists = await browser.$(locators.tlpPasswordEditField)
                    .waitForClickable()
                //  await this.keysByCharactor(myPassword);
                await browser.$(locators.tlpPasswordEditField).setValue(myPassword);
                return exists
            }
        }
        return passwordValueIsVisible
    }

    public async verifyEmptyTlpPasswordIsVisibleAndEditable(myPassword): Promise < boolean > {
        let passwordEmptyValueIsVisible: boolean;
        const a = await browser.$(locators.missingTlpPassword).waitForExist({
            timeout: 2500
        });
        if (a) {
            passwordEmptyValueIsVisible = true;
            if (passwordEmptyValueIsVisible) {
                const exists = await browser.$(locators.tlpPasswordEditField)
                    .waitForExist({
                        timeout: 2500
                    })
                //  await this.keysByCharactor(myPassword);
                await browser.$(locators.tlpPasswordEditField).setValue(myPassword);
                return exists
            }
        }
        return passwordEmptyValueIsVisible
    }

    public async keysByCharactor(txt: string) {
        var i = 0;
        for (i < txt.length; i++;) {
            browser.keys(txt.charAt(i));
        }
    }

    public async systemCredentialsCarriedForwardText(myText: string, index: number): Promise < boolean > {
        let columnText: boolean = false;
        await browser.pause(timeout.medium);
        await browser.$("//input[@id = 'deploy-creds-table-username-row-" + index + "-input' and @ng-reflect-model='" + myText + "']").waitForExist({
            timeout: 2000
        });
        await browser
        .$("//input[@id = 'deploy-creds-table-username-row-" + index + "-input' and @ng-reflect-model='" + myText + "']").isClickable().then(async () => {
            columnText = true;
        }).catch((e) => {
            logClient.error("Exception caught: " + `${e}`);
        });
        return columnText;
    }



    public async verifyCarriedForwardSystemInformationIsEditable(myCredentials, index: number): Promise < boolean > {
        const a = await browser.$("//input[@id = 'deploy-creds-table-username-row-" + index + "-input']").waitForExist();
        if (a) {
            await browser
                .$("//input[@id = 'deploy-creds-table-username-row-" + index + "-input']").click()
                .then(async () => {
                    await browser.$("//input[@id = 'deploy-creds-table-username-row-" + index + "-input']")
                        .setValue(myCredentials);
                }).catch((e) => {
                    logClient.error("Exception caught: " + `${e}`);
                });
        }
        return a;
    }

    public async systemCredentialsCarriedForwardPassword(myText: string, index: number): Promise < boolean > {
        let columnText: boolean = false;
        await browser.pause(timeout.medium);
        await browser.$("//input[@id = 'deploy-creds-table-password-row-" + index + "-input' and @ng-reflect-model='" + myText + "']").waitForExist({
            timeout: 1000
        });
        await browser
        .$("//input[@id = 'deploy-creds-table-password-row-" + index + "-input' and @ng-reflect-model='" + myText + "']").isClickable().then(async () => {
            columnText = true;
        }).catch((e) => {
            logClient.error("Exception caught: " + `${e}`);
        });
        return columnText;
    }



    public async verifyCarriedForwardSystemPasswordIsEditable(myCredentials, index: number): Promise < boolean > {
        const a = await browser.$("//input[@id = 'deploy-creds-table-password-row-" + index + "-input']").waitForExist();
        if (a) {
            await browser
                .$("//input[@id = 'deploy-creds-table-password-row-" + index + "-input']").click()
                .then(async () => {
                    await browser.$("//input[@id = 'deploy-creds-table-password-row-" + index + "-input']")
                        .setValue(myCredentials);
                }).catch((e) => {
                    logClient.error("Exception caught: " + `${e}`);
                });
        }
        return a;
    }
};