/* tslint:disable */
// @ts-nocheck
import { MatButton } from '../../matButton';
import * as fs from "fs-extra";
import * as path from "path";
const credsLocators = fs.readJsonSync(path.join(__dirname, "..", "..","JSON", "userSettingsCredsLocators.json"));
const locators = fs.readJsonSync(path.join(__dirname, "..", "..","JSON", "locators.json"));

export class IPaddressColumn extends MatButton {
    constructor(browser: WebdriverIO.Browser, selector: string) {
        super(browser, selector, "Kevin Settings Table");
    }

    public async click(): Promise<void> {
        await super.click();
    }


    public async verifyIpAddressColumnTitleExist(): Promise<boolean> {
        let ipAddressColumnExist: boolean = false;
        const a = await browser.$(credsLocators.IPaddressHeader).waitForExist();
        if (a) {
            ipAddressColumnExist = true;
        }
        return ipAddressColumnExist
    }

    public async verifyIpAddressRowExist(rowNumber): Promise<boolean> {
        let rowExists = false;
        const dynamicLocator = "//*[@id='deploy-creds-table-deviceIP-row-" + rowNumber + "']";
        rowExists = await (await browser.$(dynamicLocator)).isExisting()
        return rowExists
    }

    public async verifyIPRowIsEmpty(rowNumber): Promise<boolean> {
        let rowIsEmpty = false;
        const dynamicLocator = "//*[@id='deploy-creds-table-deviceIP-row-"+ rowNumber +"']";
        await browser.$(dynamicLocator).waitForExist({ timeout: 2500 }).catch((err: Error) => { });
        await browser.$(dynamicLocator).click().catch((err: Error) => { });
        await browser.$(dynamicLocator).getText().then(async (text:string) => {
            let result = text === "";
            rowIsEmpty = result
        }).catch((err: Error) => { //fail("verifyIPRowIsEmpty failed to getText()")});
        })
        return rowIsEmpty
    }
    public async verifyIPAddress(myIP: string, rowNumber): Promise<string> {
        const dynamicLocator = "//*[@id='deploy-creds-table-deviceIP-row-"+ rowNumber +"']";
        await browser.$(dynamicLocator).waitForExist({ timeout: 2500 }).catch((err: Error) => {console.log(err) });
        await browser.$(dynamicLocator).click().catch((err: Error) => {console.log(err) });
        return await browser.$(dynamicLocator).getText()
    }
};
