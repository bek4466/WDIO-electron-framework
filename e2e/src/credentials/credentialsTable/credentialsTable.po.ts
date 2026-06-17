/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../allure/allure";
import { MatButton } from "../../matButton";
import { LogClient } from "@extron/winston-logger";
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "JSON", "dataTool.json"));
const locators = fs.readJsonSync(path.join(__dirname, "..", "..", "JSON", "locators.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "JSON", "timeout.json"));
const credsLocators = fs.readJsonSync(path.join(__dirname, "..", "..", "JSON", "userSettingsCredsLocators.json"));
const logClient = new LogClient("e2e:credentialsTable.po");

export class CredentialsTable extends MatButton {
    public tableselector: string;
    public tablerowselector: string;
    public browser: WebdriverIO.Browser;
    public cols: number;

    constructor(browser: WebdriverIO.Browser, selector: string) {
        super(browser, selector, "Kevin Settings Table");
        this.tableselector = selector;
        this.browser = browser;
    }

    public async click(): Promise<void> {
        await super.click();
    }

    public async verifyTableLength() {
        let list = await this.browser.$$(locators.kevinTableEntries);
        return list.length;

    }

    public async keysByCharactor(txt: string) {
        let i = 0;
        for (i < txt.length; i++;) {
            this.browser.keys(txt.charAt(i));
        }
    }

    // pass column names with th tag eg (//table)
    public async checkColumnExists(
        columnname: string
    ): Promise<boolean> {
        let resultString: string;
        let status: boolean;
        const cols = await this.browser.$$(
            this.tableselector + "//th"
        );
        for (let i = 1; i <= cols.length; i++) {
            resultString = await this.browser
                .$(this.tableselector + "//th[" + i + "]")
                .getText();
            if (resultString.trim() === columnname.trim()) {
                status = true;
                return status;
            }
        }
        return false;
    }

    public async tableExists(): Promise<boolean> {
        let tableisVisible: boolean = false;
        let table: boolean;


        table = await this.browser.waitUntil(async () => {
            const progText = await this.browser.$("//table")
                .isExisting();
            return progText ? true : false;
        },{
            timeout: 30000,
            timeoutMsg: "expected table to exist after 30s"
        });
        if (table) {
            tableisVisible = true;
        }
        return tableisVisible;
    }

    public async tableContents(): Promise<string[]> {
        const arr = [];
        const rows = await this.browser.$$(this.tableselector + "//tbody/tr");
        const cols = await this.browser.$$(this.tableselector + "//th");
        for (let i = 1; i <= rows.length; i++) {
            for (let j = 1; j <= cols.length; j++) {
                const cellstring = await this.browser.$(this.tableselector + "//tbody/tr[" + i + "]/td[" + j + "]").getText();
                arr.push(cellstring.trim());
            }
        }
        return arr;
    }

    public async cellcontent(rowdata: number, columndata: number): Promise<any> {
        let cellstring: string;
        try {
            cellstring = await this.browser.$(this.tableselector + "//tbody/tr[" + rowdata + "]/td[" + columndata + "]").getText();
        } catch (err) {
            return false;
        }
        return cellstring;
    }

    public async getTablerow(celldata: string): Promise<number> {
        const tablecelldata: string = celldata;
        await this.browser.pause(3000);
        const rows = await this.browser.$$(this.tableselector + "//tbody/tr");
        const cols = await this.browser.$$(this.tableselector + "//th");
        for (let i = 1; i <= rows.length; i++) {
            for (let j = 1; j <= cols.length; j++) {
                const cellstring = await this.browser.$(this.tableselector + "//tbody/tr[" + i + "]/td[" + j + "]").getText();
                if (cellstring.trim() === tablecelldata.trim()) {
                    return i;
                }
            }
        }
        return null;
    }


    public async cellisClickable(rowdata: number, columndata: number): Promise<any> {
        let isClickable: boolean;
        try {
            let objClass: string = await this.browser.$(this.tableselector + "//tbody/tr[" + rowdata + "]//td[" + columndata + "]").getAttribute("class");
            return objClass.includes("ui-editable-column") ? true : false;
        } catch (err) {
            return false;
        }
        return false;
    }

    public async cellIsClickableCheck(Index: number): Promise<any> {
        let isClickable: boolean = false;
        
        await this.browser.$("(//label[@class='input-container no-select ng-star-inserted editable input-error'])[" + Index + "]")
        .isClickable()
        .then(async () => {
            isClickable = true;
        })
        .catch((err: any) => {
            logClient.error(
                "isClickable:" + `${err}`
            );
        });

        await allure.screenshot(this.browser, "After");
        return isClickable;  
       }

    public async cellsetValue(rowdata: number, columndata: number, data: string): Promise<void> {
        let isClickable: boolean;
        try {
            await this.browser.$(this.tableselector + "//tbody/tr[" + rowdata + "]/td[" + columndata + "]").click();
            await this.browser.$(this.tableselector + "//tbody/tr[" + rowdata + "]/td[" + columndata + "]" + "//input").setValue(data);
        } catch (err) {
            console.log("Error while setting the value");
        }
    }


    public async getTablerows(): Promise<number> {
        const rows = await this.browser.$$(this.tableselector + "//tbody/tr");
        return rows.length;
    }

    public async cellisVisible(rowdata: number, columndata: number, data: string): Promise<boolean> {
        let isVisible: boolean;
        try {
            isVisible = await this.browser.$(this.tableselector + "//tbody/tr[" + rowdata + "]/td[" + columndata + "]").isClickable();
            return isVisible;
        } catch (err) {
            console.log("Error while setting the value");
            return false;
        }
        return isVisible;
    }


    public async isDeviceWarningIconVisible(rowNumber: any): Promise<boolean> {
        let warningIcon: boolean = false;
        const row = await this.browser.$("//*[@id=\"deploy-creds-table-icon-row-" + rowNumber + "\"]")
        const rowIsClickable = await row.isDisplayed()
        if (rowIsClickable == true) {
            warningIcon = true;
        }
        return  warningIcon;
    }

    // unused
    public async credentialsWarning(warningMessage: any): Promise<boolean> {
        let warningInfo: boolean = false;
        await allure.step(
            `Set the value of ${this.name} input to ${this.browser}`,
            async () => {
                await allure.screenshot(this.browser, "Before");
                await allure.step(
                    `Set the value of ${this.name} input to ${warningMessage}`,
                    async () => {
                        await allure.screenshot(this.browser, "Before");
                        await this.browser.$("//div[@class='error-text']")
                            .isClickable()
                            .then(async () => {
                                warningInfo = true;
                            })
                            .catch((err: any) => {
                                logClient.error(
                                    "credentialsWarning:" + `${err}`
                                );
                            });

                        await allure.screenshot(this.browser, "After");
                    }
                );
            }
        );
        await allure.screenshot(this.browser, "After");
        return warningInfo;
    }
    /**
         *
         * @param: warningMessage
         */
    public async warningMessageCount(warningMessage: any, messageLength: number): Promise<boolean> {
        let warningmessage: boolean = false;
        await allure.step(
            `Check for severity, or fail if deployment failure message found`,
            async () => {
                await allure.screenshot(this.browser, "Before");
                const list = await this.browser.$$("//div[@class='error-text' and contains(text(), '" + warningMessage + "')]");
                if (await (list.length) === messageLength) {
                    // pass string from test
                    warningmessage = true;
                } else {
                    warningmessage = false;
                }
            })
            .catch((err: any) => {
                logClient.info("warningMessageCount: 1st if: " + `${err}`);
            });

        await allure.screenshot(this.browser, " After count Check");
        return warningmessage;
    }

    /**
         *
         * @param: warningCount
         */
    public async warningIconsCount(warningCount: number): Promise<boolean> {
        let warningIconCount: boolean = false;
        await allure.step(
            `Check for severity, or fail if deployment failure message found`,
            async () => {
                await allure.screenshot(this.browser, "Before");
                const list = await this.browser.$$(
                    credsLocators.warningIcons
                );
                if (await (list.length) === warningCount) {
                    // pass string from test
                    warningIconCount = true;
                } else {
                    warningIconCount = false;
                }
            })
            .catch((err: any) => {
                logClient.info("warningIconsCount: 1st if: " + `${err}`);
            });

        await allure.screenshot(this.browser, " After count Check");
        return warningIconCount;
    }
    public async checkDeviceIPUneditable(rowData: number): Promise<any> {
        let result: any;
        await allure.screenshot(this.browser, "Check editable table");
        try{
            result = await this.browser.$("//*[@id=\"deploy-creds-table-deviceIP-row-" + rowData + "-input\"]")
            .isClickable();
        }
        catch (err: any){
            result = false;
        }
        await expect(result)
            .toEqual(false);
        return result;
    }
    public async checkUsernameUneditable(rowData: number): Promise<any> {
        let result: any;
        await allure.screenshot(this.browser, "Check editable table");
        try{
            result = await this.browser.$("//*[@id=\"deploy-creds-table-username-row-" + rowData + "-input\"]")
            .isClickable();
        }
        catch (err: any){
            result = false;
        }
        await expect(result)
            .toEqual(false);
        return result;
    }

    public async checkPasswordUneditable(rowData: number): Promise<any> {
        let result: any;
        await allure.screenshot(this.browser, "Check editable table");
        try{
            result = await this.browser.$("//*[@id=\"deploy-creds-table-password-row-" + rowData + "-input\"]")
            .isClickable();
        }
        catch (err: any){
            result = false;
        }
        await expect(result)
            .toEqual(false);
        return result;
    }

    public async enterUserName(userName: any, rowIndex: number): Promise<boolean> {
        let setusernameValue: boolean = false;
        await allure.step(
            `Set the value of ${this.name} input to ${this.browser}`,
            async () => {
                await allure.screenshot(this.browser, "Before");
                await allure.step(
                    `Set the value of ${this.name} input to ${userName}`,
                    async () => {
                        await allure.screenshot(this.browser, "Before");
                        await this.browser.$("//input[@id='deploy-creds-table-username-row-" + rowIndex + "-input']").setValue(userName).then(async () => {
                            setusernameValue = true;
                        }).catch((err: Error) => {
                        });
                    })
                    .catch((err: any) => {
                        logClient.error(
                            "enterUserName:" + `${err}`
                        );
                    });
            });

        await allure.screenshot(this.browser, "After");
        return setusernameValue;
    }

    public async enterPassword(password: any, rowIndex: number): Promise<boolean> {
        let setpasswordValue: boolean = false;
        await allure.step(
            `Set the value of ${this.name} input to ${this.browser}`,
            async () => {
                await allure.screenshot(this.browser, "Before");
                await allure.step(
                    `Set the value of ${this.name} input to ${password}`,
                    async () => {
                        await allure.screenshot(this.browser, "Before");
                        await this.browser.$("//input[@id='deploy-creds-table-password-row-" + rowIndex + "-input']").setValue(password).then(async () => {
                            setpasswordValue = true;
                        }).catch((err: Error) => {
                        });
                    })
                    .catch((err: any) => {
                        logClient.error(
                            "enterPassword:" + `${err}`
                        );
                    });
            });

        await allure.screenshot(this.browser, "After");
        return setpasswordValue;
    }

    public async clearUserName(rowIndex: number): Promise<boolean> {
        let clearusernameValue: boolean = false;
        await allure.step(
            `Set the value of ${this.name} input to ${this.browser}`,
            async () => {
                await allure.screenshot(this.browser, "Before");
                await allure.step(
                    `Set the value of ${this.name} input to ${rowIndex}`,
                    async () => {
                        await allure.screenshot(this.browser, "Before");
                        await this.browser.$("//td[@id='deploy-creds-table-username-row-" + rowIndex + "']").doubleClick();
                        await this.browser.$("//td[@id='deploy-creds-table-username-row-" + rowIndex + "']").setValue('Delete')
                            .then(async () => {
                                clearusernameValue = true;
                            }).catch((err: Error) => {

                            });
                    })
                    .catch((err: any) => {
                        logClient.error(
                            "clearUserName:" + `${err}`
                        );
                    });
            });

        await allure.screenshot(this.browser, "After");
        return clearusernameValue;
    }

    public async clearPassword(rowIndex: number): Promise<boolean> {
        let clearpasswordValue: boolean = false;
        await allure.step(
            `Set the value of ${this.name} input to ${this.browser}`,
            async () => {
                await allure.screenshot(this.browser, "Before");
                await allure.step(
                    `Set the value of ${this.name} input to ${rowIndex}`,
                    async () => {
                        await allure.screenshot(this.browser, "Before");
                        await this.browser.$("//input[@id='deploy-creds-table-password-row-" + rowIndex + "-input']").doubleClick();
                        await this.browser.$("//input[@id='deploy-creds-table-password-row-" + rowIndex + "-input']").setValue("Delete")
                            .then(async () => {
                                clearpasswordValue = true;
                            }).catch((err: Error) => {
                            });
                    })
                    .catch((err: any) => {
                        logClient.error(
                            "clearPassword:" + `${err}`
                        );
                    });
            });

        await allure.screenshot(this.browser, "After");
        return clearpasswordValue;
    }

    public async hoverText(row: number, message: string): Promise<boolean> {
        // 1st index = row 0
        let messageExist: boolean = false;
        await allure.step(
            `Check for hovertext message or fail if not found`,
            async () => {
                await this.browser.pause(timeout.medium);
                // await this.browser.client.moveToObject("//mat-icon[contains(@id,'deploy-creds-table-icon-row-" + row + "')]")
                //     .then(async () => {
                // await this.browser.pause(timeout.medium);
                // await this.browser.$("//div[@id='deploy-creds-table-error-row-" + row + "']").getText()
                //     .then(async (text: any) => {
                //         console.log(text);
                //         if (await text === message || await text.match(message) || await text.match(new RegExp(message)) != undefined) {
                //             messageExist = true;
                //         } else {
                //             logClient.info(
                //                 "Match for Hover text failed..."
                //             );
                //         }
                //     })
                //     .catch((err: any) => {
                //         logClient.info(
                //             "verifyHoverText" + `${err}`);
                //     });
                // })
            })
            .catch((err: any) => {
                logClient.info("verifyHoverText Error" + `${err}`);
            });
        // await this.browser.client.moveToObject(credsLocators.passwordHeader);
        await allure.screenshot(this.browser, "After");
        // await browser.moveToObject(credsLocators.passwordHeader);
        await allure.screenshot(this.app, "After");
        return messageExist;
    }
    public async closeWithoutSaving(): Promise<any> {
        let result: any;
        result = await this.browser.$("//*[@id=\"sync-dialog-0\"]/div[3]/button[2]").click();
        return result;
    }

    public async validCreditAllDevices(numberOfDevices: number): Promise<void>{    
        for(let i = 0; i <= numberOfDevices; ++i){
        const dynamicLocator = "//input[@id='deploy-creds-table-username-row-"+ i +"-input']";
        await this.browser.$(dynamicLocator).waitForExist({ timeout: 2500 }).catch((err: Error) => { });
        await this.browser.$(dynamicLocator).click().catch((err: Error) => { });
        await this.browser.$(dynamicLocator).setValue("admin").catch((err: Error) => { });

        const dynamicLocator2 = "//input[@id='deploy-creds-table-password-row-"+ i +"-input']";
        await this.browser.$(dynamicLocator2).waitForExist({ timeout: 2500 }).catch((err: Error) => { });
        await this.browser.$(dynamicLocator2).click().catch((err: Error) => { });
        await this.browser.$(dynamicLocator2).setValue("extron").catch((err: Error) => { });
        }
        
    }

    public async invalidCreditAllDevices(numberOfDevices: number): Promise<void>{
        for(let i = 0; i <= numberOfDevices; ++i){
        const dynamicLocator = "//input[@id='deploy-creds-table-username-row-"+ i +"-input']";
        await this.browser.$(dynamicLocator).waitForExist({ timeout: 2500 }).catch((err: Error) => { });
        await this.browser.$(dynamicLocator).click().catch((err: Error) => { });
        await this.browser.$(dynamicLocator).setValue("John").catch((err: Error) => { });

        const dynamicLocator2 = "//input[@id='deploy-creds-table-password-row-"+ i +"-input']";
        await this.browser.$(dynamicLocator2).waitForExist({ timeout: 2500 }).catch((err: Error) => { });
        await this.browser.$(dynamicLocator2).click().catch((err: Error) => { });
        await this.browser.$(dynamicLocator2).setValue("Notextron").catch((err: Error) => { });
        }        
    }
};

